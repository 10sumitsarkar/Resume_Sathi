import ResumeTypeClient from "./ResumeTypeClient";

export const metadata = {
  title: 'Build Bio-Data Instantly | ResumeSathi',
  description: 'Create a printable bio-data in minutes with ResumeSathi’s free bio-data maker using ATS-friendly templates and smart editing tools.',
  keywords: ['Build Bio-Data Instantly', 'bio-data generator', 'bio-data', 'bio-data templates'],
  alternates: { canonical: '/bio-data/resume-type/' },
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
  openGraph: {
    title: 'Build Bio-Data Instantly | ResumeSathi',
    description: 'Create a printable bio-data in minutes with ResumeSathi’s free bio-data maker using ATS-friendly templates and smart editing tools.',
    url: '/bio-data/resume-type/',
    type: 'website',
    siteName: 'ResumeSathi',
    images: [{ url: '/front-assets/images/og/home-og.png', width: 1200, height: 630, alt: 'Build Bio-Data Instantly' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Build Bio-Data Instantly | ResumeSathi',
    description: 'Create a printable bio-data in minutes with ResumeSathi’s free bio-data maker using ATS-friendly templates and smart editing tools.',
    images: ['/front-assets/images/og/home-og.png'],
  },
};

export default function ResumeTypeClientWrapper() {
  return <ResumeTypeClient />;
}
