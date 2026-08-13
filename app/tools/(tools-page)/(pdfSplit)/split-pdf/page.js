import SplitPdf from "./SplitPdf";
import { DEFAULT_SITE_BASE } from "../../../../lib/apiConfig";

const siteUrl = DEFAULT_SITE_BASE.replace(/\/+$/, "");

export const metadata = {
  title: "Split PDF",
  description: "Split PDF files online for free. Extract selected pages from a PDF securely in your browser.",
  keywords: ["split PDF", "extract PDF pages", "PDF splitter", "online PDF tool"],
  alternates: { canonical: `${siteUrl}/tools/split-pdf/` },
  openGraph: {
    title: "Split PDF",
    description: "Split PDF files online for free with ResumeSathi's PDF splitter.",
    url: `${siteUrl}/tools/split-pdf`,
    type: "website",
    siteName: "ResumeSathi",
    images: [{ url: "/front-assets/images/og/tools-og.png", width: 1200, height: 630, alt: "PDF split tool" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Split PDF",
    description: "Extract selected pages from a PDF securely in your browser.",
    images: ["/front-assets/images/og/tools-og.png"],
  },
};

export default function Page() {
  return <SplitPdf />;
}
