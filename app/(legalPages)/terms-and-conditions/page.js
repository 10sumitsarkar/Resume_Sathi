import TermsClient from './client';

export const metadata = {
  title: 'Terms & Conditions | ResumeSathi',
  description:
    'Read the Terms and Conditions for using ResumeSathi, the free ATS-optimized resume builder. Understand your rights, responsibilities, and our usage policies before you build your resume.',
  keywords: [
    'ResumeSathi terms and conditions',
    'resume builder terms of use',
    'ResumeSathi user agreement',
  ],
  alternates: {
    canonical: '/terms-and-conditions',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Terms & Conditions | ResumeSathi',
    description:
      'Understand the terms of use governing your access to ResumeSathi.',
    url: '/terms-and-conditions',
    siteName: 'ResumeSathi',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Terms & Conditions | ResumeSathi',
    description:
      'Understand the terms of use governing your access to ResumeSathi.',
  },
};

export default function TermsPage() {
  return <TermsClient />;
}
