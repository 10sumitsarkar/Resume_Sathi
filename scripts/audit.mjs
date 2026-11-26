import { spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const option = (name, fallback) => {
  const index = args.findIndex((value) => value === `--${name}`);
  if (index >= 0) return args[index + 1] || fallback;
  const value = args.find((item) => item.startsWith(`--${name}=`));
  return value ? value.slice(name.length + 3) : fallback;
};
const outputDirectory = path.resolve(repoRoot, option("out", "out"));
const siteOrigin = new URL(option("site-origin", "https://www.resumesathi.com")).origin;
const lighthouseBaseUrl = option("lighthouse-base-url", "");
const runLighthouse = args.includes("--lighthouse");
const expectedAdsTxt =
  "google.com, pub-7914493060795219, DIRECT, f08c47fec0942fa0";
const siteHosts = new Set(["www.resumesathi.com", "resumesathi.com"]);
const baselinePages = [
  { name: "Home", route: "/" },
  { name: "Blog index", route: "/blog/" },
  { name: "Blog article", route: "/blog/how-to-create-a-resume-for-free/" },
  {
    name: "Exam guide",
    route: "/exam-guides/rrb-ntpc-12th-level-exam-syllabus-pattern-eligibility-salary/",
  },
  { name: "Merge PDF", route: "/tools/merge-pdf/" },
];
const groups = [
  "Placeholder text",
  "AdSense and ad network code",
  "Ad placement policy",
  "Page quality and metadata",
  "Image availability",
  "Links and sitemap",
  "Privacy, consent and footer",
  "Lighthouse mobile scores",
];
const issues = [];
const recommendations = [];
const info = new Map();
const pages = [];

function addIssue(group, detail, priority = 2) {
  issues.push({ group, detail, priority });
}

function setInfo(group, detail) {
  info.set(group, detail);
}

function walkFiles(directory, predicate) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) return walkFiles(filePath, predicate);
    return entry.isFile() && predicate(filePath) ? [filePath] : [];
  });
}

function decodeHtml(value = "") {
  const entities = {
    amp: "&",
    apos: "'",
    nbsp: " ",
    copy: "©",
    gt: ">",
    hellip: "…",
    ldquo: "“",
    lsquo: "‘",
    lt: "<",
    mdash: "—",
    ndash: "–",
    quot: '"',
    rdquo: "”",
    reg: "®",
    rsquo: "’",
    trade: "™",
  };
  return String(value)
    .replace(/&(#x[\da-f]+|#\d+|[a-z][\da-z]+);/gi, (whole, entity) => {
      if (entity[0] === "#") {
        const code = entity[1].toLowerCase() === "x"
          ? Number.parseInt(entity.slice(2), 16)
          : Number.parseInt(entity.slice(1), 10);
        return Number.isFinite(code) ? String.fromCodePoint(code) : whole;
      }
      return entities[entity.toLowerCase()] || whole;
    });
}

