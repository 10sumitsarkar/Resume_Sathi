import React from 'react';
import ArticleDetailPageClient from './ArticleDetailPageClient';

function resolveImageUrl(url) {
  const backendBase = (process.env.NEXT_PUBLIC_BACKEND_BASE || 'https://api.resumesathi.com').replace(/\/+$/, '');
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_FRONTEND_URL ||
    'https://www.resumesathi.com';

  const fallbackImage = `${siteUrl}/front-assets/images/resume-hero.webp`;

  if (!url) return fallbackImage;
  if (/^https?:\/\//i.test(url) || url.startsWith('//')) return url;

  const normalized = String(url).replace(/^\/+/, '');
  return `${backendBase}/${normalized}`;
}

async function getArticleData(slug) {
  const backendBase =
    process.env.NEXT_PUBLIC_BACKEND_BASE || 'https://api.resumesathi.com';

  try {
    const response = await fetch(
      `${backendBase}/api/articles/slug/${encodeURIComponent(slug)}`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function generateStaticParams() {
  const backendBase =
    process.env.NEXT_PUBLIC_BACKEND_BASE || "https://api.resumesathi.com";

  try {
    const response = await fetch(`${backendBase}/api/articles`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();

    const articles = Array.isArray(data)
      ? data
      : data.items || data.results || data.data || [];

    return articles
      .filter((article) => article.url_name)
      .map((article) => ({
        slug: article.url_name,
      }));
  } catch (error) {
    console.error("generateStaticParams:", error);
    return [];
  }
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

  const title = `${rawTitle} | ResumeSathi`;

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
      title,
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
      title,
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