"use client";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import FooterNav from "../../components/FooterNav";
import "./tools-lists.css";

// ── SVG Icons ──────────────────────────────────
const IconIdBadge = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <circle cx="9" cy="10" r="2" />
    <path d="M15 8h2M15 12h2M7 16h10" />
  </svg>
);

const IconClipboardCheck = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const IconFileText = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const IconFilePdf = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M8 13h1.5a1.5 1.5 0 0 0 0-3H8v6M15 10h-1v6h1M12 10v6" />
  </svg>
);

const IconFilePdfSmall = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M8 13h1.5a1.5 1.5 0 0 0 0-3H8v6" />
  </svg>
);

const IconFiles = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" />
    <polyline points="15 2 15 8 21 8" />
    <path d="M9 18V12M9 12l-2 2M9 12l2 2" />
  </svg>
);

const IconScissors = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="6" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <line x1="20" y1="4" x2="8.12" y2="15.88" />
    <line x1="14.47" y1="14.48" x2="20" y2="20" />
    <line x1="8.12" y1="8.12" x2="12" y2="12" />
  </svg>
);

const IconFileZip = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M12 14v1a1 1 0 0 0 1 1h0a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h0" />
  </svg>
);

const IconFileWord = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M8 13l2 6 2-4 2 4 2-6" />
  </svg>
);

const IconTrashFile = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M9 13h6" />
    <path d="M10 17h4" />
  </svg>
);

const IconImage = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="m21 15-5-5L5 21" />
  </svg>
);

const IconCalendar = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

const IconCrop = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6.13 1 6 16a2 2 0 0 0 2 2h15" />
    <path d="M1 6.13 16 6a2 2 0 0 1 2 2v15" />
  </svg>
);

