const fs = require('fs');
const path = require('path');
const apiConfig = require('../config/api-config.json');

const outDir = path.join(process.cwd(), 'out');
const canonicalBase = (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_FRONTEND_URL || apiConfig.frontendBase).replace(/\/+$/, '');
const canonicalHost = new URL(canonicalBase).host.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const nonCanonicalHost = canonicalHost.startsWith('www\\.')
  ? canonicalHost.replace(/^www\\\./, '')
  : `www\\.${canonicalHost}`;
const seoPrefixes = [
  'blog',
  'exam-guides',
  'about',
  'contact',
  'privacy-policy',
  'terms-and-conditions',
  'disclaimer',
  'resume',
  'templates',
  'tools',
  'typing',
];

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else if (/\.(html|xml|php)$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

function assertNoMatch(issues, label, file, content, regex) {
  const matches = content.match(regex);
  if (matches) {
    issues.push(`${label}: ${path.relative(process.cwd(), file)} -> ${matches[0].slice(0, 160)}`);
  }
}

function auditSitemapPages(issues) {
  const sitemapPath = path.join(outDir, 'sitemap.xml');
  if (!fs.existsSync(sitemapPath)) {
    issues.push('Missing generated sitemap: sitemap.xml');
    return;
  }

  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/gi)];
  if (locations.length === 0) {
    issues.push('Generated sitemap contains no URLs.');
    return;
  }

  const expectedOrigin = new URL(canonicalBase).origin;
  locations.forEach(([, location]) => {
    try {
      const url = new URL(location);
      if (url.origin !== expectedOrigin) {
        issues.push(`Sitemap URL uses a non-canonical origin: ${location}`);
        return;
      }

      const relativePath = decodeURIComponent(url.pathname).replace(/^\/+|\/+$/g, '');
      if (relativePath.split(/[\\/]/).includes('..')) {
        issues.push(`Sitemap URL contains an invalid path: ${location}`);
        return;
      }

      const pagePath = path.join(outDir, relativePath, 'index.html');
      if (!fs.existsSync(pagePath)) {
        issues.push(`Sitemap URL has no exported page: ${location}`);
      }
    } catch (error) {
      issues.push(`Invalid sitemap URL: ${location}`);
    }
  });
}

const prefixPattern = seoPrefixes.join('|');
const issues = [];

for (const file of walk(outDir)) {
  const content = fs.readFileSync(file, 'utf8');

  assertNoMatch(
    issues,
    'Non-final canonical URL',
    file,
    content,
    new RegExp(`rel="canonical" href="https://${nonCanonicalHost}/(${prefixPattern})("|\\?|#)`, 'i')
  );

  assertNoMatch(
    issues,
    'Non-final internal href',
    file,
    content,
    new RegExp(`href="/(${prefixPattern})("|\\?|#)`, 'i')
  );

  assertNoMatch(
    issues,
    'Non-final sitemap URL',
    file,
    content,
    new RegExp(`<loc>https://${nonCanonicalHost}/(${prefixPattern})(</loc>|\\?|#)`, 'i')
  );

  assertNoMatch(
    issues,
    'Backend URL leaked into public SEO output',
    file,
    content,
    /(<loc>|rel="canonical" href=")https:\/\/api\.resumesathi\.com/i
  );

  assertNoMatch(
    issues,
    'SearchAction placeholder leaked into public output',
    file,
    content,
    /search_term_string|\/blog\?(q|search)=/i
  );

  assertNoMatch(
    issues,
    'Unknown blog slug fallback leaked into hosting rules',
    file,
    content,
    /RewriteRule\s+\^blog\/\(\.\+\).*\/blog\/live\//i
  );
}

auditSitemapPages(issues);

if (issues.length) {
  console.error('[seo-audit] Failed');
  issues.forEach((issue) => console.error(`- ${issue}`));
  process.exit(1);
}

console.log('[seo-audit] OK - canonical URLs, internal links, and sitemap URLs use final frontend URLs.');
