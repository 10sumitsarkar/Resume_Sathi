import Script from "next/script";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'),
  title: {
    default: 'Logichook | Resume Builder & Career Tools',
    template: '%s | Logichook',
  },
  description: 'Create ATS-friendly resumes, explore career tools, and read expert blog articles with Logichook.',
  keywords: ['resume builder', 'ATS resume', 'career blog', 'job search tools'],
  openGraph: {
    title: 'Logichook | Resume Builder & Career Tools',
    description: 'Create ATS-friendly resumes, explore career tools, and read expert blog articles with Logichook.',
    url: '/',
    type: 'website',
    siteName: 'Logichook',
    images: [{ url: '/front-assets/images/resume-hero.webp', width: 1200, height: 630, alt: 'Logichook' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Logichook | Resume Builder & Career Tools',
    description: 'Create ATS-friendly resumes, explore career tools, and read expert blog articles with Logichook.',
    images: ['/front-assets/images/resume-hero.webp'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="stylesheet" href="/front-assets/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/front-assets/css/style.css" />
        <link rel="stylesheet" href="/front-assets/css/responsive.css" />
      </head>
      <body suppressHydrationWarning>

        {children}

   <Script src="/front-assets/js/bootstrap.bundle.min.js" defer />
 
      </body>
    </html>
  );
}
