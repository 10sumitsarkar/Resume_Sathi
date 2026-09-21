"use client";

import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { removeBackground } from "@imgly/background-removal";
import "react-toastify/dist/ReactToastify.css";
import "../../../tools-css/background-remover.css";

export default function BackgroundRemover() {
  const inputRef = useRef(null);
  const sourceUrlRef = useRef(null);
  const resultUrlRef = useRef(null);
  const transparentBlobRef = useRef(null);
  const [source, setSource] = useState(null);
  const [resultUrl, setResultUrl] = useState("");
  const [background, setBackground] = useState({ type: "transparent", color: "#ffffff" });
  const [dragOver, setDragOver] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState("Preparing your image");

  useEffect(() => () => {
    if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current);
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    transparentBlobRef.current = null;
  }, []);

  const renderWithBackground = async (transparentBlob, nextBackground) => {
    if (nextBackground.type === "transparent") {
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
      const transparentUrl = URL.createObjectURL(transparentBlob);
      resultUrlRef.current = transparentUrl;
      setResultUrl(transparentUrl);
      return;
    }

    const imageUrl = URL.createObjectURL(transparentBlob);
    const image = new Image();
    image.src = imageUrl;
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
    });

    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext("2d");
    context.fillStyle = nextBackground.color;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0);
    URL.revokeObjectURL(imageUrl);

    const coloredBlob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    const coloredUrl = URL.createObjectURL(coloredBlob);
    resultUrlRef.current = coloredUrl;
    setResultUrl(coloredUrl);
  };

  const processImage = async (file, nextSource) => {
    setProcessing(true);
    setProcessingStage("Preparing your image");
    try {
      const resultBlob = await removeBackground(file, {
        output: { format: "image/png", quality: 1 },
        progress: (key) => {
          const progressKey = String(key || "").toLowerCase();
          if (progressKey.includes("fetch") || progressKey.includes("model") || progressKey.includes("wasm")) {
            setProcessingStage("Loading AI model");
          } else if (progressKey.includes("inference") || progressKey.includes("process")) {
            setProcessingStage("Finding the subject");
          } else {
            setProcessingStage("Removing the background");
          }
        },
      });

      transparentBlobRef.current = resultBlob;
      setBackground({ type: "transparent", color: "#ffffff" });
      await renderWithBackground(resultBlob, { type: "transparent", color: "#ffffff" });
      setSource(nextSource);
      setProcessingStage("Done");
      toast.success("Background removed successfully");
    } catch (error) {
      toast.error(error.message || "Background removal failed");
      if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current);
      sourceUrlRef.current = null;
    } finally {
      setProcessing(false);
    }
  };

  const chooseBackground = async (nextBackground) => {
    setBackground(nextBackground);
    if (transparentBlobRef.current) {
      await renderWithBackground(transparentBlobRef.current, nextBackground);
    }
  };

  const loadImage = (files) => {
    const file = Array.from(files || []).find((item) => item.type.startsWith("image/"));
    if (!file) {
      toast.error("Please select a JPG, PNG, or WEBP image");
      return;
    }
    if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current);
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      sourceUrlRef.current = url;
      processImage(file, { image, name: file.name.replace(/\.[^.]+$/, "") || "image" });
    };
    image.onerror = () => toast.error("This image could not be opened");
    image.src = url;
  };

  const reset = () => {
    if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current);
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    transparentBlobRef.current = null;
    sourceUrlRef.current = null;
    resultUrlRef.current = null;
    setSource(null);
    setResultUrl("");
    setBackground({ type: "transparent", color: "#ffffff" });
  };

  const download = () => {
    if (!resultUrl || !source) return;
    const link = document.createElement("a");
    link.download = `${source.name}-${background.type === "transparent" ? "transparent" : "background"}.png`;
    link.href = resultUrl;
    link.click();
    toast.success("Transparent PNG downloaded");
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    loadImage(event.dataTransfer.files);
  };

  return (
    <div className="tools-right-div custom-container py-custom pb-120 mb-3">
      <section className="background-remover-tool mb-3 mb-md-5 extra-tool">
        <div className="tool-header">
          <h1>Background <span>Remover</span></h1>
          <p>Remove photo backgrounds online and download transparent PNGs.<br /><span>Perfect for portraits, products, and profile photos.</span></p>
        </div>

        {!source ? (
          processing ? (
            <div className="bg-remove-loader" role="status" aria-live="polite">
              <div className="bg-remove-loader-orbit"><div className="bg-remove-loader-core">BG</div></div>
              <div className="bg-remove-loader-title">Removing background</div>
              <div className="bg-remove-loader-stage">{processingStage}</div>
              <div className="bg-remove-loader-note">Your transparent PNG is being prepared. The first image may take longer while the background remover loads.</div>
            </div>
          ) : (
            <div className={`bg-remove-drop-zone drop-zone${dragOver ? " drag-over" : ""}`} onDragOver={(event) => { event.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop} onClick={() => inputRef.current?.click()}>
              <input ref={inputRef} className="drop-zone-input" type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => loadImage(event.target.files)} />
              <div className="bg-remove-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <div className="drop-zone-title">Drag &amp; Drop image here</div>
              <div className="drop-zone-sub">or <span>browse from your device</span></div>
              <button className="drop-zone-btn" type="button">Select Image</button>
            </div>
          )
        ) : (
          <div className="bg-remove-workspace">
            <div className="bg-remove-preview-card">
              <div className="bg-remove-card-heading"><h2>Transparent Preview</h2><span>{source.image.naturalWidth} x {source.image.naturalHeight}px</span></div>
              <div className="bg-remove-preview checkerboard"><img src={resultUrl} alt="Image with background removed" /></div>
              <p className="bg-remove-hint">The checkerboard shows transparent pixels.</p>
            </div>
            <div className="bg-remove-color-section">
              <div className="bg-remove-color-heading"><strong>Background color</strong><span>{background.type === "transparent" ? "Transparent" : background.color}</span></div>
              <div className="bg-remove-color-options">
                <button className={`bg-remove-color-swatch transparent-swatch${background.type === "transparent" ? " active" : ""}`} type="button" aria-label="Transparent background" title="Transparent" onClick={() => chooseBackground({ type: "transparent", color: "#ffffff" })} />
                <button className={`bg-remove-color-swatch white-swatch${background.color === "#ffffff" && background.type !== "transparent" ? " active" : ""}`} type="button" aria-label="White background" title="White" onClick={() => chooseBackground({ type: "color", color: "#ffffff" })} />
                <button className={`bg-remove-color-swatch black-swatch${background.color === "#111111" ? " active" : ""}`} type="button" aria-label="Black background" title="Black" onClick={() => chooseBackground({ type: "color", color: "#111111" })} />
                <button className={`bg-remove-color-swatch blue-swatch${background.color === "#dbeafe" ? " active" : ""}`} type="button" aria-label="Blue background" title="Light blue" onClick={() => chooseBackground({ type: "color", color: "#dbeafe" })} />
                <button className={`bg-remove-color-swatch red-swatch${background.color === "#fee2e2" ? " active" : ""}`} type="button" aria-label="Red background" title="Light red" onClick={() => chooseBackground({ type: "color", color: "#fee2e2" })} />
                <label className={`bg-remove-custom-swatch${background.type === "color" && !["#ffffff", "#111111", "#dbeafe", "#fee2e2"].includes(background.color) ? " active" : ""}`} title="Choose custom color">
                  <input type="color" value={background.color} onChange={(event) => chooseBackground({ type: "color", color: event.target.value })} aria-label="Choose custom background color" />
                </label>
              </div>
              <p className="bg-remove-color-help">Choose a color or switch back to transparent anytime.</p>
            </div>
            <div className="bg-remove-settings">
              <h2>Background Removal</h2>
              <div className="bg-remove-original"><img src={source.image.src} alt="Original uploaded image" /><span>Original image</span></div>
              <p className="bg-remove-help">The image is processed locally with an AI segmentation model. Hair, people, products, and uneven backgrounds are supported.</p>
              <div className="bg-remove-tip"><strong>Private processing:</strong><span>Your original image is not uploaded to a server.</span></div>
            </div>
          </div>
        )}

        {source && <div className="tools-bottom-button-div"><button className="tool-outline-btn" type="button" onClick={reset}>Change Image</button><button className="tool-solid-btn" type="button" onClick={download} disabled={processing}>{processing ? "Processing..." : "Download PNG"}</button></div>}
        <ToastContainer position="top-right" />
      </section>

          <section className="bg-remover-info">
        <div className="info-block">
          <h2>Remove The Background From Any Photo</h2>
          <p>
            Most photos we take have something distracting behind the
            subject, a messy room, a wall with marks on it, random people
            walking past. For a profile picture or a product listing, that
            background does nothing except pull attention away from what
            actually matters. This tool takes your image, separates the
            subject from whatever's behind it, and hands back a PNG with a
            transparent background that you can drop onto any color or
            layout you want.
          </p>
        </div>

        <div className="info-block">
          <h3>Where This Comes In Handy</h3>
          <p>
            Profile photos are a big one, LinkedIn or a resume photo looks
            far more presentable with a clean plain background instead of
            the bedroom wall it was clicked against. Sellers use it for
            product images, since listing photos with a clean cutout look
            far more professional than a phone shot on a cluttered table.
            And for anyone making a poster, a thumbnail, or a simple design,
            having the subject on a transparent background means you can
            place it anywhere without a white box showing around it.
          </p>
        </div>

        <div className="info-block">
          <h3>How To Use It</h3>
          <p>
            Drop your image into the box or pick one from your device,
            that's really the whole setup. The tool works out where the
            subject ends and the background begins on its own, no manual
            selecting or tracing around edges needed. Once it's done you'll
            see the result, and from there you can download it as a
            transparent PNG ready to use wherever you need it.
          </p>
        </div>

        <div className="info-block">
          <h3>Which Photos Work Best</h3>
          <p>
            Clear, well-lit photos give the cleanest cutouts, especially
            when there's decent contrast between the subject and whatever's
            behind them. A person standing against a plain-ish wall comes
            out almost perfect. Where it gets harder is fine detail like
            loose strands of hair, or a subject wearing something the same
            shade as the background, edges there can look slightly rough.
            Nothing unusual about that, it's just how edge detection
            behaves when the two sides blend into each other.
          </p>
        </div>

        <div className="info-block">
          <h3>Why It Downloads As A PNG</h3>
          <p>
            Transparency only survives in formats that support it, and PNG
            is the common one. A JPG can't store transparent areas at all,
            it would just fill them back in with white, which defeats the
            point entirely. So the output here stays PNG, meaning you can
            place the cutout over any background color later without a
            white rectangle appearing around your subject.
          </p>
        </div>

        <div className="info-block">
          <h3>Notes</h3>
          <p>
            If the cutout doesn't look right the first time, a better lit
            photo or one with a simpler background usually fixes it faster
            than anything else. Your original image isn't modified in any
            way, it stays as it is on your device, and nothing from the
            session is kept once you close the tab.
          </p>
        </div>

        <div className="info-block">
          <h3>Questions</h3>
          <div className="faq-list">
            <details className="faq-item">
              <summary>Is this free to use?</summary>
              <p>
                Yes, free to use, no account or signup needed, come back as
                often as you like.
              </p>
            </details>

            <details className="faq-item">
              <summary>What image formats can I upload?</summary>
              <p>
                Regular photo formats like JPG and PNG work fine here,
                whatever your phone or camera saves is usually good.
              </p>
            </details>

            <details className="faq-item">
              <summary>Why is the download always a PNG?</summary>
              <p>
                Because PNG supports transparency and JPG doesn't, saving as
                JPG would just put a white background back behind your
                subject.
              </p>
            </details>

            <details className="faq-item">
              <summary>Do I have to select the subject manually?</summary>
              <p>
                No, the separation happens automatically once your image
                loads, there's no tracing or selecting to do yourself.
              </p>
            </details>

            <details className="faq-item">
              <summary>Will my original photo be changed?</summary>
              <p>
                No, your original stays exactly as it is on your device, you
                just get a new file with the background removed.
              </p>
            </details>

            <details className="faq-item">
              <summary>Why do the edges around hair look rough sometimes?</summary>
              <p>
                Fine details like hair strands are the hardest part to
                separate, especially when the background is a similar shade,
                a higher contrast photo usually gives a cleaner result.
              </p>
            </details>

            <details className="faq-item">
              <summary>Can I use this for product photos?</summary>
              <p>
                Yes, it's one of the more common uses, a clean cutout makes
                listing images look a lot more presentable.
              </p>
            </details>

            <details className="faq-item">
              <summary>Can I use it for a passport or form photo?</summary>
              <p>
                You can remove the background, but check the exact photo
                specifications the form asks for before submitting, since
                official documents often have their own rules about
                background colour and size.
              </p>
            </details>

            <details className="faq-item">
              <summary>What if I upload the wrong image?</summary>
              <p>
                Just select a different image and it replaces the current
                one, no need to reload the page.
              </p>
            </details>

            <details className="faq-item">
              <summary>Do I need to install any software?</summary>
              <p>
                No, it runs in the browser on both laptop and phone, nothing
                to download or set up first.
              </p>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
}