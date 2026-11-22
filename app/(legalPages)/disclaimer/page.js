import DisclaimerClient from './client';

export const metadata = {
  title: 'Disclaimer', 
  description:
    'Read the ResumeSathi Disclaimer to understand the limitations of our free resume builder, ATS checker, and other tools, including advertising and third-party content.',
  alternates: {
    canonical: '/disclaimer/',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Disclaimer',
    description:
      'Understand the limitations of ResumeSathi\'s tools, content, and third-party advertising.',
    url: '/disclaimer/',
    siteName: 'ResumeSathi',
    type: 'website',
        images: [{ url: "/front-assets/images/og/home-og.webp", width: 1200, height: 630, alt: "ResumeSathi resume builder" }],
  },
  twitter: {
    card: 'summary',
    title: 'Disclaimer',
    description:
      'Understand the limitations of ResumeSathi\'s tools, content, and third-party advertising.',
        images: ["/front-assets/images/og/home-og.webp"],

    },
};

export default function DisclaimerPage() {
  return <DisclaimerClient />;
}
