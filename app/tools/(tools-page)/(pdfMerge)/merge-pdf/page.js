import MergePdf from "./MergePdf";

export const metadata = {
  title: "Merge PDF | ResumeSathi",
  description: "Merge multiple PDF files online for free with ResumeSathi’s secure and simple PDF merge tool.",
  keywords: ["merge PDF", "combine PDF files", "PDF merger", "online PDF tool"],
  alternates: { canonical: "/tools/merge-pdf" },
  openGraph: {
    title: "Merge PDF | ResumeSathi",
    description: "Merge multiple PDF files online for free with ResumeSathi’s secure and simple PDF merge tool.",
    url: "/tools/merge-pdf",
    type: "website",
    siteName: "ResumeSathi",
    images: [{ url: "/front-assets/images/og/tools-og.png", width: 1200, height: 630, alt: "PDF merge tool" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Merge PDF | ResumeSathi",
    description: "Merge multiple PDF files online for free with ResumeSathi’s secure and simple PDF merge tool.",
    images: ["/front-assets/images/og/home-og.png"],
  },
};

export default function Page() {
  return <MergePdf />;
}