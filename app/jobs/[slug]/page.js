import React from "react";
import fs from "fs";
import path from "path";
import ArticleDetailPageClient from "./ArticleDetailPageClient";
import { DEFAULT_BACKEND_BASE, DEFAULT_SITE_BASE } from "../../lib/apiConfig";
export const dynamicParams = false;

// Kuch fields (jaise og_image) DB me already percent-encoded save hote hain,
// aur kuch (jaise hero_image) raw filename ke saath (spaces/commas ke saath).
// decodeURI + encodeURI karke dono cases ko ek consistent, valid URL me
// normalize kar dete hain â€” bina double-encode kiye.
function safeEncodeUrl(url) {
  try {
    return encodeURI(decodeURI(url));
  } catch (e) {
    // Malformed % sequence mila to seedha encode kar do
    return encodeURI(url);
  }
}

function resolveImageUrl(url) {
  const backendBase = DEFAULT_BACKEND_BASE.replace(/\/+$/, "");
  const siteUrl = DEFAULT_SITE_BASE.replace(/\/+$/, "");
  const fallbackImage = `${siteUrl}/front-assets/images/og/job-og.png`;

  if (!url) return fallbackImage;
  if (/^https?:\/\//i.test(url) || url.startsWith("//")) {
    return safeEncodeUrl(url);
  }

  const normalized = String(url).replace(/^\/+/, "");
  return safeEncodeUrl(`${backendBase}/${normalized}`);
}

function getJobsCache() {
  const filePath = path.join(process.cwd(), "data", "jobs-cache.json");
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw);
    if (Array.isArray(data) && data.length > 0) return data;
  } catch (err) {
    console.error("FATAL: could not read data/jobs-cache.json", err);
  }
  return [];
}
async function getAllJobs() {
  return getJobsCache();
}

