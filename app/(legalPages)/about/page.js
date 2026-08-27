import fs from 'fs';
import path from 'path';
import AboutClient from './client';
import { DEFAULT_SITE_BASE } from '../../lib/apiConfig';

const siteUrl = DEFAULT_SITE_BASE.replace(/\/+$/, '');

function readCache(filename) {
  const filePath = path.join(process.cwd(), 'data', filename);
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);
    if (Array.isArray(data)) return data;
  } catch (err) {
    console.error(`FATAL: could not read data/${filename} for about page preview sections.`);
  }
  return [];
}

function stripHtml(value = '') {
  return String(value).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function toPreviewItems(items, type) {
  return items.slice(0, 6).map((item) => ({
    id: item.id,
    slug: item.slug || item.url_name || item.course_slug || item.article_slug || '',
    title: item.title || item.article_title || item.course_name || item.topic_name || 'ResumeSathi update',
    description: stripHtml(
      item.meta_description || item.short_description || item.description || item.excerpt || '',
    ).slice(0, 180),
    created_at: item.created_at || item.updated_at || '',
    last_date: item.last_date_for_apply || item.application_end_date || item.last_date || '',
    type,
  }));
}

const aboutFaqs = [
  {
    q: 'Can I create bio-data on ResumeSathi?',
    a: 'Yes. ResumeSathi includes a free bio-data maker with printable templates, personal details, family details, education, work information, and PDF, Word, and text export.',
  },
  {
    q: 'What can I do on ResumeSathi besides building a resume?',
    a: 'You can check ATS compatibility, manage PDF files, convert DOCX or images to PDF, crop signatures, calculate age, practice typing, read career blogs, and browse latest job updates.',
  },
  {
    q: 'Does ResumeSathi provide government job updates?',
    a: 'Yes. ResumeSathi publishes curated job updates with important dates, eligibility details, and apply links so candidates can track openings in one place.',
  },
  {
    q: 'Can I practice typing for exams on ResumeSathi?',
    a: 'Yes. The typing practice area includes lessons, practice sessions, WPM tracking, and accuracy tracking for users preparing for typing-based exams.',
  },
  {
    q: 'Are ResumeSathi PDF tools useful for job applications?',
    a: 'Yes. The PDF tools help candidates merge, split, compress, remove pages, and convert documents so application files match portal requirements.',
  },
  {
    q: 'Can freshers use ResumeSathi?',
    a: 'Yes. Freshers can build ATS-friendly resumes, add education and skills, read career guides, and use job listings to find relevant opportunities.',
  },
  {
    q: 'Can experienced professionals use ResumeSathi?',
    a: 'Yes. Experienced users can create structured resumes, highlight work experience, check ATS readiness, and prepare documents for different roles.',
  },
  {
    q: 'Does ResumeSathi help with ATS keywords?',
    a: 'ResumeSathi helps users review resume structure and ATS compatibility, so they can improve formatting, sections, and keyword relevance before applying.',
  },
  {
    q: 'How often are jobs and blogs updated?',
    a: 'Jobs and career articles are updated regularly from ResumeSathi content data, so users can discover fresh opportunities and guidance.',
  },
  {
    q: 'Is ResumeSathi useful on mobile?',
    a: 'Yes. ResumeSathi pages are responsive, so users can browse jobs, read blogs, use tools, and continue resume work from mobile or desktop.',
  },
  {
    q: 'Why should I use ResumeSathi for my career workflow?',
    a: 'ResumeSathi combines resume creation, ATS checking, document tools, typing practice, job updates, and career guidance in one free platform.',
  },
];

export const metadata = {
  title: 'About ResumeSathi | Free Resume & Bio-Data Maker, Career Tools, Jobs',
  description:
    'Learn about ResumeSathi, a free career platform with ATS resume builder, printable bio-data maker, PDF tools, typing practice, latest job updates, and career blogs for job seekers.',
  keywords: [
    'about ResumeSathi',
    'ResumeSathi mission',
    'free resume builder online',
    'free bio data maker',
    'printable bio data maker',
    'bio data format online',
    'ATS resume builder',
    'career tools for job seekers',
    'typing practice for jobs',
    'latest job updates',
    'career blog India',
  ],
  alternates: {
    canonical: `${siteUrl}/about/`,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'About ResumeSathi | Free Resume & Bio-Data Maker, Tools, Jobs',
    description:
      'ResumeSathi helps job seekers build resumes and bio-data, check ATS readiness, use free tools, practice typing, read career blogs, and find jobs.',
    url: `${siteUrl}/about/`,
    siteName: 'ResumeSathi',
    type: 'website',
    images: [{ url: '/front-assets/images/og/home-og.png', width: 1200, height: 630, alt: 'ResumeSathi resume builder' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About ResumeSathi | Free Resume & Bio-Data Maker',
    description:
      'Build resumes and bio-data, use free tools, practice typing, read career blogs, and find job updates on ResumeSathi.',
    images: ['/front-assets/images/og/home-og.png'],
  },
};

export default function AboutPage() {
  const initialJobs = toPreviewItems(readCache('jobs-cache.json'), 'job');
  const initialBlogs = toPreviewItems(readCache('articles-cache.json'), 'blog');
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: aboutFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutClient initialJobs={initialJobs} initialBlogs={initialBlogs} faqs={aboutFaqs} />
    </>
  );
}
