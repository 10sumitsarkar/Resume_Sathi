import React from 'react';
import ArticleDetailPageClient from './ArticleDetailPageClient';

function resolveImageUrl(url) {
  const backendBase = (process.env.NEXT_PUBLIC_BACKEND_BASE || 'https://api.resumesathi.com').replace(/\/+$/, '');
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://www.resumesathi.com';
  const fallbackImage = `${siteUrl}/front-assets/images/og/job-og.png`;

  if (!url) return fallbackImage;
  if (/^https?:\/\//i.test(url) || url.startsWith('//')) return url;

  const normalized = String(url).replace(/^\/+/, '');
  return `${backendBase}/${normalized}`;
}

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 👇 Ab network fetch nahi — scripts/fetch-jobs.js build se pehle ek hi baar
// /api/courses fetch karke data/jobs-cache.json mein save karta hai.
// generateStaticParams, generateMetadata, aur page component — teeno isi
// SAME cached data ko use karte hain, isliye kisi bhi job ka data
// alag-alag build calls ki wajah se mismatch/missing nahi hoga.
function getJobsCache() {
  const candidates = [];

  // Attempt 1: process.cwd() based (project root jahan se `npm run build` chalaya)
  candidates.push(path.join(process.cwd(), 'data', 'jobs-cache.json'));

  // Attempt 2: __dirname based (is file ki actual location se relative — cwd se independent)
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    candidates.push(path.join(__dirname, '..', '..', '..', 'data', 'jobs-cache.json'));
  } catch (e) {
    // import.meta.url unavailable in this runtime — skip
  }

  for (const filePath of candidates) {
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(raw);
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    } catch (err) {
      // try next candidate
    }
  }

  console.error('FATAL: could not read data/jobs-cache.json from any candidate path:', candidates);
  console.error('cwd was:', process.cwd());
  return [];
}

async function getAllJobs() {
  return getJobsCache();
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
  const title = rawTitle;
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
      title: `${title} | ResumeSathi`,
      description,
      type: 'article',
      url: canonical,
      siteName: 'ResumeSathi',
      images: [{ url: resolvedImage, alt: rawTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ResumeSathi`,
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