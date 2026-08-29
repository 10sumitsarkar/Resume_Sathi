import TermsClient from './client';

export const metadata = {
  title: 'Terms & Conditions',
  description:
    'Read the Terms and Conditions for using ResumeSathi, including user responsibilities, allowed use, account rules, and platform policies.',
  keywords: [
    'ResumeSathi terms and conditions',
    'resume builder terms of use',
    'ResumeSathi user agreement',
  ],
  alternates: {
    canonical: '/terms-and-conditions/',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Terms & Conditions',
    description:
      'Understand the terms of use governing your access to ResumeSathi.',
    url: '/terms-and-conditions/',
    siteName: 'ResumeSathi', 
    type: 'website',
        images: [{ url: "/front-assets/images/og/home-og.png", width: 1200, height: 630, alt: "ResumeSathi resume builder" }],
  },
  twitter: {
    card: 'summary',
    title: 'Terms & Conditions',
    description:
      'Understand the terms of use governing your access to ResumeSathi.',
      images: ["/front-assets/images/og/home-og.png"],
  },
};

export default function TermsPage() {
  return <TermsClient />;
}
