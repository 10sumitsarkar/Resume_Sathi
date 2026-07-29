"use client";

import { useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../../../tools-css/ats-checker.css';

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
    <div className="tools-right-div custom-container py-custom pb-120">
      <section className="ats-checker-tool">

        {/* Header */}
        <div className="tool-header">
          <h1>ATS <span>Resume Checker</span></h1>
          <p>
            Upload your resume and get instant ATS insights,
            keyword matching, and optimization suggestions.
          </p>
        </div>

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

<section className="ats-checker-info">

  <div className="info-block">
    <h2>What This Tool Checks</h2>
    <p>
      Before a recruiter opens your resume, a software system usually
      scans it first. This is called an ATS, and most companies use one
      today, even small ones. If your resume is missing a section, or
      the format confuses the software, it can get rejected before any
      human sees it. You never even find out why. This tool looks at
      your resume and checks it against 7 things ATS software usually
      looks for email, phone number, LinkedIn, work experience,
      education, skills, and a summary. Based on that it gives you a
      score out of 100 and tells you what's missing so you can fix it
      before you apply anywhere.
    </p>
  </div>

  <div className="info-block">
    <h3>How Scoring Works</h3>
    <p>
      Just upload your resume, either as a PDF or a DOCX file. The tool
      reads through the text and checks if it can find each of the 7
      sections: a working email, a phone number, a LinkedIn link, your
      work history, education, skills, and a short summary at the top.
      Every section it finds adds to your score. A lot of people are
      surprised their score is low even though their resume looks fine
      to them. Usually it's because one or two sections are missing, or
      the software just can't read them properly, even if a human eye
      would catch it easily.
    </p>
  </div>

  <div className="info-block">
    <h3>Job Description Matching</h3>
    <p>
      You can also paste in a job description and the tool will compare
      it to your resume. It pulls out the important words from the job
      post things like specific skills, tools, or job titles and
      shows you which ones your resume already has and which ones are
      missing. A lot of ATS systems actually rank resumes based on how
      many of these words match before a recruiter even looks at them
      manually. So two people with similar experience can get very
      different results just because one used the same wording as the
      job post and the other didn't.
    </p>
  </div>

  <div className="info-block">
    <h3>Why This Actually Matters</h3>
    <p>
      A lot of resumes get rejected for reasons that have nothing to do
      with the person's actual skills. Maybe the contact info was put in
      the header, and the ATS software skipped that part completely.
      Maybe the resume used a table for job titles and dates, and the
      software read it in the wrong order or missed it. These are small
      formatting choices, but they can knock a genuinely good candidate
      out of the running before anyone even reads their resume properly.
      Once you know this happens, it's easier to avoid it.
    </p>
  </div>

  <div className="info-block">
    <h3>Mistakes People Make Without Realizing</h3>
    <p>
      Putting your email or phone number in the header or footer is a
      common one some ATS tools just don't read that area. Using
      tables for your job history is another, since the software can
      read the cells out of order. Writing your skills in vague words
      instead of the exact terms from the job post also hurts your
      match score. And a lot of people skip the summary section
      entirely, thinking it's not important, when actually both the
      software and the recruiter usually look for it right at the top.
    </p>
  </div>

  <div className="info-block">
    <h3>How To Use The Keyword List Properly</h3>
    <p>
      When you see the list of missing keywords, don't just paste all
      of them into your resume blindly. Go through the list and only
      add the ones that are actually true for you something you've
      really done or used. Add them in a normal sentence, not just as a
      random word dropped in. If a keyword doesn't fit your background
      at all, skip it. Recruiters do read the resume eventually, and
      keywords with no real substance behind them usually stand out in
      a bad way.
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

  <div className="info-block">
    <h3>Questions</h3>
    <div className="faq-list">

      <details className="faq-item">
        <summary>Is this free?</summary>
        <p>
          Yes, it's completely free. No signup, no card details, no
          limit on how many times you can use it. Upload, check your
          score, paste a job description, run it again as many times as
          you want.
        </p>
      </details>

      <details className="faq-item">
        <summary>Does a high score guarantee an interview?</summary>
        <p>
          No, and I don't want to promise something untrue here. A high
          score just means your resume is less likely to get filtered
          out by the software. What happens after that whether you
          get called for an interview depends on your actual
          experience and how well you do after that point.
        </p>
      </details>

      <details className="faq-item">
        <summary>Is my resume stored anywhere?</summary>
        <p>
          No. Everything happens inside your own browser. Your file is
          never sent anywhere. Close the tab and it's gone.
        </p>
      </details>

      <details className="faq-item">
        <summary>What file types can I upload?</summary>
        <p>
          PDF and DOCX, which covers most resumes people already have.
          If yours is in Google Docs or something else, just export it
          as a PDF first. Scanned PDFs work too, through OCR, though the
          result depends on how clear the scan is.
        </p>
      </details>

      <details className="faq-item">
        <summary>My resume looks fine but the score is low. Why?</summary>
        <p>
          The software doesn't see your resume the way you do. It reads
          raw text only. If you're using tables, columns, or icons, the
          software might not read that content correctly even though it
          looks perfectly normal to your eyes.
        </p>
      </details>

      <details className="faq-item">
        <summary>Should I avoid fancy templates with columns and icons?</summary>
        <p>
          If you're applying somewhere that likely uses an ATS, yes, a
          simple layout usually works better. Multi-column resumes look
          nice but the software can read the text in the wrong order or
          skip parts of it. Save the fancier designs for situations
          where you know a person will look at it first.
        </p>
      </details>

      <details className="faq-item">
        <summary>How often should I check my resume?</summary>
        <p>
          Check it once to get a starting score, fix what it flags, then
          check again. It's also worth running the keyword match every
          time you apply somewhere new, since job posts use different
          wording even for similar roles.
        </p>
      </details>

      <details className="faq-item">
        <summary>Does this work exactly like the ATS my target company uses?</summary>
        <p>
          Not exactly, since there are many different ATS platforms out
          there and each works a little differently. This tool checks
          the things that show up across most of them sections,
          contact info, keyword match. It's a solid general check, but
          it can't promise to match one specific company's system
          exactly.
        </p>
      </details>

      <details className="faq-item">
        <summary>What's a good score to aim for?</summary>
        <p>
          Anywhere in the "Good" or "Excellent" range gives you a decent
          shot. Don't force a perfect score by adding things that aren't
          true about you. A slightly lower score with honest content is
          better than a high score that falls apart when someone asks
          you a follow-up question.
        </p>
      </details>

      <details className="faq-item">
        <summary>Is this only useful for tech jobs?</summary>
        <p>
          No, it works for any field. ATS software is used in marketing,
          finance, healthcare, sales, and pretty much everywhere else
          too. The keyword matching is actually just as useful outside
          tech, since non-tech job posts often have specific terms and
          certifications that matter a lot.
        </p>
      </details>

    </div>
  </div>

</section>
    </div>
  );
}