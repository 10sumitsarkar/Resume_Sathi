const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
const apiConfig = require('../config/api-config.json');

const BACKEND_BASE = process.env.NEXT_PUBLIC_BACKEND_BASE || apiConfig.backendBase || 'https://api.resumesathi.com';
const outDir = path.join(process.cwd(), 'data');
const jobsCachePath = path.join(outDir, 'jobs-cache.json');
const categoriesCachePath = path.join(outDir, 'categories-cache.json');

function hasUsableCache() {
  try {
    const jobs = JSON.parse(fs.readFileSync(jobsCachePath, 'utf-8'));
    return Array.isArray(jobs) && jobs.length > 0 && fs.existsSync(categoriesCachePath);
  } catch (err) {
    return false;
  }
}

async function fetchWithRetry(url, retries = 4, delayMs = 3000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`[fetch-jobs] Attempt ${attempt} -> ${url}`);
      return await fetchJson(url);
    } catch (err) {
      console.warn(`[fetch-jobs] Attempt ${attempt} failed: ${err.message}`);
      if (attempt === retries) throw err;
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;
    const req = client.get(url, { headers: { Accept: 'application/json' } }, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        try {
          resolve(JSON.parse(body));
        } catch (err) {
          reject(new Error(`Invalid JSON from ${url}`));
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.destroy(new Error('Request timed out'));
    });
  });
}

async function main() {
  let jobsRaw;
  try {
    jobsRaw = await fetchWithRetry(`${BACKEND_BASE}/api/courses`);
  } catch (err) {
    if (hasUsableCache()) {
      console.warn(`[fetch-jobs] API unavailable, using existing data/jobs-cache.json. ${err.message}`);
      return;
    }
    throw err;
  }

  const jobs = Array.isArray(jobsRaw) ? jobsRaw : (jobsRaw.items || jobsRaw.results || []);
  if (!jobs.length) {
    if (hasUsableCache()) {
      console.warn('[fetch-jobs] /api/courses returned 0 jobs, using existing cache.');
      return;
    }
    console.error('[fetch-jobs] FATAL: /api/courses returned 0 jobs. Aborting build - old deploy untouched.');
    process.exit(1);
  }

  const catsRaw = await fetchWithRetry(`${BACKEND_BASE}/api/course-categories`);
  const categories = Array.isArray(catsRaw) ? catsRaw : (catsRaw.items || catsRaw.results || []);

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(jobsCachePath, JSON.stringify(jobs, null, 2));
  fs.writeFileSync(categoriesCachePath, JSON.stringify(categories, null, 2));

  console.log(`[fetch-jobs] OK - ${jobs.length} jobs, ${categories.length} categories cached.`);
}

main().catch((err) => {
  console.error('[fetch-jobs] Build aborted:', err.message);
  process.exit(1);
});
