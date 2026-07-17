import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import JobsPageClient from './JobsPageClient';

function readCache(filename) {
  const candidates = [path.join(process.cwd(), 'data', filename)];
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    // app/jobs/page.js -> ../../data (2 levels up to project root)
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

  console.error(`FATAL: could not read data/${filename}. Did scripts/fetch-jobs.js run before build?`);
  return [];
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://www.resumesathi.com';

export const metadata = {
  title: 'Find Latest Jobs & Vacancies | ResumeSathi',
  description: 'Explore fresh job openings, company details, and career opportunities curated for job seekers.',
  keywords: 'jobs, career opportunities, hiring, resume tips, professional growth',
  alternates: { canonical: `${SITE_URL}/jobs` },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Find Latest Jobs & Vacancies | ResumeSathi',
    description: 'Explore fresh job openings, company details, and career opportunities curated for job seekers.',
    type: 'website',
    url: `${SITE_URL}/jobs`,
    siteName: 'ResumeSathi',
    images: [{ url: `${SITE_URL}/front-assets/images/og/job-og.png`, alt: 'ResumeSathi Jobs' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find Latest Jobs & Vacancies | ResumeSathi',
    description: 'Explore fresh job openings, company details, and career opportunities curated for job seekers.',
    images: [`${SITE_URL}/front-assets/images/og/job-og.png`],
  },
};

export default function JobsPage() {
  const jobs = readCache('jobs-cache.json');
  const categories = readCache('categories-cache.json');

  return <JobsPageClient initialArticles={jobs} initialCategories={categories} />;
}