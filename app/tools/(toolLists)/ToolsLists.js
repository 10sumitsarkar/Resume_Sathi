"use client";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import FooterNav from "../../components/FooterNav";
import ToolsSidebar from "../components/ToolsSidebar";
import {
  Banner468x60,
  Banner300x250,
  Banner728x90,
  NativeBanner,
} from "../../components/ads";
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

const IconKeyboard = () => (
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
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M7 10h.01M11 10h.01M15 10h.01M19 10h.01M7 14h10M17 14h.01" />
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
        href: "/tools/typing/",
        icon: <IconKeyboard />,
        tagIcon: <IconFileText />,
        title: "Typing Practice",
        desc: "Improve speed, accuracy, and touch typing with guided lessons and tests.",
        tag: "Typing",
        live: true,
      },
      {
        href: "/tools/id-card-maker/",
        icon: <IconIdBadge />,
        tagIcon: <IconFileText />,
        title: "ID Card Maker",
        desc: "Create printable ID cards and badges in browser with a clean preview flow.",
        tag: "Card",
        live: true,
      },
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
      {
        href: "/tools/background-remover/",
        icon: <IconImage />,
        tagIcon: <IconFileText />,
        title: "Background Remover",
        desc: "Remove backgrounds and download transparent PNGs.",
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
      <ToolsSidebar showDesktopSidebar={false} />
      <section className="container-fluid custom-container small-hero-area">
        <div className="left-part">
          <div>
            <label className="tl-eyebrow">
              <IconTools /> Free tools
            </label>
            <h1 className="fs-mob-22">Career & Document Tools</h1>
          </div>
          <p className="fs-mob-16">
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
              {group.key === "pdf" && (
                <div className="d-flex justify-content-center my-4">
                  <Banner728x90 />
                </div>
              )}
              {group.key === "utility" && (
                <div className="d-flex justify-content-center my-4">
                  <NativeBanner />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
      <section className="resume-content container-fluid custom-container pb-5 rk-article-text">
<h2>Free Online Tools for Job Applications, Forms and Everyday Documents</h2>

<p>Most people think a job application is finished once the resume is written. It usually isn't. The resume is the easy part. The trouble starts on the upload page, when the portal says it will only accept one PDF under 500 KB, your photo needs a white background, and your signature has to be exactly 140 by 60 pixels. All of this tends to come up the night before the last date.</p>

<p>That is the reason this Tools section exists on ResumeSathi. Each tool does one small job and does it quickly. You open it, finish the task, download the file and go back to your application. There is nothing to install and no account to create. Since the site is built so your data stays on your own device, your marksheets and ID proofs are not being handed around to strangers.</p>

<img src="/front-assets/images/tools/resumesathi-free-tools-overview.webp" alt="ResumeSathi free career and document tools page" width="600" height="315" loading="lazy" />

<blockquote>Most rejected applications don't fail because of a big mistake. A file is slightly too heavy, a photo is the wrong size, a page is upside down. These are small problems, and they shouldn't need expensive software to fix.</blockquote>

<h3>PDF Tools for Portals That Want Everything in One File</h3>

<p>Government job portals and a lot of company career pages ask for a single combined PDF. That one file is supposed to hold your resume, your 10th and 12th marksheets, your degree, an experience letter and an ID proof. Getting there usually means juggling a dozen scans and photos. The six PDF tools below cover that whole mess.</p>

<h4>Merge PDF</h4>
<p>This joins several PDFs into one file. You can drag the files into the order you want before merging, so your resume sits on top and the certificates follow. Think about the order before you click merge. A recruiter often reads only the first page properly, so it should be the one that matters most.</p>

<h4>Split PDF</h4>
<p>Sometimes you need the opposite. You might have a 40 page scanned file and the form wants only three pages from it. Split PDF lets you pull out the pages you need, or break one large file into smaller ones.</p>

<h4>Remove PDF Pages</h4>
<p>Scanners love to add a blank page at the end, and phone scanning apps sometimes capture the same page twice. Instead of scanning everything again, delete the unwanted pages and download a clean copy.</p>

<h4>Compress PDF</h4>
<p>File size limits cause more upload errors than anything else. A few photos scanned on a phone can easily reach 8 or 10 MB, while the portal stops at 1 MB. Compress PDF brings the size down so the file fits. Some quality is lost when a file shrinks, so open the result afterwards and zoom in to make sure the text and stamps are still readable.</p>

<h4>DOCX to PDF</h4>
<p>A resume made in Word can look different on another computer. Fonts shift, margins move and a heading lands alone at the bottom of a page. Converting to PDF locks the layout as you designed it. Most portals ask for PDF anyway, so this saves you a step.</p>

<h4>Image to PDF</h4>
<p>If your certificates exist only as phone photos, this tool turns JPG and PNG images into a proper PDF. Add several images and they come out as one document, which is exactly what most forms want.</p>

<div className="table-responsive">
  <table className="table table-bordered">
    <thead>
      <tr>
        <th>Tool</th>
        <th>Use it when</th>
        <th>Quick tip</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Merge PDF</td>
        <td>The portal wants resume, certificates and ID proof in one file</td>
        <td>Decide the page order first, then merge</td>
      </tr>
      <tr>
        <td>Split PDF</td>
        <td>You need only a few pages from a long scanned file</td>
        <td>Note the page numbers beforehand</td>
      </tr>
      <tr>
        <td>Remove PDF Pages</td>
        <td>A blank or duplicate page slipped into the file</td>
        <td>Check the preview before downloading</td>
      </tr>
      <tr>
        <td>Compress PDF</td>
        <td>Your file is above the portal's size limit</td>
        <td>Zoom into the result to confirm text is readable</td>
      </tr>
      <tr>
        <td>DOCX to PDF</td>
        <td>You want the Word layout to stay exactly as it is</td>
        <td>Proofread before converting</td>
      </tr>
      <tr>
        <td>Image to PDF</td>
        <td>Your documents are phone photos, not PDFs</td>
        <td>Keep the images straight and well lit</td>
      </tr>
    </tbody>
  </table>
</div>

<h3>Photo and Signature: Where Many Forms Get Stuck</h3>

<p>Nearly every application form ends with an upload section for a photo and a signature, and it is the place where a lot of people get stuck. The rules are strict. The photo has to be a certain width and height, under a certain size in KB, with a plain background. One pixel off and the portal throws an error without telling you much about what went wrong.</p>

<h4>Signature Cropper</h4>
<p>Sign on a white sheet of paper, take a photo with your phone and upload it. Then crop and resize it to the exact dimensions the form asks for. You don't need to hunt for a separate photo editing app just to trim a signature.</p>

<img src="/front-assets/images/tools/signature-cropper-form-size.webp" alt="Cropping a scanned signature to the exact size required by an application form" width="600" height="315" loading="lazy" />

<h4>Background Remover</h4>
<p>Need a passport size photo with a clean white background, or a neat photo for your resume or LinkedIn? Background Remover cuts out the background and gives you a transparent PNG. From there you can place the photo on white or any light colour the form accepts.</p>

<blockquote>Check the photo and signature requirements at the start, not after you have filled in everything else. Once you know the exact dimensions, the whole job takes about ten minutes.</blockquote>

<h3>Typing Practice for Exams Where Speed Counts</h3>

<p>Several government posts include a typing test. Clerk, data entry operator and stenographer roles are common examples. In these tests accuracy matters as much as speed, because every mistake pulls your score down.</p>

<p>The Typing Practice tool has guided lessons and timed tests. Start with the lessons to get your finger placement right, then take the tests to see how fast you type and how many errors you make. Half an hour every day for a few weeks does more than one long session the night before the exam.</p>

<h3>ID Card Maker for Schools, Offices and Events</h3>

<p>Ordering ID cards from a print shop can be expensive when you only need a few, or when you need them in a hurry. ID Card Maker lets you design printable ID cards and badges right in the browser. A live preview shows how the card will look, so you can fix a spelling mistake or a misplaced photo before anything goes to print.</p>

<p>It works well for a small school, a coaching centre, a short event or a new team that just needs temporary badges.</p>

<h3>Age Calculator for Checking Eligibility</h3>

<p>Almost every government recruitment notice has an age limit, and the age is counted on a specific cut-off date. A lot of applicants guess their age and find out later that they were a few days over the limit. That is a painful way to lose a year.</p>

<p>The Age Calculator gives your exact age in years, months and days. Enter the cut-off date from the notification and you will know straight away whether you are eligible. It also helps when a form asks for your age on a particular date and you don't want to count on your fingers.</p>

<h3>ATS Checker for One Last Look at Your Resume</h3>

<p>Many companies run resumes through an Applicant Tracking System before a person sees them. The software looks for keywords from the job description and checks whether the format can be read properly. A resume with tables, odd columns or missing keywords can be filtered out even when the candidate is a good fit.</p>

<p>The ATS Checker reads your resume and shows how compatible it is, along with how well your keywords match the role. It tells you what to change instead of leaving you to guess. The best time to use it is after your resume is written and before you send it anywhere.</p>

<h3>A Real Example: Filling a Government Job Form</h3>

<p>Say you are applying for a government post. The portal wants your resume, 10th and 12th marksheets, a graduation certificate, a photo and a signature. Here is how the tools fit together:</p>

<ol>
  <li>Check your age against the cut-off date with the Age Calculator.</li>
  <li>Build or update your resume in the Resume Builder, then run it through the ATS Checker.</li>
  <li>Turn your certificate photos into PDFs with Image to PDF.</li>
  <li>Join the resume and certificates into one file using Merge PDF.</li>
  <li>If the file is too large, shrink it with Compress PDF.</li>
  <li>Clean up your photo with Background Remover and fit your signature to the required size with Signature Cropper.</li>
  <li>Look through every file once, then upload.</li>
</ol>

<p>Done in this order, the whole thing often takes less than an hour, and you aren't panicking when the deadline is close.</p>
        <div className="d-flex justify-content-center my-4">
          <Banner300x250 />
        </div>

      <h3>When These Tools Make Sense, and When They Don't</h3>

<p>These tools are meant for quick, specific jobs. If you are laying out a 300 page book or doing serious photo retouching, you will want proper desktop software. But if you need to fix one form, one resume or one upload, these do the job without any fuss.</p>

<h3>Frequently Asked Questions</h3>

<h4>Are these tools really free?</h4>
<p>Yes. You can use them without signing up, and there is no card or account involved.</p>

<h4>Are my documents safe?</h4>
<p>ResumeSathi is built around the idea that your data stays on your device. Even so, it is a good habit to delete sensitive files like ID proofs from shared computers once you are done.</p>

<h4>Can I use them on my phone?</h4>
<p>Yes, they run in the browser, so they open on both phones and laptops. For large PDFs, a laptop is usually more comfortable.</p>

<h4>Will compressing a PDF ruin its quality?</h4>
<p>It can reduce quality a little, because that is how the file gets smaller. Open the compressed file and check that the text, signatures and stamps are still clear before you upload it.</p>

<blockquote>Write your resume in the Resume Builder and keep this Tools page open for everything else. Used together, they take most of the stress out of applying.</blockquote>

<p>New tools will be added over time, based on the problems people actually run into while applying for jobs. If you feel something important is missing, send a message through the Contact page and it will be looked at.</p>
        <div className="d-flex justify-content-center my-4">
          <Banner468x60 />
        </div>
      </section>
      <Footer />
      <FooterNav />
    </>
  );
}
