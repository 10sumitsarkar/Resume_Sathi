import fs from 'fs';
import path from 'path';
import JobsPageClient from './JobsPageClient';
import { DEFAULT_SITE_BASE } from '../lib/apiConfig';

function readCache(filename) {
  const filePath = path.join(process.cwd(), 'data', filename);
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);
    if (Array.isArray(data)) return data;
  } catch (err) {
    console.error(`FATAL: could not read data/${filename}. Did scripts/fetch-jobs.js run before build?`);
  }
  return [];
}

const SITE_URL = DEFAULT_SITE_BASE.replace(/\/+$/, '');

const jobs = readCache('jobs-cache.json');
const categories = readCache('categories-cache.json');

export const metadata = {
  title: 'Find Latest Jobs & Vacancies | ResumeSathi',
  description: 'Explore fresh job openings, company details, and career opportunities curated for job seekers.',
  keywords: 'jobs, career opportunities, hiring, resume tips, professional growth',
  alternates: { canonical: `${SITE_URL}/jobs/` },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Find Latest Jobs & Vacancies | ResumeSathi',
    description: 'Explore fresh job openings, company details, and career opportunities curated for job seekers.',
    type: 'website',
    url: `${SITE_URL}/jobs/`,
    siteName: 'ResumeSathi',
    images: [{ url: `${SITE_URL}/front-assets/images/og/job-og.png`, width: 1200, height: 630, alt: 'ResumeSathi Jobs' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find Latest Jobs & Vacancies | ResumeSathi',
    description: 'Explore fresh job openings, company details, and career opportunities curated for job seekers.',
    images: [`${SITE_URL}/front-assets/images/og/job-og.png`],
  },
};

export default function JobsPage() {
  return <JobsPageClient initialArticles={jobs} initialCategories={categories} />;
}
