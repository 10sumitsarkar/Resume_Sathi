import AboutClient from './client';

export const metadata = {
  title: 'About Us',
  description:
    'Learn about ResumeSathi — a free, ATS-optimized resume builder built to help job seekers everywhere. Discover our mission, values, and why thousands trust us to build their career documents.',
  keywords: [
    'about ResumeSathi',
    'ResumeSathi mission',
    'free resume builder online',
    'ResumeSathi story',
  ],
  alternates: {
    canonical: '/about',
  },
  robots: {
    index: true,
    follow: true, 
  },
  openGraph: {
    title: 'About Us',
    description:
      'ResumeSathi is a free, ATS-optimized resume builder built for job seekers everywhere.',
    url: '/about',
    siteName: 'ResumeSathi',
    type: 'website',
    images: [{ url: "/front-assets/images/og/home-og.png", width: 1200, height: 630, alt: "ResumeSathi resume builder" }],
  },
  twitter: {
    card: 'summary',
    title: 'About Us',
    description:
      'ResumeSathi is a free, ATS-optimized resume builder built for job seekers everywhere.',
      images: ["/front-assets/images/og/home-og.png"],

    },
};

export default function AboutPage() {
  return <AboutClient />;
}