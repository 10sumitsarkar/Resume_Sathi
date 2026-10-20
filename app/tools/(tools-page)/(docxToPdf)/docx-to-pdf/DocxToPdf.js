"use client";

import { useRef, useState } from "react";
import mammoth from "mammoth";
import { jsPDF } from "jspdf";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../tools-css/merge-pdf.css";
import "../../../tools-css/docx-to-pdf.css";
import ToolsPageAd from "../../../../tools/components/ToolsPageAd";

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
        item.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );
    });
    if (!picked) {
      toast.error("Please select a DOCX file");
      return;
    }
    try {
      const result = await mammoth.extractRawText({
        arrayBuffer: await picked.arrayBuffer(),
      });
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
          <h1>
            DOCX to <span>PDF</span>
          </h1>
          <p>
            Convert Word documents into simple PDF files. <br />
            <span>Best for text-based documents</span>
          </p>
        </div>
        <ToolsPageAd format="728x90" />
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
              accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(e) => {
                addFile(e.target.files);
                e.target.value = "";
              }}
            />
            <div className="drop-zone-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <path d="M8 13l2 6 2-4 2 4 2-6" />
              </svg>
            </div>
            <div className="drop-zone-title">Drag & Drop DOCX file here</div>
            <div className="drop-zone-sub">
              or <span>browse from your device</span>
            </div>
            <button
              className="drop-zone-btn"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
            >
              Select DOCX File
            </button>
          </div>
        ) : (
          <div className="docx-workspace">
            <div className="docx-editor-card">
              <h2>Document Text</h2>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
            <div className="docx-info-card">
              <h2>DOCX Details</h2>
              <div className="docx-file-pill">
                <strong>{file.name}</strong>
                <span>{text.split(/\s+/).filter(Boolean).length} words</span>
              </div>
              <p>You can edit extracted text before creating the PDF.</p>
            </div>
          </div>
        )}
        <ToastContainer position="top-right" />
      </section>
      {file && (
        <div className="tools-bottom-button-div">
          <button className="tool-outline-btn" type="button" onClick={reset}>
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
              <path d="M3 6h18" />
              <path d="M8 6V4h8v2" />
              <path d="M19 6l-1 14H6L5 6" />
            </svg>
            Change File
          </button>
          <button
            className="tool-solid-btn"
            type="button"
            onClick={convert}
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
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <path d="M12 18v-6" />
              <path d="m9 15 3 3 3-3" />
            </svg>
            {loading ? "Converting..." : "Download PDF"}
          </button>
        </div>
      )}

      <ToolsPageAd native />
      <section className="docx-to-pdf-info">
        <div className="info-block">
          <h2>
            Turn Your Word Document Into a PDF That Opens the Same Everywhere
          </h2>
          <p>
            You finish your resume in Word, it looks good, and you attach it to
            an email. Then a friend opens it on another laptop and the fonts
            have changed, a line has jumped to the next page and the spacing
            looks off. Word files behave differently from one device to the
            next. A PDF does not. What you see is what everyone else sees too.
          </p>
          <p>
            This tool takes your .docx file, reads the text inside it and gives
            you back a clean PDF. You can also correct the text on screen before
            you download, so a last minute typo does not mean going back to
            Word, saving again and uploading again.
          </p>
        </div>

        <div className="info-block">
          <h3>Why People Convert Word Files to PDF</h3>
          <p>
            Resumes are the main reason. Most job portals and recruiters expect
            a PDF, and sending a .docx can mean your file is skipped or opens
            badly on the other side. Cover letters written in Word need the same
            step before they go out.
          </p>
          <ul className="info-list info-list--plain">
            <li>
              <strong>Resumes and CVs.</strong> The most common use by far,
              especially before uploading to a job portal.
            </li>
            <li>
              <strong>Cover letters and application letters.</strong> Easier to
              attach and harder to change by accident.
            </li>
            <li>
              <strong>Assignments and reports.</strong> A PDF feels final, and
              nobody edits it by mistake after you submit.
            </li>
            <li>
              <strong>Simple notices and letters.</strong> Anything text based
              that you want to share without worrying about the reader's
              software.
            </li>
          </ul>
        </div>

        <blockquote>
          A resume sent as a Word file is a resume that might look different on
          the recruiter's screen than it did on yours.
        </blockquote>

        <ToolsPageAd format="300x250" />

        <div className="info-block">
          <h3>How To Use It</h3>
          <ol>
            <li>
              Upload your .docx file by dragging it in or picking it from your
              device.
            </li>
            <li>
              Check the file name and word count shown on screen to confirm it
              is the right document.
            </li>
            <li>Read through the extracted text in the editable box.</li>
            <li>
              Fix any typo, remove a line or adjust a sentence directly in the
              box.
            </li>
            <li>Click Download PDF.</li>
          </ol>
        </div>

        <div className="info-block">
          <h3>What You See After Uploading</h3>
          <p>
            Once your file is in, the tool reads through it and places the
            actual text in an editable box on the screen. Next to it you will
            see some basic details about the file, such as its name and a rough
            word count. These are there only so you can confirm the tool picked
            up the document you meant to use.
          </p>
          <p>
            If something looks wrong in the extracted text, you do not have to
            go back and open the original file. Fix it right there in the box.
          </p>
        </div>

        <div className="info-block">
          <h3>Editing Before You Convert</h3>
          <p>
            The text is not locked after it is extracted. If you spot a typo,
            want to delete a line or need to change a sentence, click inside the
            box and edit it. Whatever is in that box when you press Download PDF
            is exactly what ends up in your final file.
          </p>
          <p>
            That makes a quick read worth the time, especially for a resume. A
            wrong digit in a phone number or a misspelt company name is easy to
            miss on a screen and very hard to explain later.
          </p>
        </div>

        <ToolsPageAd format="468x60" />

        <div className="info-block">
          <h3>What Works Well and What Might Not</h3>
          <p>
            This tool is built around the words in your document. It works best
            for files that are mostly text, such as resumes, cover letters and
            simple reports. Plain headings, paragraphs and lists come through
            without trouble.
          </p>
          <p>
            Heavier formatting is a different story. Complex tables, unusual
            fonts and specific page layouts may not carry over exactly as they
            look in Word, because the focus here is on getting the content right
            instead of copying every design detail. If your document depends on
            a very particular layout, check the downloaded PDF carefully before
            you send it.
          </p>
          <ul className="info-list info-list--plain">
            <li>
              Good fit: resumes, cover letters, application letters, simple
              reports and plain notes.
            </li>
            <li>
              Needs a careful check: documents with large tables, many columns
              or decorative fonts.
            </li>
          </ul>
        </div>

        <blockquote>
          Open the downloaded PDF once before you send it. It takes ten seconds
          and catches almost every problem.
        </blockquote>

        <div className="info-block">
          <h3>Before You Upload: Small Habits That Help</h3>
          <p>
            A few things in your Word file make the result better. Use normal
            paragraphs instead of text boxes, because text inside boxes can be
            harder to read out. Keep your headings simple. Remove extra blank
            lines you added only to push text down the page. And if your resume
            uses two columns, expect the order of the text to need a look in the
            editable box.
          </p>
          <p>
            It also helps to give your file a clear name before converting, such
            as your own name followed by the word resume. The PDF is what a
            recruiter will see in their downloads folder, and a name like
            "final_final2" does not make a good impression.
          </p>
        </div>

        <div className="info-block">
          <h3>Notes</h3>
          <p>
            Give the extracted text a quick look before downloading, because it
            is the easiest place to catch anything that needs fixing. Your file
            stays on your device and is not uploaded to a server. Once you close
            the tab, nothing from that session is saved.
          </p>
        </div>

        <ToolsPageAd format="300x250" />

        <div className="info-block">
          <h3>Questions</h3>
          <div className="faq-list">
            <details className="faq-item">
              <summary>Is this free to use?</summary>
              <p>
                Yes. There is no signup and no charge, and you can use it as
                many times as you need.
              </p>
            </details>

            <details className="faq-item">
              <summary>Can I edit the text after it's extracted?</summary>
              <p>
                Yes. The extracted text sits in an editable box. Change anything
                you want before you download the PDF.
              </p>
            </details>

            <details className="faq-item">
              <summary>Does this keep the original Word formatting?</summary>
              <p>
                It is built for text based documents, so simple formatting
                carries over well. Heavy layouts or complex tables may not look
                identical to the original, so check the PDF before sending it.
              </p>
            </details>

            <details className="faq-item">
              <summary>Is my document uploaded to a server?</summary>
              <p>
                No. The file is processed in your browser and is not sent
                anywhere.
              </p>
            </details>

            <details className="faq-item">
              <summary>What does the word count next to my file mean?</summary>
              <p>
                It is a rough count of the words found in your document. It
                gives you a quick way to confirm the right file was picked up.
              </p>
            </details>

            <details className="faq-item">
              <summary>Can I change the file after uploading?</summary>
              <p>
                Yes. Use the Change File option to swap in a different document
                without starting the page over.
              </p>
            </details>

            <details className="faq-item">
              <summary>Will my original DOCX file be changed?</summary>
              <p>
                No. Your original stays exactly as it was on your device. Only a
                new PDF is created from the extracted text.
              </p>
            </details>

            <details className="faq-item">
              <summary>What file types can I upload here?</summary>
              <p>
                Standard .docx Word files work with this tool. If your file is
                in an older .doc format, open it in Word and save it as .docx
                first.
              </p>
            </details>

            <details className="faq-item">
              <summary>Is this good for resumes specifically?</summary>
              <p>
                Yes, it is one of the most common uses. Many people convert a
                Word resume to PDF before emailing it or uploading it to a job
                portal.
              </p>
            </details>

            <details className="faq-item">
              <summary>Do I need to install anything to use this?</summary>
              <p>
                No. It works in your browser on both desktop and mobile, and
                there is nothing extra to download.
              </p>
            </details>

            <details className="faq-item">
              <summary>
                My resume has a two column layout. Will it convert properly?
              </summary>
              <p>
                The text will be extracted, but the order may not match the
                columns you see in Word. Read through the editable box and
                rearrange any lines that landed in the wrong place before
                downloading.
              </p>
            </details>

            <details className="faq-item">
              <summary>
                The PDF looks different from my Word file. What should I do?
              </summary>
              <p>
                This can happen with tables, special fonts or complicated
                layouts, since the tool focuses on text. Simplify those parts in
                Word, upload again and compare. For a plain resume, the result
                is usually clean.
              </p>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
}