function getAttribute(tag, name) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = tag.match(
    new RegExp(`(?:^|\\s)${escapedName}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"),
  );
  return decodeHtml(match?.[1] ?? match?.[2] ?? match?.[3] ?? "");
}

function getRoute(filePath) {
  const relative = path.relative(outputDirectory, filePath).split(path.sep).join("/");
  if (relative === "index.html") return "/";
  if (relative.endsWith("/index.html")) return `/${relative.slice(0, -"index.html".length)}`;
  return `/${relative}`;
}

function getMetaTags(html) {
  return html.match(/<meta\b[^>]*>/gi) || [];
}

function getMeta(html, name) {
  return getMetaTags(html).find(
    (tag) => getAttribute(tag, "name").toLowerCase() === name.toLowerCase(),
  );
}

function isIndexable(html) {
  return !getMetaTags(html).some((tag) => {
    const name = getAttribute(tag, "name").toLowerCase();
    return (
      ["robots", "googlebot"].includes(name) &&
      /\bnoindex\b/i.test(getAttribute(tag, "content"))
    );
  });
}

function getCanonicalTags(html) {
  return (html.match(/<link\b[^>]*>/gi) || []).filter((tag) =>
    getAttribute(tag, "rel").toLowerCase().split(/\s+/).includes("canonical"),
  );
}

function visibleText(html) {
  const mainContent = html.match(/<main\b[^>]*>([\s\S]*?)<\/main\s*>/i)?.[1];
  return decodeHtml(mainContent || html)
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<(script|style|svg|noscript|template)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, " ")
    .replace(/<(header|nav|footer|aside)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getWords(text) {
  return text.match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu) || [];
}

function getTextHash(text) {
  return crypto.createHash("sha256").update(text.toLowerCase()).digest("hex");
}

function getTextShingles(text, size = 7) {
  const words = getWords(text).map((word) => word.toLowerCase());
  const shingles = new Set();
  for (let index = 0; index <= words.length - size; index += 1) {
    shingles.add(words.slice(index, index + size).join(" "));
  }
  return shingles;
}

function localFileForUrl(url) {
  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    return null;
  }
  const candidate = path.resolve(outputDirectory, `.${pathname}`);
  if (candidate !== outputDirectory && !candidate.startsWith(`${outputDirectory}${path.sep}`)) {
    return null;
  }
  const candidates = [candidate];
  if (!path.extname(candidate)) {
    candidates.push(path.join(candidate, "index.html"), `${candidate}.html`);
  }
  return candidates.find(
    (filePath) => fs.existsSync(filePath) && fs.statSync(filePath).isFile(),
  );
}

function getPageByRoute(route) {
  const normalized = route.endsWith("/") || path.extname(route)
    ? route
    : `${route}/`;
  return pages.find((page) => page.route === normalized);
}

function isBlockedRoute(page) {
  const route = page.route;
  const isAllowedArticle =
    /^\/blog\/[^/]+\/$/.test(route) &&
    !/^\/blog\/(?:page|category)\//.test(route);
  const isAllowedExamGuide = /^\/exam-guides\/[^/]+\/$/.test(route);
  const isExplicitlyBlocked =
    /^\/(?:resume|bio-data|tools|templates)(?:\/|$)/.test(route) ||
    /^\/(?:about|contact|privacy-policy|terms-and-conditions|disclaimer)(?:\/|$)/.test(
      route,
    ) ||
    route === "/404.html" ||
    !page.indexable ||
    page.wordCount < 400;
  return (
    isExplicitlyBlocked ||
    !(isAllowedArticle || isAllowedExamGuide)
  );
}

function extractImageUrls(html, schemas) {
  const urls = [];
  for (const tag of html.match(/<img\b[^>]*>/gi) || []) {
    for (const attribute of ["src", "data-src", "data-original"]) {
      const value = getAttribute(tag, attribute);
      if (value) urls.push(value);
    }
    const srcset = getAttribute(tag, "srcset");
    if (srcset) {
      for (const entry of srcset.split(",")) {
        const value = entry.trim().split(/\s+/)[0];
        if (value) urls.push(value);
      }
    }
  }
  for (const tag of html.match(/<(?:source|meta)\b[^>]*>/gi) || []) {
    const tagName = tag.match(/^<([a-z]+)/i)?.[1]?.toLowerCase();
    if (tagName === "source") {
      const srcset = getAttribute(tag, "srcset");
      for (const entry of srcset.split(",")) {
        const value = entry.trim().split(/\s+/)[0];
        if (value) urls.push(value);
      }
    } else if (
      ["og:image", "og:image:url", "og:image:secure_url"].includes(
        getAttribute(tag, "property").toLowerCase(),
      ) ||
      getAttribute(tag, "name").toLowerCase() === "twitter:image"
    ) {
      const value = getAttribute(tag, "content");
      if (value) urls.push(value);
    }
  }

  function collectSchemaImages(value, key = "") {
    const imageKey = /^(?:image|logo|contentUrl|thumbnailUrl)$/i.test(key);
    if (Array.isArray(value)) {
      value.forEach((item) => collectSchemaImages(item, key));
    } else if (value && typeof value === "object") {
      if (imageKey && typeof value.url === "string") urls.push(value.url);
      for (const [childKey, childValue] of Object.entries(value)) {
        collectSchemaImages(childValue, childKey);
      }
    } else if (imageKey && typeof value === "string") {
      urls.push(value);
    }
  }

  schemas.forEach((schema) => collectSchemaImages(schema));
  return urls;
}

function addDateValues(value, key, dateValues) {
  if (Array.isArray(value)) {
    value.forEach((item) => addDateValues(item, key, dateValues));
  } else if (value && typeof value === "object") {
    for (const [childKey, childValue] of Object.entries(value)) {
      addDateValues(childValue, childKey, dateValues);
    }
  } else if (
    typeof value === "string" &&
    /^(?:created_at|updated_at|published_at|modified_at|datePublished|dateModified)$/i.test(
      key,
    ) &&
    !Number.isNaN(Date.parse(value))
  ) {
    dateValues.add(new Date(value).toISOString());
  }
}

function parseSitemap() {
  const sitemapPath = path.join(outputDirectory, "sitemap.xml");
  if (!fs.existsSync(sitemapPath)) {
    addIssue("Links and sitemap", "out/sitemap.xml is missing", 1);
    return;
  }
  const xml = fs.readFileSync(sitemapPath, "utf8");
  const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/gi)].map((match) => {
    const block = match[1];
    return {
      loc: decodeHtml(block.match(/<loc>([\s\S]*?)<\/loc>/i)?.[1]?.trim() || ""),
      lastmod: decodeHtml(
        block.match(/<lastmod>([\s\S]*?)<\/lastmod>/i)?.[1]?.trim() || "",
      ),
    };
  });
  const urls = entries.map((entry) => entry.loc).filter(Boolean);
  const seen = new Set();
  const contentDates = new Set();

  for (const filename of ["articles-cache.json", "exam-guides-cache.json"]) {
    const cachePath = path.join(repoRoot, "data", filename);
    if (fs.existsSync(cachePath)) {
      addDateValues(JSON.parse(fs.readFileSync(cachePath, "utf8")), "", contentDates);
    }
  }

  if (/<changefreq>|<priority>/i.test(xml)) {
    addIssue("Links and sitemap", "sitemap.xml contains changefreq or priority", 2);
  }

  for (const entry of entries) {
    if (!entry.loc) {
      addIssue("Links and sitemap", "Sitemap entry is missing <loc>", 1);
      continue;
    }
    if (seen.has(entry.loc)) {
      addIssue("Links and sitemap", `Duplicate sitemap URL: ${entry.loc}`, 1);
    }
    seen.add(entry.loc);

    let url;
    try {
      url = new URL(entry.loc);
    } catch {
      addIssue("Links and sitemap", `Invalid sitemap URL: ${entry.loc}`, 1);
      continue;
    }
    const page = getPageByRoute(url.pathname);
    if (
      url.origin !== siteOrigin ||
      url.search ||
      url.hash ||
      !url.pathname.endsWith("/") ||
      !page ||
      !page.indexable ||
      page.canonical !== entry.loc
    ) {
      addIssue("Links and sitemap", `Not an exported self-canonical indexable URL: ${entry.loc}`, 1);
    }
    if (/^\/(?:resume|bio-data)\/.+/i.test(url.pathname)) {
      addIssue("Links and sitemap", `Wizard route is listed: ${entry.loc}`, 1);
    }
    if (entry.lastmod) {
      const lastmodDate = new Date(entry.lastmod);
      if (
        Number.isNaN(lastmodDate.valueOf()) ||
        !contentDates.has(lastmodDate.toISOString())
      ) {
        addIssue(
          "Links and sitemap",
          `lastmod is not a cached content date: ${entry.loc} (${entry.lastmod})`,
          1,
        );
      }
    }
  }

  for (const page of pages.filter((item) => item.indexable)) {
    const expectedUrl = `${siteOrigin}${page.route}`;
    if (!seen.has(expectedUrl)) {
      addIssue("Links and sitemap", `Indexable page missing from sitemap: ${page.route}`, 1);
    }
  }
  setInfo(
    "Links and sitemap",
    `${urls.length} sitemap URLs; ${pages.filter((page) => page.indexable).length} indexable pages`,
  );
}

async function checkRemoteImage(url) {
  try {
    let response = await fetch(url, {
      method: "HEAD",
      signal: AbortSignal.timeout(15000),
    });
    if (response.status === 405 || response.status === 501) {
      response = await fetch(url, {
        headers: { Range: "bytes=0-0" },
        signal: AbortSignal.timeout(15000),
      });
    }
    const status = response.status;
    if (response.body) await response.body.cancel();
    return status === 200 ? null : `HTTP ${status}`;
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }
}

async function checkImages() {
  const urls = new Set();
  for (const page of pages) {
    for (const value of extractImageUrls(page.html, page.schemas)) {
      if (!value || /^data:/i.test(value)) continue;
      let url;
      try {
        url = new URL(value, `${siteOrigin}${page.route}`);
      } catch {
        addIssue("Image availability", `Invalid image URL on ${page.route}: ${value}`, 1);
        continue;
      }
      if (!["http:", "https:"].includes(url.protocol)) {
        addIssue("Image availability", `Non-HTTP image URL on ${page.route}: ${value}`, 1);
        continue;
      }
      urls.add(url.href);
    }
  }

  const failures = [];
  let cursor = 0;
  const imageUrls = [...urls];
  async function worker() {
    while (cursor < imageUrls.length) {
      const urlString = imageUrls[cursor++];
      const url = new URL(urlString);
      if (siteHosts.has(url.hostname.toLowerCase())) {
        if (!localFileForUrl(url)) failures.push(`${urlString} (missing from out/)`);
        continue;
      }
      const failure = await checkRemoteImage(urlString);
      if (failure) failures.push(`${urlString} (${failure})`);
    }
  }
  await Promise.all(Array.from({ length: 8 }, worker));
  for (const failure of failures) {
    addIssue("Image availability", failure, 1);
  }
  setInfo(
    "Image availability",
    `${imageUrls.length} unique img, OG and JSON-LD image URLs checked`,
  );
}

function parseFooterLinks(html) {
  const footer = [...html.matchAll(/<footer\b[^>]*>[\s\S]*?<\/footer\s*>/gi)]
    .map((match) => match[0])
    .join(" ");
  return (footer.match(/<a\b[^>]*>[\s\S]*?<\/a\s*>/gi) || []).map((tag) => ({
    href: getAttribute(tag, "href").split(/[?#]/)[0],
    text: decodeHtml(tag.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim(),
  }));
}

function checkInternalLinks() {
  const inbound = new Map(pages.map((page) => [page.route, 0]));
  for (const page of pages) {
    for (const tag of page.html.match(/<a\b[^>]*>/gi) || []) {
      const href = getAttribute(tag, "href");
      if (!href || /^(?:#|mailto:|tel:|javascript:|data:)/i.test(href)) continue;
      let url;
      try {
        url = new URL(href, `${siteOrigin}${page.route}`);
      } catch {
        addIssue("Links and sitemap", `Invalid link on ${page.route}: ${href}`, 1);
        continue;
      }
      if (!["http:", "https:"].includes(url.protocol) || !siteHosts.has(url.hostname.toLowerCase())) {
        continue;
      }
      if (!localFileForUrl(url)) {
        addIssue("Links and sitemap", `Broken internal link on ${page.route}: ${href}`, 1);
        continue;
      }
      const targetPage = getPageByRoute(url.pathname);
      if (targetPage) {
        inbound.set(targetPage.route, (inbound.get(targetPage.route) || 0) + 1);
      }
    }
  }

  for (const page of pages.filter((item) => item.indexable)) {
    if ((inbound.get(page.route) || 0) === 0) {
      addIssue("Links and sitemap", `Indexable page has no inbound links: ${page.route}`, 1);
    }
  }
}

function checkPrivacyAndFooter() {
  const privacy = pages.find((page) => page.route === "/privacy-policy/");
  if (!privacy) {
    addIssue("Privacy, consent and footer", "Privacy policy page is missing", 1);
  } else {
    const text = visibleText(privacy.html).toLowerCase();
    for (const phrase of [
      "google adsense",
      "third-party vendors",
      "cookies to serve ads",
      "prior visits to this and other websites",
      "partner sites and apps policy",
    ]) {
      if (!text.includes(phrase)) {
        addIssue(
          "Privacy, consent and footer",
          `Privacy policy is missing required text: "${phrase}"`,
          1,
        );
      }
    }
  }

  const footerRequirements = [
    { href: "/about/", label: "About" },
    { href: "/contact/", label: "Contact" },
    { href: "/privacy-policy/", label: "Privacy" },
    { href: "/terms-and-conditions/", label: "Terms" },
    { href: "/disclaimer/", label: "Disclaimer" },
    { href: "/editorial-policy/", label: "Editorial Policy" },
    { href: "/authors/", label: "Authors" },
  ];
  const home = pages.find((page) => page.route === "/");
  const footerLinks = home ? parseFooterLinks(home.html) : [];
  for (const requirement of footerRequirements) {
    if (!footerLinks.some((link) => link.href === requirement.href)) {
      addIssue(
        "Privacy, consent and footer",
        `Footer is missing ${requirement.label} link (${requirement.href})`,
        1,
      );
    }
  }

  const manageLinkExists = pages.some((page) =>
    parseFooterLinks(page.html).some(
      (link) => link.text.toLowerCase() === "manage cookie choices",
    ),
  );
  if (!manageLinkExists) {
    addIssue(
      "Privacy, consent and footer",
      'Footer "Manage cookie choices" link is missing',
      1,
    );
  }

  const bannerExists = pages.some((page) => {
    const containers = page.html.match(
      /<(?:div|section|aside)\b[^>]*(?:id|class)=["'][^"']*(?:cookie[-_ ]?(?:consent|banner|notice)|consent[-_ ]?(?:banner|dialog|manager))[^"']*["'][^>]*>[\s\S]*?<\/(?:div|section|aside)\s*>/gi,
    ) || [];
    return containers.some(
      (container) =>
        /<(?:button|a)\b[^>]*>[\s\S]*?\b(?:accept|reject|manage|preferences)\b[\s\S]*?<\/(?:button|a)\s*>/i.test(
          container,
        ),
    );
  });
  if (!bannerExists) {
    addIssue("Privacy, consent and footer", "Cookie consent banner was not found in static HTML", 1);
  }
}

function checkPageQuality() {
  const titleOwners = new Map();
  const descriptionOwners = new Map();
  const contentOwners = new Map();
  const contentPages = [];

  for (const page of pages.filter((item) => item.indexable)) {
    const h1Count = (page.html.match(/<h1\b/gi) || []).length;
    if (h1Count !== 1) {
      addIssue("Page quality and metadata", `${page.route} has ${h1Count} H1 elements; expected 1`, 2);
    }
    if (page.title.length < 45 || page.title.length > 60) {
      addIssue(
        "Page quality and metadata",
        `${page.route} title length ${page.title.length}; expected 45-60`,
        2,
      );
    }
    if (page.description.length < 120 || page.description.length > 158) {
      addIssue(
        "Page quality and metadata",
        `${page.route} description length ${page.description.length}; expected 120-158`,
        2,
      );
    }
    const titleKey = page.title.toLowerCase().trim();
    if (titleOwners.has(titleKey)) {
      addIssue(
        "Page quality and metadata",
        `Duplicate title on ${page.route} and ${titleOwners.get(titleKey)}`,
        2,
      );
    } else if (titleKey) {
      titleOwners.set(titleKey, page.route);
    }
    const descriptionKey = page.description.toLowerCase().trim();
    if (descriptionOwners.has(descriptionKey)) {
      addIssue(
        "Page quality and metadata",
        `Duplicate description on ${page.route} and ${descriptionOwners.get(descriptionKey)}`,
        2,
      );
    } else if (descriptionKey) {
      descriptionOwners.set(descriptionKey, page.route);
    }

    const canonicalTags = getCanonicalTags(page.html);
    const canonical = canonicalTags.length === 1
      ? getAttribute(canonicalTags[0], "href")
      : "";
    if (canonicalTags.length !== 1 || canonical !== page.canonical) {
      addIssue(
        "Page quality and metadata",
        `${page.route} must have exactly one self-referencing canonical`,
        1,
      );
    }
    if (page.schemas.length === 0) {
      addIssue("Page quality and metadata", `${page.route} contains no valid JSON-LD`, 2);
    }
    if (page.jsonLdErrors.length) {
      addIssue(
        "Page quality and metadata",
        `${page.route} has invalid JSON-LD: ${page.jsonLdErrors.join("; ")}`,
        2,
      );
    }

    const isToolOrTemplate = /^\/(?:tools|templates)(?:\/|$)/.test(page.route);
    const minimumWords = isToolOrTemplate ? 600 : 400;
    if (page.wordCount < minimumWords) {
      addIssue(
        "Page quality and metadata",
        `${page.route} has ${page.wordCount} visible content words; expected at least ${minimumWords}`,
        2,
      );
    }
    const normalizedContent = page.text.toLowerCase().replace(/\s+/g, " ").trim();
    if (normalizedContent) {
      const hash = getTextHash(normalizedContent);
      if (contentOwners.has(hash)) {
        addIssue(
          "Page quality and metadata",
          `Duplicate visible text on ${page.route} and ${contentOwners.get(hash)}`,
          2,
        );
      } else {
        contentOwners.set(hash, page.route);
      }
      contentPages.push({
        route: page.route,
        shingles: getTextShingles(normalizedContent),
      });
    }
  }
  for (let firstIndex = 0; firstIndex < contentPages.length; firstIndex += 1) {
    const first = contentPages[firstIndex];
    for (let secondIndex = firstIndex + 1; secondIndex < contentPages.length; secondIndex += 1) {
      const second = contentPages[secondIndex];
      const smaller = first.shingles.size <= second.shingles.size
        ? first.shingles
        : second.shingles;
      if (smaller.size < 20) continue;
      let overlap = 0;
      for (const shingle of smaller) {
        if (first.shingles.has(shingle) && second.shingles.has(shingle)) overlap += 1;
      }
      if (overlap / smaller.size >= 0.9) {
        addIssue(
          "Page quality and metadata",
          `Near-duplicate visible text on ${first.route} and ${second.route}`,
          2,
        );
      }
    }
  }
  setInfo(
    "Page quality and metadata",
    `${pages.filter((page) => page.indexable).length} indexable pages checked`,
  );
}

function checkAdSenseAndPlacement() {
  const loader = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
  const shouldLoadAdsense = (route) =>
    route === "/" || /^\/(?:blog|exam-guides|templates)(?:\/|$)/.test(route);
  for (const page of pages.filter((item) => item.indexable)) {
    const scripts = (page.html.match(/<script\b[^>]*>/gi) || []).filter((tag) =>
      getAttribute(tag, "src").startsWith(loader),
    );
    const accountMetas = getMetaTags(page.html).filter(
      (tag) =>
        getAttribute(tag, "name").toLowerCase() === "google-adsense-account",
    );
    const expectedScripts = shouldLoadAdsense(page.route) ? 1 : 0;
    if (scripts.length !== expectedScripts) {
      addIssue(
        "AdSense and ad network code",
        `${page.route} has ${scripts.length} AdSense loader scripts; expected ${expectedScripts}`,
        1,
      );
    }
    if (
      accountMetas.length !== 1 ||
      getAttribute(accountMetas[0] || "", "content") !== "ca-pub-7914493060795219"
    ) {
      addIssue(
        "AdSense and ad network code",
        `${page.route} is missing the correct Google AdSense account meta`,
        1,
      );
    }
  }

  const adsPath = path.join(outputDirectory, "ads.txt");
  const adsText = fs.existsSync(adsPath) ? fs.readFileSync(adsPath, "utf8") : "";
  if (
    adsText !== expectedAdsTxt &&
    adsText !== `${expectedAdsTxt}\n` &&
    adsText !== `${expectedAdsTxt}\r\n`
  ) {
    addIssue("AdSense and ad network code", "out/ads.txt does not contain exactly the required entry", 1);
  }

  const thirdPartyAdPatterns = [
    /\badsterra\b/i,
    /highrevenueformat\.com/i,
    /profitableratecpmnetwork\.com/i,
    /\batOptions\b/i,
    /invoke\.js/i,
    /container-fd6c124f/i,
    /taboola|outbrain|propellerads|popads|hilltopads|exoclick|clickadu|adcash/i,
  ];
  const adScanFiles = walkFiles(outputDirectory, (filePath) =>
    /\.(?:html|js|css|json|xml|txt)$/i.test(filePath),
  );
  for (const filePath of adScanFiles) {
    const text = fs.readFileSync(filePath, "utf8");
    if (thirdPartyAdPatterns.some((pattern) => pattern.test(text))) {
      addIssue(
        "AdSense and ad network code",
        `Third-party ad string found in ${path.relative(outputDirectory, filePath)}`,
        1,
      );
    }
    setInfo(
      "AdSense and ad network code",
      `${pages.filter((page) => page.indexable).length} indexable pages; ads.txt checked`,
    );
  }

  const adSlotPatterns = [
    /class=["'][^"']*(?:adsense-ad-slot|resume-sathi-ad-slot|ad-slot)[^"']*["']/gi,
    /<ins\b[^>]*class=["'][^"']*adsbygoogle[^"']*["']/gi,
    /\bdata-ad-slot\s*=/gi,
    /\baria-label=["']Advertisement["']/gi,
  ];
  const adSlotCount = (html) =>
    adSlotPatterns.reduce((count, pattern) => count + (html.match(pattern) || []).length, 0);

  const adSlotPath = path.join(repoRoot, "app", "components", "AdSlot.js");
  const source = fs.existsSync(adSlotPath) ? fs.readFileSync(adSlotPath, "utf8") : "";
  const state = source.match(/export\s+const\s+ADS_ENABLED\s*=\s*(true|false)\s*;/i)?.[1]
    ?.toLowerCase();
  if (state !== "false") {
    addIssue(
      "Ad placement policy",
      `ADS_ENABLED is ${state || "missing"}; expected false until explicitly enabled`,
      1,
    );
  }
  for (const page of pages) {
    const count = adSlotCount(page.html);
    if (count && isBlockedRoute(page)) {
      addIssue(
        "Ad placement policy",
        `${page.route} is blocked for ads but contains ${count} ad slot(s)`,
        1,
      );
    }
    if (count > 2) {
      addIssue(
        "Ad placement policy",
        `${page.route} contains ${count} ad slots; maximum is 2`,
        1,
      );
    }
    if (state === "false" && count > 0) {
      addIssue(
        "Ad placement policy",
        `${page.route} renders an ad slot while ADS_ENABLED is false`,
        1,
      );
    }
  }
  setInfo(
    "Ad placement policy",
    `ADS_ENABLED=${state || "missing"}; Auto ads limited to home, blog, exam guides, and templates`,
  );
}

async function runLighthouseAudits() {
  if (!runLighthouse) {
    setInfo("Lighthouse mobile scores", "Not run; pass --lighthouse and --lighthouse-base-url");
    return [];
  }
  if (!lighthouseBaseUrl) {
    addIssue(
      "Lighthouse mobile scores",
      "Missing --lighthouse-base-url (serve out/ locally or provide the deployed origin)",
      1,
    );
    return [];
  }

  const chromePath =
    process.env.CHROME_PATH ||
    [
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    ].find((candidate) => fs.existsSync(candidate));
  if (!chromePath) {
    addIssue("Lighthouse mobile scores", "Chrome/Edge was not found; set CHROME_PATH", 1);
    return [];
  }
  const npxCliPath = [
    process.env.NPX_CLI,
    path.join(path.dirname(process.execPath), "node_modules", "npm", "bin", "npx-cli.js"),
    path.resolve(path.dirname(process.execPath), "..", "lib", "node_modules", "npm", "bin", "npx-cli.js"),
  ].find((candidate) => candidate && fs.existsSync(candidate));
  if (!npxCliPath) {
    addIssue("Lighthouse mobile scores", "npm's npx-cli.js was not found", 1);
    return [];
  }

  const results = [];
  for (const page of baselinePages) {
    const url = new URL(page.route, lighthouseBaseUrl).href;
    const outputPath = path.join(os.tmpdir(), `resumesathi-lighthouse-${process.pid}-${results.length}.json`);
    const lighthouseArgs = [
      "--yes",
      "lighthouse@12.8.2",
      url,
      `--chrome-path=${chromePath}`,
      "--only-categories=performance,accessibility,best-practices,seo",
      "--form-factor=mobile",
      "--output=json",
      `--output-path=${outputPath}`,
      "--quiet",
    ];
    const run = spawnSync(process.execPath, [npxCliPath, ...lighthouseArgs], {
      cwd: repoRoot,
      encoding: "utf8",
      shell: false,
      timeout: 240000,
      maxBuffer: 8 * 1024 * 1024,
      windowsHide: true,
    });
    if (run.error || run.status !== 0 || !fs.existsSync(outputPath)) {
      const message = run.error?.message || run.stderr?.trim() || `exit ${run.status}`;
      addIssue("Lighthouse mobile scores", `${page.name}: Lighthouse failed (${message})`, 1);
      if (fs.existsSync(outputPath)) fs.rmSync(outputPath, { force: true });
      continue;
    }
    try {
      const report = JSON.parse(fs.readFileSync(outputPath, "utf8"));
      const categories = report.lighthouseResult?.categories || report.categories || {};
      const score = (name) =>
        Number.isFinite(categories[name]?.score)
          ? Math.round(categories[name].score * 100)
          : null;
      results.push({
        name: page.name,
        url,
        performance: score("performance"),
        accessibility: score("accessibility"),
        bestPractices: score("best-practices"),
        seo: score("seo"),
      });
    } catch (error) {
      addIssue(
        "Lighthouse mobile scores",
        `${page.name}: could not read Lighthouse output (${error.message})`,
        1,
      );
    } finally {
      fs.rmSync(outputPath, { force: true });
    }
  }

  if (results.length === baselinePages.length) {
    const belowGood = results.filter(
      (result) => result.performance !== null && result.performance < 90,
    );
    setInfo(
      "Lighthouse mobile scores",
      `${results.length} mobile audits completed; ${belowGood.length} performance score(s) below 90`,
    );
    for (const result of belowGood) {
      recommendations.push({
        priority: result.performance < 50 ? 1 : 2,
        group: "Lighthouse mobile performance",
        detail: `${result.name}: ${result.performance}/100; Lighthouse's good range starts at 90`,
      });
    }
  } else {
    addIssue(
      "Lighthouse mobile scores",
      `Only ${results.length} of ${baselinePages.length} baseline audits completed`,
      1,
    );
  }
  return results;
}

