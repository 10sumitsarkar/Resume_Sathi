import fs from "fs";
import path from "path";
import React from "react";
import { notFound } from "next/navigation";
import ArticleDetailPageClient from "./ArticleDetailPageClient";
import { DEFAULT_BACKEND_BASE, DEFAULT_SITE_BASE, withTrailingSlash } from "../../lib/apiConfig";
import { latestFirst } from "../articleSort";

export const dynamicParams = false;
const STATIC_404_SLUGS = ["[slug]", "%5Bslug%5D"];

function resolveImageUrl(url) {
  const backendBase = DEFAULT_BACKEND_BASE.replace(/\/+$/, "");
  const siteUrl = DEFAULT_SITE_BASE.replace(/\/+$/, "");

  const fallbackImage = `${siteUrl}/front-assets/images/og/blog-og.png`;

  if (!url) return fallbackImage;
  if (/^https?:\/\//i.test(url) || url.startsWith("//")) return url;

  const normalized = String(url).replace(/^\/+/, "");
  return `${backendBase}/${normalized}`;
}

// 📌 Ab network fetch nahi — scripts/fetch-articles.js build se pehle ek hi
// baar /api/articles fetch karke data/articles-cache.json mein save karta hai.
// generateStaticParams, generateMetadata, aur page component — teeno isi
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

function getArticleIndex(items) {
  return items.map((item) => ({
    id: item.id,
    slug: item.slug,
    url_name: item.url_name,
    canonical_tag: item.canonical_tag,
    article_title: item.article_title,
    title: item.title,
    meta_title: item.meta_title,
    description: item.description,
    meta_description: item.meta_description,
    short_description: item.short_description,
    excerpt: item.excerpt,
    category: item.category ? {
      id: item.category.id,
      article_name: item.category.article_name,
      name: item.category.name,
      title: item.category.title,
    } : null,
    category_id: item.category_id,
    article_type: item.article_type,
    hero_image: item.hero_image,
    image: item.image,
    created_at: item.created_at,
    updated_at: item.updated_at,
  }));
}

function getArticleCategories() {
  const filePath = path.join(process.cwd(), "data", "article-categories-cache.json");
  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("FATAL: could not read data/article-categories-cache.json", error);
    return [];
  }
}

function truncateMeta(value = "", max = 50) {
  const normalized = String(value || "").replace(/\s+/g, " ").trim();
  if (normalized.length <= max) return normalized;
  return `${normalized.slice(0, max - 1).replace(/\s+\S*$/, "")}.`;
}

export async function generateStaticParams() {
  const items = await getAllArticles();
  const staticSlugs = items
    .map(getArticleSlug)
    .filter(Boolean)
    .map((slug) => ({ slug }));

  return [
    ...staticSlugs,
    ...STATIC_404_SLUGS.map((slug) => ({ slug })),
  ];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const article = await getArticleData(slug);

  if (!article) {
    return {
      title: "Blog Article Not Found | ResumeSathi",
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const siteUrl = DEFAULT_SITE_BASE.replace(/\/+$/, "");

  const rawTitle =
    article?.meta_title ||
    article?.og_title ||
    article?.article_title ||
    article?.title ||
    "Blog Article";

  const title = truncateMeta(rawTitle);

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

  const canonical = `${siteUrl}${withTrailingSlash(`/blog/${slug}`)}`;

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
  const articleIndex = getArticleIndex(await getAllArticles());

  if (!article) {
    notFound();
  }

  const latestArticles = latestFirst(articleIndex)
    .filter((item) => getArticleSlug(item) !== getArticleSlug(slug))
    .slice(0, 5);

  return (
    <ArticleDetailPageClient
      article={article}
      slug={slug}
      articleIndex={articleIndex}
      initialLatest={latestArticles}
      initialCategories={getArticleCategories()}
    />
  );
}



