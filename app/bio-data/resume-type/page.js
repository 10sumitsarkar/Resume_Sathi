import ResumeTypeClient from "./ResumeTypeClient";
import Footer from "../../components/Footer";
import FooterNav from "../../components/FooterNav";
import {
  Banner300x250,
  Banner468x60,
  Banner728x90,
  Banner320x50,
  Banner160x300,
  Banner160x600,
  NativeBanner,
} from "../../components/ads";

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
  title: "Build Bio-Data Instantly | ResumeSathi",
  description:
    "Create a printable bio-data in minutes with ResumeSathi’s free bio-data maker using ATS-friendly templates and smart editing tools.",
  keywords: [
    "Build Bio-Data Instantly",
    "bio-data generator",
    "bio-data",
    "bio-data templates",
  ],
  alternates: { canonical: "/bio-data/resume-type/" },
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
  openGraph: {
    title: "Build Bio-Data Instantly | ResumeSathi",
    description:
      "Create a printable bio-data in minutes with ResumeSathi’s free bio-data maker using ATS-friendly templates and smart editing tools.",
    url: "/bio-data/resume-type/",
    type: "website",
    siteName: "ResumeSathi",
    images: [
      {
        url: "/front-assets/images/og/home-og.png",
        width: 1200,
        height: 630,
        alt: "Build Bio-Data Instantly",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Build Bio-Data Instantly | ResumeSathi",
    description:
      "Create a printable bio-data in minutes with ResumeSathi’s free bio-data maker using ATS-friendly templates and smart editing tools.",
    images: ["/front-assets/images/og/home-og.png"],
  },
};

export default function ResumeTypeClientWrapper() {
  return (
    <>
      <ResumeTypeClient />
      <div className="d-flex justify-content-center my-4">
        <NativeBanner />
      </div>
      <section className="resume-content container-fluid custom-container pb-5 rk-article-text">
        <h2>Free Bio-Data Maker</h2>
        <p>
          ResumeSathi helps you create a clean, printable bio-data without
          manually arranging every section in a document editor. It organizes
          personal details, education, family or background information, work
          details, languages, hobbies, and other required information in a clear
          order.
        </p>
        <p>
          Add your details step by step, choose a suitable layout, preview the
          final page, and download or print it when everything looks correct.
          The format is useful for personal, job-related, formal, and
          family-sharing purposes.
        </p>
        <div className="d-flex justify-content-center my-4">
           <BioDataAdPlacement name="Banner 468x60">
              <Banner468x60 />
           </BioDataAdPlacement>
        </div>
        <blockquote className="ps-3 my-4 fst-italic">
          A bio-data should say the right things in the right order without
          making the reader search for them.
        </blockquote>
        <div className="d-flex justify-content-center my-4">
           <BioDataAdPlacement name="Banner 300x250">
            <Banner300x250 />
           </BioDataAdPlacement>
        </div>
        <p>
          A useful bio-data is simple, accurate, and easy to scan. Clear
          sections make the document look complete without making it crowded.
        </p>
        <div className="table-responsive my-4">
          <table className="table table-bordered align-middle">
            <thead>
              <tr>
                <th>Section</th>
                <th>What to include</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Personal Details</td>
                <td>
                  Full name, date of birth, contact number, email, address
                </td>
              </tr>
              <tr>
                <td>Education</td>
                <td>Degree, institution, and year of completion</td>
              </tr>
              <tr>
                <td>Family / Background</td>
                <td>Only the details required for the specific purpose</td>
              </tr>
              <tr>
                <td>Hobbies</td>
                <td>Two or three genuine interests</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-center my-4">
           <BioDataAdPlacement name="Banner 728x90">
            <Banner728x90 />
           </BioDataAdPlacement>
        </div>
        <p>
          Before downloading, check spelling, dates, names, phone numbers, and
          email addresses carefully. Clean formatting matters, but accurate
          details are what make the final bio-data reliable.
        </p>
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
