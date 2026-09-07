import ResumeTypeClient from "./ResumeTypeClient";

export const metadata = {
  title: 'Build Resume Instantly | ResumeSathi',
  description: 'Create a professional resume in minutes with ResumeSathi’s free resume builder using ATS-friendly templates and smart editing tools.',
  keywords: ['build resume instantly', 'resume generator', 'ATS resume', 'resume templates'],
  alternates: { canonical: '/resume/resume-type/' },
  openGraph: {
    title: 'Build Resume Instantly | ResumeSathi',
    description: 'Create a professional resume in minutes with ResumeSathi’s free resume builder using ATS-friendly templates and smart editing tools.',
    url: '/resume/resume-type/',
    type: 'website',
    siteName: 'ResumeSathi',
    images: [{ url: '/front-assets/images/og/home-og.png', width: 1200, height: 630, alt: 'Build resume instantly' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Build Resume Instantly | ResumeSathi',
    description: 'Create a professional resume in minutes with ResumeSathi’s free resume builder using ATS-friendly templates and smart editing tools.',
    images: ['/front-assets/images/og/home-og.png'],
  },
};

export default function ResumeTypeClientWrapper() {
  return (
    <>
      <h1 className="visually-hidden">Build Resume Instantly</h1>
      <noscript
        dangerouslySetInnerHTML={{
          __html: `<section><h2>Choose how you want to build your resume</h2><p>ResumeSathi gives job seekers a simple way to start a resume from a guided builder. This page helps you choose the resume creation flow before entering personal details, summary, education, experience, skills, and other important resume sections.</p><p>A good resume starts with the right structure. Use this step to begin a resume that is easy to scan, clear for recruiters, and ready for common job applications. After selecting the resume flow, you can complete each section and preview the selected template before downloading.</p><ul><li>Start a fresh resume with guided sections.</li><li>Continue toward template selection and resume preview.</li><li>Create a resume suitable for fresher and experienced profiles.</li></ul></section>`,
        }}
      />
      <ResumeTypeClient />
    </>
  );
}
