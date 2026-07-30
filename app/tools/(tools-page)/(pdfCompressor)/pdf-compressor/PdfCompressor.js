"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getApiBase } from "../../../../lib/apiConfig";
import "../../../tools-css/pdf-compressor.css";

const PdfPreviewClient = dynamic(
  () => import("../../(pdfMerge)/merge-pdf/PdfPreviewClient"),
  {
    ssr: false,
  },
);

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
      (f) => f.type === "application/pdf",
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

      const response = await fetch(`${getApiBase()}/pdf/compress`, {
        method: "POST",
        body: formData,
      });

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
    <div className="tools-right-div custom-container py-custom pb-120 mb-3">
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
              {dropZoneDragOver
                ? "Release to add PDF"
                : "Drag & Drop PDF file here"}
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
              <h2 className="section-subtitle d-none d-md-block">
                PDF Preview
              </h2>
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
                {OPTIONS.find((o) => o.value === quality)?.title ||
                  "Compression Level"}
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
              <h2 className="section-subtitle d-none">
                Compression Complete 🎉
              </h2>

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
            <div className="quality-modal" onClick={(e) => e.stopPropagation()}>
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
            <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
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
                <path d="M8 6H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h4"></path>
                <path d="M16 6h4a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-4"></path>
                <line x1="12" y1="2" x2="12" y2="22"></line>
              </svg>
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

      <section className="pdf-compress-info">
        <div className="info-block">
          <h2>Compress PDF Without Losing Quality</h2>
          <p>
            Almost every job portal, government application form, or online
            submission site has some kind of file size limit, and it's usually
            smaller than you'd expect. Two or three megabytes is common, and
            that's often not enough for a scanned certificate or a resume with a
            photo on it. If your file gets rejected for being too large, this
            tool brings the size down while keeping the text readable and the
            document usable. Upload your PDF, pick how much you want it
            compressed, and the smaller file downloads within a few seconds. No
            account needed, no waiting around.
          </p>
          <p>
            There isn't one perfect compression setting for every file. A
            scanned document with a lot of image data behaves very differently
            from a plain text PDF exported from Word, so the tool gives you a
            few levels to choose from depending on what you're working with and
            how strict the upload limit actually is.
          </p>
        </div>

        <div className="info-block">
          <h3>Why People Usually Need This</h3>
          <ul className="info-list">
            <li>
              <b>Sarkari job applications</b> : recruitment portals like SSC,
              state PSCs, and railway recruitment sites often cap file size for
              resumes, certificates, and ID proof, sometimes at just 1 or 2 MB.
            </li>
            <li>
              <b>Email attachments</b> : a smaller file is just easier to send,
              especially if someone's on a weak mobile connection or the inbox
              has a size limit on attachments.
            </li>
            <li>
              <b>Resume uploads</b> : a lot of ATS platforms and job boards
              reject resumes past a certain size, so compression becomes a
              necessary step before you can even submit.
            </li>
            <li>
              <b>Scanned documents</b> : PDFs made from a phone camera or a
              scanning app are almost always bigger than they need to be, and
              usually shrink a lot without the text becoming hard to read.
            </li>
          </ul>
        </div>

        <div className="info-block">
          <h3>Compression Levels</h3>
          <p>
            Different documents need different amounts of compression, so there
            are three levels to pick from here, depending on what matters more
            for your file smaller size or sharper quality.
          </p>

          <div className="info-cards">
            <div className="info-card">
              <span className="info-card-tag">Extreme</span>
              <p>
                Squeezes the file down as much as possible. Good option when a
                portal has a very strict upload limit and you just need the file
                to fit, even if image quality drops a bit.
              </p>
            </div>
            <div className="info-card info-card--highlight">
              <span className="info-card-tag">Recommended</span>
              <p>
                A middle ground between size and quality. Text stays sharp and
                images still look fine for things like resumes, certificates,
                and everyday documents. Works for most people most of the time.
              </p>
            </div>
            <div className="info-card">
              <span className="info-card-tag">Less Compression</span>
              <p>
                Trims the file size down with almost no visible change in
                quality. Better suited to PDFs with photos, diagrams, or
                anything where visual detail actually matters.
              </p>
            </div>
          </div>
        </div>

        <div className="info-block">
          <h3>How Much Smaller Will My File Get?</h3>
          <p>
            This really depends on what's inside your PDF. A text-heavy
            document, like a plain resume with no images, usually only shrinks a
            little, because there isn't much to compress in the first place text
            takes up very little space compared to images. Scanned documents are
            a different story. Since a scan is basically one big image per page,
            there's a lot more room to compress, and you'll often see the file
            size drop by more than half, sometimes a lot more depending on how
            the scan was originally saved. If your file barely shrinks after
            compressing, it's usually a sign that it was already fairly
            text-based to begin with, not that something went wrong with the
            tool.
          </p>
        </div>

        <div className="info-block">
          <h3>Choosing the Right Level for Your Situation</h3>
          <p>
            Honestly it comes down to what you're using the file for. Say you're
            uploading a resume somewhere with a tight 2 MB cap go with Extreme
            and just double-check the text still reads fine after. Sending a
            certificate over email where the limit's more relaxed? Recommended
            handles that without the document looking any different really. And
            if there are diagrams or photos in there that someone actually needs
            to look at closely, Less Compression keeps it closer to the original
            while still shaving off some size. Nothing stopping you from trying
            a couple of these and comparing before picking one to actually
            submit.
          </p>
        </div>

        <div className="info-block">
          <h3>Things to Keep in Mind</h3>
          <ul className="info-list info-list--plain">
            <li>
              Hold on to your original PDF until you've checked that the
              compressed version still looks right.
            </li>
            <li>
              Password-protected PDFs sometimes don't compress as much, since
              the encryption limits what the tool can rework.
            </li>
            <li>
              Text-only PDFs will usually show a smaller reduction than scanned
              or image-heavy files, and that's expected.
            </li>
            <li>
              If quality matters more than size for a particular file, Less
              Compression is usually the safer pick.
            </li>
          </ul>
        </div>

        <div className="info-block">
          <h3>Frequently Asked Questions</h3>

          <div className="faq-list">
            <details className="faq-item">
              <summary>Is this tool free?</summary>
              <p>
                Yes, completely free. No account, no payment, no limit on how
                many times you use it.
              </p>
            </details>

            <details className="faq-item">
              <summary>Will compression reduce PDF quality?</summary>
              <p>
                A little, depending on the level you pick. Recommended keeps
                text sharp and is fine for most resumes and documents. If
                quality matters more than size for you, go with Less Compression
                instead.
              </p>
            </details>

            <details className="faq-item">
              <summary>Does it work on mobile?</summary>
              <p>Yes, works fine from any mobile browser, no app needed.</p>
            </details>

            <details className="faq-item">
              <summary>Are my files stored anywhere?</summary>
              <p>
                No. Your file gets processed for compression and that's it,
                nothing gets kept or saved afterward.
              </p>
            </details>

            <details className="faq-item">
              <summary>What's the maximum file size I can upload?</summary>
              <p>
                That changes based on whatever limit is currently set on the
                tool. If a file won't upload, chances are it's just over that.
              </p>
            </details>

            <details className="faq-item">
              <summary>
                Why did my file barely shrink after compressing?
              </summary>
              <p>
                Most likely it was already mostly text. There just isn't a lot
                to squeeze out of plain text compared to images, so scanned
                files usually shrink way more than something like a
                Word-exported resume.
              </p>
            </details>

            <details className="faq-item">
              <summary>Can I compress a scanned document?</summary>
              <p>
                Yes, and scanned PDFs actually tend to compress the most, since
                each page is basically one big image and there's plenty of room
                to reduce.
              </p>
            </details>

            <details className="faq-item">
              <summary>Should I always pick Extreme compression?</summary>
              <p>
                Not necessarily. Extreme is great when you're up against a
                strict upload limit, but it can affect image quality more than
                the other levels. If your file already fits comfortably,
                Recommended or Less Compression is usually a better balance.
              </p>
            </details>

            <details className="faq-item">
              <summary>
                Will compressing a password-protected PDF work the same way?
              </summary>
              <p>
                Not quite as well usually. The encryption gets in the way of how
                much the tool can rework the file, so heavily protected PDFs
                tend to shrink less than you'd expect.
              </p>
            </details>

            <details className="faq-item">
              <summary>
                Can I compress the file more than once if it's still too big?
              </summary>
              <p>
                You can, but repeated compression usually gives diminishing
                results and can start hurting quality noticeably. It's better to
                go back to the original file and pick a stronger compression
                level in one pass instead.
              </p>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
}
