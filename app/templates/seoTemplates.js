import { getSiteCanonical } from "../lib/apiConfig";

export const SEO_TEMPLATES = [
  {
    slug: "software-developer-resume-template",
    title: "Software Developer Resume Template",
    description: "Read a software developer resume template with a clean two-column layout for skills, projects, experience, and contact details.",
  },
  {
    slug: "fresh-graduate-resume-template",
    title: "Fresh Graduate Resume Template",
    description: "Read a fresh graduate resume template made for education, internships, college projects, and entry-level skills.",
  },
  {
    slug: "operations-executive-resume-template",
    title: "Operations Executive Resume Template",
    description: "Read an operations executive resume template for daily operations, reporting, vendor follow-ups, and team coordination.",
  },
  {
    slug: "sales-resume-template",
    title: "Sales Resume Template",
    description: "Read a sales resume template for business development, client calls, lead follow-up, CRM work, and target-based roles.",
  },
  {
    slug: "teacher-resume-template",
    title: "Teacher Resume Template",
    description: "Read a teacher resume template for classroom experience, lesson planning, student support, education, and certificates.",
  },
  {
    slug: "ui-designer-resume-template",
    title: "UI Designer Resume Template",
    description: "Read a UI designer resume template for portfolio links, design tools, wireframes, user flows, and project work.",
  },
  {
    slug: "accounting-resume-template",
    title: "Accounting Resume Template",
    description: "Read an accounting resume template for billing, ledger work, reconciliation, Tally, Excel, and finance support roles.",
  },
  {
    slug: "hr-coordinator-resume-template",
    title: "HR Coordinator Resume Template",
    description: "Read an HR coordinator resume template for hiring support, onboarding, employee records, HRMS, and daily HR admin work.",
  },
  {
    slug: "project-coordinator-resume-template",
    title: "Project Coordinator Resume Template",
    description: "Read a project coordinator resume template for planning, status calls, reports, delivery tracking, and team updates.",
  },
];

export function buildTemplateMetadata(slug) {
  const template = SEO_TEMPLATES.find((item) => item.slug === slug);

  return {
    title: template.title,
    description: template.description,
    alternates: {
      canonical: `/templates/${template.slug}/`,
    },
    openGraph: {
      title: `${template.title} | ResumeSathi`,
      description: template.description,
      url: `/templates/${template.slug}/`,
      type: "article",
      images: [
        {
          url: "/front-assets/images/og/home-og.png",
          width: 1200,
          height: 630,
          alt: template.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${template.title} | ResumeSathi`,
      description: template.description,
      images: ["/front-assets/images/og/home-og.png"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function buildTemplateJsonLd(slug) {
  const template = SEO_TEMPLATES.find((item) => item.slug === slug);
  if (!template) return null;

  const url = getSiteCanonical(`/templates/${template.slug}/`);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: template.title,
    description: template.description,
    url,
    mainEntityOfPage: url,
    image: getSiteCanonical("/front-assets/images/og/home-og.png"),
    author: {
      "@type": "Organization",
      name: "ResumeSathi",
      url: getSiteCanonical("/"),
    },
    publisher: {
      "@type": "Organization",
      name: "ResumeSathi",
      logo: {
        "@type": "ImageObject",
        url: getSiteCanonical("/front-assets/images/logo.svg"),
      },
    },
  };
}

export function buildTemplatesCollectionJsonLd() {
  const url = getSiteCanonical("/templates/");

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Resume Templates",
    description: "Browse free resume template pages by job role and create a professional resume with ResumeSathi.",
    url,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: SEO_TEMPLATES.map((template, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: template.title,
        url: getSiteCanonical(`/templates/${template.slug}/`),
      })),
    },
  };
}

export function TemplateSeoScript({ slug }) {
  const jsonLd = buildTemplateJsonLd(slug);
  if (!jsonLd) return null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="visually-hidden">{jsonLd.headline}</h1>
    </>
  );
}
