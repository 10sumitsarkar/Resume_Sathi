import Script from "next/script";
import Link from "next/link";
import JsonLd from "./components/JsonLd";
import FloatingTypingLink from "./components/FloatingTypingLink";
import { DEFAULT_SITE_BASE } from "./lib/apiConfig";

const SITE_URL = DEFAULT_SITE_BASE.replace(/\/+$/, "");

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Free Resume Builder, ATS Resume Templates & Career Tools | ResumeSathi',
    template: '%s | ResumeSathi',
  },
  description: 'Create ATS-friendly resumes, cover letters, and job-ready career documents for free with ResumeSathi. Explore career tools, job updates, and expert advice.',
  keywords: ['resume builder', 'ATS resume', 'free resume templates', 'career blog', 'job search tools', 'cover letter builder'],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Free Resume Builder, ATS Resume Templates & Career Tools',
    description: 'Create ATS-friendly resumes, cover letters, and job-ready career documents for free with ResumeSathi.',
    url: '/',
    type: 'website',
    siteName: 'ResumeSathi',
    images: [{ url: '/front-assets/images/og/home-og.png', width: 1200, height: 630, alt: 'ResumeSathi resume builder' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Resume Builder, ATS Resume Templates & Career Tools',
    description: 'Create ATS-friendly resumes, cover letters, and job-ready career documents for free with ResumeSathi.',
    images: ['/front-assets/images/og/home-og.png'],
  },
  icons: {
    icon: '/front-assets/images/logo/favicon.png',
    shortcut: '/front-assets/images/logo/favicon.png',
    apple: '/front-assets/images/logo/favicon.png',
    other: { rel: 'apple-touch-icon-precomposed', url: '/front-assets/images/logo/favicon.png' },
  },
};

const GA_MEASUREMENT_ID = "G-GMDRJBQDWL";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" href="/front-assets/css/bootstrap.min.css" as="style" />
        <link rel="preload" href="/front-assets/css/style.css" as="style" />
        <link rel="preload" href="/front-assets/css/responsive.css" as="style" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/front-assets/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/front-assets/css/style.css" />
        <link rel="stylesheet" href="/front-assets/css/responsive.css" />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="beforeInteractive"
        />
        <Script id="google-analytics" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </head>
      <body suppressHydrationWarning>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "ResumeSathi",
            url: SITE_URL,
            logo: `${SITE_URL}/front-assets/images/logo/logo.svg`,
            sameAs: [
              "https://www.facebook.com",
              "https://www.linkedin.com",
              "https://www.instagram.com"
            ],
            description: "ResumeSathi helps job seekers create ATS-friendly resumes, cover letters, and career documents for free."
          }}
        />

        {children}
        <FloatingTypingLink />
        <Script src="/api-config.js" strategy="beforeInteractive" />
        <Script src="/front-assets/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
