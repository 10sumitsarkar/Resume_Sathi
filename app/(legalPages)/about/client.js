'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '../../components/Footer';
import NavBar from '../../components/NavBar';
import FooterNav from '../../components/FooterNav';
import '../legal-pages.css';

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const Icon = {
  File: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M9 13h6M9 17h4" />
    </svg>
  ),
  Search: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
      <path d="m8.8 11.2 1.5 1.5 3.4-4" />
    </svg>
  ),
  Layers: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 2 9 5-9 5-9-5 9-5z" />
      <path d="m3 12 9 5 9-5" />
      <path d="m3 17 9 5 9-5" />
    </svg>
  ),
  Scissors: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M20 4 8.1 15.9" />
      <path d="M8.1 8.1 20 20" />
    </svg>
  ),
  Archive: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 8v13H3V8" />
      <path d="M1 3h22v5H1z" />
      <path d="M10 12h4" />
    </svg>
  ),
  Image: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  ),
  Pen: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  ),
  Calendar: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2v4M16 2v4" />
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M3 10h18" />
    </svg>
  ),
  Palette: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r=".5" />
      <circle cx="17.5" cy="10.5" r=".5" />
      <circle cx="8.5" cy="7.5" r=".5" />
      <circle cx="6.5" cy="12.5" r=".5" />
      <path d="M12 2C6.5 2 2 5.8 2 10.5S5.6 19 10.1 19H12c1 0 1.8.8 1.8 1.8 0 .7.5 1.2 1.2 1.2 3.9-.7 7-4.8 7-9.8C22 6.6 17.5 2 12 2Z" />
    </svg>
  ),
  Spark: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
      <path d="M19 16v4M17 18h4" />
    </svg>
  ),
  Lock: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  Users: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Refresh: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 2v6h-6" />
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
      <path d="M3 22v-6h6" />
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
    </svg>
  ),
  Quote: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M7.2 6C4.9 7.3 3.5 9.4 3.5 12.2V18h6v-6H6.8c.1-1.5.8-2.7 2.2-3.6L7.2 6Zm10 0c-2.3 1.3-3.7 3.4-3.7 6.2V18h6v-6h-2.7c.1-1.5.8-2.7 2.2-3.6L17.2 6Z" />
    </svg>
  ),
  Star: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2L5.8 21 7 14.2 2 9.3l6.9-1L12 2Z" />
    </svg>
  ),
};

const HIGHLIGHTS = [
  '100% Free',
  'ATS-Friendly Templates',
  'Printable Bio-Data',
  'Instant ATS Score',
  'Latest Jobs',
  'Typing Practice',
  'PDF, Word & TXT Export',
];

const TOOLS = [
  {
    title: 'Resume Builder',
    desc: 'Create an ATS-friendly resume with guided steps and professional templates.',
    href: '/resume/resume-type/',
    icon: <Icon.File />,
    bullets: ['ATS-friendly layouts', 'Step-by-step forms', 'PDF, Word, TXT export'],
  },
  {
    title: 'Bio-Data Maker',
    desc: 'Create a clean printable bio-data with personal, family, education, and work details.',
    href: '/bio-data/resume-type/',
    icon: <Icon.File />,
    bullets: ['Premium bio-data templates', 'Photo and family details', 'PDF, Word, TXT export'],
  },
  {
    title: 'ATS Checker',
    desc: 'Review resume structure, formatting, and ATS compatibility before applying.',
    href: '/tools/ats-checker/',
    icon: <Icon.Search />,
    bullets: ['Resume score', 'Keyword guidance', 'Actionable fixes'],
  },
  {
    title: 'Merge PDF',
    desc: 'Combine multiple PDF files into one clean document for job portals.',
    href: '/tools/merge-pdf/',
    icon: <Icon.Layers />,
    bullets: ['Combine PDFs', 'Application ready', 'Browser based'],
  },
  {
    title: 'Split PDF',
    desc: 'Extract selected pages from a PDF and download them separately.',
    href: '/tools/split-pdf/',
    icon: <Icon.Scissors />,
    bullets: ['Extract pages', 'Separate files', 'Fast downloads'],
  },
  {
    title: 'Remove PDF Pages',
    desc: 'Delete unwanted PDF pages and keep only what your application needs.',
    href: '/tools/pdf-remove/',
    icon: <Icon.Scissors />,
    bullets: ['Delete pages', 'Reorder files', 'Clean output'],
  },
  {
    title: 'Compress PDF',
    desc: 'Reduce PDF size so resumes and certificates fit upload limits.',
    href: '/tools/pdf-compressor/',
    icon: <Icon.Archive />,
    bullets: ['Smaller files', 'Portal limits', 'Simple workflow'],
  },
  {
    title: 'DOCX to PDF',
    desc: 'Convert Word files into portable PDFs directly in your browser.',
    href: '/tools/docx-to-pdf/',
    icon: <Icon.File />,
    bullets: ['Word to PDF', 'No install', 'Shareable files'],
  },
  {
    title: 'Image to PDF',
    desc: 'Turn JPG or PNG images into a single application-ready PDF.',
    href: '/tools/image-to-pdf/',
    icon: <Icon.Image />,
    bullets: ['JPG and PNG', 'Single PDF', 'Form uploads'],
  },
  {
    title: 'Signature Cropper',
    desc: 'Crop and resize signatures for forms, admit cards, and applications.',
    href: '/tools/signature-cropper/',
    icon: <Icon.Pen />,
    bullets: ['Crop signature', 'Resize neatly', 'Exam forms'],
  },
  {
    title: 'Age Calculator',
    desc: 'Calculate exact age for eligibility checks in years, months, and days.',
    href: '/tools/age-calculator/',
    icon: <Icon.Calendar />,
    bullets: ['Exact age', 'Eligibility checks', 'Total days'],
  },
];

