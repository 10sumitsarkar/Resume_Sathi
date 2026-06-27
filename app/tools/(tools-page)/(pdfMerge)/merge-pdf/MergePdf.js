

"use client";

import { useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { PDFDocument } from "pdf-lib";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../../../tools-css/merge-pdf.css';

const PdfPreviewClient = dynamic(
  () => import("./PdfPreviewClient"),
  {
    ssr: false,
  }
);

export default function PdfMergePage() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [dropTargetIndex, setDropTargetIndex] = useState(null);
    const [dropZoneDragOver, setDropZoneDragOver] = useState(false);
    const [pageDragOver, setPageDragOver] = useState(false);

    const fileInputRef = useRef(null);
    const addMoreRef = useRef(null);

    // ── touch drag state (refs to avoid re-renders during move) ──
    const touchDragIndex = useRef(null);   // which card is being dragged
    const touchClone = useRef(null);   // floating ghost element
    const touchOffsetX = useRef(0);
    const touchOffsetY = useRef(0);
    const touchCurrentTarget = useRef(null);  // index card is hovering over

    // ── add files ─────────────────────────────────────────────────
    const addFiles = useCallback((rawFiles) => {
        const pdfFiles = Array.from(rawFiles)
            .filter((f) => f.type === "application/pdf")
            .map((file) => ({
                id: crypto.randomUUID(),
                file,
                preview: URL.createObjectURL(file),
            }));
        if (!pdfFiles.length) { toast.error("Only PDF files are accepted"); return; }
        setFiles((prev) => [...prev, ...pdfFiles]);
    }, []);

    const handleFileInputChange = (e) => { addFiles(e.target.files); e.target.value = ""; };

    // ── drop zone (OS file drop) ──────────────────────────────────
    const handleDropZoneDragOver = (e) => { e.preventDefault(); e.stopPropagation(); setDropZoneDragOver(true); };
    const handleDropZoneDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setDropZoneDragOver(false); };
    const handleDropZoneDrop = (e) => { e.preventDefault(); e.stopPropagation(); setDropZoneDragOver(false); addFiles(e.dataTransfer.files); };

    // ── page-level OS drop (when files already exist) ─────────────
    const handlePageDragOver = (e) => { if (draggedIndex !== null) return; e.preventDefault(); setPageDragOver(true); };
    const handlePageDragLeave = (e) => { if (draggedIndex !== null) return; if (!e.currentTarget.contains(e.relatedTarget)) setPageDragOver(false); };
    const handlePageDrop = (e) => { if (draggedIndex !== null) return; e.preventDefault(); setPageDragOver(false); addFiles(e.dataTransfer.files); };

    // ── desktop drag-reorder ──────────────────────────────────────
    const handleCardDragStart = (e, index) => { e.stopPropagation(); setDraggedIndex(index); };
    const handleCardDragOver = (e, index) => { e.preventDefault(); e.stopPropagation(); if (draggedIndex !== null && draggedIndex !== index) setDropTargetIndex(index); };
    const handleCardDrop = (e, index) => {
        e.preventDefault(); e.stopPropagation();
        if (draggedIndex === null || draggedIndex === index) { setDraggedIndex(null); setDropTargetIndex(null); return; }
        const updated = [...files];
        const [moved] = updated.splice(draggedIndex, 1);
        updated.splice(index, 0, moved);
        setFiles(updated);
        setDraggedIndex(null);
        setDropTargetIndex(null);
    };
    const handleCardDragEnd = () => { setDraggedIndex(null); setDropTargetIndex(null); };

    // ── TOUCH drag-reorder ────────────────────────────────────────
    const handleTouchStart = (e, index) => {
        // only trigger from the handle (data-drag-handle attribute)
        if (!e.target.closest('[data-drag-handle]')) return;

        e.preventDefault(); // prevent scroll while dragging

        const touch = e.touches[0];
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();

        touchDragIndex.current = index;
        touchCurrentTarget.current = index;
        touchOffsetX.current = touch.clientX - rect.left;
        touchOffsetY.current = touch.clientY - rect.top;

        // build a fully self-contained ghost (no cloneNode — canvas won't copy)
        const fileName = files[index]?.file?.name ?? "";
        const fileSize = files[index] ? (files[index].file.size / 1024 / 1024).toFixed(2) + " MB" : "";

        const ghost = document.createElement("div");
        ghost.style.cssText = `
            position: fixed;
            left: ${rect.left}px;
            top: ${rect.top}px;
            width: ${rect.width}px;
            opacity: 0.92;
            pointer-events: none;
            z-index: 9999;
            transform: scale(1.05) rotate(1.5deg);
            box-shadow: 0 14px 36px rgba(204,0,0,0.25);
            border-radius: 12px;
            border: 2px solid #cc0000;
            background: #fff;
            overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;

        ghost.innerHTML = `
            <div style="
                height: 160px;
                background: #fff0f0;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 10px;
            ">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cc0000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                </svg>
                <span style="font-size:11px;font-weight:700;color:#cc0000;letter-spacing:1px;">PDF</span>
            </div>
            <div style="padding: 10px 10px 12px; background:#fff;">
                <div style="
                    font-size: 0.72rem;
                    font-weight: 600;
                    color: #222;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    margin-bottom: 3px;
                ">${fileName}</div>
                <div style="font-size: 0.65rem; color: #9CA3AF;">${fileSize}</div>
            </div>
            <div style="
                position: absolute;
                top: 8px;
                left: 50%;
                transform: translateX(-50%);
                width: 22px;
                height: 22px;
                background: #cc0000;
                color: #fff;
                border-radius: 50%;
                font-size: 0.68rem;
                font-weight: 700;
                display: flex;
                align-items: center;
                justify-content: center;
            ">${index + 1}</div>
        `;

        document.body.appendChild(ghost);
        touchClone.current = ghost;

        setDraggedIndex(index);
    };

    const handleTouchMove = (e) => {
        if (touchDragIndex.current === null) return;
        e.preventDefault();

        const touch = e.touches[0];

        // move ghost
        if (touchClone.current) {
            touchClone.current.style.left = `${touch.clientX - touchOffsetX.current}px`;
            touchClone.current.style.top = `${touch.clientY - touchOffsetY.current}px`;
        }

        // find which card is under finger
        touchClone.current && (touchClone.current.style.display = 'none');
        const el = document.elementFromPoint(touch.clientX, touch.clientY);
        touchClone.current && (touchClone.current.style.display = '');

        const cardEl = el?.closest('[data-card-index]');
        if (cardEl) {
            const overIndex = parseInt(cardEl.getAttribute('data-card-index'), 10);
            if (overIndex !== touchCurrentTarget.current) {
                touchCurrentTarget.current = overIndex;
                setDropTargetIndex(overIndex);
            }
        }
    };

    const handleTouchEnd = () => {
        if (touchDragIndex.current === null) return;

        // remove ghost
        if (touchClone.current) {
            document.body.removeChild(touchClone.current);
            touchClone.current = null;
        }

        const from = touchDragIndex.current;
        const to = touchCurrentTarget.current;

        if (from !== null && to !== null && from !== to) {
            setFiles((prev) => {
                const updated = [...prev];
                const [moved] = updated.splice(from, 1);
                updated.splice(to, 0, moved);
                return updated;
            });
        }

        touchDragIndex.current = null;
        touchCurrentTarget.current = null;
        setDraggedIndex(null);
        setDropTargetIndex(null);
    };

    // ── remove ────────────────────────────────────────────────────
    const removeFile = (index) => {
        const updated = [...files];
        URL.revokeObjectURL(updated[index].preview);
        updated.splice(index, 1);
        setFiles(updated);
    };

    // ── merge ─────────────────────────────────────────────────────
    const mergePDFs = async () => {
        if (files.length < 2) { toast.error("Please upload at least 2 PDFs"); return; }
        try {
            setLoading(true);
            const mergedPdf = await PDFDocument.create();
            for (const item of files) {
                const bytes = await item.file.arrayBuffer();
                const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
                const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                pages.forEach((p) => mergedPdf.addPage(p));
            }
            const mergedBytes = await mergedPdf.save();
            const blob = new Blob([mergedBytes], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url; a.download = "merged.pdf"; a.click();
            URL.revokeObjectURL(url);
            toast.success("PDF merged & downloaded!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to merge PDFs. File may be corrupted.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='tools-right-div custom-container py-custom pb-0'>

            <section
                className={`merge-pdf-tool${pageDragOver ? " page-drag-over" : ""}`}
                onDragOver={files.length > 0 ? handlePageDragOver : undefined}
                onDragLeave={files.length > 0 ? handlePageDragLeave : undefined}
                onDrop={files.length > 0 ? handlePageDrop : undefined}
            >
                {/* Header */}
                <div className="tool-header">
                    <h1>Merge <span>PDF</span> Files</h1>
                    <p>Merge multiple PDF files into a single document in your preferred order. <br /> <span> Fast, secure, and hassle-free</span> </p>
                    {files.length > 0 && (
                        <div className="drag-hint">
                            <svg className="me-1" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            <span className="drag-hint-desktop">Drag cards left or right to reorder before merging</span>
                            <span className="drag-hint-mobile">Hold the ⠿ handle on any card and drag to reorder</span>
                        </div>
                    )}
                </div>

                {/* Drop zone — hidden once files added */}
                {files.length === 0 && (
                    <div
                        className={`drop-zone${dropZoneDragOver ? " drag-over" : ""}`}
                        onDragOver={handleDropZoneDragOver}
                        onDragLeave={handleDropZoneDragLeave}
                        onDrop={handleDropZoneDrop}
                    >
                        <input ref={fileInputRef} className="drop-zone-input" type="file" multiple accept=".pdf" onChange={handleFileInputChange} />
                        <div className="drop-zone-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                        </div>
                        <div className="drop-zone-title">{dropZoneDragOver ? "Release to add PDFs" : "Drag & Drop PDF files here"}</div>
                        <div className="drop-zone-sub">or <span>browse from your device</span></div>
                        <button className="drop-zone-btn" onClick={() => fileInputRef.current?.click()} type="button">Select PDF Files</button>
                    </div>
                )}

                {/* Page-level OS drop overlay */}
                {pageDragOver && (
                    <div className="page-drop-overlay">
                        <div className="page-drop-inner">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            <p>Drop PDFs to add</p>
                        </div>
                    </div>
                )}

                {/* Files section */}
                {files.length > 0 && (
                    <>
                        <div className="pdf-grid mb-3 mb-md-5">
                            {files.map((item, index) => (
                                <div
                                    key={item.id}
                                    data-card-index={index}
                                    className={[
                                        "pdf-card",
                                        draggedIndex === index ? "dragging" : "",
                                        dropTargetIndex === index && draggedIndex !== index ? "drag-target" : "",
                                    ].filter(Boolean).join(" ")}
                                    draggable
                                    onDragStart={(e) => handleCardDragStart(e, index)}
                                    onDragOver={(e) => handleCardDragOver(e, index)}
                                    onDrop={(e) => handleCardDrop(e, index)}
                                    onDragEnd={handleCardDragEnd}
                                    onTouchStart={(e) => handleTouchStart(e, index)}
                                    onTouchMove={handleTouchMove}
                                    onTouchEnd={handleTouchEnd}
                                >
                                    {/* Drag handle — touch pe yahan se pakad ke drag karo */}
                                    <div className="drag-handle" data-drag-handle="true" title="Drag to reorder">
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

                                    <button className="pdf-remove" onClick={() => removeFile(index)} type="button" title="Remove">×</button>

                                    <div className="pdf-preview-wrap">
                                        <PdfPreviewClient file={item.preview} />
                                    </div>

                                    <div className="pdf-info">
                                        <div className="pdf-name" title={item.file.name}>{item.file.name}</div>
                                        <div className="pdf-size">{(item.file.size / 1024 / 1024).toFixed(2)} MB</div>
                                    </div>
                                </div>
                            ))}
                        </div>


                    </>
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
                        <div className="loader-text">Merging your PDFs…</div>
                    </div>
                )}

                <ToastContainer position="top-right" />


            </section>
            {files.length > 0 && (
                <div className="tools-bottom-button-div">
                    <input ref={addMoreRef} type="file" multiple accept=".pdf" style={{ display: "none" }} onChange={handleFileInputChange} />
                    <button className="tool-outline-btn" type="button" onClick={() => addMoreRef.current?.click()}>
                        <span className="file-count">{files.length}</span>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Add More
                    </button>
                    <button className="tool-solid-btn" type="button" onClick={mergePDFs} disabled={loading || files.length < 2}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M8 6H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h4" />
                            <path d="M16 6h4a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-4" />
                            <line x1="12" y1="2" x2="12" y2="22" />
                        </svg>
                        Merge &amp; Download
                    </button>
                </div>
            )}
        </div>

    );
}