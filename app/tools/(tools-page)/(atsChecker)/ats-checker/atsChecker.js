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
    <div className="tools-right-div custom-container py-custom pb-0">
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
    </div>
  );
}