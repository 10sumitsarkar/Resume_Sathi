'use client';

import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import FooterNav from '../../components/FooterNav';
import '../legal-pages.css';

const SECTIONS = [
  { id: 'information-we-collect', title: '1. Information We Collect' },
  { id: 'how-we-use-information', title: '2. How We Use Your Information' },
  { id: 'local-storage', title: '3. Resume Data & Local Storage' },
  { id: 'blog-jobs-data', title: '4. Blog & Job Listings Data' },
  { id: 'cookies', title: '5. Cookies & Tracking' },
  { id: 'third-party-services', title: '6. Third-Party Services' },
  { id: 'data-security', title: '7. Data Security' },
  { id: 'data-retention', title: '8. Data Retention & Deletion' },
  { id: 'childrens-privacy', title: '9. Age & Suitability' },
  { id: 'your-rights', title: '10. Your Rights' },
  { id: 'changes', title: '11. Changes to This Policy' },
  { id: 'contact', title: '12. Contact Us' },
];

export default function PrivacyPolicyClient() {
  const lastUpdated = 'July 14, 2026';

  return (
    <>
      <NavBar />

      <section className="lp-hero">
        <div className="container-fluid custom-container">
          <span className="lp-eyebrow">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Your Privacy Matters
          </span>
          <h1>Privacy Policy</h1>
          <p>
            This policy explains what information ResumeSathi collects, how it is used,
            and the choices you have when you use our free resume builder and related tools.
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
              <div id="information-we-collect" className="lp-section">
                <h2><span className="lp-num">1</span>Information We Collect</h2>
                <p>
                  We collect information that you voluntarily enter while creating a resume,
                  such as your <strong>name, email address, phone number, work experience,
                  education, skills, and profile photo</strong>. This information is entered
                  directly into our resume builder forms.
                </p>
                <p>
                  If you use our <strong>Contact Us</strong> page, we collect your{' '}
                  <strong>name, email address, message</strong>, and, optionally, your{' '}
                  <strong>phone number</strong>, so we can respond to your query.
                </p>
                <p>
                  We may also collect limited technical information automatically, including
                  your browser type, device type, approximate location (city/state level), and
                  pages visited, to help us improve the platform.
                </p>
              </div>

              <div id="how-we-use-information" className="lp-section">
                <h2><span className="lp-num">2</span>How We Use Your Information</h2>
                <ul>
                  <li>To generate and render your resume in the templates you select.</li>
                  <li>To enable export features such as PDF, Word, and text downloads.</li>
                  <li>To calculate ATS compatibility scores and provide improvement suggestions.</li>
                  <li>To merge, rearrange, or process PDF files that you choose to work with using our tools.</li>
                  <li>To maintain and improve the performance and reliability of ResumeSathi.</li>
                  <li>To respond to you if you contact us through our Contact Us page.</li>
                </ul>
                <p>We do not sell your personal information to third parties.</p>
              </div>

              <div id="local-storage" className="lp-section">
                <h2><span className="lp-num">3</span>Resume Data & Local Storage</h2>
                <p>
                  The resume content you create&mdash;your name, contact details, work
                  experience, education, skills, and photo&mdash;is stored{' '}
                  <strong>only in your browser&rsquo;s local storage</strong>. We do not
                  currently upload, transmit, or store this resume data on our servers, and we
                  do not have access to it. Because it lives in your browser, this data stays
                  on your own device and is available to you the next time you visit using the
                  same browser, unless you clear your browser data.
                </p>
                <p>
                  Our current tools&mdash;including the resume builder, ATS checker, and PDF
                  merge tool&mdash;run entirely in your browser (client-side). No resume or
                  document content is sent to our servers to use these tools.
                </p>
                <p>
                  As we grow, we may introduce additional tools or features (such as
                  account-based saving) that require server-side processing. If and when that
                  happens, we will update this Privacy Policy to clearly explain what data is
                  sent to our servers, how it is stored, and the choices available to you.
                </p>
              </div>

              <div id="blog-jobs-data" className="lp-section">
                <h2><span className="lp-num">4</span>Blog & Job Listings Data</h2>
                <p>
                  Our Blog and Jobs pages display content (such as articles and job listings)
                  that is fetched dynamically from our database. This content is not personal
                  information about you&mdash;it is published content that we maintain to
                  provide useful information to visitors. Simply viewing these pages does not
                  require you to submit any personal information.
                </p>
              </div>

              <div id="cookies" className="lp-section">
                <h2><span className="lp-num">5</span>Cookies & Tracking</h2>
                <p>
                  ResumeSathi uses essential cookies and similar technologies to keep the
                  platform functional (for example, remembering your selected template or
                  theme). We may also use analytics cookies to understand how visitors use
                  the site so we can improve it. You can control or disable cookies through
                  your browser settings at any time.
                </p>
              </div>

              <div id="third-party-services" className="lp-section">
                <h2><span className="lp-num">6</span>Third-Party Services</h2>
                <p>
                  We may use trusted third-party service providers for functions such as
                  analytics, hosting, and error monitoring. These providers only access the
                  minimum data required to perform their function (such as basic technical or
                  usage data) and are not permitted to use it for any other purpose. Since
                  resume data is stored locally in your browser, it is not shared with these
                  providers.
                </p>
              </div>

              <div id="data-security" className="lp-section">
                <h2><span className="lp-num">7</span>Data Security</h2>
                <p>
                  We apply reasonable technical and organizational measures to protect the
                  information we do handle (such as contact form submissions and our blog/job
                  database) from unauthorized access, alteration, or disclosure. However, no
                  method of transmission or storage over the internet is completely secure,
                  and we cannot guarantee absolute security.
                </p>
              </div>

              <div id="data-retention" className="lp-section">
                <h2><span className="lp-num">8</span>Data Retention & Deletion</h2>
                <p>
                  Since your resume data is stored only in your browser&rsquo;s local storage,
                  you are in full control of it&mdash;you can delete it at any time by clearing
                  your browser&rsquo;s local storage or site data. We do not retain a copy of
                  this data on our servers.
                </p>
                <p>
                  Messages you send us through the Contact Us page (name, email, phone if
                  provided, and message) are retained only as long as necessary to respond to
                  your query and for reasonable record-keeping, after which they may be deleted.
                </p>
              </div>

              <div id="childrens-privacy" className="lp-section">
                <h2><span className="lp-num">9</span>Age & Suitability</h2>
                <p>
                  ResumeSathi is an education and career-focused platform intended to help
                  people of any age build resumes and explore job opportunities. Our content
                  is general-audience and does not include material unsuitable for younger
                  users, so students, first-time job seekers, and professionals alike can use
                  the site.
                </p>
                <p>
                  As explained above, resume information is stored locally in your browser
                  rather than on our servers. If you are a parent or guardian and believe your
                  child has shared personal information with us through the Contact Us page,
                  please reach out to us using the details below and we will address it
                  promptly.
                </p>
              </div>

              <div id="your-rights" className="lp-section">
                <h2><span className="lp-num">10</span>Your Rights</h2>
                <ul>
                  <li>Delete your resume data at any time by clearing your browser&rsquo;s local storage.</li>
                  <li>Request access to or correction of any information you have submitted through our Contact Us page.</li>
                  <li>Request deletion of any personal data you have shared with us via the Contact Us page.</li>
                  <li>Withdraw consent for optional data processing, where applicable.</li>
                </ul>
                <p>To exercise any of these rights, please reach out using the contact details below.</p>
              </div>

              <div id="changes" className="lp-section">
                <h2><span className="lp-num">11</span>Changes to This Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time to reflect changes in
                  our practices&mdash;for example, if we introduce new tools that require
                  server-side data processing&mdash;or for legal reasons. The updated version
                  will be posted on this page with a revised &ldquo;Last updated&rdquo; date.
                </p>
              </div>

              <div id="contact" className="lp-section">
                <h2><span className="lp-num">12</span>Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy or how your data is
                  handled, please visit our{' '}
                  <a href="/contact/">Contact page</a>{' '}
                  to get in touch with our team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer/>
      <FooterNav />
    </>
  );
}
