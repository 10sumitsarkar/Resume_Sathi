const fs = require('fs');
const path = require('path');

const BACKEND_BASE = process.env.NEXT_PUBLIC_BACKEND_BASE || 'https://api.resumesathi.com';

async function fetchWithRetry(url, retries = 4, delayMs = 3000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`[fetch-articles] Attempt ${attempt} -> ${url}`);
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn(`[fetch-articles] Attempt ${attempt} failed: ${err.message}`);
      if (attempt === retries) throw err;
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
}

async function main() {
  const articlesRaw = await fetchWithRetry(`${BACKEND_BASE}/api/articles`);
  const articles = Array.isArray(articlesRaw)
    ? articlesRaw
    : (articlesRaw.items || articlesRaw.results || articlesRaw.data || []);

  // FATAL: agar API ne khaali/broken data diya, build ko yahin rok do.
  if (!articles.length) {
    console.error('[fetch-articles] FATAL: /api/articles returned 0 articles. Aborting build — old deploy untouched.');
    process.exit(1);
  }

  const catsRaw = await fetchWithRetry(`${BACKEND_BASE}/api/article-categories`);
  const categories = Array.isArray(catsRaw) ? catsRaw : (catsRaw.items || catsRaw.results || []);

  const outDir = path.join(process.cwd(), 'data');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'articles-cache.json'), JSON.stringify(articles, null, 2));
  fs.writeFileSync(path.join(outDir, 'article-categories-cache.json'), JSON.stringify(categories, null, 2));

  console.log(`[fetch-articles] OK — ${articles.length} articles, ${categories.length} categories cached.`);
}

main().catch((err) => {
  console.error('[fetch-articles] Build aborted:', err.message);
  process.exit(1);
});
