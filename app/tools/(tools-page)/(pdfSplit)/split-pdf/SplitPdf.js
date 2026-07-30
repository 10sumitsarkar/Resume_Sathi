"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import JSZip from "jszip";
import { PDFDocument } from "pdf-lib";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../tools-css/merge-pdf.css";
import "../../../tools-css/split-pdf.css";

const PdfPreviewClient = dynamic(
  () => import("../../(pdfMerge)/merge-pdf/PdfPreviewClient"),
  { ssr: false },
);

export default function SplitPdf() {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dropZoneDragOver, setDropZoneDragOver] = useState(false);

  const addFile = async (rawFiles) => {
    const picked = Array.from(rawFiles || []).find(
      (item) => item.type === "application/pdf",
    );
    if (!picked) {
      toast.error("Please select a PDF file");
      return;
    }
    try {
      const source = await PDFDocument.load(await picked.arrayBuffer(), {
        ignoreEncryption: true,
      });
      const pageItems = [];
      for (let index = 0; index < source.getPageCount(); index += 1) {
        const single = await PDFDocument.create();
        const [copiedPage] = await single.copyPages(source, [index]);
        single.addPage(copiedPage);
        const bytes = await single.save();
        pageItems.push({
          id: crypto.randomUUID(),
          pageIndex: index,
          preview: URL.createObjectURL(
            new Blob([bytes], { type: "application/pdf" }),
          ),
        });
      }
      pages.forEach((page) => URL.revokeObjectURL(page.preview));
      setFile(picked);
      setPages(pageItems);
    } catch (error) {
      toast.error("Could not read this PDF");
    }
  };

  const removePage = (id) => {
    setPages((prev) => {
      const removed = prev.find((page) => page.id === id);
      if (removed) URL.revokeObjectURL(removed.preview);
      return prev.filter((page) => page.id !== id);
    });
  };

  const downloadZip = async () => {
    if (!file || !pages.length) {
      toast.error("Please keep at least one page");
      return;
    }
    try {
      setLoading(true);
      const source = await PDFDocument.load(await file.arrayBuffer(), {
        ignoreEncryption: true,
      });
      const zip = new JSZip();
      for (const page of pages) {
        const single = await PDFDocument.create();
        const [copiedPage] = await single.copyPages(source, [page.pageIndex]);
        single.addPage(copiedPage);
        const bytes = await single.save();
        zip.file(`page-${page.pageIndex + 1}.pdf`, bytes);
      }
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${file.name.replace(/\.pdf$/i, "")}-split-pages.zip`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Split PDFs downloaded in ZIP!");
    } catch (error) {
      toast.error("Failed to split PDF");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    pages.forEach((page) => URL.revokeObjectURL(page.preview));
    setFile(null);
    setPages([]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDropZoneDragOver(false);
    addFile(e.dataTransfer.files);
  };

  return (
    <div className="tools-right-div custom-container py-custom pb-120 mb-3">
      <section className="merge-pdf-tool split-pdf-tool">
        <div className="tool-header">
          <h1>
            Split <span>PDF</span>
          </h1>
          <p>
            Split each PDF page into a separate file. <br />
            <span>Delete pages you do not want before downloading ZIP</span>
          </p>
        </div>

        {!file ? (
          <div
            className={`drop-zone${dropZoneDragOver ? " drag-over" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDropZoneDragOver(true);
            }}
            onDragLeave={() => setDropZoneDragOver(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              className="drop-zone-input"
              type="file"
              accept=".pdf"
              onChange={(e) => addFile(e.target.files)}
            />
            <div className="drop-zone-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <div className="drop-zone-title">Drag & Drop PDF file here</div>
            <div className="drop-zone-sub">
              or <span>browse from your device</span>
            </div>
            <button className="drop-zone-btn" type="button">
              Select PDF File
            </button>
          </div>
        ) : (
          <>
            <div className="pdf-grid split-page-grid mb-3 mb-md-5">
              {pages.map((page) => (
                <div className="pdf-card" key={page.id}>
                  <div className="pdf-order">{page.pageIndex + 1}</div>
                  <button
                    className="pdf-remove"
                    onClick={() => removePage(page.id)}
                    type="button"
                    title="Remove"
                  >
                    x
                  </button>
                  <div className="pdf-preview-wrap">
                    <PdfPreviewClient file={page.preview} />
                  </div>
                  <div className="pdf-info">
                    <div className="pdf-name">Page {page.pageIndex + 1}</div>
                    <div className="pdf-size">Separate PDF</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        <ToastContainer position="top-right" />
      </section>
      {file && (
        <div className="tools-bottom-button-div">
          <button className="tool-outline-btn" type="button" onClick={reset}>
            <span className="file-count">{pages.length}</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" />
              <path d="M8 6V4h8v2" />
              <path d="M19 6l-1 14H6L5 6" />
            </svg>
            Change File
          </button>
          <button
            className="tool-solid-btn"
            type="button"
            onClick={downloadZip}
            disabled={loading || pages.length === 0}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {loading ? "Creating ZIP..." : "Download ZIP"}
          </button>
        </div>
      )}
    </div>
  );
}
