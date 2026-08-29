import React from "react";
import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import ArticleDetailPageClient from "./ArticleDetailPageClient";
import JobsPageClient from "../JobsPageClient";
import { DEFAULT_BACKEND_BASE, DEFAULT_SITE_BASE, withTrailingSlash } from "../../lib/apiConfig";
import { getCategoryName, getCategorySlug } from "../jobCategoryUtils";
export const dynamicParams = false;
const STATIC_404_SLUGS = ["[slug]", "%5Bslug%5D"];

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

function getDefaultJobOgImage() {
  const siteUrl = DEFAULT_SITE_BASE.replace(/\/+$/, "");
  return `${siteUrl}/front-assets/images/og/job-og.png`;
}

function truncateMeta(value = "", max = 158) {
  const normalized = String(value || "").replace(/\s+/g, " ").trim();
  if (normalized.length <= max) return normalized;
  return `${normalized.slice(0, max - 1).replace(/\s+\S*$/, "")}.`;
}

function getAbsoluteJobUrl(slug = "") {
  const siteUrl = DEFAULT_SITE_BASE.replace(/\/+$/, "");
  return `${siteUrl}${withTrailingSlash(`/jobs/${slug}`)}`;
}

function getCategoriesCache() {
  const filePath = path.join(process.cwd(), "data", "categories-cache.json");
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw);
    if (Array.isArray(data)) return data;
  } catch (err) {
    console.error("FATAL: could not read data/categories-cache.json", err);
  }
  return [];
}

async function getAllJobs() {
  return getJobsCache();
}

async function getAllCategories() {
  return getCategoriesCache();
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

async function getCategoryData(slug) {
  const categories = await getAllCategories();
  return categories.find((category) => getCategorySlug(category) === getCategorySlug(slug)) || null;
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
  const categories = await getAllCategories();
  const categorySlugs = categories.map(getCategorySlug).filter(Boolean);
  const slugs = [
    ...items.map(getJobSlug),
    ...categorySlugs,
    ...categorySlugs.map((slug) => `${slug}-jobs`),
  ];

  const staticSlugs = [...new Set(slugs)]
    .map(getJobSlug)
    .filter(Boolean)
    .map((slug) => ({ slug }));

  return [
    ...staticSlugs,
    ...STATIC_404_SLUGS.map((slug) => ({ slug })),
  ];
}

export async function generateMetadata({ params }) {
  const slug = (await params)?.slug;
  const category = slug ? await getCategoryData(slug) : null;
  if (category) {
    const siteUrl = DEFAULT_SITE_BASE.replace(/\/+$/, "");
    const categoryName = getCategoryName(category);
    const canonical = `${siteUrl}${withTrailingSlash(`/jobs/${getCategorySlug(category)}`)}`;
    const description = truncateMeta(category.description || `Explore latest ${categoryName.toLowerCase()} openings, admit cards, answer keys, results, eligibility and application dates on ResumeSathi.`);
    const ogImage = getDefaultJobOgImage();

    return {
      title: `${categoryName} Jobs, Admit Card, Answer Key & Result`,
      description,
      keywords: `${categoryName}, ${categoryName} jobs, ${categoryName} admit card, ${categoryName} answer key, ${categoryName} result, government jobs`,
      alternates: { canonical },
      robots: { index: true, follow: true },
      openGraph: {
        title: `${categoryName} - Latest Jobs | ResumeSathi`,
        description,
        type: "website",
        url: canonical,
        siteName: "ResumeSathi",
        images: [{ url: ogImage, width: 1200, height: 630, alt: "ResumeSathi Jobs" }],
      },
      twitter: {
        card: "summary_large_image",
        title: `${categoryName} - Latest Jobs | ResumeSathi`,
        description,
        images: [ogImage],
      },
    };
  }

  const article = slug ? await getArticleData(slug) : null;
  if (!article) {
    return {
      title: "Job Page Not Found | ResumeSathi",
      description: "The job page you are looking for could not be found on ResumeSathi.",
      robots: { index: false, follow: true },
    };
  }

  const siteUrl = DEFAULT_SITE_BASE.replace(/\/+$/, "");
  const rawTitle =
    article?.meta_title ||
    article?.og_title ||
    article?.title ||
    article?.topic_name ||
    "Job Opening";
  const title = rawTitle;
  const description = truncateMeta(
    article?.meta_description ||
    article?.og_description ||
    article?.description ||
    "Explore this job opportunity on ResumeSathi and apply today."
  );
  const keywords =
    article?.meta_keywords ||
    article?.keywords ||
    "jobs, career opportunities, hiring, apply now, government jobs";
  const canonical = `${siteUrl}${withTrailingSlash(`/jobs/${getJobSlug(slug) || ""}`)}`;
  const resolvedImage = getDefaultJobOgImage();
  const categoryLabel = getCategoryLabel(article);
  const seoTitle = truncateMeta(title.replace(/\s*\|\s*ResumeSathi\s*$/i, ""), 58);
  const seoDescription = description || truncateMeta(`Check ${rawTitle} details, important dates, eligibility, admit card, answer key and result updates on ResumeSathi.`);

  return {
    title: seoTitle,
    description: seoDescription,
    keywords,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      title: `${seoTitle} | ResumeSathi`,
      description: seoDescription,
      type: "article",
      url: canonical,
      siteName: "ResumeSathi",
      section: categoryLabel || "Jobs",
      images: [{ url: resolvedImage, width: 1200, height: 630, alt: "ResumeSathi Jobs" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${seoTitle} | ResumeSathi`,
      description: seoDescription,
      images: [resolvedImage],
    },
  };
}

function buildCategoryJsonLd(category, jobs = []) {
  if (!category) return null;

  const categoryName = getCategoryName(category);
  const categorySlug = getCategorySlug(category);
  const categoryUrl = getAbsoluteJobUrl(categorySlug);
  const description = truncateMeta(category.description || `Browse latest ${categoryName.toLowerCase()} openings, admit cards, answer keys and results.`);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${categoryUrl}#webpage`,
        url: categoryUrl,
        name: `${categoryName} Jobs`,
        description,
        isPartOf: {
          "@type": "WebSite",
          name: "ResumeSathi",
          url: DEFAULT_SITE_BASE.replace(/\/+$/, ""),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Jobs",
            item: getAbsoluteJobUrl(""),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: categoryName,
            item: categoryUrl,
          },
        ],
      },
      {
        "@type": "ItemList",
        name: `${categoryName} Jobs`,
        itemListElement: jobs.slice(0, 20).map((job, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: getAbsoluteJobUrl(getJobSlug(job)),
          name: getTitle(job),
        })),
      },
    ],
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
  const category = slug ? await getCategoryData(slug) : null;
  if (category) {
    const jobs = await getAllJobs();
    const categories = await getAllCategories();
    const categoryId = Number(category.id);
    const categoryJobs = jobs.filter((job) => Number(job.course_type || job.category_id || job.category?.id || job.course_category?.id || 0) === categoryId);
    const categoryName = getCategoryName(category);
    const categoryJsonLd = buildCategoryJsonLd(category, categoryJobs);

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(categoryJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <JobsPageClient
          initialArticles={categoryJobs}
          initialCategories={categories}
          initialCategoryId={categoryId}
          pageTitle={`${categoryName} Jobs`}
          pageDescription={category.description || `Browse latest ${categoryName.toLowerCase()} openings, admit cards, answer keys and results.`}
        />
      </>
    );
  }

  const article = slug ? await getArticleData(slug) : null;
  if (!article) {
    notFound();
  }

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


