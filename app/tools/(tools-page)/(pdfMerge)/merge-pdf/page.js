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
    images: [{ url: "/front-assets/images/resume-hero.webp", width: 1200, height: 630, alt: "PDF merge tool" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Merge PDF | ResumeSathi",
    description: "Merge multiple PDF files online for free with ResumeSathi’s secure and simple PDF merge tool.",
    images: ["/front-assets/images/resume-hero.webp"],
  },
};

export default function Page() {
  return <MergePdf />;
}