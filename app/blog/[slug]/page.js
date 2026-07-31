import fs from "fs";
import path from "path";
import React from "react";
import ArticleDetailPageClient from "./ArticleDetailPageClient";
import { DEFAULT_BACKEND_BASE, DEFAULT_SITE_BASE } from "../../lib/apiConfig";

export const dynamicParams = false;

function resolveImageUrl(url) {
  const backendBase = DEFAULT_BACKEND_BASE.replace(/\/+$/, "");
  const siteUrl = DEFAULT_SITE_BASE.replace(/\/+$/, "");

  const fallbackImage = `${siteUrl}/front-assets/images/og/blog-og.png`;

  if (!url) return fallbackImage;
  if (/^https?:\/\//i.test(url) || url.startsWith("//")) return url;

  const normalized = String(url).replace(/^\/+/, "");
  return `${backendBase}/${normalized}`;
}

// ðŸ‘‡ Ab network fetch nahi â€” scripts/fetch-articles.js build se pehle ek hi
// baar /api/articles fetch karke data/articles-cache.json mein save karta hai.
// generateStaticParams, generateMetadata, aur page component â€” teeno isi
// SAME cached data ko use karte hain, isliye kisi bhi article ka data
// alag-alag build calls ki wajah se mismatch/missing nahi hoga.
function getArticlesCache() {
  const filePath = path.join(process.cwd(), "data", "articles-cache.json");
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw);
    if (Array.isArray(data) && data.length > 0) return data;
  } catch (err) {
    console.error("FATAL: could not read data/articles-cache.json", err);
  }
  return [];
}
async function getAllArticles() {
  return getArticlesCache();
}

function getArticleSlug(articleOrSlug) {
  const raw =
    typeof articleOrSlug === "string"
      ? articleOrSlug
      : articleOrSlug?.url_name ||
        articleOrSlug?.slug ||
        articleOrSlug?.canonical_tag ||
        "";

  let value = String(raw).trim().split("/").filter(Boolean).pop() || "";
  try {
    value = decodeURIComponent(value);
  } catch {
    // Keep malformed URI sequences as-is rather than failing the build.
  }

  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function getArticleData(slug) {
  const items = await getAllArticles();
  return (
    items.find((item) => getArticleSlug(item) === getArticleSlug(slug)) || null
  );
}

export async function generateStaticParams() {
  const items = await getAllArticles();
  return items
    .map(getArticleSlug)
    .filter(Boolean)
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const article = await getArticleData(slug);

  const siteUrl = DEFAULT_SITE_BASE.replace(/\/+$/, "");

  const rawTitle =
    article?.meta_title ||
    article?.og_title ||
    article?.article_title ||
    article?.title ||
    "Blog Article";

  const title = rawTitle;

  const description =
    article?.meta_description ||
    article?.og_description ||
    article?.description ||
    "Read this helpful article from ResumeSathi about resume writing, interviews, career growth, and job search success.";

  const keywords =
    article?.meta_keywords ||
    article?.keywords ||
    "resume tips, interview tips, career advice, job search";

  const image =
    article?.og_image ||
    article?.meta_image ||
    article?.hero_image ||
    article?.image;

  const resolvedImage = resolveImageUrl(image);

  const canonical = `${siteUrl}/blog/${slug}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `${title} | ResumeSathi`,
      description,
      url: canonical,
      type: "article",
      siteName: "ResumeSathi",
      images: [
        {
          url: resolvedImage,
          alt: rawTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ResumeSathi`,
      description,
      images: [resolvedImage],
    },
  };
}

export default async function ArticleDetailPage({ params }) {
  const { slug } = await params;

  const article = await getArticleData(slug);

  return <ArticleDetailPageClient article={article} slug={slug} />;
}


