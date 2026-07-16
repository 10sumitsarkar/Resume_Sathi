import ResumeTypeClient from "./ResumeTypeClient";

export const metadata = {
  title: 'Build Resume Instantly | ResumeSathi',
  description: 'Create a professional resume in minutes with ResumeSathi’s free resume builder using ATS-friendly templates and smart editing tools.',
  keywords: ['build resume instantly', 'resume generator', 'ATS resume', 'resume templates'],
  alternates: { canonical: '/resume/resume-type' },
  openGraph: {
    title: 'Build Resume Instantly | ResumeSathi',
    description: 'Create a professional resume in minutes with ResumeSathi’s free resume builder using ATS-friendly templates and smart editing tools.',
    url: '/resume/resume-type',
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
  return <ResumeTypeClient />;
}
