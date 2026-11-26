import JsonLd from "./components/JsonLd";
import FloatingTypingLink from "./components/FloatingTypingLink";
import ClientScripts from "./components/ClientScripts";
import CookieConsent from "./components/CookieConsent";
import { DEFAULT_SITE_BASE } from "./lib/apiConfig";
import "./globals.css";

const SITE_URL = DEFAULT_SITE_BASE.replace(/\/+$/, "");

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Free Resume Builder, ATS Resume Templates & Career Tools | ResumeSathi',
    template: '%s | ResumeSathi',
  },
  description: 'Create ATS-friendly resumes, cover letters, and career documents for free with ResumeSathi. Explore career tools, exam guides, and expert advice.',
  openGraph: {
    title: 'Free Resume Builder, ATS Resume Templates & Career Tools',
    description: 'Create ATS-friendly resumes, cover letters, and job-ready career documents for free with ResumeSathi.',
    url: '/',
    type: 'website',
    siteName: 'ResumeSathi',
    images: [{ url: '/front-assets/images/og/home-og.webp', width: 1200, height: 630, alt: 'ResumeSathi resume builder' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Resume Builder, ATS Resume Templates & Career Tools',
    description: 'Create ATS-friendly resumes, cover letters, and job-ready career documents for free with ResumeSathi.',
    images: ['/front-assets/images/og/home-og.webp'],
  },
  icons: {
    icon: '/front-assets/images/logo/favicon.png',
    shortcut: '/front-assets/images/logo/favicon.png',
    apple: '/front-assets/images/logo/favicon.png',
    other: { rel: 'apple-touch-icon-precomposed', url: '/front-assets/images/logo/favicon.png' },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <meta charSet="utf-8" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || []; window.gtag = window.gtag || function(){window.dataLayer.push(arguments);}; window.gtag('consent', 'default', {analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied'});`,
          }}
        />
        <meta
          name="google-adsense-account"
          content="ca-pub-7914493060795219"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" href="/front-assets/css/bootstrap.min.css" as="style" />
        <link rel="preload" href="/front-assets/css/style.css" as="style" />
        <link rel="preload" href="/front-assets/css/responsive.css" as="style" />
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          as="style"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href="/front-assets/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/front-assets/css/style.css" />
        <link rel="stylesheet" href="/front-assets/css/responsive.css" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          crossOrigin="anonymous"
        />
      </head>
      <body suppressHydrationWarning>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "ResumeSathi",
            url: SITE_URL,
            logo: {
              "@type": "ImageObject",
              url: `${SITE_URL}/front-assets/images/logo/logo-512.png`,
              width: 512,
              height: 512,
            },
            sameAs: [
              "https://www.youtube.com/@Resume_Sathi",
              "https://www.facebook.com/resumesathi",
              "https://in.pinterest.com/resumesathi/",
              "https://www.instagram.com/resume_sathi/"
            ],
            description: "ResumeSathi helps job seekers create ATS-friendly resumes, cover letters, and career documents for free."
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "ResumeSathi",
            url: SITE_URL,
          }}
        />

        <main id="main-content">
          {children}
        </main>
        <FloatingTypingLink />
        <ClientScripts />
        <CookieConsent />
      </body>
    </html>
  );
}
