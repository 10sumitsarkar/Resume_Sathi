import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ResumeListClient from "./homeClient";

// 👇 Ab network fetch nahi — jobs/blogs preview sections ke liye
// build-time cached data use karte hain (jobs/[slug] aur blog/[slug] ke
// liye already ban chuki data/jobs-cache.json aur data/articles-cache.json).
function readCache(filename) {
  const candidates = [path.join(process.cwd(), 'data', filename)];
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    // app/page.js -> ../data (1 level up to project root)
    candidates.push(path.join(__dirname, '..', 'data', filename));
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

  console.error(`FATAL: could not read data/${filename} for homepage preview sections.`);
  return [];
}

export const metadata = {
  title: "Free Resume Builder & ATS-Friendly Resume Templates",
  description:
    "Create professional, ATS-friendly resumes for free with ResumeSathi. Build a resume, cover letter, and job-ready documents in minutes.",
  keywords: [
    "resume builder",
    "free resume maker",
    "ATS resume",
    "cover letter builder",
    "job search tools",
  ],
  alternates: { canonical: "/" }, 
  openGraph: {
    title: "Free Resume Builder & ATS-Friendly Resume Templates",
    description:
      "Create ATS-friendly resumes, cover letters, and job-ready career documents for free with ResumeSathi.",
    url: "/",
    type: "website",
    siteName: "ResumeSathi",
    images: [{ url: "/front-assets/images/og/home-og.png", width: 1200, height: 630, alt: "ResumeSathi resume builder" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Resume Builder & ATS-Friendly Resume Templates",
    description:
      "Create ATS-friendly resumes, cover letters, and job-ready career documents for free with ResumeSathi.",
    images: ["/front-assets/images/og/home-og.png"],
  },
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.resumesathi.com";

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ResumeSathi",
    url: SITE_URL,
    logo: `${SITE_URL}/front-assets/images/logo/logo.svg`,
    description:
      "ResumeSathi is a 100% free, ATS-friendly resume builder. All data stays in your browser — nothing is ever uploaded to a server.",
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ResumeSathi",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "ResumeSathi Resume Builder",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: SITE_URL,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    description:
      "Build ATS-friendly resumes and cover letters for free. No signup required — all data is stored locally in your browser.",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "1200",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is ResumeSathi completely free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, ResumeSathi is 100% free and always will be. No hidden charges, no premium plans. All templates and all tools are completely free.",
        },
      },
      {
        "@type": "Question",
        name: "Where is my data saved?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Your data is saved only in your browser's localStorage. No server, no database, no account required. Your data stays on your device until you choose to clear it.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need to create an account to build a resume?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Absolutely not. No signup, no login, no email verification. Simply choose a template, fill in your details, and download.",
        },
      },
      {
        "@type": "Question",
        name: "How do I download my resume as a PDF?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Once you complete your resume, click the 'Download PDF' button. The browser print dialog opens — select 'Save as PDF' to save it to your device. No extra software needed.",
        },
      },
      {
        "@type": "Question",
        name: "Is ResumeSathi ATS-friendly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Every ResumeSathi template is built to be parsed correctly by Applicant Tracking Systems, using clean structure and standard fonts.",
        },
      },
    ],
  },
];

export default function Page() {
  const initialJobs = readCache('jobs-cache.json').slice(0, 8);
  const initialBlogs = readCache('articles-cache.json').slice(0, 6);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ResumeListClient initialJobs={initialJobs} initialBlogs={initialBlogs} />
    </>
  );
}