import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import React from 'react';
import ArticleDetailPageClient from './ArticleDetailPageClient';

function resolveImageUrl(url) {
  const backendBase = (process.env.NEXT_PUBLIC_BACKEND_BASE || 'https://api.resumesathi.com').replace(/\/+$/, '');
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_FRONTEND_URL ||
    'https://www.resumesathi.com';

  const fallbackImage = `${siteUrl}/front-assets/images/og/blog-og.png`;

  if (!url) return fallbackImage;
  if (/^https?:\/\//i.test(url) || url.startsWith('//')) return url;

  const normalized = String(url).replace(/^\/+/, '');
  return `${backendBase}/${normalized}`;
}

// 👇 Ab network fetch nahi — scripts/fetch-articles.js build se pehle ek hi
// baar /api/articles fetch karke data/articles-cache.json mein save karta hai.
// generateStaticParams, generateMetadata, aur page component — teeno isi
// SAME cached data ko use karte hain, isliye kisi bhi article ka data
// alag-alag build calls ki wajah se mismatch/missing nahi hoga.
function getArticlesCache() {
  const candidates = [path.join(process.cwd(), 'data', 'articles-cache.json')];
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    candidates.push(path.join(__dirname, '..', '..', '..', 'data', 'articles-cache.json'));
  } catch (e) {
    // import.meta.url unavailable — skip
  }

  for (const filePath of candidates) {
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(raw);
      if (Array.isArray(data)) return data;
    } catch (err) {
      // try next candidate
    }
  }

  console.error('FATAL: could not read data/articles-cache.json. Did scripts/fetch-articles.js run before build?');
  return [];
}

async function getAllArticles() {
  return getArticlesCache();
}

async function getArticleData(slug) {
  const items = await getAllArticles();
  return items.find((item) => {
    const slugValue = item.url_name || item.slug || item.canonical_tag || '';
    return slugValue === slug || slugValue === decodeURIComponent(slug);
  }) || null;
}

export async function generateStaticParams() {
  const items = await getAllArticles();
  return items
    .map((article) => article.url_name || article.slug || article.canonical_tag)
    .filter(Boolean)
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const article = await getArticleData(slug);

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_FRONTEND_URL ||
    'https://www.resumesathi.com';

  const rawTitle =
    article?.meta_title ||
    article?.og_title ||
    article?.article_title ||
    article?.title ||
    'Blog Article';

  const title = rawTitle;

  const description =
    article?.meta_description ||
    article?.og_description ||
    article?.description ||
    'Read this helpful article from ResumeSathi about resume writing, interviews, career growth, and job search success.';

  const keywords =
    article?.meta_keywords ||
    article?.keywords ||
    'resume tips, interview tips, career advice, job search';

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
      type: 'article',
      siteName: 'ResumeSathi',
      images: [
        {
          url: resolvedImage,
          alt: rawTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ResumeSathi`,
      description,
      images: [resolvedImage],
    },
  };
}

export default async function ArticleDetailPage({ params }) {
  const { slug } = await params;

  const article = await getArticleData(slug);

  return (
    <ArticleDetailPageClient
      article={article}
      slug={slug}
    />
  );
}