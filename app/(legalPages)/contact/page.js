import ContactClient from './client';

export const metadata = {
  title: 'Contact Us | ResumeSathi',
  description:
    'Get in touch with the ResumeSathi team for support, feedback, or partnership queries. We are here to help you build a better resume and land your next job.',
  keywords: [
    'contact ResumeSathi',
    'ResumeSathi support',
    'resume builder help',
    'ResumeSathi feedback',
  ],
  alternates: {
    canonical: '/contact',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Contact Us | ResumeSathi',
    description:
      'Have a question or feedback? Reach out to the ResumeSathi team.',
    url: '/contact',
    siteName: 'ResumeSathi',
    type: 'website',
    images: [{ url: "/front-assets/images/og/home-og.png", width: 1200, height: 630, alt: "ResumeSathi resume builder" }],

  },
  twitter: {
    card: 'summary',
    title: 'Contact Us | ResumeSathi',
    description: 'Have a question or feedback? Reach out to the ResumeSathi team.',
        images: ["/front-assets/images/og/home-og.png"],

  },
};

export default function ContactPage() {
  return <ContactClient />;
}
