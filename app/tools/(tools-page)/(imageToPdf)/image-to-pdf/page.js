import ImageToPdf from "./ImageToPdf";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.resumesathi.com";

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
