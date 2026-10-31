import React from "react";
import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import GuideDetailClient from "./GuideDetailClient";
import { DEFAULT_SITE_BASE, withTrailingSlash } from "../../lib/apiConfig";
import { getExamGuideBackendBase, isExamGuide } from "../examGuideData";
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
  const backendBase = getExamGuideBackendBase();
  const siteUrl = DEFAULT_SITE_BASE.replace(/\/+$/, "");
  const fallbackImage = `${siteUrl}/front-assets/images/og/home-og.png`;

  if (!url) return fallbackImage;
  if (/^https?:\/\//i.test(url) || url.startsWith("//")) {
    return safeEncodeUrl(url);
  }

  const normalized = String(url).replace(/^\/+/, "");
  return safeEncodeUrl(`${backendBase}/${normalized}`);
}

function getExamGuidesCache() {
  const filePath = path.join(process.cwd(), "data", "exam-guides-cache.json");
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw);
    if (Array.isArray(data) && data.length > 0) return data.filter(isExamGuide);
  } catch (err) {
    console.error("FATAL: could not read data/exam-guides-cache.json", err);
  }
  return [];
}

function getDefaultExamGuideOgImage() {
  const siteUrl = DEFAULT_SITE_BASE.replace(/\/+$/, "");
  return `${siteUrl}/front-assets/images/og/home-og.png`;
}

function truncateMeta(value = "", max = 158) {
  const normalized = String(value || "").replace(/\s+/g, " ").trim();
  if (normalized.length <= max) return normalized;
  return `${normalized.slice(0, max - 1).replace(/\s+\S*$/, "")}.`;
}

function getAbsoluteExamGuideUrl(slug = "") {
  const siteUrl = DEFAULT_SITE_BASE.replace(/\/+$/, "");
  return `${siteUrl}${withTrailingSlash(`/exam-guides/${slug}`)}`;
}

async function getAllExamGuides() {
  return getExamGuidesCache();
}

function getExamGuideSlug(guideOrSlug) {
  const raw =
    typeof guideOrSlug === "string"
      ? guideOrSlug
      : guideOrSlug?.slug || guideOrSlug?.url_name || guideOrSlug?.canonical_tag || "";

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

async function getExamGuideData(slug) {
  const items = await getAllExamGuides();
  return (
    items.find((item) => getExamGuideSlug(item) === getExamGuideSlug(slug)) || null
  );
}

// ðŸ‘‡ NAYA FUNCTION â€” static export ke liye zaroori
export async function generateStaticParams() {
  const items = await getAllExamGuides();
  const slugs = [...new Set(items.map(getExamGuideSlug))]
    .map(getExamGuideSlug)
    .filter(Boolean)
    .map((slug) => ({ slug }));

  return slugs.length > 0 ? slugs : [{ slug: '__no_guides__' }];
}

export async function generateMetadata({ params }) {
  const slug = (await params)?.slug;
  const article = slug ? await getExamGuideData(slug) : null;
  if (!article) {
    return {
      title: "Exam Guide Not Found | ResumeSathi",
      description: "The exam guide you are looking for could not be found on ResumeSathi.",
      robots: { index: false, follow: true },
    };
  }

  const siteUrl = DEFAULT_SITE_BASE.replace(/\/+$/, "");
  const rawTitle =
    article?.meta_title ||
    article?.og_title ||
    article?.title ||
    article?.topic_name ||
    "Exam Guide";
  const title = rawTitle;
  const description = truncateMeta(
    article?.meta_description ||
    article?.og_description ||
    article?.description ||
    "Explore exam details, eligibility, important dates, and preparation guidance on ResumeSathi."
  );
  const keywords =
    article?.meta_keywords ||
    article?.keywords ||
    "exam guides, syllabus, eligibility, exam pattern, exam preparation";
  const canonical = `${siteUrl}${withTrailingSlash(`/exam-guides/${getExamGuideSlug(slug) || ""}`)}`;
  const resolvedImage = getDefaultExamGuideOgImage();
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
      section: "Exam Guides",
      images: [{ url: resolvedImage, width: 1200, height: 630, alt: "ResumeSathi Exam Guides" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${seoTitle} | ResumeSathi`,
      description: seoDescription,
      images: [resolvedImage],
    },
  };
}

// ---------- Exam guide structured data ----------

function getTitle(item) {
  if (!item) return "";
  return (
    item.title ||
    item.article_title ||
    item.meta_title ||
    item.topic_name ||
    item.name ||
    "Exam Guide"
  );
}

function getHeroImage(item) {
  return item?.hero_image || item?.image || item?.meta_image || item?.og_image;
}

function buildExamGuideJsonLd(article, slug) {
  if (!article) return null;
  const canonical = getAbsoluteExamGuideUrl(getExamGuideSlug(slug));
  const description =
    article.meta_description ||
    article.description ||
    article.short_description ||
    "";
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: getTitle(article),
    description,
    image: resolveImageUrl(getHeroImage(article)),
    datePublished: article.created_at,
    ...(article.updated_at ? { dateModified: article.updated_at } : {}),
    articleSection: "Exam Guides",
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    publisher: {
      "@type": "Organization",
      name: "ResumeSathi",
      logo: {
        "@type": "ImageObject",
        url: `${DEFAULT_SITE_BASE.replace(/\/+$/, "")}/front-assets/images/logo/logo.svg`,
      },
    },
  };
}

export default async function ExamGuideDetailPage({ params }) {
  const slug = (await params)?.slug;
  const article = slug ? await getExamGuideData(slug) : null;
  if (!article) {
    notFound();
  }

  const examGuideJsonLd = buildExamGuideJsonLd(article, slug);

  return (
    <>
      {examGuideJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            // "<" ko unicode-escape kiya hai taaki description ke andar
            // agar kabhi "</script>" jaisi string aa jaye to wo is <script>
            // tag ko time se pehle close na kar de.
            __html: JSON.stringify(examGuideJsonLd).replace(
              /</g,
              "\\u003c",
            ),
          }}
        />
      )}
      <GuideDetailClient article={article} slug={slug} />
    </>
  );
}
