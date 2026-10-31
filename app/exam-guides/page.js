import fs from 'fs';
import path from 'path';
import ExamGuidesClient from './ExamGuidesClient';
import { DEFAULT_SITE_BASE } from '../lib/apiConfig';
import { isExamGuide } from './examGuideData';

function readCache(filename) {
  const filePath = path.join(process.cwd(), 'data', filename);
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);
    if (Array.isArray(data)) return data.filter(isExamGuide);
  } catch (err) {
    console.error(`FATAL: could not read data/${filename}. Did scripts/fetch-exam-guides.js run before build?`);
  }
  return [];
}

const SITE_URL = DEFAULT_SITE_BASE.replace(/\/+$/, '');

const guides = readCache('exam-guides-cache.json').filter(isExamGuide);

export const metadata = {
  title: 'Exam Guides, Syllabus & Results',
  description: 'Explore exam guides with syllabus, eligibility, important dates, admit cards, answer keys, and results.',
  keywords: 'exam guides, syllabus, eligibility, exam pattern, admit card, answer key, result, exam preparation',
  alternates: { canonical: `${SITE_URL}/exam-guides/` },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Exam Guides, Syllabus & Results | ResumeSathi',
    description: 'Explore exam guides with syllabus, eligibility, important dates, admit cards, answer keys, and results.',
    type: 'website',
    url: `${SITE_URL}/exam-guides/`,
    siteName: 'ResumeSathi',
    images: [{ url: `${SITE_URL}/front-assets/images/og/home-og.png`, width: 1200, height: 630, alt: 'ResumeSathi Exam Guides' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Exam Guides, Syllabus & Results | ResumeSathi',
    description: 'Explore exam guides with syllabus, eligibility, important dates, admit cards, answer keys, and results.',
    images: [`${SITE_URL}/front-assets/images/og/home-og.png`],
  },
};

export default function ExamGuidesPage() {
  return <ExamGuidesClient initialArticles={guides} />;
}
