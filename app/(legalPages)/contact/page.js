import ContactClient from './client';

export const metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with the ResumeSathi team for support, feedback, or partnership queries. We are here to help you build a better resume and land your next job.',
  alternates: {
    canonical: '/contact/',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Contact Us',
    description:
      'Have a question or feedback? Reach out to the ResumeSathi team.',
    url: '/contact/',
    siteName: 'ResumeSathi',
    type: 'website',
    images: [{ url: "/front-assets/images/og/home-og.webp", width: 1200, height: 630, alt: "ResumeSathi resume builder" }],

  },
  twitter: {
    card: 'summary',
    title: 'Contact Us',
    description: 'Have a question or feedback? Reach out to the ResumeSathi team.',
        images: ["/front-assets/images/og/home-og.webp"],

  },
};

export default function ContactPage() {
  return (
    <>
      <ContactClient />
    </>
  );
}
