'use client';
import NavBar from '../../components/NavBar';
import Footer from "../../components/Footer";
import FooterNav from '../../components/FooterNav';
import './tools-lists.css';

// ── SVG Icons ──────────────────────────────────
const IconIdBadge = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" />
    <path d="M15 8h2M15 12h2M7 16h10" />
  </svg>
);

const IconClipboardCheck = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const IconFileText = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const IconFilePdf = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M8 13h1.5a1.5 1.5 0 0 0 0-3H8v6M15 10h-1v6h1M12 10v6" />
  </svg>
);

const IconFilePdfSmall = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M8 13h1.5a1.5 1.5 0 0 0 0-3H8v6" />
  </svg>
);

const IconFiles = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" />
    <polyline points="15 2 15 8 21 8" />
    <path d="M9 18V12M9 12l-2 2M9 12l2 2" />
  </svg>
);

const IconScissors = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
    <line x1="20" y1="4" x2="8.12" y2="15.88" />
    <line x1="14.47" y1="14.48" x2="20" y2="20" />
    <line x1="8.12" y1="8.12" x2="12" y2="12" />
  </svg>
);

const IconFileZip = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M12 14v1a1 1 0 0 0 1 1h0a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h0" />
  </svg>
);

const IconFileWord = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M8 13l2 6 2-4 2 4 2-6" />
  </svg>
);

const IconArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const IconTools = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

// ── Tool Groups Data ────────────────────────────
const TOOL_GROUPS = [
  {
    key: "resume",
    icon: <IconIdBadge />,
    label: "Resume",
    tools: [
      {
        href: "/tools/ats-checker",
        icon: <IconClipboardCheck />,
        tagIcon: <IconFileText />,
        title: "ATS Checker",
        desc: "Analyze your resume for ATS compatibility and keyword alignment.",
        tag: "Resume",
        live: true,
      },
    ],
  },
  {
    key: "pdf",
    icon: <IconFilePdf />,
    label: "PDF",
    tools: [
      {
        href: "/tools/merge-pdf",
        icon: <IconFiles />,
        tagIcon: <IconFilePdfSmall />,
        title: "Merge PDF",
        desc: "Combine multiple PDFs into one. Drag to reorder before merging.",
        tag: "PDF only",
        live: true,
      },
      {
        icon: <IconScissors />,
        tagIcon: <IconFilePdfSmall />,
        title: "Split PDF",
        desc: "Extract pages or split a PDF into multiple files.",
        tag: "PDF only",
        live: false,
      },
      {
        href: "/tools/pdf-compressor",
        icon: <IconFileZip />,
        tagIcon: <IconFilePdfSmall />,
        title: "Compress PDF",
        desc: "Reduce file size for easy sharing on job portals.",
        tag: "PDF only",
        live: true,
      },
      {
        icon: <IconFileWord />,
        tagIcon: <IconFileText />,
        title: "DOCX to PDF",
        desc: "Convert Word documents to PDF without losing formatting.",
        tag: "DOCX",
        live: false,
      },
    ],
  },
];

// ── Component ───────────────────────────────────
export default function ToolsLists() {
  return (
    <>
      <NavBar />
      <section className="container-fluid custom-container small-hero-area">

        <div className='left-part'>
          <div>
            <label className="tl-eyebrow">
              <IconTools /> Free tools
            </label>
            <h1 className="fs-mob-22">Career & Document Tools</h1>
          </div>
          <p className='className="fs-mob-16"'>Everything you need to optimize resumes, manage PDF documents, and streamline your job application workflow—all in one place.</p>
        </div>
        <div className='right-part d-none d-md-block'>
          <img src={'/front-assets/images/tools-hero.webp'} className='img-fluid' width={500} />
        </div>
      </section>
      <section className="tool-list py-custom pb-120">
        <div className="container-fluid custom-container">
          {TOOL_GROUPS.map((group) => (
            <div key={group.key} className="tl-group">

              <div className="tl-group-header">
                <div className="tl-group-icon">{group.icon}</div>
                <span className="tl-group-title">
                  {group.label}
                  <span className="tl-group-count">
                    {group.tools.length} tool{group.tools.length > 1 ? "s" : ""}
                  </span>
                </span>
                <div className='tl-group-line'></div>
              </div>

              <div className="row g-3">
                {group.tools.map((tool) =>
                  tool.live ? (
                    <div key={tool.title} className="col-sm-6 col-md-4 col-lg-3">
                      <a className="tl-card" href={tool.href}>
                        <div className="tl-card-top">
                          <div className="tl-card-icon">{tool.icon}</div>
                        </div>
                        <div className="tl-card-title">{tool.title}</div>
                        <div className="tl-card-desc">{tool.desc}</div>
                        <div className="tl-card-footer">
                          <span className="tl-card-tag">
                            {tool.tagIcon}{tool.tag}
                          </span>
                          <span className="tl-card-arrow"><IconArrowRight /></span>
                        </div>
                      </a>
                    </div>
                  ) : (
                    <div key={tool.title} className="col-sm-6 col-md-4 col-lg-3">
                      <div className="tl-card tl-card--soon">
                        <div className="tl-card-top">
                          <div className="tl-card-icon">{tool.icon}</div>
                          <span className="tl-soon-badge">Soon</span>
                        </div>
                        <div className="tl-card-title">{tool.title}</div>
                        <div className="tl-card-desc">{tool.desc}</div>
                        <div className="tl-card-footer">
                          <span className="tl-card-tag">
                            {tool.tagIcon}{tool.tag}
                          </span>
                          <span className="tl-card-arrow"><IconArrowRight /></span>
                        </div>
                      </div>
                    </div>

                  )
                )}
              </div>

            </div>
          ))}

        </div>
      </section>
      <Footer/>
      <FooterNav />
    </>
  );
}