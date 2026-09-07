import ResumeTemplateContentClient from "./ResumeTemplateContentClient";
import { SEO_TEMPLATES, buildTemplatesCollectionJsonLd } from "./seoTemplates";

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
      <section className="template-noscript-article">
        <h2>Resume templates by job role</h2>
        <p>
          Browse free resume template guides for common job profiles. Each page
          explains who the template is useful for, what to write in the summary,
          how to present skills, and how to avoid common resume mistakes before
          creating your resume.
        </p>
        <p>
          These templates are written for real hiring situations, including
          fresh graduate resumes, teacher resumes, software developer resumes,
          sales resumes, HR resumes, accounting resumes, operations resumes,
          UI designer resumes, and project coordinator resumes. Pick a role to
          see sample wording, section order, and practical guidance before you
          start editing your own resume.
        </p>
        <p>
          Use the examples as a starting point, then replace every sample line
          with your own responsibilities, tools, results, education, and skills.
        </p>
        <ul>
          {SEO_TEMPLATES.map((template) => (
            <li key={template.slug}>
              <a href={`/templates/${template.slug}/`}>{template.title}</a>
              {`: ${template.description}`}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
