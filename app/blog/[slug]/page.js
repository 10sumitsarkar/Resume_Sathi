import React from 'react';
import ArticleDetailPageClient from './ArticleDetailPageClient';

function resolveImageUrl(url) {
  const backendBase = (process.env.NEXT_PUBLIC_BACKEND_BASE || 'http://localhost:8000').replace(/\/+$/, '');
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';
  const fallbackImage = `${siteUrl}/front-assets/images/resume-hero.webp`;

  if (!url) return fallbackImage;
  if (/^https?:\/\//i.test(url) || url.startsWith('//')) return url;

  const normalized = String(url).replace(/^\/+/, '');
  return `${backendBase}/${normalized}`;
}

async function getArticleData(slug) {
  const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE || 'http://localhost:8000';
  const apiBase = `${backendBase}/api`;

  try {
    const response = await fetch(`${apiBase}/articles/slug/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const slug = (await params)?.slug;
  const article = slug ? await getArticleData(slug) : null;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';
  const title = article?.meta_title || article?.og_title || article?.article_title || article?.title || 'Blog Article';
  const description = article?.meta_description || article?.og_description || article?.description || 'Read this helpful article from our blog.';
  const keywords = article?.meta_keywords || article?.keywords || 'resume tips, career advice, interview tips';
  const image = article?.og_image || article?.meta_image || article?.hero_image || article?.image;
  const canonical = `${siteUrl}/blog/${slug || ''}`;
  const resolvedImage = resolveImageUrl(image);

  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      type: 'article',
      url: canonical,
      images: [{ url: resolvedImage, alt: title }],
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
  const slug = (await params)?.slug;
  const article = slug ? await getArticleData(slug) : null;

  return <ArticleDetailPageClient article={article} slug={slug} />;
}