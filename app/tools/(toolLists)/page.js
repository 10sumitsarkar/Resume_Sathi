import ToolsLists from "./ToolsLists";

export const metadata = {
  title: "Free Online Tools",
  description:
    "Use ResumeSathi’s free online tools to merge PDFs, generate gradients, create CSS animations, and improve your resume workflow.",
  keywords: ["free online tools", "merge PDF", "gradient generator", "CSS animation generator"],
  alternates: { canonical: "/tools/" },
  openGraph: {
    title: "Free Online Tools",
    description: "Use ResumeSathi’s free online tools to merge PDFs, generate gradients, create CSS animations, and improve your resume workflow.",
    url: "/tools/",
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
  return (
    <>
      <ToolsLists />
      <section className="container-fluid custom-container py-5">
        <h2>Free Online Tools</h2>
        <p>
          ResumeSathi tools help students, job seekers, and small teams finish
          everyday browser tasks without installing extra software. You can
          merge PDF files, generate CSS gradients, create animation snippets,
          and use simple utilities that support resume building, portfolios,
          forms, and online applications.
        </p>
        <p>
          Every tool is designed to be quick, practical, and easy to understand.
          Use the PDF tools when a job portal asks for one combined document,
          use the design tools when you need clean website styling, and return
          to the resume builder when you are ready to prepare a complete job
          application.
        </p>
      </section>
    </>
  );
}
