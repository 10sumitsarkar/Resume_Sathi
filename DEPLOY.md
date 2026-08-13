Rebuild & Deploy Steps (Frontend)

Use this when you update the backend DB or public cache and need the frontend static build to reflect changes.

1) Ensure API public cache is regenerated (run on API server):

```bash
# trigger Laravel rebuild endpoint (replace host if needed)
curl -s -X POST "https://api.resumesathi.com/api/public-cache/rebuild" | jq
```

2) Regenerate frontend data cache and build (run in frontend repo):

```bash
cd Resume_Sathi
# regenerates data/article-*.json from API and then builds
npm run regen
# or run separately
node scripts/fetch-articles.js
npm run build
```

3) Deploy built output to your host (or run `npm run start` locally to test).

4) If you use a CDN, purge the cache for `/public/content-cache/*` and your site assets.

Notes
- `npm run regen` runs the fetch script and then `npm run build`.
- If you prefer server-side dynamic updates (no rebuild), deploy the frontend with a Node server and remove static-export; then the client can fetch live JSON at runtime.

API / DB Troubleshooting
- If `article-categories.json` still contains unwanted entries after rebuild, check the DB:

```bash
cd Resume_Sathi_APIs
php artisan tinker
# list categories
\App\Models\ArticleCategory::pluck('article_name')->toArray();
# remove if necessary
\App\Models\ArticleCategory::where('article_name','Interview Tips')->delete();
# trigger rebuild
curl -s -X POST "http://localhost/api/public-cache/rebuild" | jq
```

- Ensure file permissions allow Laravel to write to `public/content-cache/`.

If you want, I can also add a small CI script to run `npm run regen` automatically after API cache rebuild.
