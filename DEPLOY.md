Rebuild & Deploy Steps (Frontend)

Use this when you update the backend DB or public cache and need the frontend static build to reflect changes.

Exam Guides use their own backend tables and admin module; they do not use Jobs.
After deploying the API code, run the new migration before rebuilding the frontend:

```bash
cd Resume_Sathi_APIs
php artisan migrate --force
```

Manage Exam Guide content and comments at `/admin/exam-guides` and
`/admin/exam-guides/comments`. Exam Guides do not use categories or drafts.
The frontend fetches guides from `/api/exam-guides` and comments from
`/api/exam-guide-comments`; create active guides before rebuilding to include
them in the static pages. Static builds use the shared `backendBase` from
`config/api-config.json` (or
`NEXT_PUBLIC_BACKEND_BASE`) for Exam Guide data, comments, and media, just like
the other modules. Configure the shared backend URL for the environment before
building. The build rejects non-Exam-Guide records so stale Jobs data cannot
be exported as Exam Guides.

1) Ensure API public cache is regenerated (run on API server):

```bash
# trigger Laravel rebuild endpoint (replace host if needed)
curl -s -X POST "https://api.resumesathi.com/api/public-cache/rebuild" | jq
```

2) Regenerate frontend data cache and build (run in frontend repo):

```bash
cd Resume_Sathi
# refreshes the API-backed data caches and builds the static site
npm run regen
# or run separately
node scripts/fetch-articles.js
npm run build
```

3) Deploy the generated `out/` directory to your static host.

4) If you use a CDN, purge the cache for `/public/content-cache/*` and your site assets.

## Automatic Hostinger deployment

The GitHub Actions workflow at `.github/workflows/deploy-hostinger.yml` builds
the static site after changes are pushed to `main`, can be started manually
from the Actions tab, and has an hourly best-effort fallback. The build fetches
the latest articles and exam guides before exporting the site.

Before enabling it, add these repository secrets under
**Settings > Secrets and variables > Actions**:

- `FTP_SERVER`: the FTP/FTPS hostname shown in Hostinger hPanel.
- `FTP_USERNAME`: the FTP account username.
- `FTP_PASSWORD`: the FTP account password.
- `FTP_SERVER_DIR`: the site's exact FTP directory, commonly `public_html/`.

The workflow uses explicit FTPS on port 21 and uploads only the generated
`out/` files. It does not wipe the remote directory, so verify the target
directory in Hostinger before the first run. The `main` branch must be
configured for Next.js static export and generate `out/index.html`; the
workflow checks this before uploading so a server-rendered build cannot be
mistaken for a successful deployment. Start a test deployment using
**Actions > Build and deploy to Hostinger > Run workflow**.

### Trigger deployment when an article is published

To queue a deployment immediately after an article is saved as published, set
these variables in the API server's `.env` file:

- `GITHUB_DEPLOYMENT_REPOSITORY=10sumitsarkar/Resume_Sathi`
- `GITHUB_DEPLOYMENT_TOKEN`: a fine-grained GitHub token limited to this
  repository with **Contents: read and write** permission.

Keep the token only in the API server's private `.env`; never commit it or put
it in frontend code. After updating the API code and `.env`, clear Laravel's
cached configuration (`php artisan config:clear`). A successful publish then
queues the frontend workflow; the article becomes live after its build and
Hostinger upload finish. If queuing fails, the article is still saved and the
admin page shows a warning; check the API log and the GitHub token settings.

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
