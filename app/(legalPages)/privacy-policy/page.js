import PrivacyPolicyClient from './client';

export const metadata = {
  title: 'Privacy Policy | ResumeSathi Resume & Bio-Data Maker',
  description:
    'Read the ResumeSathi Privacy Policy to understand how we collect, use, store, and protect your personal information while you build resumes and bio-data on our free platform.',
  keywords: [
    'ResumeSathi privacy policy',
    'resume builder privacy',
    'bio data maker privacy',
    'bio data local storage',
    'data protection resume maker',
    'ResumeSathi data security',
  ],
  alternates: {
    canonical: '/privacy-policy/',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Privacy Policy | ResumeSathi Resume & Bio-Data Maker',
    description:
      'Learn how ResumeSathi handles resume and bio-data information, local storage, contact data, and privacy choices.',
    url: '/privacy-policy/',
    siteName: 'ResumeSathi',
    type: 'website',
        images: [{ url: "/front-assets/images/og/home-og.png", width: 1200, height: 630, alt: "ResumeSathi resume builder" }],
  },
  twitter: {
    card: 'summary',
    title: 'Privacy Policy | ResumeSathi Resume & Bio-Data Maker',
    description:
      'Learn how ResumeSathi handles resume and bio-data information, local storage, contact data, and privacy choices.',
        images: ["/front-assets/images/og/home-og.png"],

    },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />;
}
