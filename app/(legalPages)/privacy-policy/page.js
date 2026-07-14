import PrivacyPolicyClient from './client';

export const metadata = {
  title: 'Privacy Policy | ResumeSathi',
  description:
    'Read the ResumeSathi Privacy Policy to understand how we collect, use, store, and protect your personal information while you build resumes on our free, ATS-optimized platform.',
  keywords: [
    'ResumeSathi privacy policy',
    'resume builder privacy',
    'data protection resume maker',
    'ResumeSathi data security',
  ],
  alternates: {
    canonical: '/privacy-policy',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Privacy Policy | ResumeSathi',
    description:
      'Learn how ResumeSathi collects, uses, and protects your personal information.',
    url: '/privacy-policy',
    siteName: 'ResumeSathi',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Privacy Policy | ResumeSathi',
    description:
      'Learn how ResumeSathi collects, uses, and protects your personal information.',
  },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />;
}