const STEPS = [
  {
    title: 'Build Your Resume or Bio-Data',
    desc: 'Choose a template and fill your career, personal, or family details in a guided builder.',
  },
  {
    title: 'Improve Your Documents',
    desc: 'Use ATS, PDF, DOCX, image, signature, and eligibility tools to prepare files.',
  },
  {
    title: 'Apply and Prepare',
    desc: 'Browse job updates, read career blogs, and practice typing for exam workflows.',
  },
];

const VALUES = [
  {
    title: 'Free Access',
    desc: 'ResumeSathi keeps core resume, job, typing, and document tools free for job seekers.',
    icon: <Icon.Spark />,
  },
  {
    title: 'Built for Job Seekers',
    desc: 'Every section is designed around practical application needs, not just design.',
    icon: <Icon.Users />,
  },
  {
    title: 'Privacy First',
    desc: 'Resume creation is built with a privacy-conscious workflow for personal career data.',
    icon: <Icon.Lock />,
  },
  {
    title: 'Always Improving',
    desc: 'New tools, articles, templates, and refinements are added as user needs grow.',
    icon: <Icon.Refresh />,
  },
];

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'Software Engineer',
    text: 'ResumeSathi helped me create a clean ATS resume quickly, and the tools made my application files ready without extra software.',
  },
  {
    name: 'Rahul Verma',
    role: 'SSC CGL Aspirant',
    text: 'I used resume builder, job updates, and typing practice together. It saved time during exam preparation.',
  },
  {
    name: 'Ananya Singh',
    role: 'UX Designer',
    text: 'The resume templates and career blogs made my profile stronger. Everything felt simple and practical.',
  },
];

function getSlug(item) {
  return item?.slug || item?.course_slug || item?.article_slug || item?.url_slug || item?.id || '';
}

function getTitle(item) {
  return item?.title || item?.name || item?.course_name || item?.article_name || 'ResumeSathi update';
}

function getDescription(item) {
  const value = item?.short_description || item?.description || item?.excerpt || item?.summary || '';
  return String(value).replace(/<[^>]*>/g, '').slice(0, 140);
}

