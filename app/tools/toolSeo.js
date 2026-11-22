import Link from "next/link";
import JsonLd from "../components/JsonLd";
import { DEFAULT_SITE_BASE } from "../lib/apiConfig";

const SITE_URL = DEFAULT_SITE_BASE.replace(/\/+$/, "");

export const TOOL_SEO = {
  "/tools/age-calculator/": {
    name: "Age Calculator",
    title: "Online Age Calculator: Calculate Your Age | ResumeSathi",
    description:
      "Calculate your exact age in years, months, and days from your date of birth. Enter the dates in the online age calculator and check the result instantly.",
    applicationCategory: "UtilitiesApplication",
  },
  "/tools/ats-checker/": {
    name: "ATS Resume Checker",
    title: "ATS Resume Checker: Analyze Keywords & Format | ResumeSathi",
    description:
      "Check your resume's ATS readability, keyword match, and formatting. Upload a resume and review practical suggestions before tailoring it to a job.",
    applicationCategory: "BusinessApplication",
  },
  "/tools/background-remover/": {
    name: "Background Remover",
    title: "Background Remover: Make PNG Transparent | ResumeSathi",
    description:
      "Remove a plain image background in your browser and download a transparent PNG. Upload an image, review the cutout, and save it for your next design.",
    applicationCategory: "DesignApplication",
  },
  "/tools/css-animations/": {
    name: "CSS Animation Generator",
    title: "CSS Animation Generator: Build Web Effects | ResumeSathi",
    description:
      "Create CSS animations for a website, landing page, or resume project. Adjust the effect, preview the result, and copy CSS for your design.",
    applicationCategory: "DesignApplication",
    robots: { index: false, follow: true },
  },
  "/tools/docx-to-pdf/": {
    name: "DOCX to PDF Converter",
    title: "DOCX to PDF Converter: Convert Word Files | ResumeSathi",
    description:
      "Convert a Word DOCX document to PDF in your browser. Select a file, process it online, and download a PDF that is ready to share or print.",
    applicationCategory: "UtilitiesApplication",
  },
  "/tools/gradient-generator/": {
    name: "CSS Gradient Generator",
    title: "CSS Gradient Generator: Create Backgrounds | ResumeSathi",
    description:
      "Create gradient backgrounds for resumes, portfolios, and web projects. Adjust colors and direction, preview the result, and copy the generated CSS.",
    applicationCategory: "DesignApplication",
    robots: { index: false, follow: true },
  },
  "/tools/image-to-pdf/": {
    name: "Image to PDF Converter",
    title: "Image to PDF Converter: Convert JPG & PNG | ResumeSathi",
    description:
      "Convert JPG and PNG images into a PDF in your browser. Add images, arrange their order, and download the finished document without uploading your files.",
    applicationCategory: "UtilitiesApplication",
  },
  "/tools/id-card-maker/": {
    name: "ID Card Maker",
    title: "ID Card Maker: Create Editable ID Cards | ResumeSathi",
    description:
      "Create school, employee, visitor, event, or volunteer ID cards with editable front and back templates. Customize designs in your browser and download print-ready images.",
    applicationCategory: "DesignApplication",
  },
  "/tools/merge-pdf/": {
    name: "Merge PDF",
    title: "Merge PDF Online Free: Combine PDF Files | ResumeSathi",
    description:
      "Combine multiple PDF files into one document online. Select and arrange your files, merge them in your browser, then download the combined PDF.",
    applicationCategory: "UtilitiesApplication",
  },
  "/tools/pdf-compressor/": {
    name: "PDF Compressor",
    title: "Compress PDF Online: Reduce File Size | ResumeSathi",
    description:
      "Reduce PDF file size online while adjusting compression options. Choose a file, review available settings, and download the compressed document.",
    applicationCategory: "UtilitiesApplication",
  },
  "/tools/pdf-remove/": {
    name: "PDF Page Remover",
    title: "Remove PDF Pages Online: Delete Pages | ResumeSathi",
    description:
      "Delete selected pages from a PDF in your browser. Choose the pages to remove, save the updated document, and download the resulting file.",
    applicationCategory: "UtilitiesApplication",
  },
  "/tools/signature-cropper/": {
    name: "Signature Cropper",
    title: "Signature Cropper: Resize and Fit Images | ResumeSathi",
    description:
      "Crop a signature image to a custom width and height in your browser. Upload the image, adjust the crop, and download the result for forms and documents.",
    applicationCategory: "UtilitiesApplication",
  },
  "/tools/split-pdf/": {
    name: "Split PDF",
    title: "Split PDF Online: Extract Selected Pages | ResumeSathi",
    description:
      "Split a PDF online by selecting the pages you need. Extract chosen pages into separate files, then download the results from your browser.",
    applicationCategory: "UtilitiesApplication",
  },
};

export function getToolMetadata(path) {
  const tool = TOOL_SEO[path];
  if (!tool) throw new Error(`Unknown tool metadata path: ${path}`);

  return {
    title: { absolute: tool.title },
    description: tool.description,
    alternates: { canonical: path },
    robots: tool.robots || { index: true, follow: true },
    openGraph: {
      title: tool.title,
      description: tool.description,
      url: path,
      type: "website",
      siteName: "ResumeSathi",
      images: [
        {
          url: "/front-assets/images/og/tools-og.webp",
          width: 1200,
          height: 630,
          alt: tool.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: tool.title,
      description: tool.description,
      images: ["/front-assets/images/og/tools-og.webp"],
    },
  };
}

function getToolBreadcrumbItems(path) {
  const tool = TOOL_SEO[path];
  if (!tool) throw new Error(`Unknown tool breadcrumb path: ${path}`);

  return [
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools/" },
    { name: tool.name, path },
  ];
}

export function ToolJsonLd({ path }) {
  const tool = TOOL_SEO[path];
  if (!tool) throw new Error(`Unknown tool schema path: ${path}`);
  const breadcrumbItems = getToolBreadcrumbItems(path);

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebApplication",
            name: tool.name,
            url: `${SITE_URL}${path}`,
            applicationCategory: tool.applicationCategory,
            operatingSystem: "Web",
            description: tool.description,
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "INR",
            },
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: breadcrumbItems.map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: item.name,
              item: `${SITE_URL}${item.path}`,
            })),
          },
        ],
      }}
    />
  );
}

export function ToolBreadcrumbNav({ path }) {
  const breadcrumbItems = getToolBreadcrumbItems(path);

  return (
    <nav className="rs-tool-breadcrumb container-fluid custom-container" aria-label="Breadcrumb">
      <ol>
        {breadcrumbItems.map((item, index) => (
          <li
            key={item.path}
            aria-current={index === breadcrumbItems.length - 1 ? "page" : undefined}
          >
            {index === breadcrumbItems.length - 1 ? (
              <span>{item.name}</span>
            ) : (
              <Link href={item.path}>{item.name}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function ToolBreadcrumb({ path }) {
  return (
    <>
      <ToolJsonLd path={path} />
      <ToolBreadcrumbNav path={path} />
    </>
  );
}
