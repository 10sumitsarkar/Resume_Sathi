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
            className={`drop-zone${dropZoneDragOver ? " drag-over" : ""} mb-3 mb-md-5`}
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
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
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
            onClick={downloadZip}
            disabled={loading || pages.length === 0}
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
            {loading ? "Creating ZIP..." : "Download ZIP"}
          </button>
        </div>
      )}

      <section className="pdf-split-info">
        <div className="info-block">
          <h2>Split One PDF Into Multiple Files</h2>
          <p>
            Sometimes a PDF has way more in it than you actually need. Maybe
            it's a 40 page government notification and you only care about the
            annexure at the end. Maybe it's a scanned bundle of mark sheets and
            you need just the 10th class one for a specific upload. This tool
            lets you pull pages out of a bigger PDF and save them as their own
            file, or break the whole thing into smaller chunks, without opening
            any desktop software.
          </p>
        </div>

        <div className="info-block">
          <h3>Where This Actually Comes Up</h3>
          <p>
            A common one is portals that cap file size, so a 15 MB PDF has to
            become two or three smaller ones before it'll even upload. Students
            often get a single scanned PDF from a cyber cafe with all their
            certificates stapled together digitally, and then need to separate
            out just the caste certificate or just the birth certificate for a
            particular form. Office use comes up too, someone sends a 60 page
            contract and you only need to forward pages 12 to 15 to a colleague
            instead of the entire thing.
          </p>
        </div>

        <div className="info-block">
          <h3>Picking Which Pages To Pull Out</h3>
          <p>
            Once you upload the file, every page shows up as a small thumbnail
            so you can actually see what's on it instead of guessing from page
            numbers. Click on the pages you want, they get marked as selected,
            click again to unselect. There's also a quick range option if you'd
            rather just type something like 3-9 instead of clicking one by one.
            You can preview a page bigger before deciding if that's the one you
            meant to grab.
          </p>
        </div>

        <div className="info-block">
          <h3>One File Or Several?</h3>
          <p>
            You get a choice here. Pull out only the pages you selected and get
            back one new PDF with just those pages, useful when you need a
            single certificate out of a bigger scan. Or split everything into
            separate single-page files at once, which helps when you've got a
            stack of documents scanned together and need each page as its own
            file to upload individually. Either way nothing on the original
            pages changes, you're just choosing how they get grouped into new
            files.
          </p>
        </div>

        <div className="info-block">
          <h3>Does Splitting Touch The Quality?</h3>
          <p>
            No. A page is just being copied into a new file, not redrawn or
            recompressed. Text stays sharp, scanned images stay exactly as clear
            or blurry as they were in the original. If your source PDF was a low
            quality phone scan to begin with, the split pages will carry that
            same quality forward, the tool isn't improving or degrading
            anything, just separating.
          </p>
        </div>

        <div className="info-block">
          <h3>Notes</h3>
          <p>
            Double check your page selection before hitting split, especially if
            you're using the range option, it's easy to be off by one page when
            typing numbers quickly. This runs entirely in your browser, nothing
            gets sent to a server or stored anywhere, and once you close the tab
            everything from that session is gone for good.
          </p>
        </div>

        <div className="info-block">
          <h3>Questions</h3>
          <div className="faq-list">
            <details className="faq-item">
              <summary>Is this free to use?</summary>
              <p>
                Yes, no account, no payment, no limit on how many times you come
                back to use it.
              </p>
            </details>

            <details className="faq-item">
              <summary>How many pages can I split at once?</summary>
              <p>
                There isn't a hard cap. A 5 page file or a 200 page file both
                work, bigger files just take a little longer to process on your
                device.
              </p>
            </details>

            <details className="faq-item">
              <summary>Can I choose exactly which pages to keep?</summary>
              <p>
                Yes, click on individual thumbnails to select them, or type a
                page range if that's faster for what you need.
              </p>
            </details>

            <details className="faq-item">
              <summary>Is my file uploaded to a server?</summary>
              <p>
                No, everything happens locally in your browser. Your PDF never
                leaves your device during this process.
              </p>
            </details>

            <details className="faq-item">
              <summary>Will splitting reduce the quality of my pages?</summary>
              <p>
                No, pages are copied as they are, nothing is compressed or
                resized along the way.
              </p>
            </details>

            <details className="faq-item">
              <summary>Can I split a password protected PDF?</summary>
              <p>
                It's better to unlock it first using a password removal tool,
                then come back here to split it.
              </p>
            </details>

            <details className="faq-item">
              <summary>Does this change my original file?</summary>
              <p>
                No, This tool only reads it to create the new split files.
              </p>
            </details>

            <details className="faq-item">
              <summary>
                Can I get each page as a separate file instead of one?
              </summary>
              <p>
                Yes, there's an option for that, it splits the whole document
                into individual single-page PDFs in one go.
              </p>
            </details>

            <details className="faq-item">
              <summary>What if I select the wrong pages?</summary>
              <p>
                Just click the page again to unselect it, or clear your range
                and re-enter it, no need to re-upload the file.
              </p>
            </details>

            <details className="faq-item">
              <summary>Do I need to install anything?</summary>
              <p>
                No, it works straight in the browser on both laptop and phone,
                nothing to download or set up.
              </p>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
}
