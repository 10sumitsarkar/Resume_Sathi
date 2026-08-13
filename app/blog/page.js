import fs from 'fs';
import path from 'path';
import BlogPageClient from './BlogPageClient';
import { DEFAULT_SITE_BASE } from '../lib/apiConfig';

function readCache(filename) {
  const filePath = path.join(process.cwd(), 'data', filename);
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);
    if (Array.isArray(data)) return data;
  } catch (err) {
    console.error(`FATAL: could not read data/${filename}. Did scripts/fetch-articles.js run before build?`);
  }
  return [];
}

const SITE_URL = DEFAULT_SITE_BASE.replace(/\/+$/, '');

function latestFirst(items) {
  return items.slice().sort((a, b) => {
    const bTime = new Date(b.updated_at || b.created_at || 0).getTime();
    const aTime = new Date(a.updated_at || a.created_at || 0).getTime();
    return bTime - aTime;
  });
}

const articles = latestFirst(readCache('articles-cache.json'));

const categories = readCache('article-categories-cache.json');

export const metadata = {
  title: 'Career Blog with Resume and Interview Tips',
  description: 'Explore expert blog articles on resumes, interviews, career growth, and job search strategies.',
  keywords: 'resume tips, career advice, interview tips, job search, professional growth',
  alternates: { canonical: `${SITE_URL}/blog/` },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Career Blog with Resume and Interview Tips - ResumeSathi',
    description: 'Explore expert blog articles on resumes, interviews, career growth, and job search strategies.',
    type: 'website',
    url: `${SITE_URL}/blog/`,
    siteName: 'ResumeSathi',
    images: [{ url: `${SITE_URL}/front-assets/images/og/blog-og.png`, width: 1200, height: 630, alt: 'ResumeSathi Blog' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Career Blog with Resume and Interview Tips - ResumeSathi',
    description: 'Explore expert blog articles on resumes, interviews, career growth, and job search strategies.',
    images: [`${SITE_URL}/front-assets/images/og/blog-og.png`],
  },
};

export default function BlogPage() {
  return <BlogPageClient initialArticles={articles} initialCategories={categories} />;
}
