import UploadResume from './UploadResume';
import { DEFAULT_SITE_BASE } from '../../lib/apiConfig';

const siteUrl = DEFAULT_SITE_BASE.replace(/\/+$/, '');

export const metadata = {
  title: 'upload bio-data | ResumeSathi',
  description: 'Upload an existing bio-data and extract details into ResumeSathi’s online bio-data maker for quick editing and updating.',
  keywords: ['upload bio-data', 'bio-data parser', 'import bio-data', 'bio-data maker'],
  alternates: { canonical: `${siteUrl}/bio-data/upload-resume/` },
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
  openGraph: {
    title: 'upload bio-data | ResumeSathi',
    description: 'Upload an existing bio-data and extract details into ResumeSathi’s online bio-data maker for quick editing and updating.',
    url: `${siteUrl}/bio-data/upload-resume`,
    type: 'website',
    siteName: 'ResumeSathi',
    images: [{ url: '/front-assets/images/og/home-og.png', width: 1200, height: 630, alt: 'upload bio-data to ResumeSathi' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'upload bio-data | ResumeSathi',
    description: 'Upload an existing bio-data and extract details into ResumeSathi’s online bio-data maker for quick editing and updating.',
    images: ['/front-assets/images/og/home-og.png'],
  },
};

export default function UploadResumePage() {
  return <UploadResume />;
}
