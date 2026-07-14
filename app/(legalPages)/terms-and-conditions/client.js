'use client';

import NavBar from '../../components/NavBar';
import FooterNav from '../../components/FooterNav';
import '../legal-pages.css';

const SECTIONS = [
  { id: 'acceptance', title: '1. Acceptance of Terms' },
  { id: 'eligibility', title: '2. Eligibility' },
  { id: 'service-description', title: '3. Description of Service' },
  { id: 'local-data-accounts', title: '4. Local Data & Accounts' },
  { id: 'user-content', title: '5. Your Content' },
  { id: 'acceptable-use', title: '6. Acceptable Use' },
  { id: 'intellectual-property', title: '7. Intellectual Property' },
  { id: 'ats-disclaimer', title: '8. ATS Score Disclaimer' },
  { id: 'third-party-links', title: '9. Third-Party Links' },
  { id: 'disclaimer-warranty', title: '10. Disclaimer of Warranty' },
  { id: 'limitation-liability', title: '11. Limitation of Liability' },
  { id: 'termination', title: '12. Termination' },
  { id: 'governing-law', title: '13. Governing Law' },
  { id: 'changes', title: '14. Changes to These Terms' },
  { id: 'contact', title: '15. Contact Us' },
];

export default function TermsClient() {
  const lastUpdated = 'July 14, 2026';

  return (
    <>
      <NavBar />

      <section className="lp-hero">
        <div className="container-fluid custom-container">
          <span className="lp-eyebrow">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <path d="m9 15 2 2 4-4" />
            </svg>
            Please Read Carefully
          </span>
          <h1>Terms & Conditions</h1>
          <p>
            These Terms govern your access to and use of ResumeSathi. By using our website
            and tools, you agree to be bound by the terms outlined below.
          </p>
          <span className="lp-updated">Last updated: {lastUpdated}</span>
        </div>
      </section>

      <section className="lp-body">
        <div className="container-fluid custom-container">
          <div className="lp-layout">
            <aside className="lp-toc">
              <p className="lp-toc__title">On this page</p>
              <ul>
                {SECTIONS.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`}>{s.title}</a>
                  </li>
                ))}
              </ul>
            </aside>

            <div className="lp-content">
              <div id="acceptance" className="lp-section">
                <h2><span className="lp-num">1</span>Acceptance of Terms</h2>
                <p>
                  By accessing or using ResumeSathi (&ldquo;the Service&rdquo;), you agree to
                  comply with and be bound by these Terms and Conditions. If you do not agree
                  with any part of these terms, please discontinue use of the Service.
                </p>
              </div>

              <div id="eligibility" className="lp-section">
                <h2><span className="lp-num">2</span>Eligibility</h2>
                <p>
                  ResumeSathi is an education and career-focused platform, and its content is
                  general-audience in nature. There is no minimum age requirement to use our
                  resume builder, ATS checker, PDF merge tool, blog, or job listings. If you
                  are under the age of 18, we recommend using the Service with the awareness
                  or involvement of a parent or guardian, particularly before sharing your
                  resume with third parties.
                </p>
              </div>

              <div id="service-description" className="lp-section">
                <h2><span className="lp-num">3</span>Description of Service</h2>
                <p>
                  ResumeSathi is a free online resume-building platform that allows users to
                  create, customize, preview, and export resumes in PDF, Word, and text
                  formats. We also offer supporting tools such as an ATS compatibility
                  checker and a PDF merge tool, along with a blog and job listings page whose
                  content is served dynamically from our database.
                </p>
              </div>

              <div id="local-data-accounts" className="lp-section">
                <h2><span className="lp-num">4</span>Local Data & Accounts</h2>
                <p>
                  ResumeSathi does not currently require you to create an account. The resume
                  information you enter (name, contact details, work experience, education,
                  skills, photo, etc.) is stored locally in your own browser and is not saved
                  on our servers. You are responsible for keeping your own backup of your
                  resume data, since clearing your browser data will remove it.
                </p>
                <p>
                  Our ATS checker and PDF merge tool currently run entirely in your browser
                  and do not require an account. If we introduce account-based features or
                  server-side tools in the future, additional terms describing those features
                  will be added here and you will be notified through an update to this page.
                </p>
              </div>

              <div id="user-content" className="lp-section">
                <h2><span className="lp-num">5</span>Your Content</h2>
                <p>
                  You retain full ownership of the personal and professional information you
                  enter into your resumes (&ldquo;User Content&rdquo;). You are solely
                  responsible for ensuring the accuracy of the information you provide and
                  for how you choose to share or distribute your finished resume.
                </p>
              </div>

              <div id="acceptable-use" className="lp-section">
                <h2><span className="lp-num">6</span>Acceptable Use</h2>
                <p>You agree not to:</p>
                <ul>
                  <li>Use the Service for any unlawful purpose or in violation of any applicable law.</li>
                  <li>Upload false, misleading, or fraudulent credentials or qualifications.</li>
                  <li>Attempt to interfere with, disrupt, or gain unauthorized access to our systems.</li>
                  <li>Copy, scrape, or resell templates, tools, or content from the platform.</li>
                  <li>Impersonate any person or misrepresent your affiliation with any entity.</li>
                </ul>
              </div>

              <div id="intellectual-property" className="lp-section">
                <h2><span className="lp-num">7</span>Intellectual Property</h2>
                <p>
                  All templates, designs, branding, source code, and other materials made
                  available through ResumeSathi are the property of ResumeSathi and its
                  licensors, and are protected by applicable intellectual property laws.
                  You may use these materials only to create your own resume through the
                  Service.
                </p>
              </div>

              <div id="ats-disclaimer" className="lp-section">
                <h2><span className="lp-num">8</span>ATS Score Disclaimer</h2>
                <p>
                  Our ATS compatibility checker provides an estimated score based on general
                  best practices for resume formatting and content. This score is for
                  guidance only and does not guarantee that your resume will pass any
                  specific employer&rsquo;s applicant tracking system or result in a job
                  offer or interview.
                </p>
              </div>

              <div id="third-party-links" className="lp-section">
                <h2><span className="lp-num">9</span>Third-Party Links</h2>
                <p>
                  ResumeSathi may contain links to third-party websites, including job
                  listings and blog references. We do not control and are not responsible
                  for the content, accuracy, or practices of these external sites.
                </p>
              </div>

              <div id="disclaimer-warranty" className="lp-section">
                <h2><span className="lp-num">10</span>Disclaimer of Warranty</h2>
                <p>
                  The Service is provided on an &ldquo;as is&rdquo; and &ldquo;as
                  available&rdquo; basis, without warranties of any kind, whether express or
                  implied, including but not limited to warranties of merchantability,
                  fitness for a particular purpose, or non-infringement.
                </p>
              </div>

              <div id="limitation-liability" className="lp-section">
                <h2><span className="lp-num">11</span>Limitation of Liability</h2>
                <p>
                  To the fullest extent permitted by law, ResumeSathi shall not be liable
                  for any indirect, incidental, special, or consequential damages arising
                  out of or related to your use of, or inability to use, the Service,
                  including any employment outcomes or loss of resume data stored in your
                  browser.
                </p>
              </div>

              <div id="termination" className="lp-section">
                <h2><span className="lp-num">12</span>Termination</h2>
                <p>
                  We reserve the right to suspend or restrict your access to the Service at
                  any time, without prior notice, if we reasonably believe you have violated
                  these Terms.
                </p>
              </div>

              <div id="governing-law" className="lp-section">
                <h2><span className="lp-num">13</span>Governing Law</h2>
                <p>
                  These Terms shall be governed by and construed in accordance with the laws
                  of India, without regard to its conflict of law provisions. Any disputes
                  arising under these Terms shall be subject to the exclusive jurisdiction of
                  the courts of India.
                </p>
              </div>

              <div id="changes" className="lp-section">
                <h2><span className="lp-num">14</span>Changes to These Terms</h2>
                <p>
                  We may revise these Terms from time to time&mdash;for example, if we
                  introduce user accounts or new server-based tools. Continued use of the
                  Service after any changes take effect constitutes your acceptance of the
                  revised Terms.
                </p>
              </div>

              <div id="contact" className="lp-section">
                <h2><span className="lp-num">15</span>Contact Us</h2>
                <p>
                  If you have any questions about these Terms & Conditions, please visit our{' '}
                  <a href="/contact">Contact page</a>{' '}
                  to reach our team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterNav />
    </>
  );
}