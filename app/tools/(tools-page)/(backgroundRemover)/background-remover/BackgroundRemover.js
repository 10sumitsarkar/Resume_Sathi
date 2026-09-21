"use client";

import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { removeBackground } from "@imgly/background-removal";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import "react-toastify/dist/ReactToastify.css";
import "../../../tools-css/background-remover.css";

export default function BackgroundRemover() {
  const inputRef = useRef(null);
  const sourceUrlRef = useRef(null);
  const resultUrlRef = useRef(null);
  const transparentBlobRef = useRef(null);
  const transparentUrlRef = useRef(null);
  const [source, setSource] = useState(null);
  const [resultUrl, setResultUrl] = useState("");
  const [background, setBackground] = useState({ type: "transparent", color: "#ffffff" });
  const [cropMode, setCropMode] = useState(false);
  const [crop, setCrop] = useState(null);
  const [completedCrop, setCompletedCrop] = useState(null);
  const [transparentPreviewUrl, setTransparentPreviewUrl] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState("Preparing your image");

  useEffect(() => () => {
    if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current);
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    if (transparentUrlRef.current) URL.revokeObjectURL(transparentUrlRef.current);
    transparentBlobRef.current = null;
  }, []);

  const createCroppedBlob = async (blob, cropArea) => {
    const imageUrl = URL.createObjectURL(blob);
    const image = new Image();
    image.src = imageUrl;
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
    });
    const pixelCrop = {
      x: image.naturalWidth * (cropArea.x / 100),
      y: image.naturalHeight * (cropArea.y / 100),
      width: image.naturalWidth * (cropArea.width / 100),
      height: image.naturalHeight * (cropArea.height / 100),
    };
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(pixelCrop.width));
    canvas.height = Math.max(1, Math.round(pixelCrop.height));
    canvas.getContext("2d").drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      canvas.width,
      canvas.height,
    );
    URL.revokeObjectURL(imageUrl);
    return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  };

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
      if (transparentUrlRef.current) URL.revokeObjectURL(transparentUrlRef.current);
      const transparentUrl = URL.createObjectURL(resultBlob);
      transparentUrlRef.current = transparentUrl;
      setTransparentPreviewUrl(transparentUrl);
      setBackground({ type: "transparent", color: "#ffffff" });
      setCrop({ unit: "%", x: 0, y: 0, width: 100, height: 100 });
      setCompletedCrop(null);
      setCropMode(false);
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
    if (transparentUrlRef.current) URL.revokeObjectURL(transparentUrlRef.current);
    transparentBlobRef.current = null;
    sourceUrlRef.current = null;
    resultUrlRef.current = null;
    setSource(null);
    setResultUrl("");
    setBackground({ type: "transparent", color: "#ffffff" });
    setTransparentPreviewUrl("");
    setCropMode(false);
    setCrop(null);
    setCompletedCrop(null);
  };

  const applyCrop = async () => {
    if (!transparentBlobRef.current || !completedCrop?.width || !completedCrop?.height) {
      toast.error("Select a crop area first");
      return;
    }
    const croppedBlob = await createCroppedBlob(transparentBlobRef.current, completedCrop);
    transparentBlobRef.current = croppedBlob;
    if (transparentUrlRef.current) URL.revokeObjectURL(transparentUrlRef.current);
    const croppedUrl = URL.createObjectURL(croppedBlob);
    transparentUrlRef.current = croppedUrl;
    setTransparentPreviewUrl(croppedUrl);
    await renderWithBackground(croppedBlob, background);
    setCropMode(false);
    setCrop({ unit: "%", x: 0, y: 0, width: 100, height: 100 });
    setCompletedCrop(null);
    toast.success("Crop applied");
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
              {cropMode ? (
                <div className="bg-remove-crop-editor">
                  <ReactCrop crop={crop} onChange={(_, nextCrop) => setCrop(nextCrop)} onComplete={(_, nextCrop) => setCompletedCrop(nextCrop)}>
                    <img src={transparentPreviewUrl} alt="Select crop area" />
                  </ReactCrop>
                  <div className="bg-remove-crop-actions">
                    <button type="button" className="tool-outline-btn" onClick={() => setCropMode(false)}>Cancel</button>
                    <button type="button" className="tool-solid-btn" onClick={applyCrop}>Apply Crop</button>
                  </div>
                </div>
              ) : (
                <div className="bg-remove-preview checkerboard"><img src={resultUrl} alt="Image with background removed" /></div>
              )}
              <p className="bg-remove-hint">The checkerboard shows transparent pixels.</p>
              {!cropMode && <button type="button" className="bg-remove-crop-button" onClick={() => setCropMode(true)}>Crop Image</button>}
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
            actually matters. This tool separates the subject from whatever's
            behind it, and from there you can keep the background fully
            transparent, swap in a solid colour of your choice, and crop the
            image down before downloading it.
          </p>
        </div>

        <div className="info-block">
          <h3>Where This Comes In Handy</h3>
          <p>
            Profile photos are a big one, a LinkedIn or resume photo looks
            far more presentable on a clean plain background instead of the
            bedroom wall it was clicked against. Sellers use it for product
            images, since listing photos with a clean cutout look far more
            professional than a phone shot on a cluttered table. And for
            anyone making a poster, a thumbnail, or a simple design, having
            the subject on a transparent background means you can place it
            anywhere without a white box showing around it.
          </p>
        </div>

        <div className="info-block">
          <h3>How To Use It</h3>
          <p>
            Drop your image into the box or pick one from your device,
            that's really the whole setup. The tool works out where the
            subject ends and the background begins on its own, no manual
            selecting or tracing around edges needed. Once that's done you
            get the result on screen, and the rest is up to you, leave it
            transparent, put a colour behind it, or trim the frame down
            before downloading.
          </p>
        </div>

        <div className="info-block">
          <h3>Transparent Or A Solid Colour Behind</h3>
          <p>
            Transparent is the default and it's what you want when the image
            is going into a design, a poster, or over some other layout.
            But plenty of the time you actually need a colour back there,
            like a white or light background for a resume photo, or a plain
            shade behind a product so the listing looks consistent. So
            there's an option to pick a background colour instead, and the
            preview updates as you change it so you can see how it looks
            before committing to the download.
          </p>
        </div>

        <div className="info-block">
          <h3>Cropping The Image</h3>
          <p>
            Removing the background often leaves a lot of empty space around
            the subject, which isn't ideal if the photo is going into a
            fixed size slot somewhere. The crop option lets you tighten the
            frame around your subject, cut off whatever you don't need, and
            get the composition you actually want. Handy when the original
            photo was clicked from a distance and the subject ends up small
            in the middle of a big frame.
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
            Nothing unusual about that, it's just how edge detection behaves
            when the two sides blend into each other.
          </p>
        </div>

        <div className="info-block">
          <h3>Notes</h3>
          <p>
            Do the background colour and crop before downloading, since
            going back and redoing it afterwards means starting from the
            original photo again. Your original image isn't modified in any
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
              <summary>Can I put a colour behind instead of keeping it transparent?</summary>
              <p>
                Yes, pick whichever background colour you want and the
                preview updates right away, or just leave it transparent if
                that's what you need.
              </p>
            </details>

            <details className="faq-item">
              <summary>Can I crop the photo here too?</summary>
              <p>
                Yes, there's a crop option so you can tighten the frame
                around your subject before downloading.
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
              <summary>Why is the download a PNG?</summary>
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
                just get a new file with your edits applied.
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
              <summary>Can I use this for a passport or form photo?</summary>
              <p>
                You can remove the background and set a plain colour behind
                it, but check the exact photo specifications the form asks
                for before submitting, since official documents often have
                their own rules about background colour and size.
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