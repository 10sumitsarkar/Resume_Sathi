import { Suspense } from 'react';
import ShowResume from './ShowResumeClient';

export const metadata = {
  title: 'Resume Preview | ResumeSathi',
  description: 'Preview your resume before download and fine-tune the layout, formatting, and content with ResumeSathi’s resume preview tool.',
  keywords: ['resume preview', 'resume template preview', 'download resume preview'],
  alternates: { canonical: '/bio-data/preview/' },
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
  openGraph: {
    title: 'Resume Preview | ResumeSathi',
    description: 'Preview your resume before download and fine-tune the layout, formatting, and content with ResumeSathi’s resume preview tool.',
    url: '/bio-data/preview',
    type: 'website',
    siteName: 'ResumeSathi',
    images: [{ url: '/front-assets/images/og/home-og.png', width: 1200, height: 630, alt: 'Bio-data preview before download' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resume Preview | ResumeSathi',
    description: 'Preview your resume before download and fine-tune the layout, formatting, and content with ResumeSathi’s resume preview tool.',
    images: ['/front-assets/images/og/home-og.png'],
  },
};

export default function ResumePreviewPage() {
    return (
                 <Suspense fallback={
         <div className='loader-div'>
          <div className='loader-inner-div'>
            <div className="box" id="loader1"></div>
            <div className="box" id="loader2"></div>
            <div className="box" id="loader3"></div>
            <div className="box" id="loader4"></div>
            <div className="box" id="loader5"></div>
          </div>
         </div>
        }>
                 <ShowResume />;
                 </Suspense>
               );
}
