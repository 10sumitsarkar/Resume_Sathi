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
      <section className="merge-pdf-tool extra-tool mb-3 mb-md-5">
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

      <section className="docx-to-pdf-info">
        <div className="info-block">
          <h2>Convert A Word Document Into A PDF</h2>
          <p>
            Word files cause more trouble than they should when it's time to
            actually submit something. Open the same .docx on a different
            laptop and the formatting shifts, fonts change, spacing breaks,
            sometimes a whole page just disappears. PDFs don't have that
            problem, what you see is what everyone else sees too. This tool
            takes your Word document, pulls the text out, and gives you back
            a clean PDF version that stays consistent wherever it's opened.
          </p>
        </div>

        <div className="info-block">
          <h3>Why This Gets Used So Often</h3>
          <p>
            Resumes are the obvious one, most job portals and email
            attachments expect a PDF, not a .docx, and sending the wrong
            format sometimes means your resume gets skipped without anyone
            even opening it. Cover letters written in Word need the same
            treatment before they go out. And for things like assignments or
            reports, a PDF just feels more final and less likely to get
            edited by mistake once it leaves your hands.
          </p>
        </div>

        <div className="info-block">
          <h3>What Happens After You Upload</h3>
          <p>
            Once your .docx file is in, the tool reads through it and pulls
            out the actual text content into an editable box on screen.
            Alongside that, you'll see basic details about the file itself,
            its name and roughly how many words it contains, just so you can
            confirm it picked up the right document. If something looks off
            in the extracted text, you can fix it directly in that box before
            moving ahead, there's no need to go back and edit the original
            Word file.
          </p>
        </div>

        <div className="info-block">
          <h3>Editing Before You Convert</h3>
          <p>
            This is the part people find useful, the text isn't locked once
            it's extracted. Spot a typo, want to remove a line, need to
            tweak a sentence, just click into the box and change it right
            there. Whatever's in that box when you hit Download PDF is
            exactly what ends up in your final file, so it's worth a quick
            read through before converting, especially for something like a
            resume where small mistakes matter.
          </p>
        </div>

        <div className="info-block">
          <h3>A Few Things Worth Knowing</h3>
          <p>
            This works best for documents that are mostly text, like resumes,
            cover letters, or simple reports. Heavier formatting like complex
            tables, unusual fonts, or specific page layouts might not carry
            over exactly the same way, since the tool is focused on getting
            the words right rather than replicating pixel-perfect Word
            styling. For a plain text-based document though, it does the job
            cleanly.
          </p>
        </div>

        <div className="info-block">
          <h3>Notes</h3>
          <p>
            Give the extracted text a quick look before downloading, it's the
            easiest place to catch anything that needs fixing. Your file
            stays local, nothing gets uploaded to a server, and once you
            close the tab there's nothing left saved from that session.
          </p>
        </div>

        <div className="info-block">
          <h3>Questions</h3>
          <div className="faq-list">
            <details className="faq-item">
              <summary>Is this free to use?</summary>
              <p>
                Yes, no signup and no charge, use it as many times as you
                need.
              </p>
            </details>

            <details className="faq-item">
              <summary>Can I edit the text after it's extracted?</summary>
              <p>
                Yes, the extracted text sits in an editable box, change
                anything you want before downloading the PDF.
              </p>
            </details>

            <details className="faq-item">
              <summary>Does this keep the original Word formatting?</summary>
              <p>
                It's built for text-based documents, so simple formatting
                carries over fine, but heavy layouts or complex tables might
                not look identical to the original.
              </p>
            </details>

            <details className="faq-item">
              <summary>Is my document uploaded to a server?</summary>
              <p>
                No, the file is processed right in your browser, it doesn't
                get sent anywhere.
              </p>
            </details>

            <details className="faq-item">
              <summary>What does the word count next to my file mean?</summary>
              <p>
                It's just a rough count of the words found in your document,
                a quick way to confirm the right file got picked up.
              </p>
            </details>

            <details className="faq-item">
              <summary>Can I change the file after uploading?</summary>
              <p>
                Yes, use the Change File option to swap in a different
                document without starting the whole page over.
              </p>
            </details>

            <details className="faq-item">
              <summary>Will my original DOCX file be changed?</summary>
              <p>
                No, your original stays exactly as it was on your device,
                only a new PDF gets created from the extracted text.
              </p>
            </details>

            <details className="faq-item">
              <summary>What file types can I upload here?</summary>
              <p>
                Standard .docx Word files work with this tool.
              </p>
            </details>

            <details className="faq-item">
              <summary>Is this good for resumes specifically?</summary>
              <p>
                Yes, it's actually one of the more common uses, converting a
                Word resume into a PDF before sending it out or uploading it
                to a job portal.
              </p>
            </details>

            <details className="faq-item">
              <summary>Do I need to install anything to use this?</summary>
              <p>
                No, it works directly in your browser on both desktop and
                mobile, nothing extra to download.
              </p>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
}
