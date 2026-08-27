'use client';

import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import FooterNav from '../../components/FooterNav';
import '../legal-pages.css';

const SECTIONS = [
  { id: 'general-disclaimer', title: '1. General Disclaimer' },
  { id: 'no-professional-advice', title: '2. No Professional Advice' },
  { id: 'accuracy-of-content', title: '3. Accuracy of Content & Tools' },
  { id: 'ats-score-disclaimer', title: '4. ATS Score & Job Outcomes' },
  { id: 'blog-jobs-disclaimer', title: '5. Blog & Job Listings' },
  { id: 'external-links', title: '6. External Links' },
  { id: 'advertising-disclosure', title: '7. Advertising & Third-Party Ads' },
  { id: 'affiliate-disclosure', title: '8. Affiliate Disclosure' },
  { id: 'limitation-of-liability', title: '9. Limitation of Liability' },
  { id: 'changes', title: '10. Changes to This Disclaimer' },
  { id: 'contact', title: '11. Contact Us' },
];

export default function DisclaimerClient() {
  const lastUpdated = 'July 17, 2026';

  return (
    <>
      <NavBar />

      <section className="lp-hero">
        <div className="container-fluid custom-container">
          <span className="lp-eyebrow">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Please Read Carefully
          </span>
          <h1>Disclaimer</h1>
          <p>
            This page explains the limitations of the information and tools provided on
            ResumeSathi, and the terms under which you use our free resume builder, bio-data maker, and
            related services.
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
              <div id="general-disclaimer" className="lp-section">
                <h2><span className="lp-num">1</span>General Disclaimer</h2>
                <p>
                  All information, tools, and content provided on ResumeSathi
                  (&ldquo;the Site&rdquo;) are made available for general informational and
                  educational purposes only. While we try to keep everything accurate and
                  up to date, we make no representations or warranties of any kind, express
                  or implied, about the completeness, accuracy, reliability, suitability, or
                  availability of the Site, its tools, or any information, products, or
                  services contained on it. Any reliance you place on such information is
                  strictly at your own risk.
                </p>
              </div>

              <div id="no-professional-advice" className="lp-section">
                <h2><span className="lp-num">2</span>No Professional Advice</h2>
                <p>
                  ResumeSathi is not a career counseling, recruitment, legal, or professional
                  advisory service. The suggestions, templates, and tips provided through our
                  resume builder, bio-data maker, and ATS checker are general in nature and should not be
                  treated as personalized career, legal, or employment advice. For decisions
                  that significantly affect your career, we recommend consulting a qualified
                  career counselor or professional.
                </p>
              </div>

              <div id="accuracy-of-content" className="lp-section">
                <h2><span className="lp-num">3</span>Accuracy of Content & Tools</h2>
                <p>
                  Our resume builder, bio-data maker, PDF/Word export, PDF merge tool, and other utilities are
                  provided &ldquo;as is&rdquo; and &ldquo;as available.&rdquo; We do not
                  guarantee that these tools will be error-free, uninterrupted, secure, or
                  free of formatting issues across every device, browser, or application you
                  may use to open your documents. You are responsible for reviewing any
                  resume, bio-data, or document generated through our tools before using or submitting it.
                </p>
              </div>

              <div id="ats-score-disclaimer" className="lp-section">
                <h2><span className="lp-num">4</span>ATS Score & Job Outcomes</h2>
                <p>
                  Our ATS compatibility score and improvement suggestions are generated using
                  automated analysis and are intended only as a general guide. They do not
                  guarantee that your resume will pass any specific employer&rsquo;s applicant
                  tracking system, be shortlisted, or result in an interview or job offer. Job
                  outcomes depend on many factors beyond our control, including employer
                  requirements, market conditions, and your individual qualifications.
                </p>
              </div>

              <div id="blog-jobs-disclaimer" className="lp-section">
                <h2><span className="lp-num">5</span>Blog & Job Listings</h2>
                <p>
                  Articles published on our Blog are for general informational purposes and
                  reflect the views of the author at the time of writing; they should not be
                  taken as professional or legal advice. Job listings displayed on our Jobs
                  page are aggregated or published for convenience only. We do not guarantee
                  the accuracy, availability, or legitimacy of any job listing and are not
                  responsible for the hiring practices of any listed employer. Always verify
                  details directly with the employer before applying or sharing personal
                  information.
                </p>
              </div>

              <div id="external-links" className="lp-section">
                <h2><span className="lp-num">6</span>External Links</h2>
                <p>
                  The Site may contain links to third-party websites or resources that are not
                  owned or controlled by ResumeSathi. We have no control over, and assume no
                  responsibility for, the content, privacy policies, or practices of any
                  third-party websites. Including a link does not imply endorsement, and you
                  access such external sites at your own risk.
                </p>
              </div>

              <div id="advertising-disclosure" className="lp-section">
                <h2><span className="lp-num">7</span>Advertising & Third-Party Ads</h2>
                <p>
                  ResumeSathi may display advertisements served by third-party advertising
                  companies, including Google AdSense. These companies may use cookies, web
                  beacons, or similar technologies to serve ads based on your prior visits to
                  this or other websites. Google&rsquo;s use of advertising cookies enables it
                  and its partners to serve ads to you based on your visit to this site and/or
                  other sites on the Internet.
                </p>
                <p>
                  You may opt out of personalized advertising by visiting{' '}
                  <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
                    Google Ads Settings
                  </a>{' '}
                  or by visiting{' '}
                  <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer">
                    www.aboutads.info
                  </a>{' '}
                  to opt out of third-party vendor use of cookies for personalized advertising.
                  We do not control the content of ads shown by these third parties and are not
                  responsible for the products, services, or claims made in them.
                </p>
              </div>

              <div id="affiliate-disclosure" className="lp-section">
                <h2><span className="lp-num">8</span>Affiliate Disclosure</h2>
                <p>
                  From time to time, ResumeSathi may include affiliate links, meaning we may
                  earn a small commission if you click through and make a purchase, at no
                  additional cost to you. Any such relationships do not influence the
                  objectivity of our content, and we only recommend products or services we
                  believe may be useful to our users.
                </p>
              </div>

              <div id="limitation-of-liability" className="lp-section">
                <h2><span className="lp-num">9</span>Limitation of Liability</h2>
                <p>
                  To the fullest extent permitted by law, ResumeSathi and its team shall not be
                  liable for any direct, indirect, incidental, consequential, or special
                  damages arising out of or in connection with your use of the Site or
                  reliance on any information, tools, or content provided, including but not
                  limited to loss of data, loss of employment opportunity, or damages related
                  to documents generated using our tools.
                </p>
              </div>

              <div id="changes" className="lp-section">
                <h2><span className="lp-num">10</span>Changes to This Disclaimer</h2>
                <p>
                  We may update this Disclaimer from time to time to reflect changes in our
                  practices, tools, or for legal reasons. The updated version will be posted on
                  this page with a revised &ldquo;Last updated&rdquo; date.
                </p>
              </div>

              <div id="contact" className="lp-section">
                <h2><span className="lp-num">11</span>Contact Us</h2>
                <p>
                  If you have any questions about this Disclaimer, please visit our{' '}
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
