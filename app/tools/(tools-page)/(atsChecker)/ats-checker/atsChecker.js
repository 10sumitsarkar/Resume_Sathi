"use client";

import { useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../../../tools-css/ats-checker.css';
import ToolsPageAd from "../../../../tools/components/ToolsPageAd";

import {
  extractPdfText,
  extractPdfOCR,
  extractDocxText,
  calculateATSScore,
  calculateKeywordMatch,
} from "./ats-utils";

const AtsPdfPreview = dynamic(
  () => import("./AtsPdfPreview"),
  { ssr: false }
);

// ── Checklist items config ──────────────────
const CHECK_ITEMS = [
  { key: "email",      label: "Email Address" },
  { key: "phone",      label: "Phone Number" },
  { key: "linkedin",   label: "LinkedIn Profile" },
  { key: "education",  label: "Education Section" },
  { key: "experience", label: "Work Experience" },
  { key: "skills",     label: "Skills Section" },
  { key: "summary",    label: "Professional Summary" },
];

export default function AtsChecker() {

  const [file, setFile]                     = useState(null);
  const [loading, setLoading]               = useState(false);
  const [isImagePdf, setIsImagePdf]         = useState(false);
  const [ocrUsed, setOcrUsed]               = useState(false);
  const [analysis, setAnalysis]             = useState(null);
  const [jobDescription, setJobDescription] = useState("");

  const fileInputRef = useRef(null);

  // ── Core analysis logic ──────────────────
  const analyzeResume = async (uploadedFile) => {
    try {
      setLoading(true);
      let resumeText = "";

      if (uploadedFile.type === "application/pdf") {
        resumeText = await extractPdfText(uploadedFile);
        if (!resumeText || resumeText.trim().length < 100) {
          resumeText = await extractPdfOCR(uploadedFile);
        }
      } else {
        resumeText = await extractDocxText(uploadedFile);
      }

      const atsResult     = calculateATSScore(resumeText);
      const keywordResult = calculateKeywordMatch(resumeText, jobDescription);
      setAnalysis({ ...atsResult, ...keywordResult, resumeText });
      toast.success("Resume analyzed successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to analyze resume");
    } finally {
      setLoading(false);
    }
  };

  // ── File upload handler ──────────────────
  const handleFileUpload = useCallback(async (rawFiles) => {
    const uploadedFile = rawFiles?.[0];
    if (!uploadedFile) return;

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(uploadedFile.type)) {
      toast.error("Only PDF and DOCX files are supported");
      return;
    }

    const fileData = {
      id:      crypto.randomUUID(),
      file:    uploadedFile,
      preview: uploadedFile.type === "application/pdf"
               ? URL.createObjectURL(uploadedFile)
               : null,
    };

    setFile(fileData);
    await analyzeResume(uploadedFile);
  }, [jobDescription]);

  const handleInputChange = (e) => {
    handleFileUpload(e.target.files);
    e.target.value = "";
  };

  const handleDropZoneDragOver = (e) => e.preventDefault();
  const handleDropZoneDrop     = (e) => {
    e.preventDefault();
    handleFileUpload(e.dataTransfer.files);
  };

  // ── OCR ──────────────────────────────────
  const runOCRAnalysis = async () => {
    if (!file?.file) return;
    try {
      setLoading(true);
      const resumeText    = await extractPdfOCR(file.file);
      const atsResult     = calculateATSScore(resumeText);
      const keywordResult = calculateKeywordMatch(resumeText, jobDescription);
      setAnalysis({ ...atsResult, ...keywordResult, resumeText });
      setOcrUsed(true);
      setIsImagePdf(false);
      toast.success("OCR Analysis Completed");
    } catch (error) {
      console.error(error);
      toast.error("OCR Analysis Failed");
    } finally {
      setLoading(false);
    }
  };

  const runAnalysisAgain = async () => {
    if (!file?.file) {
      toast.error("Please upload resume first");
      return;
    }
    await analyzeResume(file.file);
  };

  const resetResume = () => {
    setIsImagePdf(false);
    setOcrUsed(false);
    if (file?.preview) URL.revokeObjectURL(file.preview);
    setFile(null);
    setAnalysis(null);
    setJobDescription("");
  };

  // ── Score label helper ───────────────────
  const getScoreLabel = (score) => {
    const s = parseInt(score, 10);
    if (s >= 80) return "Excellent";
    if (s >= 60) return "Good";
    if (s >= 40) return "Fair";
    return "Needs Work";
  };

  const getScoreBadgeClass = (score) => {
    const s = parseInt(score, 10);
    if (s >= 80) return "badge-excellent";
    if (s >= 60) return "badge-good";
    if (s >= 40) return "badge-fair";
    return "badge-needs-work";
  };

  // SVG ring circumference: r=52 → 2π×52 ≈ 326.73
  const CIRCUMFERENCE = 326.73;

  // ── PDF Preview content ──────────────────
  const PdfPreviewContent = () => (
    file?.preview ? (
      <AtsPdfPreview file={file.preview} />
    ) : (
      <div className="docx-preview-placeholder">
        <svg width="40" height="40" fill="none" stroke="#ccc" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
        <span>DOCX Preview Not Available</span>
      </div>
    )
  );

  // ── Render ───────────────────────────────
  return (
    <div className="tools-right-div custom-container py-custom pb-120 mb-3">
      <section className="ats-checker-tool mb-3 mb-md-5">

        {/* Header */}
        <div className="tool-header">
          <h1>ATS <span>Resume Checker</span></h1>
          <p>
            Upload your resume and get instant ATS insights,
            keyword matching, and optimization suggestions.
          </p>
        </div>
        <ToolsPageAd format="728x90" />

        {/* ── Upload Zone ── */}
        {!file && (
          <div
            className="drop-zone"
            onDragOver={handleDropZoneDragOver}
            onDrop={handleDropZoneDrop}
          >
            <input
              ref={fileInputRef}
              className="drop-zone-input"
              type="file"
              accept=".pdf,.docx"
              onChange={handleInputChange}
            />
            <div className="drop-zone-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <div className="drop-zone-title">Drag & Drop Resume Here</div>
            <div className="drop-zone-sub">Supports PDF and DOCX</div>
            <button
              className="drop-zone-btn"
              type="button"
              onClick={() => fileInputRef.current?.click()}
            >
              Select Resume
            </button>
          </div>
        )}

        {/* ── Results ── */}
        {file && analysis && (
          <>
            {/* ── Score Card ── */}
            <div className="ats-score-card">

              {/* Top Row: Circle Left + Checklist Right */}
              <div className="ats-score-top-row">

                {/* Left: SVG Ring + Badge */}
                <div className="ats-score-left">
                   <span className="ats-section-label">ATS Compatibility</span>
                  <div className="ats-score-ring-wrap">
                    <svg className="ats-score-ring" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="52" className="ring-track" />
                      <circle
                        cx="60" cy="60" r="52"
                        className="ring-fill"
                        strokeDasharray={`${(analysis.score / 100) * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
                      />
                    </svg>
                    <div className="ats-score-ring-inner">
                      <span className="ats-score-number">{analysis.score}</span>
                      <span className="ats-score-denom">/ 100</span>
                    </div>
                  </div>
                  <div className={`ats-score-badge ${getScoreBadgeClass(analysis.score)}`}>
                    {getScoreLabel(analysis.score)}
                  </div>
                </div>

                <div className="ats-divider"></div>

                {/* Right: Header + Checklist */}
                <div className="ats-score-right">
                  <div className="ats-score-right-header">
                    <span className="ats-section-label">Resume Checklist</span>
                    {file?.preview && (
                      <button
                        className="ats-preview-btn"
                        type="button"
                        data-bs-toggle="modal"
                        data-bs-target="#resumePreviewModal"
                      >
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                        View Resume
                      </button>
                    )}
                  </div>

                  <ul className="ats-check-list">
                    {CHECK_ITEMS.map(({ key, label }) => (
                      <li key={key} className={analysis.checks[key] ? "check-pass" : "check-fail"}>
                        <span className="check-icon">
                          {analysis.checks[key] ? (
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          ) : (
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8">
                              <line x1="18" y1="6" x2="6" y2="18"/>
                              <line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                          )}
                        </span>
                        {label}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* ── JD Matching ── */}
            <div className="ats-jd-card">
              <div className="ats-card-header">
                <p>Job Description Matching</p>
              </div>
              <textarea
                className="ats-jd-input"
                rows={6}
                placeholder="Paste job description here to check keyword match..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
              <button
                className="analyze-btn mt-3"
                type="button"
                onClick={runAnalysisAgain}
              >
                Analyze Against JD
              </button>
            </div>

            {/* ── Keyword Match ── */}
            <div className="ats-keyword-card">
              <div className="ats-card-header">
                <p>Keyword Match</p>
              </div>

              <div className="keyword-score">
                <span className="keyword-score-number">{analysis.keywordScore}</span>
                <span className="keyword-score-percent">%</span>
                <span>match with job description</span>
              </div>

              <div className="keyword-legend">
                <span>
                  <span className="dot dot-matched" />
                  Matched ({analysis.matchedKeywords?.length ?? 0})
                </span>
                <span>
                  <span className="dot dot-missing" />
                  Missing ({analysis.missingKeywords?.length ?? 0})
                </span>
              </div>

              <div className="keyword-tags">
                {analysis.matchedKeywords?.map((item) => (
                  <span key={item} className="keyword-tag matched">✓ {item}</span>
                ))}
                {analysis.missingKeywords?.map((item) => (
                  <span key={item} className="keyword-tag missing">✕ {item}</span>
                ))}
              </div>
            </div>

            {/* ── Suggestions ── */}
            <div className="ats-suggestions-card">
              <div className="ats-card-header">
                <p>Optimization Suggestions</p>
              </div>

              {analysis.suggestions?.length > 0 ? (
                <ul>
                  {analysis.suggestions.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <div className="ats-suggestions-empty">
                  🎉 Great job! No suggestions — your resume looks well-optimized.
                </div>
              )}
            </div>
          </>
        )}

        {/* ── Bootstrap Modal: Resume Preview (desktop + mobile) ── */}
        <div
          className="modal fade"
          id="resumePreviewModal"
          tabIndex="-1"
          aria-labelledby="resumePreviewModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content ats-modal-content">
              <div className="modal-header ats-modal-header">
                <h5 className="modal-title" id="resumePreviewModalLabel">Resume Preview</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body ats-modal-body">
                <PdfPreviewContent />
              </div>
            </div>
          </div>
        </div>

        {/* Loader */}
        {loading && (
       <div className='loader-div flex-column'>
                    <img src='/front-assets/images/pleasewait.gif' width={250} alt='Please wait' />
                    <p className='text-white m-0'>Analyzing Resume..</p>
                </div>
        )}

        <ToastContainer position="top-right" />
      </section>

      {/* Bottom Buttons */}
      {file && (
        <div className="tools-bottom-button-div">
          <button className="tool-outline-btn" type="button" onClick={resetResume}>
            Upload New
          </button>
          <button className="tool-solid-btn" type="button" onClick={runAnalysisAgain}>
            Re-Analyze
          </button>
        </div>
      )}

      {/* ============================================================
   ATS RESUME CHECKER — INFO / CONTENT SECTION
   Paste below the tool component's closing tag.
   ============================================================ */}

<ToolsPageAd native />
<section className="ats-checker-info">

  <div className="info-block">
    <h2>Check Your Resume the Way Hiring Software Reads It</h2>
    <p>
      Applying for a job usually means your resume meets a machine
      before it meets a person. Most companies, big or small, run
      incoming applications through an applicant tracking system, which
      sorts, filters and ranks them. If the software cannot find your
      email address or cannot make sense of your work history, your
      application may sit at the bottom of a pile that nobody opens.
      Nobody tells you this happened. You just never hear back.
    </p>
    <p>
      This ATS Checker is built to catch those problems early. Upload
      your resume, and it scans the text for seven things that hiring
      software commonly expects to find. You get a score out of 100 and
      a plain list of what is missing, so you can fix it before sending
      the resume anywhere.
    </p>
  </div>

  <div className="info-block">
    <h3>The Seven Things It Looks For</h3>
    <p>
      The checker does not judge your writing or your career. It only
      looks for the basic pieces that most ATS platforms try to pull
      out of a resume. Here is what each one means and why it matters.
    </p>
    <ul className="info-list info-list--plain">
      <li><strong>Email address:</strong> This is how a recruiter reaches you. If the software cannot read it, your application can end up with no contact details at all.</li>
      <li><strong>Phone number:</strong> Many recruiters still prefer a quick call, especially for fresher and entry level roles.</li>
      <li><strong>LinkedIn link:</strong> Plenty of hiring teams check your profile before they check anything else, so the link needs to be present and readable.</li>
      <li><strong>Work experience:</strong> The system tries to separate your jobs, titles and dates. A messy layout can scramble this part badly.</li>
      <li><strong>Education:</strong> Some roles filter on degree or institution, so this section has to be easy to find.</li>
      <li><strong>Skills:</strong> This is where most keyword matching happens, so a clear skills section helps a lot.</li>
      <li><strong>Summary:</strong> A short introduction at the top tells both the software and the recruiter who you are in a few lines.</li>
    </ul>
  </div>

  <blockquote>
    A resume can look perfect on your screen and still read as a
    jumble to software. The checker shows you the version the machine
    sees, not the one you see.
  </blockquote>

  <div className="info-block">
    <h3>How the Score Is Worked Out</h3>
    <p>
      Upload a PDF or a DOCX file and the tool reads the text inside
      it. It then looks for each of the seven items above. Every item
      it finds adds to your total, and the final number is out of 100.
      Anything missing is listed so you know exactly where the points
      were lost.
    </p>
    <p>
      People are often surprised by a low score on a resume they
      worked hard on. In most cases the reason is simple. One or two
      sections are missing, or they are placed somewhere the software
      cannot read, such as a header, a text box or an image. A person
      would spot that content immediately. A parser will not.
    </p>
  </div>

  <div className="info-block">
    <h3>Matching Your Resume to a Job Description</h3>
    <p>
      The score tells you whether your resume is readable. Keyword
      matching tells you whether it fits a particular job. Paste the
      job description into the box and the tool picks out the important
      terms, such as skills, software, certifications and job titles.
      It then shows which of those already appear in your resume and
      which do not.
    </p>
    <p>
      This matters because many ATS platforms rank applicants by how
      closely their resume matches the posting. Two candidates with
      almost the same experience can land far apart in that ranking
      only because one wrote "customer support" and the other wrote
      "client servicing" when the job post used the first phrase. The
      match list makes these gaps easy to see.
    </p>
  </div>

  <ToolsPageAd format="300x250" />

  <div className="info-block">
    <h3>Why Good Candidates Get Filtered Out</h3>
    <p>
      Most automatic rejections have nothing to do with ability. They
      come from formatting decisions that seemed harmless at the time.
      Someone puts their phone number in the page header because it
      looks tidy, and the parser skips the header completely. Someone
      else lays out their job history in a table with dates on the
      right, and the software reads the cells in the wrong order, so a
      2019 job appears to end before it began.
    </p>
    <p>
      None of this says anything about the person. It is just how
      parsers behave. Once you know it, the fixes are quick, and most
      of them take less than ten minutes.
    </p>
  </div>

  <div className="info-block">
    <h3>Mistakes That Cost People Points</h3>
    <ul className="info-list info-list--plain">
      <li><strong>Contact details in the header or footer.</strong> Move them into the main body, near your name.</li>
      <li><strong>Job history inside tables.</strong> Plain lines of text are safer than cells and columns.</li>
      <li><strong>Two column templates.</strong> The text can be read straight across both columns, which mixes unrelated lines together.</li>
      <li><strong>Vague skill names.</strong> If the job post says "Google Analytics", write that instead of "web tools".</li>
      <li><strong>No summary at all.</strong> Many people skip it because it feels optional. Recruiters usually look for it first.</li>
      <li><strong>Icons instead of words.</strong> A small phone symbol next to a number is fine, but a symbol with no number is just an image to the software.</li>
    </ul>
  </div>

  <ToolsPageAd format="468x60" />

  <div className="info-block">
    <h3>Using the Missing Keyword List Sensibly</h3>
    <p>
      When the tool lists keywords your resume lacks, resist the urge
      to paste every one of them in. Read through the list and keep
      only what is true for you. If you have actually used a tool or
      handled a task, add it, and put it inside a real sentence, such
      as a bullet under the job where you did that work. A word dropped
      at the bottom of the page with no context does very little.
    </p>
    <p>
      If a keyword does not match your background, leave it out. A
      recruiter will read your resume sooner or later, and an interview
      question about a skill you only pasted in for the score is an
      uncomfortable moment. Honest wording with a few missing keywords
      is a better position than a stuffed resume you cannot defend.
    </p>
  </div>

  <blockquote>
    Add a keyword only if you can talk about it for two minutes in an
    interview.
  </blockquote>

  <div className="info-block">
    <h3>A Simple Routine Before Every Application</h3>
    <ol>
      <li>Upload your current resume and note the first score.</li>
      <li>Fix whatever the checker flags as missing, starting with contact details and summary.</li>
      <li>Paste the job description for the role you are applying to.</li>
      <li>Add the genuine missing keywords in natural sentences.</li>
      <li>Run the check again and compare the two scores.</li>
      <li>Save the final file as a PDF, unless the portal asks for DOCX.</li>
    </ol>
    <p>
      Repeat steps three to five for each new job. The base resume
      stays the same, but the wording should lean a little toward each
      posting.
    </p>
  </div>

  <div className="info-block">
    <h3>Notes</h3>
    <ul className="info-list info-list--plain">
      <li>Your resume is checked inside your browser. Nothing gets uploaded to a server.</li>
      <li>Works with PDF and DOCX files, and scanned PDFs through OCR.</li>
      <li>Run the check again after editing to see if your score went up.</li>
      <li>Keyword matching only works once you paste in a job description.</li>
    </ul>
  </div>

  <ToolsPageAd format="300x250" />

  <div className="info-block">
    <h3>Questions</h3>
    <div className="faq-list">

      <details className="faq-item">
        <summary>Is this free?</summary>
        <p>
          Yes. There is no signup and no card needed, and you can run
          as many checks as you like. Upload, read the score, paste a
          job description and try again whenever you want.
        </p>
      </details>

      <details className="faq-item">
        <summary>Does a high score guarantee an interview?</summary>
        <p>
          No. A high score only means the software is less likely to
          trip over your resume. Whether you are called depends on your
          experience, the other applicants and the hiring team. Think
          of the score as clearing one hurdle, not winning the race.
        </p>
      </details>

      <details className="faq-item">
        <summary>Is my resume stored anywhere?</summary>
        <p>
          No. The check runs inside your own browser and the file is
          not sent to any server. When you close the tab, it is gone.
        </p>
      </details>

      <details className="faq-item">
        <summary>What file types can I upload?</summary>
        <p>
          PDF and DOCX. If your resume lives in Google Docs, download it
          as a PDF first. Scanned PDFs also work through OCR, though the
          result depends on how sharp the scan is. A blurry photo of a
          printout will not read well.
        </p>
      </details>

      <details className="faq-item">
        <summary>My resume looks fine but the score is low. Why?</summary>
        <p>
          Software reads raw text, not design. Tables, columns, text
          boxes and icons can hide content from it even when everything
          looks normal to you. Check which of the seven items the tool
          says is missing, then see whether that content sits in a
          header, a box or a column.
        </p>
      </details>

      <details className="faq-item">
        <summary>Should I avoid fancy templates with columns and icons?</summary>
        <p>
          If the company probably uses an ATS, a plain single column
          layout is the safer choice. Designed templates look good, but
          the text can be read in the wrong order. Keep the fancy
          version for cases where you are sure a person will see it
          first, like sending it directly to someone you know.
        </p>
      </details>

      <details className="faq-item">
        <summary>How often should I check my resume?</summary>
        <p>
          Once to get a starting point, once more after your fixes, and
          again with the keyword match for every new job you apply to.
          Job posts word similar roles differently, so a resume that
          matched one posting well can match the next one poorly.
        </p>
      </details>

      <details className="faq-item">
        <summary>Does this work exactly like the ATS my target company uses?</summary>
        <p>
          Not exactly. There are many ATS products and each behaves a
          little differently. This tool checks things that most of them
          care about, such as contact details, main sections and
          keywords. It is a solid general check, but it cannot copy one
          company's private system.
        </p>
      </details>

      <details className="faq-item">
        <summary>What is a good score to aim for?</summary>
        <p>
          Anything in the Good or Excellent range puts you in a decent
          spot. Do not chase a perfect 100 by adding things that are
          not true. A slightly lower score with honest content beats a
          high score that falls apart in an interview.
        </p>
      </details>

      <details className="faq-item">
        <summary>Is this only useful for tech jobs?</summary>
        <p>
          No. Applicant tracking systems are used in marketing,
          finance, healthcare, sales, teaching and most other fields.
          Keyword matching can be even more useful outside tech, since
          non-tech postings often name specific certifications,
          licences and tools that the software looks for.
        </p>
      </details>

      <details className="faq-item">
        <summary>Can freshers with no work experience use it?</summary>
        <p>
          Yes. If you have no jobs to list, internships, projects and
          training can go under the experience heading. A fresher
          resume will often score lower on that one item, which is
          normal. Focus on a clear summary, a solid skills section and
          good keyword matches for the role.
        </p>
      </details>

    </div>
  </div>

</section>
    </div>
  );
}