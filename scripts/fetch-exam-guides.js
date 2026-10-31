const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
const apiConfig = require('../config/api-config.json');

const BACKEND_BASE = (process.env.NEXT_PUBLIC_BACKEND_BASE || apiConfig.backendBase).replace(/\/+$/, '');
const outDir = path.join(process.cwd(), 'data');
const examGuidesCachePath = path.join(outDir, 'exam-guides-cache.json');
const cacheSourcePath = path.join(outDir, 'exam-guides-cache-source.txt');
const CACHE_SOURCE = 'exam-guides-api-v2';

function isExamGuide(item) {
  return Boolean(
    item &&
    typeof item.slug === 'string' &&
    item.slug.trim() &&
    typeof item.canonical_tag === 'string' &&
    /^exam-guides\//i.test(item.canonical_tag.trim())
  );
}

function hasUsableCache() {
  try {
    const examGuides = JSON.parse(fs.readFileSync(examGuidesCachePath, 'utf-8'));
    const cacheSource = fs.readFileSync(cacheSourcePath, 'utf-8').trim();
    return Array.isArray(examGuides) &&
      examGuides.every(isExamGuide) &&
      cacheSource === CACHE_SOURCE;
  } catch (err) {
    return false;
  }
}

function writeCaches(examGuides) {
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(examGuidesCachePath, JSON.stringify(examGuides, null, 2));
  fs.writeFileSync(cacheSourcePath, `${CACHE_SOURCE}\n`);
}

async function fetchWithRetry(url, retries = 4, delayMs = 3000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`[fetch-exam-guides] Attempt ${attempt} -> ${url}`);
      return await fetchJson(url);
    } catch (err) {
      console.warn(`[fetch-exam-guides] Attempt ${attempt} failed: ${err.message}`);
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

function normalizeItems(payload) {
  if (Array.isArray(payload)) return payload;
  if (!payload) return [];
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.results)) return payload.results;
  return [];
}

async function main() {
  let guidesRaw;
  try {
    guidesRaw = await fetchWithRetry(`${BACKEND_BASE}/api/exam-guides?limit=500&include_contents=1`);
  } catch (err) {
    if (hasUsableCache()) {
      console.warn(`[fetch-exam-guides] API unavailable, using existing data/exam-guides-cache.json. ${err.message}`);
      return;
    }
    throw err;
  }

  const examGuides = normalizeItems(guidesRaw);
  const invalidGuide = examGuides.find((guide) => !isExamGuide(guide));
  if (invalidGuide) {
    throw new Error('The Exam Guides API returned a record that is not an Exam Guide. Refusing to cache Jobs or other content.');
  }
  writeCaches(examGuides);

  console.log(`[fetch-exam-guides] OK - ${examGuides.length} exam guides cached.`);
}

main().catch((err) => {
  console.error('[fetch-exam-guides] Build aborted:', err.message);
  process.exit(1);
});
