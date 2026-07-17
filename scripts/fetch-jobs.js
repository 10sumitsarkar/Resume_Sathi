const fs = require('fs');
const path = require('path');

const BACKEND_BASE = process.env.NEXT_PUBLIC_BACKEND_BASE || 'https://api.resumesathi.com';

async function fetchWithRetry(url, retries = 4, delayMs = 3000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`[fetch-jobs] Attempt ${attempt} -> ${url}`);
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn(`[fetch-jobs] Attempt ${attempt} failed: ${err.message}`);
      if (attempt === retries) throw err;
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
}

async function main() {
  const jobsRaw = await fetchWithRetry(`${BACKEND_BASE}/api/courses`);
  const jobs = Array.isArray(jobsRaw) ? jobsRaw : (jobsRaw.items || jobsRaw.results || []);

  // FATAL: agar API ne khaali/broken data diya, build ko yahin rok do.
  // Warna purane jobs bhi khaali shell ke saath overwrite ho jaayenge.
  if (!jobs.length) {
    console.error('[fetch-jobs] FATAL: /api/courses returned 0 jobs. Aborting build — old deploy untouched.');
    process.exit(1);
  }

  const catsRaw = await fetchWithRetry(`${BACKEND_BASE}/api/course-categories`);
  const categories = Array.isArray(catsRaw) ? catsRaw : (catsRaw.items || catsRaw.results || []);

  const outDir = path.join(process.cwd(), 'data');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'jobs-cache.json'), JSON.stringify(jobs, null, 2));
  fs.writeFileSync(path.join(outDir, 'categories-cache.json'), JSON.stringify(categories, null, 2));

  console.log(`[fetch-jobs] OK — ${jobs.length} jobs, ${categories.length} categories cached.`);
}

main().catch((err) => {
  console.error('[fetch-jobs] Build aborted:', err.message);
  process.exit(1);
});