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

  const addFile = useCallback(async (rawFile) => {
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
  }, [file]);

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
              <svg className="me-1" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
            className={`drop-zone${dropZoneDragOver ? " drag-over" : ""}`}
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
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
            </div>
            <div className="drop-zone-title">
              {dropZoneDragOver ? "Release to add PDF" : "Drag & Drop PDF file here"}
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
                  dropTargetIndex === index && draggedIndex !== index ? "drag-target" : "",
                ].filter(Boolean).join(" ")}
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
                <div className="drag-handle" title={removed ? "Page marked for removal" : "Drag to reorder"}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="5" r="1" fill="currentColor" stroke="none" />
                    <circle cx="9" cy="12" r="1" fill="currentColor" stroke="none" />
                    <circle cx="9" cy="19" r="1" fill="currentColor" stroke="none" />
                    <circle cx="15" cy="5" r="1" fill="currentColor" stroke="none" />
                    <circle cx="15" cy="12" r="1" fill="currentColor" stroke="none" />
                    <circle cx="15" cy="19" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </div>
                <div className="pdf-order">{index + 1}</div>
                <div className="pdf-remove">{removed ? "+" : "x"}</div>
                <div className="pdf-preview-wrap">
                  <PagePreview file={file.preview} pageNumber={pageNumber} />
                </div>
                <div className="pdf-info">
                  <div className="pdf-name">Page {pageNumber}</div>
                  <div className="pdf-size">{removed ? "Will be removed" : "Will be kept"}</div>
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
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
}
