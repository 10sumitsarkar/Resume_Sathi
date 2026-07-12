import ShowResume from './ShowResumeClient';


export const metadata = {
  title: 'Resume Preview | ResumeSathi',
  description: 'Preview your resume before download and fine-tune the layout, formatting, and content with ResumeSathi’s resume preview tool.',
  keywords: ['resume preview', 'resume template preview', 'download resume preview'],
  alternates: { canonical: '/resume/preview' },
  openGraph: {
    title: 'Resume Preview | ResumeSathi',
    description: 'Preview your resume before download and fine-tune the layout, formatting, and content with ResumeSathi’s resume preview tool.',
    url: '/resume/preview',
    type: 'website',
    siteName: 'ResumeSathi',
    images: [{ url: '/front-assets/images/resume-hero.webp', width: 1200, height: 630, alt: 'Resume preview before download' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resume Preview | ResumeSathi',
    description: 'Preview your resume before download and fine-tune the layout, formatting, and content with ResumeSathi’s resume preview tool.',
    images: ['/front-assets/images/resume-hero.webp'],
  },
};

export default function ResumePreviewPage() {
  return <ShowResume />;
}