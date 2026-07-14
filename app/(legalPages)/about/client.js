'use client';

import Link from 'next/link';
import NavBar from '../../components/NavBar';
import FooterNav from '../../components/FooterNav';
import '../legal-pages.css';

const VALUES = [
  {
    title: '100% Free',
    desc: 'Every template, tool, and export option is free to use — no hidden charges, no premium lock.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5" />
        <path d="M12 17h.01" />
      </svg>
    ),
  },
  {
    title: 'ATS-Optimized',
    desc: 'Every template and our built-in checker are designed to help your resume pass applicant tracking systems.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    title: 'Built for India',
    desc: 'Designed with Indian job seekers in mind — from formats recruiters expect to relevant job listings.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 4.418-8 12-8 12S4 14.418 4 10a8 8 0 0 1 16 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    title: 'Privacy First',
    desc: 'Your resume data belongs to you. We keep it secure and never sell your personal information.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
];

export default function AboutClient() {
  return (
    <>
      <NavBar />

      <section className="lp-hero">
        <div className="container-fluid custom-container">
          <span className="lp-eyebrow">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            About ResumeSathi
          </span>
          <h1>Helping India Build Better Resumes</h1>
          <p>
            ResumeSathi is a free, ATS-optimized resume builder created to help job seekers
            across India present their best selves to employers — without spending a rupee.
          </p>
        </div>
      </section>

      <section className="lp-body">
        <div className="container-fluid custom-container">

          {/* Our Story */}
          <div className="ab-story">
            <div>
              <p className="ab-kicker">Our Story</p>
              <h2>Why We Built ResumeSathi</h2>
              <p>
                Finding a job is hard enough — building a professional, recruiter-ready
                resume shouldn&rsquo;t add to the struggle. Most resume builders lock the
                best templates and export options behind paywalls, putting job seekers who
                need help the most at a disadvantage.
              </p>
              <p>
                ResumeSathi was built to change that. We offer professionally designed,
                ATS-friendly resume templates, an instant ATS score checker, and easy PDF,
                Word, and text exports — all completely free, so every job seeker gets a
                fair shot at their next opportunity.
              </p>
            </div>
            <div className="ab-mv">
              <div className="ab-mv-card">
                <span className="ab-mv-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m3 11 18-5v12L3 14v-3z" />
                    <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
                  </svg>
                </span>
                <h3>Our Mission</h3>
                <p>To make professional resume building free, simple, and accessible for every job seeker in India.</p>
              </div>
              <div className="ab-mv-card">
                <span className="ab-mv-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </span>
                <h3>Our Vision</h3>
                <p>A future where no one misses a job opportunity because of a poorly formatted or costly resume.</p>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="ab-values">
            <p className="ab-kicker ab-kicker--center">What We Stand For</p>
            <h2 className="ab-values-title">Our Core Values</h2>
            <div className="ab-values-grid">
              {VALUES.map((v) => (
                <div className="ab-value-card" key={v.title}>
                  <span className="ab-value-icon">{v.icon}</span>
                  <h3>{v.title}</h3>
                  <p>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="ab-cta">
            <h2>Ready to Build Your Resume?</h2>
            <p>Join thousands of job seekers who trust ResumeSathi to create their next career document.</p>
            <Link className="rl-create-btn" href="/resume/resume-type">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Create Your Resume
            </Link>
          </div>

        </div>
      </section>

      <FooterNav />
    </>
  );
}