async function main() {
  if (!fs.existsSync(outputDirectory)) {
    console.error(`FAIL: ${outputDirectory} does not exist. Build the site first.`);
    process.exitCode = 1;
    return;
  }

  const htmlFiles = walkFiles(outputDirectory, (filePath) => filePath.endsWith(".html"));
  const knownBadText = /\b127\.0\.0\.1\b|\blocalhost\b|\bexample\.com\b|\blorem\b|\bTODO\b/i;
  for (const filePath of htmlFiles) {
    const html = fs.readFileSync(filePath, "utf8");
    const route = getRoute(filePath);
    const matches = html.match(knownBadText);
    if (matches) {
      addIssue("Placeholder text", `${route} contains "${matches[0]}"`, 1);
    }

    const title = decodeHtml(html.match(/<title\b[^>]*>([\s\S]*?)<\/title\s*>/i)?.[1] || "")
      .replace(/\s+/g, " ")
      .trim();
    const description = getAttribute(getMeta(html, "description") || "", "content")
      .replace(/\s+/g, " ")
      .trim();
    const text = visibleText(html);
    const words = getWords(text);
    const canonicalTags = getCanonicalTags(html);
    const canonical = canonicalTags.length === 1
      ? getAttribute(canonicalTags[0], "href")
      : "";
    const schemas = [];
    const jsonLdErrors = [];
    for (const match of html.matchAll(
      /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script\s*>/gi,
    )) {
      try {
        schemas.push(JSON.parse(match[1]));
      } catch (error) {
        jsonLdErrors.push(error.message);
      }
    }
    pages.push({
      filePath,
      route,
      html,
      title,
      description,
      text,
      wordCount: words.length,
      canonical,
      indexable: isIndexable(html),
      schemas,
      jsonLdErrors,
    });
  }

  checkAdSenseAndPlacement();
  checkPageQuality();
  checkInternalLinks();
  parseSitemap();
  checkPrivacyAndFooter();
  const lighthouseResults = await runLighthouseAudits();
  await checkImages();

  const groupsWithStatus = groups
    .filter((group) => info.has(group) || issues.some((entry) => entry.group === group))
    .map((group) => {
      const failures = issues.filter((entry) => entry.group === group).length;
      return {
        group,
        status: failures
          ? "FAIL"
          : group === "Lighthouse mobile scores" &&
              info.get(group)?.startsWith("Not run")
            ? "NOT RUN"
            : "PASS",
        result: failures ? `${failures} issue(s)` : info.get(group) || "Checks passed",
      };
    });

  console.log(`\nResumeSathi static QA audit: ${outputDirectory}`);
  console.log("| Status | Check | Result |");
  console.log("|---|---|---|");
  for (const row of groupsWithStatus) {
    console.log(`| ${row.status} | ${row.group} | ${row.result} |`);
  }

  if (lighthouseResults.length) {
    console.log("\nLighthouse mobile scores");
    console.log("| Page | Performance | Accessibility | Best practices | SEO |");
    console.log("|---|---:|---:|---:|---:|");
    for (const result of lighthouseResults) {
      console.log(
        `| ${result.name} | ${result.performance ?? "n/a"} | ${result.accessibility ?? "n/a"} | ${result.bestPractices ?? "n/a"} | ${result.seo ?? "n/a"} |`,
      );
    }
  }

  if (issues.length || recommendations.length) {
    const prioritized = [...issues, ...recommendations].sort(
      (left, right) => left.priority - right.priority || left.group.localeCompare(right.group),
    );
    console.log("\nPrioritized fixes");
    prioritized.slice(0, 40).forEach((entry, index) => {
      console.log(`${index + 1}. [P${entry.priority}] ${entry.group}: ${entry.detail}`);
    });
    if (prioritized.length > 40) {
      console.log(`... ${prioritized.length - 40} additional issue(s) omitted`);
    }
  } else {
    console.log("\nPrioritized fixes: none.");
  }

  console.log(`\nHTML files: ${pages.length}; indexable: ${pages.filter((page) => page.indexable).length}`);
  if (issues.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
