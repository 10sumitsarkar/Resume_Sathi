const fs = require('fs');
const path = require('path');
const apiConfig = require('../config/api-config.json');

const outDir = path.join(process.cwd(), 'out');
const canonicalBase = (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_FRONTEND_URL || apiConfig.frontendBase).replace(/\/+$/, '');

const excludedPathPatterns = [
  /^\/resume\/(personal-info|summary|education|work-experience|internship|skill|language|certificate|hobbie|social-media|select-theme|preview)(\/|$)/,
  /^\/bio-data\/(personal-info|summary|education|work-experience|internship|skill|language|hobbie|social-media|select-theme|preview)(\/|$)/,
  /^\/blog\/live(\/|$)/,
  /^\/jobs\/live(\/|$)/,
  /^\/jobs\/(%5Bslug%5D|\[slug\]|[^/]+-jobs)(\/|$)/,
  /^\/blog\/(%5Bslug%5D|\[slug\])(\/|$)/,
  /^\/404(\/|$)/,
  /^\/_not-found(\/|$)/,
];

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fullPath, files);
    else if (entry.name === 'index.html' || entry.name === '404.html') files.push(fullPath);
  }
  return files;
}

function routeFromFile(file) {
  const rel = path.relative(outDir, file).replace(/\\/g, '/');
  if (rel === 'index.html') return '/';
  if (rel === '404.html') return '/404/';
  return `/${rel.replace(/\/index\.html$/, '/')}`;
}

function isExcluded(route) {
  return excludedPathPatterns.some((pattern) => pattern.test(route));
}

function getAttr(content, regex) {
  const match = content.match(regex);
  return match ? match[1] : '';
}

function isIndexable(content) {
  const robots = Array.from(content.matchAll(/<meta\s+name="robots"\s+content="([^"]+)"/gi)).map((match) => match[1].toLowerCase());
  return !robots.some((value) => value.includes('noindex'));
}

function exportedHrefExists(href) {
  if (!href.startsWith('/')) return true;
  if (href.startsWith('/_next/') || href.startsWith('/front-assets/')) return true;
  const cleanHref = href.split('?')[0].split('#')[0];
  if (/\.[a-z0-9]+$/i.test(cleanHref)) return fs.existsSync(path.join(outDir, cleanHref.replace(/^\/+/, '')));
  const cleanRoute = cleanHref.replace(/^\/+/, '').replace(/\/+$/, '');
  const file = cleanRoute ? path.join(outDir, cleanRoute, 'index.html') : path.join(outDir, 'index.html');
  return fs.existsSync(file);
}

const sitemapLocs = new Set();
const sitemapPath = path.join(outDir, 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  for (const match of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    try {
      sitemapLocs.add(new URL(match[1]).pathname);
    } catch {}
  }
}

const issues = [];
const warnings = [];
let checked = 0;

for (const file of walk(outDir)) {
  const route = routeFromFile(file);
  const content = fs.readFileSync(file, 'utf8');
  if (isExcluded(route)) continue;

  const indexable = isIndexable(content);
  if (!indexable) continue;
  checked += 1;

  const title = getAttr(content, /<title>([^<]*)<\/title>/i);
  const description = getAttr(content, /<meta\s+name="description"\s+content="([^"]*)"/i);
  const canonical = getAttr(content, /<link\s+rel="canonical"\s+href="([^"]*)"/i);
  const ogTitle = getAttr(content, /<meta\s+property="og:title"\s+content="([^"]*)"/i);
  const ogDescription = getAttr(content, /<meta\s+property="og:description"\s+content="([^"]*)"/i);
  const ogImage = getAttr(content, /<meta\s+property="og:image"\s+content="([^"]*)"/i);
  const h1Count = (content.match(/<h1[\s>]/gi) || []).length;

  if (!title) issues.push(`${route} missing title`);
  else if (title.length < 20 || title.length > 75) warnings.push(`${route} title length ${title.length}: ${title}`);
  if (!description) issues.push(`${route} missing description`);
  else if (description.length < 50 || description.length > 170) warnings.push(`${route} description length ${description.length}`);
  if (!canonical) issues.push(`${route} missing canonical`);
  else if (!canonical.startsWith(`${canonicalBase}/`)) issues.push(`${route} canonical not final: ${canonical}`);
  if (!ogTitle) warnings.push(`${route} missing og:title`);
  if (!ogDescription) warnings.push(`${route} missing og:description`);
  if (!ogImage) warnings.push(`${route} missing og:image`);
  if (h1Count !== 1) warnings.push(`${route} has ${h1Count} H1 tags`);
  if (sitemapLocs.size && !sitemapLocs.has(route)) warnings.push(`${route} indexable but not in sitemap.xml`);

  for (const match of content.matchAll(/\shref="([^"]+)"/g)) {
    const href = match[1];
    if (/^(https?:|mailto:|tel:|#|javascript:)/i.test(href)) continue;
    if (href.includes('/jobs/[slug]') || href.includes('/blog/[slug]')) issues.push(`${route} placeholder href: ${href}`);
    if (href.startsWith('/jobs/') && href.includes('-jobs/')) issues.push(`${route} legacy job category href: ${href}`);
    if (!exportedHrefExists(href)) warnings.push(`${route} href may not exist: ${href}`);
  }
}

if (issues.length) {
  console.error(`[full-seo-audit] Failed - checked ${checked} indexable pages`);
  issues.forEach((issue) => console.error(`- ${issue}`));
  if (warnings.length) {
    console.error('[full-seo-audit] Warnings');
    warnings.slice(0, 80).forEach((warning) => console.error(`- ${warning}`));
    if (warnings.length > 80) console.error(`- ...and ${warnings.length - 80} more warnings`);
  }
  process.exit(1);
}

console.log(`[full-seo-audit] OK - checked ${checked} indexable pages (resume/bio-data step pages excluded).`);
if (warnings.length) {
  console.warn('[full-seo-audit] Warnings');
  warnings.slice(0, 120).forEach((warning) => console.warn(`- ${warning}`));
  if (warnings.length > 120) console.warn(`- ...and ${warnings.length - 120} more warnings`);
}
