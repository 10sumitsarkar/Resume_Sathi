import ResumeLists from "./ResumeLists";

export const metadata = {
  title: 'Free Resume Builder | ResumeSathi',
  description: 'Create a professional resume in minutes with ResumeSathi’s free resume builder using ATS-friendly templates and smart editing tools.',
  keywords: ['resume builder', 'free resume maker', 'ATS resume templates', 'professional resume'],
  alternates: { canonical: '/resume' },
  openGraph: {
    title: 'Free Resume Builder | ResumeSathi',
    description: 'Create a professional resume in minutes with ResumeSathi’s free resume builder using ATS-friendly templates and smart editing tools.',
    url: '/resume',
    type: 'website',
    siteName: 'ResumeSathi',
    images: [{ url: '/front-assets/images/og/home-og.png', width: 1200, height: 630, alt: 'ResumeSathi resume builder' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Resume Builder | ResumeSathi',
    description: 'Create a professional resume in minutes with ResumeSathi’s free resume builder using ATS-friendly templates and smart editing tools.',
    images: ['/front-assets/images/og/home-og.png'],
  },
};

export default function ResumeTypeClientWrapper() {
  return <ResumeLists />;
}
