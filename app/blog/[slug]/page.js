import fs from "fs";
import path from "path";
import React from "react";
import { notFound } from "next/navigation";
import ArticleDetailPageClient from "./ArticleDetailPageClient";
import JsonLd from "../../components/JsonLd";
import { DEFAULT_BACKEND_BASE, DEFAULT_SITE_BASE, withTrailingSlash } from "../../lib/apiConfig";
import { latestFirst } from "../articleSort";
import {
  getContextualArticleLinks,
  getRelatedBlogArticles,
} from "../blogData";
import { getBlogCategorySlug } from "../blogRoutes";
import { getArticleAuthorSlug } from "../articleMetadata";
import { getSeoDescription, getSeoTitle } from "../../lib/seoMetadata";

export const dynamicParams = false;

function resolveImageUrl(url) {
  const backendBase = DEFAULT_BACKEND_BASE.replace(/\/+$/, "");
  const siteUrl = DEFAULT_SITE_BASE.replace(/\/+$/, "");

  const fallbackImage = `${siteUrl}/front-assets/images/og/blog-og.webp`;

  if (!url) return fallbackImage;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("//")) return `https:${url}`;

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

function getArticleLastUpdatedAt(article) {
  const timestamps = [
    article?.created_at,
    article?.updated_at,
    ...(Array.isArray(article?.contents)
      ? article.contents.flatMap((item) => [item?.created_at, item?.updated_at])
      : []),
  ].filter((value) => value && !Number.isNaN(Date.parse(value)));

  return timestamps.reduce(
    (latest, value) =>
      !latest || Date.parse(value) > Date.parse(latest) ? value : latest,
    "",
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
      url_name: item.category.url_name,
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

export async function generateStaticParams() {
  const items = await getAllArticles();
  const staticSlugs = items
    .map(getArticleSlug)
    .filter(Boolean)
    .map((slug) => ({ slug }));

  return staticSlugs;
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

  const title = getSeoTitle(
    String(rawTitle).replace(/\s*\|\s*ResumeSathi\s*$/i, "").trim(),
  );

  const description = getSeoDescription(
    article?.meta_description ||
      article?.og_description ||
      article?.description ||
      "Read this helpful article from ResumeSathi about resume writing, interviews, career growth, and job search success.",
  );

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
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
      },
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

  if (!article) {
    notFound();
  }

  const articleIndex = getArticleIndex(await getAllArticles());
  const relatedArticles = getRelatedBlogArticles(article, articleIndex);
  const contextualLinks = getContextualArticleLinks(article);
  const latestArticles = latestFirst(articleIndex)
    .filter((item) => getArticleSlug(item) !== getArticleSlug(slug))
    .slice(0, 5);

  const siteUrl = DEFAULT_SITE_BASE.replace(/\/+$/, "");
  const canonical = `${siteUrl}${withTrailingSlash(`/blog/${slug}`)}`;
  const articleTitle =
    article.article_title ||
    article.title ||
    article.meta_title ||
    article.og_title ||
    "Blog Article";
  const articleDescription = getSeoDescription(
    article.meta_description ||
      article.og_description ||
      article.description ||
      "Read this helpful article from ResumeSathi about resume writing, interviews, career growth, and job search success.",
  );
  const breadcrumbTitle =
    article.article_title || article.title || article.meta_title || "Blog Article";
  const categoryName =
    article.category?.article_name ||
    article.category?.name ||
    article.category?.title ||
    "General";
  const categorySlug = getBlogCategorySlug(article.category) || "general";
  const categoryUrl = `${siteUrl}/blog/category/${encodeURIComponent(categorySlug)}/`;
  const authorName =
    [article.user?.first_name, article.user?.last_name]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    article.user?.name ||
    "";
  const authorSlug = getArticleAuthorSlug(article);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: articleTitle,
          description: articleDescription,
          image: [resolveImageUrl(article.og_image || article.meta_image || article.hero_image || article.image)],
          datePublished: article.created_at,
          ...(getArticleLastUpdatedAt(article)
            ? { dateModified: getArticleLastUpdatedAt(article) }
            : {}),
          ...(authorName
            ? {
                author: {
                  "@type": "Person",
                  name: authorName,
                  ...(authorSlug
                    ? {
                        url: `${DEFAULT_SITE_BASE.replace(/\/+$/, "")}/authors/${authorSlug}/`,
                      }
                    : {}),
                },
              }
            : {}),
          ...(article.category?.article_name
            ? { articleSection: article.category.article_name }
            : {}),
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": canonical,
          },
          publisher: {
            "@type": "Organization",
            name: "ResumeSathi",
            logo: {
              "@type": "ImageObject",
              url: `${DEFAULT_SITE_BASE.replace(/\/+$/, "")}/front-assets/images/logo/logo-512.png`,
            },
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: `${siteUrl}/`,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Blog",
              item: `${siteUrl}/blog/`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: categoryName,
              item: categoryUrl,
            },
            {
              "@type": "ListItem",
              position: 4,
              name: breadcrumbTitle,
              item: canonical,
            },
          ],
        }}
      />
      <ArticleDetailPageClient
        article={article}
        slug={slug}
        articleIndex={articleIndex}
        initialLatest={latestArticles}
        initialCategories={getArticleCategories()}
        initialRelated={relatedArticles}
        contextualLinks={contextualLinks}
      />
    </>
  );
}
