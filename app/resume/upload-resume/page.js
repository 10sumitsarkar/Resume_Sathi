import UploadResume from './UploadResume';

export const metadata = {
  title: 'Upload Resume | ResumeSathi',
  description: 'Upload an existing resume and extract details into ResumeSathi’s online resume builder for quick editing and updating.',
  keywords: ['upload resume', 'resume parser', 'import resume', 'resume builder'],
  alternates: { canonical: '/resume/upload-resume' },
  openGraph: {
    title: 'Upload Resume | ResumeSathi',
    description: 'Upload an existing resume and extract details into ResumeSathi’s online resume builder for quick editing and updating.',
    url: '/resume/upload-resume',
    type: 'website',
    siteName: 'ResumeSathi',
    images: [{ url: '/front-assets/images/og/home-og.png', width: 1200, height: 630, alt: 'Upload resume to ResumeSathi' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Upload Resume | ResumeSathi',
    description: 'Upload an existing resume and extract details into ResumeSathi’s online resume builder for quick editing and updating.',
    images: ['/front-assets/images/og/home-og.png'],
  },
};

export default function UploadResumePage() {
  return <UploadResume />;
}
