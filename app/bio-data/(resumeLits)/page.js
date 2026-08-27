import ResumeLists from "./ResumeLists";

export const metadata = {
  title: 'Free Bio-Data Maker | ResumeSathi',
  description: 'Create a clean printable bio-data with personal details, education, extra qualification, and work details.',
  keywords: ['bio data maker', 'bioData format', 'free bioData builder', 'printable bio data'],
  alternates: { canonical: '/bio-data/' },
  openGraph: {
    title: 'Free Bio-Data Maker | ResumeSathi',
    description: 'Create a clean printable bio-data with personal details, education, extra qualification, and work details.',
    url: '/bio-data',
    type: 'website',
    siteName: 'ResumeSathi',
    images: [{ url: '/front-assets/images/og/home-og.png', width: 1200, height: 630, alt: 'ResumeSathi bio-data maker' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Bio-Data Maker | ResumeSathi',
    description: 'Create a clean printable bio-data with personal details, education, extra qualification, and work details.',
    images: ['/front-assets/images/og/home-og.png'],
  },
};

export default function ResumeTypeClientWrapper() {
  return <ResumeLists />;
}
