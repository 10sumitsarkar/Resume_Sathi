import PdfCompressor from "./PdfCompressor";

export const metadata = {
  title: "Compress PDF",
  description: "Compress PDF files online for free with ResumeSathi's secure and simple PDF compression tool.",
  keywords: ["compress PDF", "reduce PDF size", "PDF compressor", "online PDF tool"],
  alternates: { canonical: "/tools/compress-pdf" },
  openGraph: {
    title: "Compress PDF",
    description: "Compress PDF files online for free with ResumeSathi's secure and simple PDF compression tool.",
    url: "/tools/compress-pdf",
    type: "website",
    siteName: "ResumeSathi",
    images: [{ url: "/front-assets/images/og/tools-og.png", width: 1200, height: 630, alt: "PDF compress tool" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Compress PDF",
    description: "Compress PDF files online for free with ResumeSathi's secure and simple PDF compression tool.",
    images: ["/front-assets/images/og/home-og.png"],
  },
};

export default function Page() {
  return <PdfCompressor />;
}