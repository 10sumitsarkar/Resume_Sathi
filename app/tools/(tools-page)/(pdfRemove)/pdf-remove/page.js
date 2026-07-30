import PdfRemove from "./PdfRemoveClient";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.resumesathi.com";

export const metadata = {
  title: "Remove PDF Pages",
  description:
    "Remove unwanted pages from a PDF online for free with ResumeSathi's secure browser-based PDF page remover.",
  keywords: ["remove PDF pages", "delete PDF pages", "PDF page remover", "online PDF tool"],
  alternates: { canonical: `${siteUrl}/tools/pdf-remove` },
  openGraph: {
    title: "Remove PDF Pages",
    description: "Delete unwanted pages from a PDF and download a clean PDF file.",
    url: `${siteUrl}/tools/pdf-remove`,
    type: "website",
    siteName: "ResumeSathi",
    images: [
      {
        url: "/front-assets/images/og/tools-og.png",
        width: 1200,
        height: 630,
        alt: "Remove PDF pages tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Remove PDF Pages",
    description: "Remove unwanted PDF pages securely in your browser.",
    images: ["/front-assets/images/og/tools-og.png"],
  },
};

export default function Page() {
  return <PdfRemove />;
}
