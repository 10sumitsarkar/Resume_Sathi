"use client";

import { useRef, useState } from "react";
import mammoth from "mammoth";
import { jsPDF } from "jspdf";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../tools-css/merge-pdf.css";
import "../../../tools-css/docx-to-pdf.css";

export default function DocxToPdf() {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [dropZoneDragOver, setDropZoneDragOver] = useState(false);

  const addFile = async (rawFiles) => {
    const picked = Array.from(rawFiles || []).find((item) => {
      const name = item.name.toLowerCase();
      return (
        name.endsWith(".docx") ||
        item.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );
    });
    if (!picked) {
      toast.error("Please select a DOCX file");
      return;
    }
    try {
      const result = await mammoth.extractRawText({ arrayBuffer: await picked.arrayBuffer() });
      setFile(picked);
      setText(result.value || "");
    } catch (error) {
      toast.error("Could not read this DOCX file");
    }
  };

  const convert = () => {
    if (!file || !text.trim()) {
      toast.error("Please add a DOCX file first");
      return;
    }
    setLoading(true);
    try {
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const margin = 48;
      const maxWidth = 500;
      const lines = doc.splitTextToSize(text, maxWidth);
      let y = margin;
      lines.forEach((line) => {
        if (y > 790) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += 16;
      });
      doc.save(file.name.replace(/\.docx$/i, ".pdf"));
      toast.success("PDF downloaded!");
    } catch (error) {
      toast.error("Failed to convert DOCX");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setText("");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDropZoneDragOver(false);
    addFile(e.dataTransfer.files);
  };

  return (
    <div className="tools-right-div custom-container py-custom pb-120 mb-3">
      <section className="merge-pdf-tool extra-tool">
        <div className="tool-header">
          <h1>DOCX to <span>PDF</span></h1>
          <p>Convert Word documents into simple PDF files. <br /><span>Best for text-based documents</span></p>
        </div>
        {!file ? (
          <div
            className={`drop-zone${dropZoneDragOver ? " drag-over" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDropZoneDragOver(true); }}
            onDragLeave={() => setDropZoneDragOver(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              className="drop-zone-input"
              type="file"
              accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(e) => {
                addFile(e.target.files);
                e.target.value = "";
              }}
            />
            <div className="drop-zone-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><path d="M8 13l2 6 2-4 2 4 2-6" /></svg></div>
            <div className="drop-zone-title">Drag & Drop DOCX file here</div>
            <div className="drop-zone-sub">or <span>browse from your device</span></div>
            <button className="drop-zone-btn" type="button" onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}>Select DOCX File</button>
          </div>
        ) : (
          <div className="docx-workspace">
            <div className="docx-editor-card">
              <h2>Document Text</h2>
              <textarea value={text} onChange={(e) => setText(e.target.value)} />
            </div>
            <div className="docx-info-card">
              <h2>DOCX Details</h2>
              <div className="docx-file-pill"><strong>{file.name}</strong><span>{text.split(/\s+/).filter(Boolean).length} words</span></div>
              <p>You can edit extracted text before creating the PDF.</p>
            </div>
          </div>
        )}
        <ToastContainer position="top-right" />
      </section>
      {file && (
        <div className="tools-bottom-button-div">
          <button className="tool-outline-btn" type="button" onClick={reset}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M19 6l-1 14H6L5 6" /></svg>
            Change File
          </button>
          <button className="tool-solid-btn" type="button" onClick={convert} disabled={loading}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><path d="M12 18v-6" /><path d="m9 15 3 3 3-3" /></svg>
            {loading ? "Converting..." : "Download PDF"}
          </button>
        </div>
      )}
    </div>
  );
}
