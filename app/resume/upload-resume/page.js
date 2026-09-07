import UploadResume from './UploadResume';
import { DEFAULT_SITE_BASE } from '../../lib/apiConfig';

const siteUrl = DEFAULT_SITE_BASE.replace(/\/+$/, '');

export const metadata = {
  title: 'Upload Resume | ResumeSathi',
  description: 'Upload an existing resume and extract details into ResumeSathi’s online resume builder for quick editing and updating.',
  keywords: ['upload resume', 'resume parser', 'import resume', 'resume builder'],
  alternates: { canonical: `${siteUrl}/resume/upload-resume/` },
  openGraph: {
    title: 'Upload Resume | ResumeSathi',
    description: 'Upload an existing resume and extract details into ResumeSathi’s online resume builder for quick editing and updating.',
    url: `${siteUrl}/resume/upload-resume`,
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
  return (
    <>
      <h1 className="visually-hidden">Upload Resume</h1>
      <noscript
        dangerouslySetInnerHTML={{
          __html: `<section><h2>Upload and update an existing resume</h2><p>ResumeSathi lets you upload an existing resume so you can reuse your information while creating a cleaner, updated version. This flow is helpful when you already have a resume but want to improve its structure, update details, or move the content into a professional template.</p><p>After uploading, review the extracted details carefully and edit the resume sections before downloading. Check your contact information, work experience, education, skills, and summary so the final resume is accurate and ready for applications.</p><ul><li>Import existing resume details for faster editing.</li><li>Review and correct extracted information before final export.</li><li>Use a clean ResumeSathi template for the updated resume.</li></ul></section>`,
        }}
      />
      <UploadResume />
    </>
  );
}
