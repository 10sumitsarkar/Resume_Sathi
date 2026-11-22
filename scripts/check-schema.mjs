import fs from "node:fs";
import path from "node:path";

const outputDirectory = path.resolve(process.cwd(), "out");
const siteHosts = new Set(["www.resumesathi.com", "resumesathi.com"]);
const errors = [];
const warnings = [];
const imageChecks = new Map();

if (!fs.existsSync(outputDirectory)) {
  throw new Error("The out/ directory does not exist. Run npm run build first.");
}

function listHtmlFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return listHtmlFiles(entryPath);
    return entry.isFile() && entry.name === "index.html" ? [entryPath] : [];
  });
}

function decodeHtml(value = "") {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&apos;|&#39;|&#x27;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_, value) => String.fromCodePoint(Number(value)))
    .replace(/&#x([\da-f]+);/gi, (_, value) =>
      String.fromCodePoint(Number.parseInt(value, 16)),
    );
}

function getMetaContent(html, name) {
  const tags = html.match(/<meta\b[^>]*>/gi) || [];
  const tag = tags.find((value) => {
    const metaName = value.match(/\bname=["']([^"']+)["']/i)?.[1];
    return metaName?.toLowerCase() === name.toLowerCase();
  });
  return decodeHtml(tag?.match(/\bcontent=["']([^"']*)["']/i)?.[1] || "");
}

function isIndexable(html) {
  const tags = html.match(/<meta\b[^>]*>/gi) || [];
  return !tags.some((tag) => {
    const name = tag.match(/\bname=["']([^"']+)["']/i)?.[1];
    const content = tag.match(/\bcontent=["']([^"']*)["']/i)?.[1] || "";
    return /^(robots|googlebot)$/i.test(name || "") && /\bnoindex\b/i.test(content);
  });
}

function getRoute(filePath) {
  const relativePath = path.relative(outputDirectory, filePath).split(path.sep).join("/");
  return `/${relativePath.replace(/index\.html$/, "")}`;
}

function collectUrlValues(value, key = "", results = []) {
  if (Array.isArray(value)) {
    for (const item of value) collectUrlValues(item, key, results);
    return results;
  }
  if (!value || typeof value !== "object") {
    if (
      typeof value === "string" &&
      /^(?:url|@id|item|sameAs|image|logo|contentUrl|thumbnailUrl)$/i.test(key)
    ) {
      results.push({ key, value });
    }
    return results;
  }
  for (const [childKey, childValue] of Object.entries(value)) {
    collectUrlValues(childValue, childKey, results);
  }
  return results;
}

function collectImageValues(value, key = "", results = []) {
  if (Array.isArray(value)) {
    for (const item of value) collectImageValues(item, key, results);
  } else if (value && typeof value === "object") {
    if (
      /^(?:image|logo)$/i.test(key) &&
      typeof value.url === "string"
    ) {
      results.push({ key, value: value.url });
    }
    for (const [childKey, childValue] of Object.entries(value)) {
      collectImageValues(childValue, childKey, results);
    }
  } else if (
    typeof value === "string" &&
    /^(?:image|logo|contentUrl|thumbnailUrl)$/i.test(key)
  ) {
    results.push({ key, value });
  }
  return results;
}

function getSchemaNodes(schemas) {
  return schemas.flatMap((schema) => [
    ...(Array.isArray(schema?.["@graph"]) ? schema["@graph"] : []),
    schema,
  ]);
}

function localFileForUrl(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (!siteHosts.has(url.hostname.toLowerCase())) return null;

  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    return null;
  }
  const candidate = path.resolve(outputDirectory, `.${pathname}`);
  if (!candidate.startsWith(outputDirectory + path.sep)) return null;
  const candidates = [candidate];
  if (!path.extname(candidate)) candidates.push(path.join(candidate, "index.html"));
  return candidates.find(
    (filePath) => fs.existsSync(filePath) && fs.statSync(filePath).isFile(),
  );
}

