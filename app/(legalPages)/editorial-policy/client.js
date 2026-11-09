'use client';

import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import FooterNav from '../../components/FooterNav';
import '../legal-pages.css';

const SECTIONS = [
  { id: 'purpose', title: '1. Purpose & scope' },
  { id: 'sources', title: '2. Sources & fact-checking' },
  { id: 'examples', title: '3. Examples & claims' },
  { id: 'updates', title: '4. Updates & corrections' },
  { id: 'contact', title: '5. Contact the editors' },
];

export default function EditorialPolicyClient() {
  return (
    <>
      <NavBar />
      <section className="lp-hero">
        <div className="container-fluid custom-container">
          <span className="lp-eyebrow">How we handle published content</span>
          <h1>Editorial Policy</h1>
          <p>
            Our standards for useful, accurate, transparent career articles and exam
            guides on ResumeSathi.
          </p>
          <span className="lp-updated">Last updated: November 9, 2026</span>
        </div>
      </section>

      <section className="lp-body">
        <div className="container-fluid custom-container">
          <div className="lp-layout">
            <aside className="lp-toc">
              <p className="lp-toc__title">On this page</p>
              <ul>
                {SECTIONS.map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`}>{section.title}</a>
                  </li>
                ))}
              </ul>
            </aside>

            <div className="lp-content">
              <div id="purpose" className="lp-section">
                <h2><span className="lp-num">1</span>Purpose & scope</h2>
                <p>
                  This policy applies to ResumeSathi career articles and exam guides.
                  Our content is intended to help readers understand topics and prepare;
                  it is not a substitute for professional advice or an official notice.
                </p>
              </div>

              <div id="sources" className="lp-section">
                <h2><span className="lp-num">2</span>Sources & fact-checking</h2>
                <p>
                  For claims that can change—such as eligibility, application dates,
                  fees, vacancies, pay, and exam rules—readers should be directed to the
                  relevant primary source, such as the recruiting authority or employer.
                  When a current official source is unavailable, the page should make
                  that limitation clear and avoid presenting uncertain details as final.
                </p>
                <p>
                  Readers should verify time-sensitive details against the latest
                  official source before acting. A link to an authority homepage may
                  require readers to locate the relevant notification themselves.
                </p>
              </div>

              <div id="examples" className="lp-section">
                <h2><span className="lp-num">3</span>Examples & claims</h2>
                <p>
                  Examples should be described accurately. Hypothetical or composite
                  scenarios should be identified as such; real personal stories should
                  protect privacy and should not include invented details. Statistics
                  and specific outcome claims should be supported by a source or clearly
                  attributed context.
                </p>
              </div>

              <div id="updates" className="lp-section">
                <h2><span className="lp-num">4</span>Updates & corrections</h2>
                <p>
                  Pages with time-sensitive information should show when they were last
                  updated. If you find an error, outdated information, an unclear source,
                  or a concern about attribution, contact us with the page URL and the
                  correction or source you recommend. We will review the report and
                  update the page when appropriate.
                </p>
              </div>

              <div id="contact" className="lp-section">
                <h2><span className="lp-num">5</span>Contact the editors</h2>
                <p>
                  Send editorial feedback through our{' '}
                  <a href="/contact/">Contact Us page</a>. Include the article or guide
                  URL so we can identify the relevant content.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <FooterNav />
    </>
  );
}
