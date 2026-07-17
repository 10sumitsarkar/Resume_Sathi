
import AtsChecker from "./atsChecker";

export const metadata = {
  title: "ATS Resume Checker", 
  description: "Analyze your resume ATS score, keyword match, and formatting quality with ResumeSathi’s free ATS checker tool.",
  keywords: ["ATS resume checker", "resume ATS score", "keyword matching", "resume optimization"],
  alternates: { canonical: "/tools/ats-checker" },
  openGraph: {
    title: "ATS Resume Checker",
    description: "Analyze your resume ATS score, keyword match, and formatting quality with ResumeSathi’s free ATS checker tool.",
    url: "/tools/ats-checker",
    type: "website",
    siteName: "ResumeSathi",
    images: [{ url: "/front-assets/images/og/tools-og.png", width: 1200, height: 630, alt: "ATS resume checker tool" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ATS Resume Checker",
    description: "Analyze your resume ATS score, keyword match, and formatting quality with ResumeSathi’s free ATS checker tool.",
    images: ["/front-assets/images/og/tools-og.png"],
  },
};

export default function Page() {
    return <AtsChecker />;
}
