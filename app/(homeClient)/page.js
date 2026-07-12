import ResumeListClient from "./homeClient";

export const metadata = {
  title: "Free Resume Builder & ATS-Friendly Resume Templates | ResumeSathi",
  description:
    "Create professional, ATS-friendly resumes for free with ResumeSathi. Build a resume, cover letter, and job-ready documents in minutes.",
  keywords: [
    "resume builder",
    "free resume maker",
    "ATS resume",
    "cover letter builder",
    "job search tools",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Free Resume Builder for Jobs & Career Growth | ResumeSathi",
    description:
      "Create ATS-friendly resumes, cover letters, and job-ready career documents for free with ResumeSathi.",
    url: "/",
    type: "website",
    siteName: "ResumeSathi",
    images: [{ url: "/front-assets/images/resume-hero.webp", width: 1200, height: 630, alt: "ResumeSathi resume builder" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Resume Builder for Jobs & Career Growth | ResumeSathi",
    description:
      "Create ATS-friendly resumes, cover letters, and job-ready career documents for free with ResumeSathi.",
    images: ["/front-assets/images/resume-hero.webp"],
  },
};

export default function Page() {
  return <ResumeListClient />;
}