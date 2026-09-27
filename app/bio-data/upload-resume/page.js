import UploadResume from './UploadResume';
import Footer from '../../components/Footer';
import FooterNav from '../../components/FooterNav';
import {
  Banner468x60,
  Banner300x250,
  Banner160x300,
  Banner160x600,
  Banner320x50,
  Banner728x90,
} from '../../components/ads';
import { DEFAULT_SITE_BASE } from '../../lib/apiConfig';

const siteUrl = DEFAULT_SITE_BASE.replace(/\/+$/, '');

function BioDataAdPlacement({ name, children }) {
  return (
    <div
      className="d-flex flex-column align-items-center gap-2 my-4"
      role="region"
      aria-label={`${name} ad placement`}
    >
      <span className="text-muted small">Ad test: {name}</span>
      {children}
    </div>
  );
}

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
  return (
    <>
      <UploadResume />
      <section className="resume-content container-fluid custom-container pb-5 rk-article-text">
        <h2>Free Bio-Data Maker</h2>
        <p>
          Upload an existing bio-data to reuse your details and quickly prepare
          an updated version in ResumeSathi. This is useful when you already
          have old information but want a cleaner printable format.
        </p>
        <p>
          Check names, dates, contact details, education, work details, and
          family or background information before downloading the final file.
        </p>
        <BioDataAdPlacement name="Banner 468x60">
          <Banner468x60 />
        </BioDataAdPlacement>
        <BioDataAdPlacement name="Banner 300x250">
          <Banner300x250 />
        </BioDataAdPlacement>
        <BioDataAdPlacement name="Banner 728x90">
          <Banner728x90 />
        </BioDataAdPlacement>
        <BioDataAdPlacement name="Banner 320x50">
          <Banner320x50 />
        </BioDataAdPlacement>
        <BioDataAdPlacement name="Banner 160x300">
          <Banner160x300 />
        </BioDataAdPlacement>
        <BioDataAdPlacement name="Banner 160x600">
          <Banner160x600 />
        </BioDataAdPlacement>
      </section>
      <Footer />
      <FooterNav />
    </>
  );
}
