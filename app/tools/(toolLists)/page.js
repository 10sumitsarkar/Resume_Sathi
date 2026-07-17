import ToolsLists from "./ToolsLists";

export const metadata = {
  title: "Free Online Tools",
  description:
    "Use ResumeSathi’s free online tools to merge PDFs, generate gradients, create CSS animations, and improve your resume workflow.",
  keywords: ["free online tools", "merge PDF", "gradient generator", "CSS animation generator"],
  alternates: { canonical: "/tools" },
  openGraph: {
    title: "Free Online Tools",
    description: "Use ResumeSathi’s free online tools to merge PDFs, generate gradients, create CSS animations, and improve your resume workflow.",
    url: "/tools",
    type: "website", 
    siteName: "ResumeSathi",
    images: [{ url: "/front-assets/images/og/home-og.png", width: 1200, height: 630, alt: "ResumeSathi tools" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Tools",
    description: "Use ResumeSathi’s free online tools to merge PDFs, generate gradients, create CSS animations, and improve your resume workflow.",
    images: ["/front-assets/images/og/home-og.png"],
  },
};

export default function ToolsPages() {
  return <ToolsLists />;
}