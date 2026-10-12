import ResumeTemplateContentClient from "./ResumeTemplateContentClient";
import { SEO_TEMPLATES, buildTemplatesCollectionJsonLd } from "./seoTemplates";

export const metadata = {
  title: "Free Resume Templates for Freshers, Developers, Teachers & More",
  description: "Choose a free ATS-friendly resume template for freshers, developers, teachers, sales, HR, accounting, and other job roles. Build a professional resume in minutes.",
  alternates: {
    canonical: "/templates/",
  },
  openGraph: {
    title: "Free Resume Templates for Every Career Stage | ResumeSathi",
    description: "Pick a professional resume template matching your role and create a clean, ATS-friendly CV in minutes.",
    url: "/templates/",
    type: "website",
    images: [
      {
        url: "/front-assets/images/og/home-og.png",
        width: 1200,
        height: 630,
        alt: "ResumeSathi free resume templates",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Resume Templates for Every Career Stage | ResumeSathi",
    description: "Pick a professional resume template matching your role and create a clean, ATS-friendly CV in minutes.",
    images: ["/front-assets/images/og/home-og.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ResumeTemplateContentPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildTemplatesCollectionJsonLd()) }}
      />
      <h1 className="visually-hidden">Free Resume Templates by Job Role</h1>
      <ResumeTemplateContentClient />

    </>
  );
}
