import ToolsLists from "./ToolsLists";

const TITLE = "Free Online Tools for Resume, PDF & Documents | ResumeSathi";
const DESCRIPTION =
  "Free tools for job applications: ATS checker, merge, split and compress PDF, DOCX to PDF, signature cropper, background remover, age calculator. No signup.";
const OG_IMAGE = "/front-assets/images/og/home-og.png";

export const metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "free online tools",
    "ATS resume checker",
    "merge PDF online",
    "compress PDF",
    "split PDF",
    "DOCX to PDF",
    "image to PDF",
    "signature cropper",
    "background remover",
    "age calculator",
    "typing practice",
    "ID card maker",
  ],
  alternates: { canonical: "/tools/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/tools/",
    type: "website",
    siteName: "ResumeSathi",
    locale: "en_IN",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "ResumeSathi free career and document tools" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Career & Document Tools",
  description: DESCRIPTION,
  url: "https://www.resumesathi.com/tools/",
  isPartOf: { "@type": "WebSite", name: "ResumeSathi", url: "https://www.resumesathi.com/" },
  inLanguage: "en-IN",
};

export default function ToolsPages() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolsLists />
    </>
  );
}