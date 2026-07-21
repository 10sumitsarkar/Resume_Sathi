"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../tools-css/pdf-compressor.css";

const PdfPreviewClient = dynamic(() => import("../../(pdfMerge)/merge-pdf/PdfPreviewClient"), {
  ssr: false,
});

const OPTIONS = [
  {
    value: "extreme",
    title: "Extreme Compression",
    desc: "Smallest file size, lower quality",
  },
  {
    value: "recommended",
    title: "Recommended Compression",
    desc: "Good quality, good compression",
  },
  {
    value: "less",
    title: "Less Compression",
    desc: "Better quality, larger file size",
  },
];

// ── Circular compression-ratio indicator ──────────────────────
function CompressionRing({ percentage }) {
  const size = 140;
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const safePct = Math.max(0, Math.min(100, percentage || 0));
  const offset = circumference - (safePct / 100) * circumference;

  return (
    <svg
      className="compression-ring"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
    >
      <circle
        className="ring-bg"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={stroke}
      />
      <circle
        className="ring-progress"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
      <text x="50%" y="47%" textAnchor="middle" className="ring-value">
        {safePct}%
      </text>
      <text x="50%" y="65%" textAnchor="middle" className="ring-label">
        saved
      </text>
    </svg>
  );
}

export default function PdfCompressor() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [quality, setQuality] = useState("recommended");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [dropZoneDragOver, setDropZoneDragOver] = useState(false);
  const [pageDragOver, setPageDragOver] = useState(false);
  const [showQualityModal, setShowQualityModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const fileInputRef = useRef(null);

  // ── helpers ──────────────────────────────────────────────────
  function formatSize(size) {
    if (!size) return "";
    if (size < 1024) return size + " Bytes";
    if (size < 1024 * 1024) return (size / 1024).toFixed(2) + " KB";
    return (size / (1024 * 1024)).toFixed(2) + " MB";
  }

  function parsePercentage(value) {
    if (value === null || value === undefined) return 0;
    const num = parseFloat(String(value).replace("%", ""));
    return isNaN(num) ? 0 : Math.round(num);
  }

  const addFile = (rawFiles) => {
    const picked = Array.from(rawFiles).find(
      (f) => f.type === "application/pdf"
    );
    if (!picked) {
      toast.error("Only PDF files are accepted");
      return;
    }
    if (preview) URL.revokeObjectURL(preview);
    setFile(picked);
    setPreview(URL.createObjectURL(picked));
    setResult(null);
  };

  const handleFileInputChange = (e) => {
    addFile(e.target.files);
    e.target.value = "";
  };

  // ── drop zone (OS file drop) ─────────────────────────────────
  const handleDropZoneDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDropZoneDragOver(true);
  };
  const handleDropZoneDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDropZoneDragOver(false);
  };
  const handleDropZoneDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDropZoneDragOver(false);
    addFile(e.dataTransfer.files);
  };

  // ── page-level OS drop (replace file once one exists) ────────
  const handlePageDragOver = (e) => {
    e.preventDefault();
    setPageDragOver(true);
  };
  const handlePageDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setPageDragOver(false);
  };
  const handlePageDrop = (e) => {
    e.preventDefault();
    setPageDragOver(false);
    addFile(e.dataTransfer.files);
  };

  // ── remove / reset to the very first (drop-zone) screen ──────
  const resetToStart = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setResult(null);
    setLoading(false);
    setShowQualityModal(false);
    setShowPreviewModal(false);
  };

  // ── compress ──────────────────────────────────────────────────
  const compressPdf = async () => {
    if (!file) {
      toast.error("Please select a PDF file");
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const formData = new FormData();
      formData.append("pdf", file);
      formData.append("quality", quality);

      const response = await fetch(
        "https://api.resumesathi.com/api/pdf/compress",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Compression failed");
      }

      setResult(data);
      toast.success("PDF compressed successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to compress PDF");
    } finally {
      setLoading(false);
    }
  };

  // ── download compressed file (direct download, no new tab) ───
