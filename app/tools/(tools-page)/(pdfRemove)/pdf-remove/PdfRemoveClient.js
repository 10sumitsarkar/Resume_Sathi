"use client";

import { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { PDFDocument } from "pdf-lib";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../tools-css/merge-pdf.css";
import "../../../tools-css/pdf-remove.css";

const PagePreview = dynamic(() => import("./PagePreview"), { ssr: false });

export default function PdfRemoveClient() {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pages, setPages] = useState([]);
  const [dropZoneDragOver, setDropZoneDragOver] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dropTargetIndex, setDropTargetIndex] = useState(null);

  const addFile = useCallback(
    async (rawFile) => {
      if (!rawFile || rawFile.type !== "application/pdf") {
        toast.error("Only PDF files are accepted");
        return;
      }

      const preview = URL.createObjectURL(rawFile);
      if (file?.preview) URL.revokeObjectURL(file.preview);

      try {
        setLoading(true);
        const pdf = await PDFDocument.load(await rawFile.arrayBuffer(), {
          ignoreEncryption: true,
        });
        setFile({
          id: crypto.randomUUID(),
          file: rawFile,
          preview,
        });
        setPages(
          Array.from({ length: pdf.getPageCount() }, (_, index) => ({
            id: crypto.randomUUID(),
            pageNumber: index + 1,
            removed: false,
          })),
        );
      } catch (error) {
        URL.revokeObjectURL(preview);
        setFile(null);
        setPages([]);
        toast.error("Could not read PDF. It might be corrupted or encrypted.");
      } finally {
        setLoading(false);
      }
    },
    [file],
  );

  const handleFileInputChange = (e) => {
    if (e.target.files?.length) addFile(e.target.files[0]);
    e.target.value = "";
  };

  const handleDropZoneDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDropZoneDragOver(false);
    if (e.dataTransfer.files?.length) addFile(e.dataTransfer.files[0]);
  };

  const togglePageRemoved = (pageNumber) => {
    setPages((prev) =>
      prev.map((page) =>
        page.pageNumber === pageNumber
          ? { ...page, removed: !page.removed }
          : page,
      ),
    );
  };

  const movePage = (from, to) => {
    if (from === null || to === null || from === to) return;
    setPages((prev) => {
      if (prev[from]?.removed || prev[to]?.removed) return prev;
      const updated = [...prev];
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);
      return updated;
    });
  };

  const resetDrag = () => {
    setDraggedIndex(null);
    setDropTargetIndex(null);
  };

  const reset = () => {
    if (file?.preview) URL.revokeObjectURL(file.preview);
    setFile(null);
    setPages([]);
    resetDrag();
  };

  const downloadModifiedPDF = async () => {
    if (!file) {
      toast.error("Please upload a PDF file");
      return;
    }

    const keptPages = pages
      .filter((page) => !page.removed)
      .map((page) => page.pageNumber - 1);

    if (keptPages.length === 0) {
      toast.error("You can't remove all pages.");
      return;
    }

    try {
      setLoading(true);
      const pdf = await PDFDocument.load(await file.file.arrayBuffer(), {
        ignoreEncryption: true,
      });
      const output = await PDFDocument.create();
      const copiedPages = await output.copyPages(pdf, keptPages);
      copiedPages.forEach((page) => output.addPage(page));

      const bytes = await output.save();
      const url = URL.createObjectURL(
        new Blob([bytes], { type: "application/pdf" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = `${file.file.name.replace(/\.pdf$/i, "")}-pages-removed.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("PDF downloaded!");
    } catch (error) {
      toast.error("Failed to create modified PDF.");
    } finally {
      setLoading(false);
    }
  };

  const removedCount = pages.filter((page) => page.removed).length;

  return (
    <div className="tools-right-div custom-container py-custom pb-120 mb-3">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        className="d-none"
        onChange={handleFileInputChange}
      />
      <section className="merge-pdf-tool pdf-remove-tool">
        <div className="tool-header">
          <h1>
            Remove <span>PDF</span> Pages
          </h1>
          <p>
            Delete unwanted pages from your PDF. <br />
            <span>Drag kept pages to reorder before downloading</span>
          </p>
          {file && (
            <div className="drag-hint pdf-remove-hint">
              <svg
                className="me-1"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              Click pages to remove. Drag only kept pages to reorder.
            </div>
          )}
        </div>

        {!file && (
          <div
            className={`drop-zone${dropZoneDragOver ? " drag-over" : ""} mb-3 mb-md-5`}
            onDragOver={(e) => {
              e.preventDefault();
              setDropZoneDragOver(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setDropZoneDragOver(false);
            }}
            onDrop={handleDropZoneDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="drop-zone-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="9" y1="15" x2="15" y2="15" />
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
            <button className="drop-zone-btn" type="button">
              Select PDF File
            </button>
          </div>
        )}

        {file && (
          <div className="pdf-grid pdf-remove-grid mb-3 mb-md-5">
            {pages.map(({ id, pageNumber, removed }, index) => (
              <button
                key={id}
                className={[
                  "pdf-card pdf-remove-card",
                  removed ? "removed" : "",
                  draggedIndex === index ? "dragging" : "",
                  dropTargetIndex === index && draggedIndex !== index
                    ? "drag-target"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                type="button"
                draggable={!removed}
                onClick={() => togglePageRemoved(pageNumber)}
                onDragStart={(e) => {
                  if (removed) {
                    e.preventDefault();
                    return;
                  }
                  setDraggedIndex(index);
                }}
                onDragOver={(e) => {
                  if (removed || draggedIndex === null) return;
                  e.preventDefault();
                  if (draggedIndex !== index) setDropTargetIndex(index);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  movePage(draggedIndex, index);
                  resetDrag();
                }}
                onDragEnd={resetDrag}
              >
                <div
                  className="drag-handle"
                  title={
                    removed ? "Page marked for removal" : "Drag to reorder"
                  }
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle
                      cx="9"
                      cy="5"
                      r="1"
                      fill="currentColor"
                      stroke="none"
                    />
                    <circle
                      cx="9"
                      cy="12"
                      r="1"
                      fill="currentColor"
                      stroke="none"
                    />
                    <circle
                      cx="9"
                      cy="19"
                      r="1"
                      fill="currentColor"
                      stroke="none"
                    />
                    <circle
                      cx="15"
                      cy="5"
                      r="1"
                      fill="currentColor"
                      stroke="none"
                    />
                    <circle
                      cx="15"
                      cy="12"
                      r="1"
                      fill="currentColor"
                      stroke="none"
                    />
                    <circle
                      cx="15"
                      cy="19"
                      r="1"
                      fill="currentColor"
                      stroke="none"
                    />
                  </svg>
                </div>
                <div className="pdf-order">{index + 1}</div>
                <div className="pdf-remove">{removed ? "+" : "x"}</div>
                <div className="pdf-preview-wrap">
                  <PagePreview file={file.preview} pageNumber={pageNumber} />
                </div>
                <div className="pdf-info">
                  <div className="pdf-name">Page {pageNumber}</div>
                  <div className="pdf-size">
                    {removed ? "Will be removed" : "Will be kept"}
                  </div>
                </div>
                <div className="page-remove-overlay">
                  <div className="page-remove-icon">x</div>
                  <div className="page-remove-text">Marked for Removal</div>
                </div>
              </button>
            ))}
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
            <div className="loader-text">Processing your PDF...</div>
          </div>
        )}

        <ToastContainer position="top-right" />
      </section>

      {file && (
        <div className="tools-bottom-button-div">
          <button className="tool-outline-btn" type="button" onClick={reset}>
            <span className="file-count">{pages.length - removedCount}</span>
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
            Change PDF
          </button>
          <button
            className="tool-solid-btn"
            type="button"
            onClick={downloadModifiedPDF}
            disabled={loading || pages.length === removedCount}
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
            Download PDF
          </button>
        </div>
      )}

      <section className="pdf-remove-info">
        <div className="info-block">
          <h2>Remove Unwanted Pages From A PDF</h2>
          <p>
            Not every page in a PDF deserves to stay there. A blank page got
            scanned in by mistake, an old cover sheet is sitting in front of the
            actual document, or there's a page with someone else's data mixed
            into a bundle that was never meant to be shared. Instead of redoing
            the whole scan or asking someone to resend the file, you can just
            open it here, tap the pages you don't want, and get a clean copy
            back with only what should actually be there.
          </p>
        </div>

        <div className="info-block">
          <h3>Situations This Solves</h3>
          <p>
            Aadhaar and PAN scans often come with an extra blank side that a
            scanner adds automatically, and portals reject that right away.
            College certificates sometimes get combined with a random
            instructions page that was only meant for printing, not for
            uploading. And every so often someone realizes halfway through
            filling a form that one page in their PDF has outdated information
            on it and needs to go before submitting anywhere.
          </p>
        </div>

        <div className="info-block">
          <h3>How Removing Actually Works Here</h3>
          <p>
            After the file loads, every page appears as its own thumbnail so you
            know exactly what you're looking at. Tap or click on any page you
            want gone, it gets marked and won't be part of the final file, tap
            it again if you change your mind. The pages you're keeping can still
            be dragged around to fix their order, but the ones marked for
            removal stay locked in place since there's no point rearranging
            something that's about to be deleted anyway.
          </p>
        </div>

        <div className="info-block">
          <h3>Checking Order Before You Download</h3>
          <p>
            Once you're happy with which pages are staying, look over the order
            one more time. If page 4 should really come before page 2, just drag
            it there, the numbering on each card updates as you move things so
            you can confirm the final arrangement before hitting download. This
            step matters more than people expect, fixing order after downloading
            means starting the whole process again.
          </p>
        </div>

        <div className="info-block">
          <h3>What Happens To The Removed Pages</h3>
          <p>
            They're simply left out of the new file, nothing more dramatic than
            that. Your original PDF isn't edited or overwritten, it stays
            exactly as it was on your device. What you download is a fresh file
            built only from the pages you chose to keep, quality unchanged,
            nothing recompressed or resized in the process.
          </p>
        </div>

        <div className="info-block">
          <h3>Notes</h3>
          <p>
            Take a moment before downloading to double check both the pages you
            removed and the order of what's left, small mistakes are easy to
            miss when you're going fast. This tool works entirely in your
            browser, no file gets uploaded to any server, and nothing from the
            session is kept once you close the tab.
          </p>
        </div>

        <div className="info-block">
          <h3>Questions</h3>
          <div className="faq-list">
            <details className="faq-item">
              <summary>Is this free to use?</summary>
              <p>Yes, no login and no cost, use it as often as you need to.</p>
            </details>

            <details className="faq-item">
              <summary>How do I mark a page for removal?</summary>
              <p>
                Just click or tap on the page thumbnail, it'll show as removed.
                Click it again if you want to keep it after all.
              </p>
            </details>

            <details className="faq-item">
              <summary>Can I reorder pages while removing others?</summary>
              <p>
                Yes, but only the pages you're keeping can be dragged into a new
                order, pages marked for removal aren't draggable since they
                won't be in the final file anyway.
              </p>
            </details>

            <details className="faq-item">
              <summary>Does my file get uploaded anywhere?</summary>
              <p>
                No, everything happens locally in your browser, your PDF never
                leaves your device.
              </p>
            </details>

            <details className="faq-item">
              <summary>Will the remaining pages lose quality?</summary>
              <p>
                No, the kept pages are copied over exactly as they were, nothing
                gets compressed or resized.
              </p>
            </details>

            <details className="faq-item">
              <summary>Is my original file changed after this?</summary>
              <p>
                No, your original stays untouched on your device, you get a
                separate new file with the removed pages left out.
              </p>
            </details>

            <details className="faq-item">
              <summary>What if I remove the wrong page by accident?</summary>
              <p>
                Just click on it again before downloading to bring it back into
                the kept pages, no need to re-upload anything.
              </p>
            </details>

            <details className="faq-item">
              <summary>Can I remove more than one page at a time?</summary>
              <p>
                Yes, click on as many pages as you want removed, there's no
                limit on how many you mark.
              </p>
            </details>

            <details className="faq-item">
              <summary>
                Can I remove pages from a password protected PDF?
              </summary>
              <p>
                Best to unlock it first with a password removal tool, then come
                back here to remove the pages you need to.
              </p>
            </details>

            <details className="faq-item">
              <summary>Do I need to install any software for this?</summary>
              <p>
                No, it runs directly in the browser on desktop or mobile,
                nothing to download beforehand.
              </p>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
}
