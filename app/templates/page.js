import ResumeTemplateContentClient from "./ResumeTemplateContentClient";
import { buildTemplatesCollectionJsonLd } from "./seoTemplates";

export const metadata = {
  title: "Free Resume Templates by Job Role",
  description: "Browse human-written resume template pages for developers, freshers, teachers, sales, HR, accounting, operations, design, and management roles.",
  alternates: {
    canonical: "/templates/",
  },
  openGraph: {
    title: "Resume Templates for Different Job Roles | ResumeSathi",
    description: "Choose a resume template by role, read the sample content, or create a resume with the selected design.",
    url: "/templates/",
    type: "website",
    images: [
      {
        url: "/front-assets/images/og/home-og.png",
        width: 1200,
        height: 630,
        alt: "ResumeSathi resume templates",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Resume Templates for Different Job Roles | ResumeSathi",
    description: "Choose a resume template by role, read the sample content, or create a resume with the selected design.",
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
