import ContactClient from './client';

export const metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with the ResumeSathi team for support, feedback, or partnership queries. We are here to help you build a better resume and land your next job.',
  keywords: [
    'contact ResumeSathi',
    'ResumeSathi support',
    'resume builder help',
    'ResumeSathi feedback',
  ],
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
    images: [{ url: "/front-assets/images/og/home-og.png", width: 1200, height: 630, alt: "ResumeSathi resume builder" }],

  },
  twitter: {
    card: 'summary',
    title: 'Contact Us',
    description: 'Have a question or feedback? Reach out to the ResumeSathi team.',
        images: ["/front-assets/images/og/home-og.png"],

  },
};

export default function ContactPage() {
  return (
    <>
      <ContactClient />
      <section className="container-fluid custom-container py-5">
        <h2>Contact ResumeSathi</h2>
        <p>
          Contact ResumeSathi for help with the free resume builder, bio-data
          maker, resume templates, typing practice, online tools, or job update
          pages. We use support messages to fix broken pages, improve confusing
          flows, and keep important career resources useful for visitors.
        </p>
        <p>
          For the fastest help, share the page link, the action you were trying
          to complete, and the device or browser where the issue happened. You
          can also contact us for corrections, partnership queries, content
          feedback, and privacy-related requests connected to your use of
          ResumeSathi.
        </p>
        <p>
          ResumeSathi reviews feedback related to resume downloads, template
          content, job listings, tool errors, account questions, and page
          accessibility. Clear details help the team understand the problem and
          improve the website for future visitors.
        </p>
        <p>
          If your message is about a specific job update or article, include
          the title and the URL so the relevant page can be checked quickly. If
          your message is about a resume, bio-data, or PDF tool, mention the
          browser, file type, and the step where the problem appeared.
        </p>
        <p>
          We also welcome suggestions for new templates, typing lessons,
          document tools, and career resources that would help students and job
          seekers complete applications more confidently.
        </p>
      </section>
    </>
  );
}