const downloadResult = () => {
  if (!result?.download_url) return;

  window.location.href = result.download_url;
};

  const savedPct = result ? parsePercentage(result.saved_percentage) : 0;

  return (
    <div className="tools-right-div custom-container py-custom pb-120">
      <section
        className={`pdf-compress-tool${pageDragOver ? " page-drag-over" : ""}`}
        onDragOver={file ? handlePageDragOver : undefined}
        onDragLeave={file ? handlePageDragLeave : undefined}
        onDrop={file ? handlePageDrop : undefined}
      >
        {/* Header */}
        <div className="tool-header">
          <h1>
            Compress <span>PDF</span> Online
          </h1>
          <p>
            Reduce your PDF file size without losing the quality you need.{" "}
            <br /> <span>Fast, secure, and hassle-free</span>
          </p>
        </div>

        {/* Drop zone — hidden once a file is added */}
        {!file && (
          <div
            className={`drop-zone${dropZoneDragOver ? " drag-over" : ""}`}
            onDragOver={handleDropZoneDragOver}
            onDragLeave={handleDropZoneDragLeave}
            onDrop={handleDropZoneDrop}
          >
            <input
              ref={fileInputRef}
              className="drop-zone-input"
              type="file"
              accept=".pdf"
              onChange={handleFileInputChange}
            />
            <div className="drop-zone-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <div className="drop-zone-title">
              {dropZoneDragOver ? "Release to add PDF" : "Drag & Drop PDF file here"}
            </div>
            <div className="drop-zone-sub">
              or <span>browse from your device</span>
            </div>
            <button
              className="drop-zone-btn"
              onClick={() => fileInputRef.current?.click()}
              type="button"
            >
              Select PDF File
            </button>
          </div>
        )}

        {/* Page-level OS drop overlay */}
        {pageDragOver && (
          <div className="page-drop-overlay">
            <div className="page-drop-inner">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <p>Drop PDF to replace</p>
            </div>
          </div>
        )}

        {/* Selected file + compression options (before compressing) */}
        {file && !result && (
          <div className="pdf-workspace">
            {/* Left: PDF preview card */}
            <div className="pdf-card-wrap">
              <h2 className="section-subtitle d-none d-md-block">PDF Preview</h2>
              <div className="pdf-card">
                <button
                  className="pdf-remove"
                  onClick={resetToStart}
                  type="button"
                  title="Remove"
                >
                  ×
                </button>

                <div className="pdf-preview-wrap">
                  <PdfPreviewClient file={preview} />
                </div>

                <div className="pdf-info">
                  <div className="pdf-name" title={file.name}>
                    {file.name}
                  </div>
                  <div className="pdf-size">{formatSize(file.size)}</div>
                </div>
                
              </div>
              <button
                  className="mobile-quality-trigger"
                  type="button"
                  onClick={() => setShowQualityModal(true)}
                >
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
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                  {OPTIONS.find((o) => o.value === quality)?.title || "Compression Level"}
                </button>
            </div>

            {/* Right: Compression level options */}
            <div className="pdf-side-panel">
              <div className="quality-options">
                <h2 className="section-subtitle">Compression Level</h2>
                {OPTIONS.map((item) => (
                  <label
                    key={item.value}
                    className={`quality-card${
                      quality === item.value ? " active" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="quality"
                      value={item.value}
                      checked={quality === item.value}
                      onChange={(e) => setQuality(e.target.value)}
                      disabled={loading}
                    />
                    <span className="quality-title">{item.title}</span>
                    <p className="quality-desc">{item.desc}</p>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Result (after compressing) — single centered card, preview via modal */}
        {file && result && (
          <div className="pdf-result-wrap">
            <div className="compress-result">
              <h2 className="section-subtitle d-none">Compression Complete 🎉</h2>

              

              <div className="result-ring-wrap">
                <CompressionRing percentage={savedPct} />
              </div>

              <div className="result-file-row">
                <div className="result-file-name" title={file.name}>
                  {file.name}
                </div>
                <button
                  className="preview-pdf-btn"
                  type="button"
                  onClick={() => setShowPreviewModal(true)}
                >
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
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  Preview
                </button>
              </div>

              <div className="result-stats">
                <p>
                  Original Size: <b>{result.original_size}</b>
                </p>
                <p>
                  Compressed Size: <b>{result.compressed_size}</b>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Mobile: Compression Level modal */}
        {showQualityModal && !result && (
          <div
            className="quality-modal-overlay"
            onClick={() => setShowQualityModal(false)}
          >
            <div
              className="quality-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="quality-modal-header">
                <h2 className="section-subtitle">Compression Level</h2>
                <button
                  className="quality-modal-close"
                  type="button"
                  onClick={() => setShowQualityModal(false)}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              <div className="quality-options">
                {OPTIONS.map((item) => (
                  <label
                    key={item.value}
                    className={`quality-card${
                      quality === item.value ? " active" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="quality-modal"
                      value={item.value}
                      checked={quality === item.value}
                      onChange={(e) => setQuality(e.target.value)}
                      disabled={loading}
                    />
                    <span className="quality-title">{item.title}</span>
                    <p className="quality-desc">{item.desc}</p>
                  </label>
                ))}
              </div>

              <button
                className="quality-modal-apply"
                type="button"
                onClick={() => setShowQualityModal(false)}
              >
                Apply
              </button>
            </div>
          </div>
        )}

        {/* PDF Preview modal (shown after compression, all screen sizes) */}
        {showPreviewModal && result && (
          <div
            className="preview-modal-overlay"
            onClick={() => setShowPreviewModal(false)}
          >
            <div
              className="preview-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="quality-modal-header">
                <h2 className="section-subtitle">PDF Preview</h2>
                <button
                  className="quality-modal-close"
                  type="button"
                  onClick={() => setShowPreviewModal(false)}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              <div className="preview-modal-canvas">
                <PdfPreviewClient file={preview} />
              </div>

              <div className="pdf-info">
                <div className="pdf-name" title={file?.name}>
                  {file?.name}
                </div>
                <div className="pdf-size">{formatSize(file?.size)}</div>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="loader-overlay">
            <div className="loader-inner-div">
              <div className="box" id="loader1"></div>
              <div className="box" id="loader2"></div>
              <div className="box" id="loader3"></div>
              <div className="box" id="loader4"></div>
              <div className="box" id="loader5"></div>
            </div>
            <div className="loader-text">Compressing your PDF…</div>
          </div>
        )}

        <ToastContainer position="top-right" />
      </section>

      {file && (
        <div className="tools-bottom-button-div">
          <button
            className="tool-outline-btn"
            type="button"
            onClick={resetToStart}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Change File
          </button>

          {!result ? (
            <button
              className="tool-solid-btn"
              type="button"
              onClick={compressPdf}
              disabled={loading}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 6H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h4"></path><path d="M16 6h4a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-4"></path><line x1="12" y1="2" x2="12" y2="22"></line></svg>
              {loading ? "Compressing..." : "Compress"}{" "}
              <span className="d-none d-sm-block">&amp; Download</span>
            </button>
          ) : (
            <button
              className="tool-solid-btn btn-download"
              type="button"
              onClick={downloadResult}
              disabled={downloading}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              {downloading ? "Downloading..." : "Download"}{" "}
              <span className="d-none d-sm-block">Compressed PDF</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}