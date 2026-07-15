import React from 'react';
import ArticleDetailPageClient from './ArticleDetailPageClient';

function resolveImageUrl(url) {
  const backendBase = (process.env.NEXT_PUBLIC_BACKEND_BASE || 'https://api.resumesathi.com').replace(/\/+$/, '');
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://www.resumesathi.com';
  const fallbackImage = `${siteUrl}/front-assets/images/resume-hero.webp`;

  if (!url) return fallbackImage;
  if (/^https?:\/\//i.test(url) || url.startsWith('//')) return url;

  const normalized = String(url).replace(/^\/+/, '');
  return `${backendBase}/${normalized}`;
}

async function getAllJobs() {
  const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE || 'https://api.resumesathi.com';
  const apiBase = `${backendBase}/api`;

  try {
    const response = await fetch(`${apiBase}/courses`);
    if (!response.ok) return [];
    const jobs = await response.json();
    return Array.isArray(jobs) ? jobs : (jobs.items || jobs.results || []);
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function getArticleData(slug) {
  const items = await getAllJobs();
  return items.find((item) => {
    const slugValue = item.slug || item.url_name || item.canonical_tag || '';
    return slugValue === slug || slugValue === decodeURIComponent(slug);
  }) || null;
}

// 👇 NAYA FUNCTION — static export ke liye zaroori
export async function generateStaticParams() {
  const items = await getAllJobs();
  return items
    .map((item) => item.slug || item.url_name || item.canonical_tag)
    .filter(Boolean)
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const slug = (await params)?.slug;
  const article = slug ? await getArticleData(slug) : null;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://www.resumesathi.com';
  const rawTitle = article?.meta_title || article?.og_title || article?.title || article?.topic_name || 'Job Opening';
  const title = `${rawTitle} | ResumeSathi`;
  const description = article?.meta_description || article?.og_description || article?.description || 'Explore this job opportunity on ResumeSathi and apply today.';
  const keywords = article?.meta_keywords || article?.keywords || 'jobs, career opportunities, hiring, apply now, government jobs';
  const image = article?.og_image || article?.meta_image || article?.hero_image || article?.image;
  const canonical = `${siteUrl}/jobs/${slug || ''}`;
  const resolvedImage = resolveImageUrl(image);

  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      type: 'article',
      url: canonical,
      siteName: 'ResumeSathi',
      images: [{ url: resolvedImage, alt: rawTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [resolvedImage],
    },
  };
}

export default async function JobDetailPage({ params }) {
  const slug = (await params)?.slug;
  const article = slug ? await getArticleData(slug) : null;

  return <ArticleDetailPageClient article={article} slug={slug} />;
}