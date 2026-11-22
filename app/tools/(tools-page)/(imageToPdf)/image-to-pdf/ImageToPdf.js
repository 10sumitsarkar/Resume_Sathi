"use client";

import { useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../tools-css/merge-pdf.css";
import "../../../tools-css/image-to-pdf.css";

export default function ImageToPdf() {
  const inputRef = useRef(null);
  const touchDragIndex = useRef(null);
  const touchCurrentTarget = useRef(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dropZoneDragOver, setDropZoneDragOver] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dropTargetIndex, setDropTargetIndex] = useState(null);

  const addImages = (rawFiles) => {
    const picked = Array.from(rawFiles || []).filter((file) =>
      /^image\/(png|jpeg|jpg)$/i.test(file.type),
    );
    if (!picked.length) {
      toast.error("Please select JPG or PNG images");
      return;
    }
    setImages((prev) => [
      ...prev,
      ...picked.map((file) => ({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
      })),
    ]);
  };

  const convert = async () => {
    if (!images.length) {
      toast.error("Please add at least one image");
      return;
    }
    try {
      setLoading(true);
      const pdf = await PDFDocument.create();
      for (const item of images) {
        const bytes = await item.file.arrayBuffer();
        const embedded =
          item.file.type === "image/png"
            ? await pdf.embedPng(bytes)
            : await pdf.embedJpg(bytes);
        const page = pdf.addPage([embedded.width, embedded.height]);
        page.drawImage(embedded, {
          x: 0,
          y: 0,
          width: embedded.width,
          height: embedded.height,
        });
      }
      const pdfBytes = await pdf.save();
      const url = URL.createObjectURL(
        new Blob([pdfBytes], { type: "application/pdf" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = "images.pdf";
      link.click();
      URL.revokeObjectURL(url);
      toast.success("PDF created!");
    } catch (error) {
      toast.error("Failed to convert images");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDropZoneDragOver(false);
    addImages(e.dataTransfer.files);
  };

  const removeImage = (index) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const reset = () => {
    images.forEach((item) => URL.revokeObjectURL(item.preview));
    setImages([]);
  };

  const moveImage = (from, to) => {
    if (from === to || from === null || to === null) return;
    setImages((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);
      return updated;
    });
  };

  const handleCardDrop = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    moveImage(draggedIndex, index);
    setDraggedIndex(null);
    setDropTargetIndex(null);
  };

  const handleTouchStart = (index) => {
    touchDragIndex.current = index;
    touchCurrentTarget.current = index;
    setDraggedIndex(index);
  };

  const handleTouchMove = (e) => {
    if (touchDragIndex.current === null) return;
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const card = element?.closest("[data-image-index]");
    if (!card) return;
    const nextIndex = Number(card.getAttribute("data-image-index"));
    if (Number.isInteger(nextIndex) && nextIndex !== touchCurrentTarget.current) {
      touchCurrentTarget.current = nextIndex;
      setDropTargetIndex(nextIndex);
    }
  };

  const handleTouchEnd = () => {
    moveImage(touchDragIndex.current, touchCurrentTarget.current);
    touchDragIndex.current = null;
    touchCurrentTarget.current = null;
    setDraggedIndex(null);
    setDropTargetIndex(null);
  };

  return (
    <div className="tools-right-div custom-container py-custom pb-120 mb-3">
      <section className="merge-pdf-tool extra-tool mb-3 mb-md-5">
        <div className="tool-header">
          <h1>
            Image to <span>PDF</span>
          </h1>
          <p>
            Convert JPG and PNG files into a clean PDF. <br />
            <span>Your images stay in your browser</span>
          </p>
          {images.length > 0 && (
            <div className="drag-hint">
              <svg className="me-1" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>Drag cards left or right to reorder before merging</span>
            </div>
          )}
        </div>

        {images.length === 0 ? (
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
              accept="image/png,image/jpeg"
              multiple
              onChange={(e) => addImages(e.target.files)}
            />
            <div className="drop-zone-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="m21 15-5-5L5 21" />
              </svg>
            </div>
            <div className="drop-zone-title">Drag & Drop images here</div>
            <div className="drop-zone-sub">
              or <span>browse from your device</span>
            </div>
            <button className="drop-zone-btn" type="button">
              Select Images
            </button>
          </div>
        ) : (
          <>
            <div className="image-pdf-selected">
              <div className="image-pdf-grid">
                {images.map((item, index) => (
                  <div
                    data-image-index={index}
                    className={[
                      "image-pdf-card",
                      draggedIndex === index ? "dragging" : "",
                      dropTargetIndex === index && draggedIndex !== index ? "drag-target" : "",
                    ].filter(Boolean).join(" ")}
                    key={item.id}
                    draggable
                    onDragStart={() => setDraggedIndex(index)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (draggedIndex !== null && draggedIndex !== index) setDropTargetIndex(index);
                    }}
                    onDrop={(e) => handleCardDrop(e, index)}
                    onDragEnd={() => {
                      setDraggedIndex(null);
                      setDropTargetIndex(null);
                    }}
                    onTouchStart={() => handleTouchStart(index)}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    <img src={item.preview} alt={item.file.name} />
                    <button type="button" onClick={() => removeImage(index)}>
                      x
                    </button>
                    <span>{index + 1}</span>
                    <div title={item.file.name}>{item.file.name}</div>
                  </div>
                ))}
              </div>
            </div>
            <input
              ref={inputRef}
              className="d-none"
              type="file"
              accept="image/png,image/jpeg"
              multiple
              onChange={(e) => addImages(e.target.files)}
            />
          </>
        )}
        <ToastContainer position="top-right" />
      </section>
      {images.length > 0 && (
        <div className="tools-bottom-button-div">
          <button className="tool-outline-btn" type="button" onClick={() => inputRef.current?.click()}>
            <span className="file-count">{images.length}</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add More
          </button>
          <button className="tool-solid-btn" type="button" onClick={convert} disabled={loading}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <polyline points="9 15 12 12 15 15" />
            </svg>
            {loading ? "Creating..." : "Create PDF"}
          </button>
        </div>
      )}

      <section className="image-to-pdf-info">
        <div className="info-block">
          <h2>Turn Your Photos And Screenshots Into A PDF</h2>
          <p>
            A lot of what people need to submit online isn't a document at
            all, it's a photo. A picture of a marksheet taken on a phone, a
            screenshot of a payment receipt, a scanned ID card saved as a
            JPG. But most forms specifically ask for a PDF, not an image
            file, and that's where this tool comes in. Drop in your JPGs or
            PNGs and get back a proper PDF built from them, no extra app
            needed on your phone or laptop.
          </p>
        </div>

        <div className="info-block">
          <h3>Where This Comes Up Most</h3>
          <p>
            Job and government portals are a big one, they'll happily take a
            resume as a PDF but flat out reject a photo of your certificate,
            so converting it first is the only way around that. Sometimes
            it's a single image, like a photo of a signed consent form, that
            just needs to become a one-page PDF before it can be emailed
            somewhere. And plenty of people scan documents by photographing
            each page separately and need all those photos combined into one
            PDF instead of sending five different image files.
          </p>
        </div>

        <div className="info-block">
          <h3>Adding And Arranging Your Images</h3>
          <p>
            Drop your images in or pick them from your device, each one
            turns into its own card with a small number showing where it'll
            land in the final PDF. Got the order wrong, or realized the
            marksheet photo should come before the ID card one? Just drag the
            cards around until the numbers line up the way you want. There's
            also an Add More button if you forgot a file, no need to start
            the upload over from scratch.
          </p>
        </div>

        <div className="info-block">
          <h3>One Image Or A Whole Batch</h3>
          <p>
            This works whether you're converting a single photo or a dozen
            of them at once. Each image you add becomes its own page in the
            resulting PDF, in whatever order the cards are arranged in when
            you hit Create PDF. So a bunch of individually scanned pages
            turns into one properly ordered, multi-page document instead of
            staying scattered as separate image files on your phone.
          </p>
        </div>

        <div className="info-block">
          <h3>What Happens To Image Quality</h3>
          <p>
            Your images get placed into the PDF as they are, nothing gets
            aggressively compressed or stretched out of proportion in the
            process. A clear photo goes in clear, a slightly blurry phone
            scan comes out just as blurry as it went in, since the tool
            isn't touching the actual image data, only wrapping it into a
            PDF page.
          </p>
        </div>

        <div className="info-block">
          <h3>Notes</h3>
          <p>
            Worth checking the card order once more right before hitting
            Create PDF, since the page order in your final file depends
            entirely on that. This whole process runs inside your browser,
            no images are sent to any server, and closing the tab clears
            everything from that session for good.
          </p>
        </div>

        <div className="info-block">
          <h3>Questions</h3>
          <div className="faq-list">
            <details className="faq-item">
              <summary>Is this free to use?</summary>
              <p>
                Yes, completely free, no signup required, use it whenever you
                need to.
              </p>
            </details>

            <details className="faq-item">
              <summary>What image types can I upload?</summary>
              <p>
                JPG and PNG both work fine here, that covers pretty much any
                photo or screenshot you'd have on your phone.
              </p>
            </details>

            <details className="faq-item">
              <summary>Can I convert more than one image into a single PDF?</summary>
              <p>
                Yes, add as many as you need, each one becomes its own page
                in the same PDF file.
              </p>
            </details>

            <details className="faq-item">
              <summary>Can I change the order of the images?</summary>
              <p>
                Yes, drag the cards left or right until they're in the order
                you want before creating the PDF.
              </p>
            </details>

            <details className="faq-item">
              <summary>Are my images uploaded to a server anywhere?</summary>
              <p>
                No, everything happens right in your browser, your images
                never leave your device.
              </p>
            </details>

            <details className="faq-item">
              <summary>Will converting reduce image quality?</summary>
              <p>
                No, your images are placed into the PDF as they are, nothing
                is compressed or resized in the process.
              </p>
            </details>

            <details className="faq-item">
              <summary>Can I add more images after I've already uploaded some?</summary>
              <p>
                Yes, use the Add More option to bring in additional files
                without losing what you've already added.
              </p>
            </details>

            <details className="faq-item">
              <summary>What if I add the wrong image?</summary>
              <p>
                Just remove it using the small remove icon on that card
                before creating the PDF, no need to restart everything.
              </p>
            </details>

            <details className="faq-item">
              <summary>Is there a limit on how many images I can add?</summary>
              <p>
                Not really, a couple of images or a large batch both work,
                bigger batches just take slightly longer to process.
              </p>
            </details>

            <details className="faq-item">
              <summary>Do I need to install any app for this?</summary>
              <p>
                No, it works directly in your browser on mobile or desktop,
                nothing to download beforehand.
              </p>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
}
