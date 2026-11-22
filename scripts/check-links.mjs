import fs from "node:fs";
import path from "node:path";

const outputDirectory = path.resolve(process.cwd(), "out");
const siteOrigin = "https://www.resumesathi.com";
const siteHosts = new Set(["www.resumesathi.com", "resumesathi.com"]);

if (!fs.existsSync(outputDirectory)) {
  throw new Error("The out/ directory does not exist. Run npm run build first.");
}

function listHtmlFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return listHtmlFiles(entryPath);
    return entry.isFile() && entry.name.endsWith(".html") ? [entryPath] : [];
  });
}

function getPageUrl(filePath) {
  const relativePath = path.relative(outputDirectory, filePath).split(path.sep).join("/");
  if (relativePath === "index.html") return "/";
  if (relativePath.endsWith("/index.html")) {
    return `/${relativePath.slice(0, -"index.html".length)}`;
  }
  return `/${relativePath}`;
}

function readPage(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function isIndexable(html) {
  return !/<meta\b[^>]*\bname=["'](?:robots|googlebot)["'][^>]*\bcontent=["'][^"']*\bnoindex\b/i.test(
    html,
  );
}

function decodeHtml(value) {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function resolveInternalTarget(href, sourceUrl) {
  const normalizedHref = decodeHtml(href.trim());
  if (
    !normalizedHref ||
    /^(?:#|mailto:|tel:|javascript:|data:|blob:)/i.test(normalizedHref)
  ) {
    return null;
  }

  let url;
  try {
    url = new URL(normalizedHref, new URL(sourceUrl, siteOrigin));
  } catch {
    return { invalid: true };
  }
  if (!siteHosts.has(url.hostname.toLowerCase())) return null;

  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    return { invalid: true };
  }
  pathname = pathname.replace(/\\/g, "/");

  const candidates = [];
  const basePath = path.resolve(outputDirectory, `.${pathname}`);
  if (!basePath.startsWith(outputDirectory + path.sep) && basePath !== outputDirectory) {
    return { invalid: true };
  }

  candidates.push(basePath);
  if (!path.extname(basePath)) {
    candidates.push(path.join(basePath, "index.html"), `${basePath}.html`);
  } else if (pathname.endsWith("/")) {
    candidates.push(path.join(basePath, "index.html"));
  }

  const targetFile = candidates.find(
    (candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile(),
  );

  return targetFile ? { targetFile } : { invalid: true };
}

const allHtmlFiles = listHtmlFiles(outputDirectory).filter((filePath) => {
  const name = path.basename(filePath).toLowerCase();
  return name !== "404.html" && name !== "500.html";
});
const pages = allHtmlFiles.map((filePath) => ({
  filePath,
  url: getPageUrl(filePath),
  html: readPage(filePath),
}));
const pageByPath = new Map(
  pages.map((page) => [path.resolve(page.filePath).toLowerCase(), page]),
);
const indexablePages = pages.filter((page) => isIndexable(page.html));
const inboundCounts = new Map(
  indexablePages.map((page) => [path.resolve(page.filePath).toLowerCase(), 0]),
);
const brokenLinks = [];

for (const source of pages) {
  const anchors = source.html.matchAll(/<a\b[^>]*\bhref\s*=\s*(["'])(.*?)\1/gi);
  for (const match of anchors) {
    const href = match[2];
    const resolved = resolveInternalTarget(href, source.url);
    if (!resolved) continue;

    if (resolved.invalid) {
      brokenLinks.push({ source: source.url, href });
      continue;
    }

    const targetKey = path.resolve(resolved.targetFile).toLowerCase();
    const targetPage = pageByPath.get(targetKey);
    if (!targetPage && !fs.statSync(resolved.targetFile).isFile()) {
      brokenLinks.push({ source: source.url, href });
      continue;
    }
    if (targetKey !== path.resolve(source.filePath).toLowerCase() && inboundCounts.has(targetKey)) {
      inboundCounts.set(targetKey, inboundCounts.get(targetKey) + 1);
    }
  }
}

const orphanPages = indexablePages
  .filter((page) => inboundCounts.get(path.resolve(page.filePath).toLowerCase()) === 0)
  .map((page) => page.url)
  .sort();

console.log(`Checked ${pages.length} exported HTML pages (${indexablePages.length} indexable).`);
console.log("\nBroken internal links:");
if (brokenLinks.length === 0) {
  console.log("- none");
} else {
  for (const link of brokenLinks) {
    console.log(`- ${link.source} -> ${link.href}`);
  }
}

console.log("\nIndexable pages with zero inbound internal links:");
if (orphanPages.length === 0) {
  console.log("- none");
} else {
  for (const pageUrl of orphanPages) console.log(`- ${pageUrl}`);
}

if (brokenLinks.length > 0 || orphanPages.length > 0) process.exitCode = 1;
