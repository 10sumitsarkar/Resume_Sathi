import GradientGenerator from "./GradientGenerator";

export const metadata = {
  title: 'Gradient Generator | ResumeSathi',
  description: 'Create stunning gradient backgrounds for resumes, portfolios, and web projects with ResumeSathi’s free gradient generator tool.',
  keywords: ['gradient generator', 'linear gradient tool', 'background gradient', 'CSS gradient generator'],
  alternates: { canonical: '/tools/gradient-generator/' },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Gradient Generator | ResumeSathi',
    description: 'Create stunning gradient backgrounds for resumes, portfolios, and web projects with ResumeSathi’s free gradient generator tool.',
    url: '/tools/gradient-generator/',
    type: 'website',
    siteName: 'ResumeSathi',
    images: [{ url: '/front-assets/images/og/home-og.png', width: 1200, height: 630, alt: 'Gradient generator tool' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gradient Generator | ResumeSathi',
    description: 'Create stunning gradient backgrounds for resumes, portfolios, and web projects with ResumeSathi’s free gradient generator tool.',
    images: ['/front-assets/images/og/home-og.png'],
  },
};

export default function ResumeTypeClientWrapper() {
  return <GradientGenerator />;
}