function getJobSlug(jobOrSlug) {
  const raw =
    typeof jobOrSlug === "string"
      ? jobOrSlug
      : jobOrSlug?.slug || jobOrSlug?.url_name || jobOrSlug?.canonical_tag || "";

  let value = String(raw).trim().split("/").filter(Boolean).pop() || "";
  try {
    value = decodeURIComponent(value);
  } catch {
    // Keep malformed URI values usable.
  }

  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function getArticleData(slug) {
  const items = await getAllJobs();
  return (
    items.find((item) => getJobSlug(item) === getJobSlug(slug)) || null
  );
}

// ðŸ‘‡ NAYA FUNCTION â€” static export ke liye zaroori
export async function generateStaticParams() {
  const items = await getAllJobs();
  return items
    .map(getJobSlug)
    .filter(Boolean)
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const slug = (await params)?.slug;
  const article = slug ? await getArticleData(slug) : null;
  const siteUrl = DEFAULT_SITE_BASE.replace(/\/+$/, "");
  const rawTitle =
    article?.meta_title ||
    article?.og_title ||
    article?.title ||
    article?.topic_name ||
    "Job Opening";
  const title = rawTitle;
  const description =
    article?.meta_description ||
    article?.og_description ||
    article?.description ||
    "Explore this job opportunity on ResumeSathi and apply today.";
  const keywords =
    article?.meta_keywords ||
    article?.keywords ||
    "jobs, career opportunities, hiring, apply now, government jobs";
  const image =
    article?.og_image ||
    article?.meta_image ||
    article?.hero_image ||
    article?.image;
  const canonical = `${siteUrl}/jobs/${getJobSlug(slug) || ""}`;
  const resolvedImage = resolveImageUrl(image);

  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      title: `${title} | ResumeSathi`,
      description,
      type: "article",
      url: canonical,
      siteName: "ResumeSathi",
      images: [{ url: resolvedImage, alt: rawTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ResumeSathi`,
      description,
      images: [resolvedImage],
    },
  };
}

// ---------- JobPosting JSON-LD helpers ----------

const BACKEND_BASE = DEFAULT_BACKEND_BASE.replace(/\/+$/, "");

function getTitle(item) {
  if (!item) return "";
  return (
    item.title ||
    item.article_title ||
    item.meta_title ||
    item.topic_name ||
    item.name ||
    "Job Opening"
  );
}

function getCompanyName(item) {
  return item?.company || item?.company_name || item?.organization || "";
}

function getLocation(item) {
  return item?.location || item?.city || item?.place || "";
}

function getEmploymentTypeRaw(item) {
  return item?.employment_type || item?.job_type || "";
}

function getCategoryLabel(item) {
  return (
    item?.category?.course_name ||
    item?.course_category?.course_name ||
    item?.category?.article_name ||
    item?.category?.name ||
    item?.category?.title ||
    ""
  );
}

function getHeroImage(item) {
  return item?.hero_image || item?.image || item?.meta_image || item?.og_image;
}

function getApplicationDates(item) {
  return {
    begin: item?.application_begin || item?.applicationStart || item?.start_date || "",
    lastDate:
      item?.last_date_for_apply || item?.lastDateForApply || item?.apply_until || "",
  };
}

function toIsoDate(value) {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString().slice(0, 10);
}

// Google JobPosting ke liye employmentType ek fixed enum expect karta hai,
// isliye free-text value ("Full Time", "Contractual" etc.) ko map karo.
function normalizeEmploymentType(raw) {
  if (!raw) return undefined;
  const key = String(raw).trim().toLowerCase();
  const map = {
    "full time": "FULL_TIME",
    "full-time": "FULL_TIME",
    permanent: "FULL_TIME",
    "part time": "PART_TIME",
    "part-time": "PART_TIME",
    contract: "CONTRACTOR",
    contractual: "CONTRACTOR",
    temporary: "TEMPORARY",
    internship: "INTERN",
    intern: "INTERN",
    volunteer: "VOLUNTEER",
    apprenticeship: "OTHER",
  };
  return map[key] || "OTHER";
}

// jobLocation ke liye sirf ek flat "location" string available hai,
// isliye best-effort split kiya hai. Behtar accuracy ke liye backend me
// alag se addressLocality / addressRegion / postalCode fields add karwana
// recommended rahega.
function buildJobLocation(item) {
  const raw = getLocation(item);
  const parts = String(raw || "")
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  return {
    "@type": "Place",
    address: {
      "@type": "PostalAddress",
      addressLocality: parts[0] || undefined,
      addressRegion: parts[1] || undefined,
      addressCountry: "IN",
    },
  };
}

function normalizeHtmlUrls(html) {
  if (!html) return "";
  return html
    .replace(/(src|href)=("|')\/(?!\/)/g, `$1=$2${BACKEND_BASE}/`)
    .replace(
      /(src|href)=("|')((?!http:|https:|\/\/|mailto:|tel:|data:|#)[^"'>]+)("|')/g,
      (_m, attr, quote, p, closing) => {
        const clean = p
          .replace(/^(?:\.\.\/)+/, "")
          .replace(/^(?:\.\/)+/, "")
          .replace(/^\/+/, "");
        return `${attr}=${quote}${BACKEND_BASE}/${clean}${closing}`;
      },
    );
}

function getDescriptionHtml(item) {
  // Google recommends description match jo actually page par visible hai â€”
  // isliye poora article content (jo user ko page par dikhta hai) primary hai.
  if (item?.contents?.length) {
    const combined = item.contents
      .map((c) => normalizeHtmlUrls(c?.content || ""))
      .filter(Boolean)
      .join("\n");
    if (combined) return combined;
  }

  // Content na ho tabhi dedicated description field par fallback karo.
  return (
    item?.description ||
    item?.meta_description ||
    item?.short_description ||
    "Explore this job opportunity and apply today."
  );
}

// Recursively drop undefined/null/empty-string keys so JSON.stringify
// doesn't emit "field": undefined or empty placeholders.
function cleanObject(obj) {
  if (Array.isArray(obj)) {
    return obj.map(cleanObject).filter((v) => v !== undefined);
  }
  if (obj && typeof obj === "object") {
    const out = {};
    for (const [key, value] of Object.entries(obj)) {
      const cleaned = cleanObject(value);
      if (cleaned !== undefined && cleaned !== null && cleaned !== "") {
        out[key] = cleaned;
      }
    }
    return Object.keys(out).length ? out : undefined;
  }
  return obj;
}

function buildJobPostingJsonLd(article, slug) {
  if (!article) return null;

  const { begin, lastDate } = getApplicationDates(article);
  const categoryLabel = getCategoryLabel(article); // e.g. Railway, Defence, Banking...

  const jobsUrl = `${
    (
      DEFAULT_SITE_BASE
    ).replace(/\/+$/, "")
  }/jobs/`;

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: getTitle(article),
    description: getDescriptionHtml(article),
    image: resolveImageUrl(getHeroImage(article)),
    identifier: {
      "@type": "PropertyValue",
      name: getCompanyName(article) || "ResumeSathi",
      value: String(article.id ?? slug ?? ""),
    },
    datePosted: toIsoDate(article.created_at),
    validFrom: toIsoDate(begin),
    validThrough: toIsoDate(lastDate),
    // Default FULL_TIME diya hai kyunki zyadatar govt recruitment
    // postings full-time hoti hain jab tak field khud specify na kare.
    employmentType:
      normalizeEmploymentType(getEmploymentTypeRaw(article)) || "FULL_TIME",
    // industry = category jaise Railway, Defence, Banking, Teaching etc.
    industry: categoryLabel || undefined,
    hiringOrganization: {
      "@type": "Organization",
      // Real department field nahi hai, isliye category ke saath ek
      // meaningful naam banaya hai (e.g. "Defence - Government Jobs").
      name: categoryLabel
        ? `${categoryLabel} - Government Jobs`
        : "Government Jobs",
      sameAs: jobsUrl,
      logo: article.company_logo
        ? resolveImageUrl(article.company_logo)
        : undefined,
    },
    jobLocation: buildJobLocation(article),
    // false rakha hai kyunki apply external govt portal par hota hai,
    // isi site/page se direct apply nahi hota.
    directApply: false,
  };

  return cleanObject(jsonLd);
}

export default async function JobDetailPage({ params }) {
  const slug = (await params)?.slug;
  const article = slug ? await getArticleData(slug) : null;
  const jobPostingJsonLd = buildJobPostingJsonLd(article, slug);

  return (
    <>
      {jobPostingJsonLd && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            // "<" ko unicode-escape kiya hai taaki description ke andar
            // agar kabhi "</script>" jaisi string aa jaye to wo is <script>
            // tag ko time se pehle close na kar de.
            __html: JSON.stringify(jobPostingJsonLd).replace(
              /</g,
              "\\u003c",
            ),
          }}
        />
      )}
      <ArticleDetailPageClient article={article} slug={slug} />
    </>
  );
}


