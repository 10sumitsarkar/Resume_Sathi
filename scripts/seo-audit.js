const fs = require('fs');
const path = require('path');

const outDir = path.join(process.cwd(), 'out');
const seoPrefixes = [
  'blog',
  'jobs',
  'about',
  'contact',
  'privacy-policy',
  'terms-and-conditions',
  'disclaimer',
  'resume',
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

const prefixPattern = seoPrefixes.join('|');
const issues = [];

for (const file of walk(outDir)) {
  const content = fs.readFileSync(file, 'utf8');

  assertNoMatch(
    issues,
    'Non-final canonical URL',
    file,
    content,
    new RegExp(`rel="canonical" href="https://www\\.resumesathi\\.com/(${prefixPattern})("|\\?|#)`, 'i')
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
    new RegExp(`<loc>https://www\\.resumesathi\\.com/(${prefixPattern})(</loc>|\\?|#)`, 'i')
  );

  assertNoMatch(
    issues,
    'Backend URL leaked into public SEO output',
    file,
    content,
    /(<loc>|rel="canonical" href=")https:\/\/api\.resumesathi\.com/i
  );
}

if (issues.length) {
  console.error('[seo-audit] Failed');
  issues.forEach((issue) => console.error(`- ${issue}`));
  process.exit(1);
}

console.log('[seo-audit] OK - canonical URLs, internal links, and sitemap URLs use final frontend URLs.');