const IconArrowRight = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const IconTools = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
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
        href: "/tools/ats-checker/",
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
        href: "/tools/merge-pdf/",
        icon: <IconFiles />,
        tagIcon: <IconFilePdfSmall />,
        title: "Merge PDF",
        desc: "Combine multiple PDFs into one. Drag to reorder before merging.",
        tag: "PDF only",
        live: true,
      },
      {
        href: "/tools/split-pdf/",
        icon: <IconScissors />,
        tagIcon: <IconFilePdfSmall />,
        title: "Split PDF",
        desc: "Extract pages or split a PDF into multiple files.",
        tag: "PDF only",
        live: true,
      },
      {
        href: "/tools/pdf-remove/",
        icon: <IconTrashFile />,
        tagIcon: <IconFilePdfSmall />,
        title: "Remove PDF Pages",
        desc: "Delete unwanted pages from a PDF and download a clean file.",
        tag: "PDF only",
        live: true,
      },
      {
        href: "/tools/pdf-compressor/",
        icon: <IconFileZip />,
        tagIcon: <IconFilePdfSmall />,
        title: "Compress PDF",
        desc: "Reduce file size for easy sharing on job portals.",
        tag: "PDF only",
        live: true,
      },
      {
        href: "/tools/docx-to-pdf/",
        icon: <IconFileWord />,
        tagIcon: <IconFileText />,
        title: "DOCX to PDF",
        desc: "Convert Word documents to PDF without losing formatting.",
        tag: "DOCX",
        live: true,
      },
      {
        href: "/tools/image-to-pdf/",
        icon: <IconImage />,
        tagIcon: <IconFilePdfSmall />,
        title: "Image to PDF",
        desc: "Convert JPG and PNG images into one clean PDF.",
        tag: "Images",
        live: true,
      },
    ],
  },
  {
    key: "utility",
    icon: <IconTools />,
    label: "Utility",
    tools: [
      {
        href: "/tools/age-calculator/",
        icon: <IconCalendar />,
        tagIcon: <IconFileText />,
        title: "Age Calculator",
        desc: "Calculate exact age in years, months, and days.",
        tag: "Date",
        live: true,
      },
      {
        href: "/tools/signature-cropper/",
        icon: <IconCrop />,
        tagIcon: <IconFilePdfSmall />,
        title: "Signature Cropper",
        desc: "Crop and resize signatures to exact form dimensions.",
        tag: "Image",
        live: true,
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
        <div className="left-part">
          <div>
            <label className="tl-eyebrow">
              <IconTools /> Free tools
            </label>
            <h1 className="fs-mob-22">Career & Document Tools</h1>
          </div>
          <p className='className="fs-mob-16"'>
            Everything you need to optimize resumes, manage PDF documents, and
            streamline your job application workflow—all in one place.
          </p>
        </div>
        <div className="right-part d-none d-md-block">
          <img
            src="/front-assets/images/tools-hero.webp"
            className="img-fluid"
            width={500}
            height={360}
            alt="ResumeSathi free career and document tools"
            loading="eager"
            fetchPriority="high"
          />
        </div>
      </section>
      <section className="tool-list py-custom">
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
                <div className="tl-group-line"></div>
              </div>

              <div className="row g-3">
                {group.tools.map((tool) =>
                  tool.live ? (
                    <div
                      key={tool.title}
                      className="col-sm-6 col-md-4 col-lg-3"
                    >
                      <a className="tl-card" href={tool.href}>
                        <div className="tl-card-top">
                          <div className="tl-card-icon">{tool.icon}</div>
                        </div>
                        <div className="tl-card-title">{tool.title}</div>
                        <div className="tl-card-desc">{tool.desc}</div>
                        <div className="tl-card-footer">
                          <span className="tl-card-tag">
                            {tool.tagIcon}
                            {tool.tag}
                          </span>
                          <span className="tl-card-arrow">
                            <IconArrowRight />
                          </span>
                        </div>
                      </a>
                    </div>
                  ) : (
                    <div
                      key={tool.title}
                      className="col-sm-6 col-md-4 col-lg-3"
                    >
                      <div className="tl-card tl-card--soon">
                        <div className="tl-card-top">
                          <div className="tl-card-icon">{tool.icon}</div>
                          <span className="tl-soon-badge">Soon</span>
                        </div>
                        <div className="tl-card-title">{tool.title}</div>
                        <div className="tl-card-desc">{tool.desc}</div>
                        <div className="tl-card-footer">
                          <span className="tl-card-tag">
                            {tool.tagIcon}
                            {tool.tag}
                          </span>
                          <span className="tl-card-arrow">
                            <IconArrowRight />
                          </span>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="resume-content container-fluid custom-container pb-5 rk-article-text">
        <h2>Free Online Tools</h2>
        <p>
          ResumeSathi's tools section exists because job applications rarely
          stop at just the resume. Somewhere along the way you're merging PDFs
          for a portal that only accepts one file, tweaking a gradient for a
          portfolio page, or trying to get a small animation working on a
          website without pulling in a whole design tool for a five-minute job.
          These utilities are built for exactly that — quick browser tasks that
          students, job seekers, and small teams need done without installing
          anything or signing up for another paid subscription.
        </p>
        <p>
          Nothing here is meant to be complicated. You open the tool, do the one
          thing it's built for, and get back to whatever you were actually
          working on — the resume, the application form, the portfolio site,
          whatever it was. That's really the whole idea behind keeping these
          separate from the main resume builder instead of cramming everything
          into one place.
        </p>

        <blockquote className="ps-3 my-4 fst-italic">
          A tool doesn't need to be big to be useful. It just needs to solve the
          one small problem that's stopping you from finishing everything else.
        </blockquote>

        <p>
          The PDF tools come in handy more often than people expect. A lot of
          job portals and government application forms ask for a single combined
          PDF — your resume, certificates, and ID proof all in one file — and
          merging three or four separate PDFs shouldn't require downloading
          desktop software just to do it once. The same goes for situations
          where you need to split a large PDF, rearrange pages, or shrink a file
          that's too big for an upload limit. These are small jobs, but they
          hold up an entire application if you don't have a quick way to handle
          them.
        </p>

        <div className="table-responsive my-4">
          <table className="table table-bordered align-middle">
            <thead>
              <tr>
                <th>Tool</th>
                <th>Useful for</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>PDF Merge</td>
                <td>
                  Combining resume, certificates, and ID proof into one file for
                  job portals
                </td>
              </tr>
              <tr>
                <td>CSS Gradient Generator</td>
                <td>
                  Getting clean background colors for a portfolio or personal
                  website without guessing hex codes
                </td>
              </tr>
              <tr>
                <td>Animation Snippets</td>
                <td>
                  Copy-ready CSS animations for buttons, cards, and hover
                  effects
                </td>
              </tr>
              <tr>
                <td>Resume Builder</td>
                <td>
                  Bringing everything together into a complete, ready-to-send
                  application
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          The design tools serve a different kind of need. If you're building a
          portfolio site to go along with your resume, or just want a personal
          page that doesn't look like a default template, small things like a
          proper gradient or a smooth animation make more difference than people
          expect. The gradient generator lets you pick colors visually and get
          the CSS code without sitting there adjusting hex values by trial and
          error. The animation snippets work the same way — pick something close
          to what you want, copy the code, and drop it into your project instead
          of writing it from scratch.
        </p>
        <p>
          None of these tools try to replace proper design or development
          software. They're built for the smaller, in-between moments — when you
          need one specific thing done and don't want to open a heavier
          application just for that. A student prepping for internship
          applications might use the PDF merge tool once and never touch it
          again for months. Someone building their first portfolio site might
          live in the gradient tool for an afternoon. Both uses are exactly what
          these were made for.
        </p>
        <p>
          Use the PDF tools when a job portal specifically asks for one combined
          document instead of separate attachments — this comes up more often
          with government job applications and formal recruitment portals than
          most people expect. Use the design tools when you're setting up
          something visual, whether that's a portfolio, a personal site, or even
          just a form that needs to look presentable. And when you're ready to
          actually put together the application itself, that's when it makes
          sense to head back to the resume builder and bring everything into one
          finished document.
        </p>
        <p>
          These tools will keep growing over time based on what people actually
          run into while applying for jobs — small, repetitive tasks that don't
          deserve their own separate app but still need to get done properly. If
          there's a gap between what the resume builder covers and what a real
          application actually requires, that's usually where a new tool ends up
          here next.
        </p>
      </section>
      <Footer />
      <FooterNav />
    </>
  );
}