async function checkRemoteImage(url) {
  if (!imageChecks.has(url)) {
    imageChecks.set(
      url,
      (async () => {
        let response;
        try {
          response = await fetch(url, {
            method: "HEAD",
            signal: AbortSignal.timeout(10000),
          });
          if (response.status === 405 || response.status === 501) {
            response = await fetch(url, {
              headers: { Range: "bytes=0-0" },
              signal: AbortSignal.timeout(10000),
            });
          }
          return response.status >= 200 && response.status < 300
            ? null
            : `HTTP ${response.status}`;
        } catch (error) {
          return error instanceof Error ? error.message : String(error);
        }
      })(),
    );
  }
  return imageChecks.get(url);
}

const pages = listHtmlFiles(outputDirectory).map((filePath) => {
  const html = fs.readFileSync(filePath, "utf8");
  const title = decodeHtml(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "");
  const description = getMetaContent(html, "description");
  return {
    filePath,
    route: getRoute(filePath),
    html,
    title,
    description,
    indexable: isIndexable(html),
  };
});

for (const page of pages) {
  const scripts = [...page.html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const pageSchemas = [];
  if (/<meta\b[^>]*\bname=["']keywords["']/i.test(page.html)) {
    errors.push(`${page.route}: keywords meta tag is present`);
  }

  for (const match of scripts) {
    let data;
    try {
      data = JSON.parse(match[1]);
    } catch (error) {
      errors.push(`${page.route}: invalid JSON-LD (${error.message})`);
      continue;
    }
    pageSchemas.push(...(Array.isArray(data) ? data : [data]));

    for (const { key, value } of collectUrlValues(data)) {
      try {
        const url = new URL(value);
        if (!["http:", "https:"].includes(url.protocol)) {
          errors.push(`${page.route}: ${key} is not an HTTP(S) URL: ${value}`);
        }
      } catch {
        errors.push(`${page.route}: ${key} is not an absolute URL: ${value}`);
      }
    }

    for (const { key, value } of collectImageValues(data)) {
      let url;
      try {
        url = new URL(value);
      } catch {
        errors.push(`${page.route}: ${key} image/logo URL is not absolute: ${value}`);
        continue;
      }

      if (!["http:", "https:"].includes(url.protocol)) {
        errors.push(`${page.route}: ${key} image/logo URL is not HTTP(S): ${value}`);
      } else if (siteHosts.has(url.hostname.toLowerCase())) {
        if (!localFileForUrl(value)) {
          errors.push(`${page.route}: ${key} image/logo file is missing: ${url.pathname}`);
        }
      } else {
        const failure = await checkRemoteImage(value);
        if (failure) errors.push(`${page.route}: remote ${key} image/logo failed (${failure}): ${value}`);
      }
    }
  }

  const schemaNodes = getSchemaNodes(pageSchemas);
  const schemaTypes = new Set(
    schemaNodes.flatMap((schema) => schema?.["@type"] || []),
  );

  if (page.indexable) {
    const organization = schemaNodes.find((schema) => schema?.["@type"] === "Organization");
    if (!organization) {
      errors.push(`${page.route}: missing Organization schema`);
    } else {
      const logoUrl = typeof organization.logo === "string"
        ? organization.logo
        : organization.logo?.url;
      const logoFile = logoUrl ? localFileForUrl(logoUrl) : null;
      if (!logoFile) {
        errors.push(`${page.route}: Organization logo must map to a local PNG file`);
      } else {
        const logoBytes = fs.readFileSync(logoFile);
        const isPng =
          logoBytes.length >= 24 &&
          logoBytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
        if (!isPng) {
          errors.push(`${page.route}: Organization logo is not a PNG image`);
        } else {
          const width = logoBytes.readUInt32BE(16);
          const height = logoBytes.readUInt32BE(20);
          if (width < 112 || height < 112) {
            errors.push(`${page.route}: Organization PNG logo is smaller than 112x112`);
          }
        }
      }
    }
    if (!schemaTypes.has("WebSite")) errors.push(`${page.route}: missing WebSite schema`);
  }

  if (page.route.startsWith("/blog/") && /^\/blog\/[^/]+\/$/.test(page.route)) {
    const blogPosting = pageSchemas.find((schema) => schema?.["@type"] === "BlogPosting");
    if (!blogPosting) errors.push(`${page.route}: missing BlogPosting schema`);
    else {
      if (!blogPosting.datePublished) errors.push(`${page.route}: BlogPosting missing datePublished`);
      if (!blogPosting.dateModified) errors.push(`${page.route}: BlogPosting missing dateModified`);
      if (!blogPosting.author?.url) errors.push(`${page.route}: BlogPosting missing author.url`);
    }
  }

  if (page.route.startsWith("/exam-guides/") && /^\/exam-guides\/[^/]+\/$/.test(page.route)) {
    const article = pageSchemas.find((schema) => schema?.["@type"] === "Article");
    if (!article) errors.push(`${page.route}: missing Article schema`);
    else {
      if (!article.datePublished) errors.push(`${page.route}: Article missing datePublished`);
      if (!article.dateModified) errors.push(`${page.route}: Article missing dateModified`);
    }
    if (schemaTypes.has("FAQPage")) errors.push(`${page.route}: FAQPage is not allowed on exam guides`);
  }

  if (page.route.startsWith("/tools/") && page.route !== "/tools/") {
    const application = schemaNodes.find((schema) => schema?.["@type"] === "WebApplication");
    if (!application) errors.push(`${page.route}: missing WebApplication schema`);
    else {
      if (!application.name) errors.push(`${page.route}: WebApplication missing name`);
      if (!application.url) errors.push(`${page.route}: WebApplication missing url`);
      if (!application.applicationCategory) errors.push(`${page.route}: WebApplication missing applicationCategory`);
      if (!application.operatingSystem) errors.push(`${page.route}: WebApplication missing operatingSystem`);
      if (application.offers?.price !== "0" || application.offers?.priceCurrency !== "INR") {
        errors.push(`${page.route}: WebApplication missing free INR offer`);
      }
    }
    if (!schemaTypes.has("BreadcrumbList")) errors.push(`${page.route}: missing BreadcrumbList schema`);
  }

  if (schemaTypes.has("Review") || pageSchemas.some((schema) => schema?.aggregateRating)) {
    errors.push(`${page.route}: Review or aggregateRating markup must not be used`);
  }
}

const indexablePages = pages.filter((page) => page.indexable);
const countDuplicates = (key) => {
  const values = new Map();
  for (const page of indexablePages) {
    const value = page[key].trim().replace(/\s+/g, " ").toLowerCase();
    if (value) values.set(value, [...(values.get(value) || []), page.route]);
  }
  return [...values.entries()].filter(([, routes]) => routes.length > 1);
};
const duplicateTitles = countDuplicates("title");
const duplicateDescriptions = countDuplicates("description");

for (const page of indexablePages) {
  if (page.title.length < 45 || page.title.length > 60) {
    warnings.push(`${page.route}: title length ${page.title.length}`);
  }
  if (page.description.length < 120 || page.description.length > 158) {
    warnings.push(`${page.route}: description length ${page.description.length}`);
  }
}
for (const [title, routes] of duplicateTitles) {
  errors.push(`Duplicate title on ${routes.join(", ")}: ${title}`);
}
for (const [description, routes] of duplicateDescriptions) {
  errors.push(`Duplicate description on ${routes.join(", ")}: ${description}`);
}

console.log("Metadata table (indexable HTML pages)");
console.log("| Route | Title length | Description length | Title |");
console.log("|---|---:|---:|---|");
for (const page of indexablePages) {
  console.log(
    `| ${page.route} | ${page.title.length} | ${page.description.length} | ${page.title.replace(/\|/g, "\\|")} |`,
  );
}

console.log(`\nIndexable pages: ${indexablePages.length}`);
console.log(`Duplicate titles: ${duplicateTitles.length}`);
console.log(`Duplicate descriptions: ${duplicateDescriptions.length}`);
console.log(`JSON-LD/image errors: ${errors.length}`);
for (const error of errors) console.log(`ERROR ${error}`);
console.log(`Metadata length warnings: ${warnings.length}`);
for (const warning of warnings) console.log(`WARN ${warning}`);

if (errors.length || warnings.length) process.exitCode = 1;
