import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import BlogPageClient from './BlogPageClient';

function readCache(filename) {
  const candidates = [path.join(process.cwd(), 'data', filename)];
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    // app/blog/page.js -> ../../data (2 levels up to project root)
    candidates.push(path.join(__dirname, '..', '..', 'data', filename));
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

  console.error(`FATAL: could not read data/${filename}. Did scripts/fetch-articles.js run before build?`);
  return [];
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://www.resumesathi.com';

export const metadata = {
  title: 'Career Blog with Resume and Interview Tips - ResumeSathi | ResumeSathi',
  description: 'Explore expert blog articles on resumes, interviews, career growth, and job search strategies.',
  keywords: 'resume tips, career advice, interview tips, job search, professional growth',
  alternates: { canonical: `${SITE_URL}/blog` },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Career Blog with Resume and Interview Tips - ResumeSathi',
    description: 'Explore expert blog articles on resumes, interviews, career growth, and job search strategies.',
    type: 'website',
    url: `${SITE_URL}/blog`,
    siteName: 'ResumeSathi',
    images: [{ url: `${SITE_URL}/front-assets/images/og/blog-og.png`, alt: 'ResumeSathi Blog' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Career Blog with Resume and Interview Tips - ResumeSathi',
    description: 'Explore expert blog articles on resumes, interviews, career growth, and job search strategies.',
    images: [`${SITE_URL}/front-assets/images/og/blog-og.png`],
  },
};

export default function BlogPage() {
  const articles = readCache('articles-cache.json');
  const categories = readCache('article-categories-cache.json');

  return <BlogPageClient initialArticles={articles} initialCategories={categories} />;
}