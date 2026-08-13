const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
const apiConfig = require('../config/api-config.json');

const BACKEND_BASE = process.env.NEXT_PUBLIC_BACKEND_BASE || apiConfig.backendBase;
const outDir = path.join(process.cwd(), 'data');
const articlesCachePath = path.join(outDir, 'articles-cache.json');
const categoriesCachePath = path.join(outDir, 'article-categories-cache.json');

function hasUsableCache() {
  try {
    const articles = JSON.parse(fs.readFileSync(articlesCachePath, 'utf-8'));
    return Array.isArray(articles) && articles.length > 0 && fs.existsSync(categoriesCachePath);
  } catch (err) {
    return false;
  }
}

async function fetchWithRetry(url, retries = 4, delayMs = 3000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`[fetch-articles] Attempt ${attempt} -> ${url}`);
      return await fetchJson(url);
    } catch (err) {
      console.warn(`[fetch-articles] Attempt ${attempt} failed: ${err.message}`);
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
  let articlesRaw;
  try {
    articlesRaw = await fetchWithRetry(`${BACKEND_BASE}/api/articles?limit=500&include_contents=1`);
  } catch (err) {
    if (hasUsableCache()) {
      console.warn(`[fetch-articles] API unavailable, using existing data/articles-cache.json. ${err.message}`);
      return;
    }
    throw err;
  }

  const articles = Array.isArray(articlesRaw)
    ? articlesRaw
    : (articlesRaw.items || articlesRaw.results || articlesRaw.data || []);

  if (!articles.length) {
    if (hasUsableCache()) {
      console.warn('[fetch-articles] /api/articles returned 0 articles, using existing cache.');
      return;
    }
    console.error('[fetch-articles] FATAL: /api/articles returned 0 articles. Aborting build - old deploy untouched.');
    process.exit(1);
  }

  const catsRaw = await fetchWithRetry(`${BACKEND_BASE}/api/article-categories`);
  const categories = Array.isArray(catsRaw) ? catsRaw : (catsRaw.items || catsRaw.results || []);

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(articlesCachePath, JSON.stringify(articles, null, 2));
  fs.writeFileSync(categoriesCachePath, JSON.stringify(categories, null, 2));

  console.log(`[fetch-articles] OK - ${articles.length} articles, ${categories.length} categories cached.`);
}

main().catch((err) => {
  console.error('[fetch-articles] Build aborted:', err.message);
  process.exit(1);
});
