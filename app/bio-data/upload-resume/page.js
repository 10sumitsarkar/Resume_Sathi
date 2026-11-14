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
      style={{ display: "none" }}
      aria-hidden="true"
    >
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
        <h2>Upload and Update an Existing Bio-Data</h2>
        <p>
          Upload an existing PDF, DOC, or DOCX bio-data to reuse its readable
          text while preparing an updated document in ResumeSathi. The file
          must be no larger than 5 MB. A text-based document is the best place
          to start; a scanned image may not provide text that can be imported.
        </p>
        <h3>What Happens After You Choose a File?</h3>
        <p>
          The importer looks for details such as your name, contact
          information, education, work history, and skills. It creates an
          editable draft from the text it can read, so you can continue in the
          bio-data builder instead of entering every detail from a blank page.
        </p>
        <ol>
          <li>Select a PDF, DOC, or DOCX file that is 5 MB or smaller.</li>
          <li>Choose Next to extract text and open the editable bio-data form.</li>
          <li>Review the imported information and fill in details that were not detected.</li>
          <li>Preview the document, then download or print it when it is ready.</li>
        </ol>
        <h3>Review the Imported Details</h3>
        <p>
          Extraction can place text in the wrong section when a document uses
          columns, tables, unusual fonts, or scanned pages. Check spelling,
          dates, phone numbers, addresses, education, and any family or
          background details before using the finished bio-data. Include only
          personal information that is appropriate for its intended purpose.
        </p>
        <p>
          If the file cannot be read, try a text-based PDF or a DOCX copy of the
          document. You can also create a new bio-data with the
          <a href="/bio-data/resume-type/"> guided bio-data builder</a> and
          enter the information manually.
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
