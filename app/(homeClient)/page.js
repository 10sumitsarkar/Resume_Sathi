import fs from 'fs';
import path from 'path';
import ResumeListClient from "./homeClient";
import { DEFAULT_SITE_BASE } from "../lib/apiConfig";
import { isExamGuide } from "../exam-guides/examGuideData";

// Blog preview content build-time cache se aata hai.
function readCache(filename) {
  const filePath = path.join(process.cwd(), 'data', filename);
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);
    if (Array.isArray(data)) return data;
  } catch (err) {
    console.error(`FATAL: could not read data/${filename} for homepage preview sections.`);
  }
  return [];
}
export const metadata = {
  title: "Free Resume Builder and Career Tools",
  description:
    "Create a resume with guided sections and role-based templates, then prepare application files with free browser-based career tools.",
  keywords: [
    "resume builder",
    "free resume builder",
    "ats friendly resume builder",
    "resume builder no signup",
    "free resume templates",
    "career tools",
  ],
  alternates: { canonical: "/" }, 
  openGraph: {
    title: "Free Resume Builder and Career Tools | ResumeSathi",
    description:
      "Create a resume with guided sections and role-based templates, then prepare application files with free browser-based career tools.",
    url: "/",
    type: "website",
    siteName: "ResumeSathi",
    images: [{ url: "/front-assets/images/og/home-og.png", width: 1200, height: 630, alt: "ResumeSathi resume builder" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Resume Builder and Career Tools | ResumeSathi",
    description:
      "Create a resume with guided sections and role-based templates, then prepare application files with free browser-based career tools.",
    images: ["/front-assets/images/og/home-og.png"],
  },
};

const SITE_URL = DEFAULT_SITE_BASE.replace(/\/+$/, "");

const HOME_BLOG_LIMIT = 6;
const initialBlogs = readCache('articles-cache.json').slice(0, HOME_BLOG_LIMIT);
const HOME_EXAM_GUIDE_LIMIT = 6;
const initialExamGuides = readCache('exam-guides-cache.json')
  .filter(isExamGuide)
  .slice(0, HOME_EXAM_GUIDE_LIMIT);

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ResumeSathi",
    url: SITE_URL,
    logo: `${SITE_URL}/front-assets/images/logo/logo.svg`,
    description:
      "ResumeSathi provides a browser-based resume builder, role-based templates, career articles, exam guides, and application tools.",
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ResumeSathi",
    url: SITE_URL,
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
      "Build and export a resume with guided sections. Resume details are stored locally in your browser.",
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
          text: "The resume builder is currently free to use, with no payment required to create or download a resume.",
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
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ResumeListClient
        initialBlogs={initialBlogs}
        initialExamGuides={initialExamGuides}
      />
    </>
  );
}