function formatDate(value) {
  if (!value) return 'Updated recently';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Updated recently';
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function PreviewCard({ item, type }) {
  const slug = getSlug(item);
  const href = type === 'job' ? `/jobs/${slug}/` : `/blog/${slug}/`;
  const date = item?.created_at || item?.updated_at || item?.last_date || item?.application_end_date;

  return (
    <article className="ab-preview-card">
      <div className="ab-preview-tag">{type === 'job' ? 'Job Update' : 'Career Blog'}</div>
      <h3>{getTitle(item)}</h3>
      <p>{getDescription(item) || 'Read the latest ResumeSathi update for better career planning and applications.'}</p>
      <div className="ab-preview-foot">
        <span>{formatDate(date)}</span>
        <Link prefetch={false} href={href}>
          {type === 'job' ? 'View job' : 'Read blog'} <ArrowIcon />
        </Link>
      </div>
    </article>
  );
}

function SectionHeader({ eyebrow, title, desc, href, cta }) {
  return (
    <div className="ab-section-head">
      <div>
        <p className="ab-kicker">{eyebrow}</p>
        <h2>{title}</h2>
        {desc ? <p>{desc}</p> : null}
      </div>
      {href && cta ? (
        <Link prefetch={false} className="ab-outline-btn" href={href}>
          {cta} <ArrowIcon />
        </Link>
      ) : null}
    </div>
  );
}

const compareRows = [
  { feature: 'Career workflow', us: 'Resume, tools, jobs, blogs, and typing practice together', others: 'Separate websites for every task' },
  { feature: 'Cost', us: 'Free tools for everyday job preparation', others: 'Many tools lock export or advanced actions' },
  { feature: 'Candidate focus', us: 'Built around forms, deadlines, ATS, and application files', others: 'Generic utilities without job-search context' },
  { feature: 'Speed', us: 'Move from resume to documents to jobs quickly', others: 'Repeated uploads and manual switching' },
];

export default function AboutClient({ initialJobs = [], initialBlogs = [], faqs = [] }) {
  const [openFaq, setOpenFaq] = useState(0);

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
          <h1>Free ATS-Friendly Resume Builder</h1>
          <p>
            Create a professional resume or printable bio-data for free, with helpful tools,
            job updates, blogs, and typing practice when you need them.
          </p>
        </div>
      </section>

      <section className="lp-body">
        <div className="container-fluid custom-container">
          <div className="ab-highlights">
            {HIGHLIGHTS.map((h) => (
              <span className="ab-highlight" key={h}>
                <CheckIcon />
                {h}
              </span>
            ))}
          </div>

          <div className="ab-story">
            <div>
              <p className="ab-kicker">Our Story</p>
              <h2>Why We Built ResumeSathi</h2>
              <p>
                Job preparation often means switching between resume builders, bio-data makers, PDF utilities, job portals,
                typing practice websites, and career advice pages. ResumeSathi brings these essentials into
                one free platform so candidates can move from preparation to application faster.
              </p>
              <p>
                The goal is simple: help every fresher, experienced professional, student, and exam candidate
                create better resumes, bio-data documents, track opportunities, and build skills without confusing paid
                barriers.
              </p>
            </div>
            <div className="ab-mv">
              <div className="ab-mv-card">
                <span className="ab-mv-icon"><Icon.Spark /></span>
                <h3>Our Mission</h3>
                <p>Make resume creation, bio-data creation, ATS checks, document tools, jobs, typing practice, and career learning accessible to everyone.</p>
              </div>
              <div className="ab-mv-card">
                <span className="ab-mv-icon"><Icon.Search /></span>
                <h3>Our Vision</h3>
                <p>A job-search workflow where candidates do not lose opportunities because of weak resumes, missed deadlines, or unprepared files.</p>
              </div>
            </div>
          </div>

          <section className="ab-typing-promo" id="bio-data-maker">
            <div className="ab-typing-promo-card">
              <div className="ab-typing-copy">
                <div className="ab-typing-label">
                  <Icon.File /> Free bio-data maker
                </div>
                <h2>Printable Bio-Data Templates for Personal and Job Use</h2>
                <p>
                  ResumeSathi also helps you create a clean bio-data with personal details,
                  family details, address, caste, religion, education, work details, hobbies,
                  and photo. The builder keeps your information in your browser and gives you
                  premium printable templates for PDF, Word, and text export.
                </p>
                <div className="ab-mini-points">
                  <span><CheckIcon /> Personal and family details</span>
                  <span><CheckIcon /> Premium A4 layouts</span>
                  <span><CheckIcon /> Photo-ready templates</span>
                  <span><CheckIcon /> Local browser storage</span>
                </div>
                <Link prefetch={false} className="ab-typing-button" href="/bio-data/resume-type/">
                  Create Bio-Data <ArrowIcon />
                </Link>
              </div>
              <div className="ab-typing-visual ab-biodata-visual" aria-hidden="true">
                <div className="ab-biodata-sheet">
                  <div className="ab-biodata-title">BIO-DATA</div>
                  <div className="ab-biodata-photo" />
                  {['Name', "Father's Name", 'Date of Birth', 'Caste', 'Religion', 'Address'].map((item) => (
                    <div className="ab-biodata-row" key={item}>
                      <span>{item}</span>
                      <i />
                    </div>
                  ))}
                  <div className="ab-biodata-grid">
                    <b />
                    <b />
                    <b />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="ab-features">
            <SectionHeader
              eyebrow="Our Tools"
              title="All ResumeSathi Tools in One Place"
              desc="Open any tool directly, or visit the complete tools list to explore everything available for resume and application preparation."
              href="/tools/"
              cta="View all tools"
            />
            <div className="ab-tools-grid ab-tools-grid--full">
              {TOOLS.map((tool) => (
                <Link prefetch={false} className="ab-tool-card ab-tool-card--link" href={tool.href} key={tool.title}>
                  <span className="ab-value-icon">{tool.icon}</span>
                  <h3>{tool.title}</h3>
                  <p>{tool.desc}</p>
                  <ul>
                    {tool.bullets.map((bullet) => (
                      <li key={bullet}>
                        <CheckIcon />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                  <span className="ab-card-link">Open tool <ArrowIcon /></span>
                </Link>
              ))}
            </div>
          </div>

          <section className="ab-typing-promo" id="typing-practice">
            <div className="ab-typing-promo-card">
              <div className="ab-typing-copy">
                <div className="ab-typing-label">
                  <Icon.Spark /> Free typing practice
                </div>
                <h2>Practice Typing for Exams, Job Forms, and Daily Work</h2>
                <p>
                  Build speed, accuracy, and confidence with structured lessons, focused typing practice,
                  and live performance tracking. It is useful for government exam preparation, data entry
                  practice, clerical roles, online forms, and everyday career tasks where clean typing matters.
                </p>
                <div className="ab-mini-points">
                  <span><CheckIcon /> Guided lessons</span>
                  <span><CheckIcon /> Live WPM tracking</span>
                  <span><CheckIcon /> Accuracy feedback</span>
                  <span><CheckIcon /> No signup needed</span>
                </div>
                <Link prefetch={false} className="ab-typing-button" href="/typing/">
                  Start Typing Practice <ArrowIcon />
                </Link>
              </div>
              <div className="ab-typing-visual" aria-hidden="true">
                <div className="ab-typing-speed">62 <span>WPM</span></div>
                <div className="ab-typing-progress"><span /></div>
                <div className="ab-keyboard">
                  {['Q W E R T Y U I O P', 'A S D F G H J K L', 'Z X C V B N M'].map((row) => (
                    <div className="ab-key-row" key={row}>
                      {row.split(' ').map((key) => <span key={key}>{key}</span>)}
                    </div>
                  ))}
                  <div className="ab-key-row ab-key-row--space"><span>SPACE</span></div>
                </div>
              </div>
            </div>
          </section>

          <div className="ab-why">
            <p className="ab-kicker ab-kicker--center">Why ResumeSathi</p>
            <h2 className="ab-values-title">A Career Platform That Connects the Whole Journey</h2>
            <p className="ab-why-sub">ResumeSathi is built for candidates who want fewer scattered tools and a clearer path from preparation to application.</p>
            <div className="ab-compare-grid">
              {compareRows.map((row) => (
                <div className="ab-compare-card" key={row.feature}>
                  <div className="ab-compare-feature">{row.feature}</div>
                  <div className="ab-compare-side ab-compare-side--us">
                    <span className="ab-compare-icon ab-compare-icon--yes"><CheckIcon /></span>
                    <div>
                      <div className="ab-compare-tag">ResumeSathi</div>
                      <div className="ab-compare-value">{row.us}</div>
                    </div>
                  </div>
                  <div className="ab-compare-side ab-compare-side--them">
                    <span className="ab-compare-icon ab-compare-icon--no">x</span>
                    <div>
                      <div className="ab-compare-tag">Most others</div>
                      <div className="ab-compare-value">{row.others}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="ab-how">
            <p className="ab-kicker ab-kicker--center">The Process</p>
            <h2 className="ab-values-title">How ResumeSathi Supports Your Career Workflow</h2>
            <div className="ab-steps">
              {STEPS.map((s, i) => (
                <div className="ab-step" key={s.title}>
                  <span className="ab-step-num">{i + 1}</span>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="ab-preview-section">
            <SectionHeader
              eyebrow="Latest Jobs"
              title="Fresh Job Updates for Candidates"
              desc="Browse current openings, important dates, and application information."
              href="/jobs/"
              cta="View all jobs"
            />
            <div className="ab-preview-grid">
              {initialJobs.slice(0, 6).map((job) => (
                <PreviewCard key={job.id || getSlug(job)} item={job} type="job" />
              ))}
            </div>
          </div>

          <div className="ab-testimonials">
            <p className="ab-kicker ab-kicker--center">Testimonials</p>
            <h2 className="ab-values-title">Trusted by Job Seekers</h2>
            <div className="ab-testimonial-grid">
              {TESTIMONIALS.map((item) => (
                <div className="ab-tcard" key={item.name}>
                  <div className="ab-tcard-quote"><Icon.Quote /></div>
                  <p className="ab-tcard-text">&quot;{item.text}&quot;</p>
                  <div className="ab-tcard-stars">
                    {[1, 2, 3, 4, 5].map((star) => <Icon.Star key={star} />)}
                  </div>
                  <div className="ab-tcard-author">
                    <div className="ab-tcard-av">{item.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div>
                    <div>
                      <div className="ab-tcard-name">{item.name}</div>
                      <div className="ab-tcard-role">{item.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="ab-preview-section">
            <SectionHeader
              eyebrow="Career Blog"
              title="Resume Tips and Career Guidance"
              desc="Read practical guides on resumes, interviews, skills, applications, and career planning."
              href="/blog/"
              cta="View all blogs"
            />
            <div className="ab-preview-grid">
              {initialBlogs.slice(0, 6).map((blog) => (
                <PreviewCard key={blog.id || getSlug(blog)} item={blog} type="blog" />
              ))}
            </div>
          </div>

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

          <div className="ab-faq-home">
            <div className="ab-faq-left">
              <p className="ab-kicker">FAQ</p>
              <h2>About ResumeSathi Questions</h2>
              <p>Clear answers about ResumeSathi tools, jobs, blogs, typing practice, and career preparation workflow.</p>
              <Link prefetch={false} href="/contact/" className="ab-typing-button">
                Contact us <ArrowIcon />
              </Link>
            </div>
            <div className="ab-faq-right">
              <div className="ab-faq-list">
                {faqs.map((faq, index) => (
                  <div
                    className={`ab-faq-item${openFaq === index ? ' ab-faq-item--open' : ''}`}
                    key={faq.q}
                  >
                    <button
                      type="button"
                      className="ab-faq-q"
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    >
                      <span>{faq.q}</span>
                      <span className={`ab-faq-icon${openFaq === index ? ' ab-faq-icon--open' : ''}`}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </span>
                    </button>
                    <div className="ab-faq-a-wrap">
                      <p className="ab-faq-a">{faq.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <section className="ab-final-cta" id="about-cta">
            <div className="ab-cta-bg-text" aria-hidden="true">FREE</div>
            <div className="ab-cta-content">
              <div className="ab-cta-badge"><Icon.Spark /> Free career toolkit</div>
              <h2>Build your resume, prepare your files, and apply smarter.</h2>
              <p>Start with an ATS-friendly resume or printable bio-data, then use ResumeSathi tools, typing practice, jobs, and blogs to keep your next application ready.</p>
              <div className="ab-cta-actions">
                <Link prefetch={false} className="ab-cta-btn-primary" href="/resume/resume-type/">
                  Create Your Resume <ArrowIcon />
                </Link>
                <Link prefetch={false} className="ab-cta-btn-ghost" href="/bio-data/resume-type/">
                  Create Bio-Data <ArrowIcon />
                </Link>
                <Link prefetch={false} className="ab-cta-btn-ghost" href="/tools/">
                  Explore Free Tools <ArrowIcon />
                </Link>
              </div>
              <p className="ab-cta-footnote"><Icon.Lock /> No signup needed for core tools - Built for job seekers</p>
            </div>
          </section>
        </div>
      </section>
      <Footer />
      <FooterNav />
    </>
  );
}
