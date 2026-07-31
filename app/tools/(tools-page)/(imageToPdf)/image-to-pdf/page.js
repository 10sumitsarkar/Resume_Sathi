import ImageToPdf from "./ImageToPdf";
import { DEFAULT_SITE_BASE } from "../../../../lib/apiConfig";

const siteUrl = DEFAULT_SITE_BASE.replace(/\/+$/, "");

export const metadata = {
  title: "Image to PDF",
  description: "Convert JPG and PNG images to PDF online for free in your browser.",
  keywords: ["image to PDF", "JPG to PDF", "PNG to PDF", "online PDF tool"],
  alternates: { canonical: `${siteUrl}/tools/image-to-pdf` },
  openGraph: {
    title: "Image to PDF",
    description: "Convert JPG and PNG images to PDF online for free.",
    url: `${siteUrl}/tools/image-to-pdf`,
    type: "website",
    siteName: "ResumeSathi",
    images: [{ url: "/front-assets/images/og/tools-og.png", width: 1200, height: 630, alt: "Image to PDF tool" }],
  },
  twitter: { card: "summary_large_image", title: "Image to PDF", description: "Convert images to PDF online.", images: ["/front-assets/images/og/tools-og.png"] },
};

export default function Page() {
  return <ImageToPdf />;
}
