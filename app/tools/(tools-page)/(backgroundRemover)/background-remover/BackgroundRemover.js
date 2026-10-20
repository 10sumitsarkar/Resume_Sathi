"use client";

import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { removeBackground } from "@imgly/background-removal";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import "react-toastify/dist/ReactToastify.css";
import "../../../tools-css/background-remover.css";
import ToolsPageAd from "../../../../tools/components/ToolsPageAd";

export default function BackgroundRemover() {
  const inputRef = useRef(null);
  const sourceUrlRef = useRef(null);
  const resultUrlRef = useRef(null);
  const transparentBlobRef = useRef(null);
  const transparentUrlRef = useRef(null);
  const [source, setSource] = useState(null);
  const [resultUrl, setResultUrl] = useState("");
  const [background, setBackground] = useState({
    type: "transparent",
    color: "#ffffff",
  });
  const [cropMode, setCropMode] = useState(false);
  const [crop, setCrop] = useState(null);
  const [completedCrop, setCompletedCrop] = useState(null);
  const [transparentPreviewUrl, setTransparentPreviewUrl] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState(
    "Preparing your image",
  );

  useEffect(
    () => () => {
      if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current);
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
      if (transparentUrlRef.current)
        URL.revokeObjectURL(transparentUrlRef.current);
      transparentBlobRef.current = null;
    },
    [],
  );

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
    canvas
      .getContext("2d")
      .drawImage(
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

    const coloredBlob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/png"),
    );
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
          if (
            progressKey.includes("fetch") ||
            progressKey.includes("model") ||
            progressKey.includes("wasm")
          ) {
            setProcessingStage("Loading AI model");
          } else if (
            progressKey.includes("inference") ||
            progressKey.includes("process")
          ) {
            setProcessingStage("Finding the subject");
          } else {
            setProcessingStage("Removing the background");
          }
        },
      });

      transparentBlobRef.current = resultBlob;
      if (transparentUrlRef.current)
        URL.revokeObjectURL(transparentUrlRef.current);
      const transparentUrl = URL.createObjectURL(resultBlob);
      transparentUrlRef.current = transparentUrl;
      setTransparentPreviewUrl(transparentUrl);
      setBackground({ type: "transparent", color: "#ffffff" });
      setCrop({ unit: "%", x: 0, y: 0, width: 100, height: 100 });
      setCompletedCrop(null);
      setCropMode(false);
      await renderWithBackground(resultBlob, {
        type: "transparent",
        color: "#ffffff",
      });
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
    const file = Array.from(files || []).find((item) =>
      item.type.startsWith("image/"),
    );
    if (!file) {
      toast.error("Please select a JPG, PNG, or WEBP image");
      return;
    }
    if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current);
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      sourceUrlRef.current = url;
      processImage(file, {
        image,
        name: file.name.replace(/\.[^.]+$/, "") || "image",
      });
    };
    image.onerror = () => toast.error("This image could not be opened");
    image.src = url;
  };

  const reset = () => {
    if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current);
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    if (transparentUrlRef.current)
      URL.revokeObjectURL(transparentUrlRef.current);
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
    if (
      !transparentBlobRef.current ||
      !completedCrop?.width ||
      !completedCrop?.height
    ) {
      toast.error("Select a crop area first");
      return;
    }
    const croppedBlob = await createCroppedBlob(
      transparentBlobRef.current,
      completedCrop,
    );
    transparentBlobRef.current = croppedBlob;
    if (transparentUrlRef.current)
      URL.revokeObjectURL(transparentUrlRef.current);
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
          <h1>
            Background <span>Remover</span>
          </h1>
          <p>
            Remove photo backgrounds online and download transparent PNGs.
            <br />
            <span>Perfect for portraits, products, and profile photos.</span>
          </p>
        </div>
        <ToolsPageAd format="728x90" />

        {!source ? (
          processing ? (
            <div className="bg-remove-loader" role="status" aria-live="polite">
              <div className="bg-remove-loader-orbit">
                <div className="bg-remove-loader-core">BG</div>
              </div>
              <div className="bg-remove-loader-title">Removing background</div>
              <div className="bg-remove-loader-stage">{processingStage}</div>
              <div className="bg-remove-loader-note">
                Your transparent PNG is being prepared. The first image may take
                longer while the background remover loads.
              </div>
            </div>
          ) : (
            <div
              className={`bg-remove-drop-zone drop-zone${dragOver ? " drag-over" : ""}`}
              onDragOver={(event) => {
                event.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
            >
              <input
                ref={inputRef}
                className="drop-zone-input"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(event) => loadImage(event.target.files)}
              />
              <div className="bg-remove-icon" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <div className="drop-zone-title">Drag &amp; Drop image here</div>
              <div className="drop-zone-sub">
                or <span>browse from your device</span>
              </div>
              <button className="drop-zone-btn" type="button">
                Select Image
              </button>
            </div>
          )
        ) : (
          <div className="bg-remove-workspace">
            <div className="bg-remove-preview-card">
              <div className="bg-remove-card-heading">
                <h2>Transparent Preview</h2>
                <span>
                  {source.image.naturalWidth} x {source.image.naturalHeight}px
                </span>
              </div>
              {cropMode ? (
                <div className="bg-remove-crop-editor">
                  <ReactCrop
                    crop={crop}
                    onChange={(_, nextCrop) => setCrop(nextCrop)}
                    onComplete={(_, nextCrop) => setCompletedCrop(nextCrop)}
                  >
                    <img src={transparentPreviewUrl} alt="Select crop area" />
                  </ReactCrop>
                  <div className="bg-remove-crop-actions">
                    <button
                      type="button"
                      className="tool-outline-btn"
                      onClick={() => setCropMode(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="tool-solid-btn"
                      onClick={applyCrop}
                    >
                      Apply Crop
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-remove-preview checkerboard">
                  <img src={resultUrl} alt="Image with background removed" />
                </div>
              )}
              <p className="bg-remove-hint">
                The checkerboard shows transparent pixels.
              </p>
              {!cropMode && (
                <button
                  type="button"
                  className="bg-remove-crop-button"
                  onClick={() => setCropMode(true)}
                >
                  Crop Image
                </button>
              )}
            </div>
            <div className="bg-remove-color-section">
              <div className="bg-remove-color-heading">
                <strong>Background color</strong>
                <span>
                  {background.type === "transparent"
                    ? "Transparent"
                    : background.color}
                </span>
              </div>
              <div className="bg-remove-color-options">
                <button
                  className={`bg-remove-color-swatch transparent-swatch${background.type === "transparent" ? " active" : ""}`}
                  type="button"
                  aria-label="Transparent background"
                  title="Transparent"
                  onClick={() =>
                    chooseBackground({ type: "transparent", color: "#ffffff" })
                  }
                />
                <button
                  className={`bg-remove-color-swatch white-swatch${background.color === "#ffffff" && background.type !== "transparent" ? " active" : ""}`}
                  type="button"
                  aria-label="White background"
                  title="White"
                  onClick={() =>
                    chooseBackground({ type: "color", color: "#ffffff" })
                  }
                />
                <button
                  className={`bg-remove-color-swatch black-swatch${background.color === "#111111" ? " active" : ""}`}
                  type="button"
                  aria-label="Black background"
                  title="Black"
                  onClick={() =>
                    chooseBackground({ type: "color", color: "#111111" })
                  }
                />
                <button
                  className={`bg-remove-color-swatch blue-swatch${background.color === "#dbeafe" ? " active" : ""}`}
                  type="button"
                  aria-label="Blue background"
                  title="Light blue"
                  onClick={() =>
                    chooseBackground({ type: "color", color: "#dbeafe" })
                  }
                />
                <button
                  className={`bg-remove-color-swatch red-swatch${background.color === "#fee2e2" ? " active" : ""}`}
                  type="button"
                  aria-label="Red background"
                  title="Light red"
                  onClick={() =>
                    chooseBackground({ type: "color", color: "#fee2e2" })
                  }
                />
                <label
                  className={`bg-remove-custom-swatch${background.type === "color" && !["#ffffff", "#111111", "#dbeafe", "#fee2e2"].includes(background.color) ? " active" : ""}`}
                  title="Choose custom color"
                >
                  <input
                    type="color"
                    value={background.color}
                    onChange={(event) =>
                      chooseBackground({
                        type: "color",
                        color: event.target.value,
                      })
                    }
                    aria-label="Choose custom background color"
                  />
                </label>
              </div>
              <p className="bg-remove-color-help">
                Choose a color or switch back to transparent anytime.
              </p>
            </div>
            <div className="bg-remove-settings">
              <h2>Background Removal</h2>
              <div className="bg-remove-original">
                <img src={source.image.src} alt="Original uploaded image" />
                <span>Original image</span>
              </div>
              <p className="bg-remove-help">
                The image is processed locally with an AI segmentation model.
                Hair, people, products, and uneven backgrounds are supported.
              </p>
              <div className="bg-remove-tip">
                <strong>Private processing:</strong>
                <span>Your original image is not uploaded to a server.</span>
              </div>
            </div>
          </div>
        )}

        {source && (
          <div className="tools-bottom-button-div">
            <button className="tool-outline-btn" type="button" onClick={reset}>
              Change Image
            </button>
            <button
              className="tool-solid-btn"
              type="button"
              onClick={download}
              disabled={processing}
            >
              {processing ? "Processing..." : "Download PNG"}
            </button>
          </div>
        )}
        <ToastContainer position="top-right" />
      </section>

      <ToolsPageAd native />
      <section className="bg-remover-info">
        <div className="info-block">
          <h2>Cut the Background Out of a Photo in a Few Clicks</h2>
          <p>
            Think about the last photo you took of yourself or of something you
            wanted to sell. There was probably a crumpled bedsheet in the
            corner, a half open cupboard, or a family member walking through the
            frame. The subject was fine. The background was the problem. It
            pulls the eye away from the one thing you wanted people to look at.
          </p>
          <p>
            This tool separates the subject from everything behind it. Once that
            is done, you can leave the background transparent, put a solid
            colour behind the subject, or crop the frame closer before you
            download the file. You do not need to trace around edges or learn an
            editing program. Upload the photo and the tool handles the cutting.
          </p>
        </div>

        <div className="info-block">
          <h3>Where People Actually Use It</h3>
          <p>
            Most of the time, a background remover solves one of a handful of
            everyday problems. These are the ones that come up again and again.
          </p>
          <ul className="info-list info-list--plain">
            <li>
              <strong>Resume and LinkedIn photos.</strong> A clean plain
              background looks far more professional than the wall of your room,
              and it keeps the attention on your face.
            </li>
            <li>
              <strong>Product listings.</strong> If you sell things online, a
              cutout on a plain colour looks neater than a phone photo taken on
              a cluttered table. Buyers notice that.
            </li>
            <li>
              <strong>Posters and thumbnails.</strong> With a transparent
              background you can drop the subject onto any design without a
              white box showing around it.
            </li>
            <li>
              <strong>Profile pictures.</strong> Useful for chat apps, gaming
              accounts, school portals and anywhere else that wants a tidy round
              or square picture.
            </li>
            <li>
              <strong>Simple school or office projects.</strong> Cut out a
              person or an object and place it on a slide or a notice without
              opening heavy software.
            </li>
          </ul>
        </div>

        <blockquote>
          A good background does not get noticed. A bad one is the only thing
          people remember about the photo.
        </blockquote>

        <div className="info-block">
          <h3>How To Use It</h3>
          <p>
            There is hardly any setup. Here is the whole process from start to
            finish.
          </p>
          <ol>
            <li>
              Drag your photo into the box, or tap it and pick an image from
              your device.
            </li>
            <li>
              Wait a moment while the tool works out where the subject ends and
              the background begins.
            </li>
            <li>
              Look at the result on screen. By default the background is
              transparent.
            </li>
            <li>
              If you want a colour behind the subject, choose one and watch the
              preview change.
            </li>
            <li>
              Crop the frame if there is too much empty space around the
              subject.
            </li>
            <li>Download the final image.</li>
          </ol>
          <p>
            The separation happens on its own once the image loads. There is
            nothing to select by hand, and you never have to zoom in and follow
            an outline with your finger or mouse.
          </p>
        </div>

        <ToolsPageAd format="300x250" />

        <div className="info-block">
          <h3>Transparent or a Solid Colour Behind</h3>
          <p>
            Transparent is the default because it is the most flexible. If the
            cutout is going into a poster, a presentation or some other layout,
            you want nothing behind it so the design underneath shows through.
            That is also what lets you place the same subject on many different
            backgrounds later.
          </p>
          <p>
            Often, though, you need a real colour behind the subject. A white or
            light shade is the usual choice for a resume photo. A seller might
            want the same soft grey behind every product so the whole shop looks
            consistent. For those cases there is a colour option, and the
            preview updates as you change it. You see how the final picture will
            look before you commit to a download, which saves you from
            downloading, checking and repeating.
          </p>
          <p>
            A small tip about colour. Light backgrounds work well for most
            portraits, but if the person is wearing a white shirt, a pale
            background can make the edges of the shirt hard to see. In that case
            try a soft blue or a light grey and compare the previews.
          </p>
        </div>

        <div className="info-block">
          <h3>Cropping the Image</h3>
          <p>
            Once the background is gone, you are often left with a lot of empty
            space around the subject. That is a problem if the photo is headed
            for a slot of a fixed size, such as a profile circle, a form field
            or a product grid. A subject floating in the middle of a huge frame
            ends up looking tiny when it gets squeezed into a small box.
          </p>
          <p>
            The crop option lets you pull the frame in close, remove whatever
            you do not need and set the composition you actually want. It is
            especially handy when the original photo was taken from a distance,
            like a group photo where you only need one person, or a product shot
            where the item takes up a small part of the picture.
          </p>
        </div>

        <ToolsPageAd format="468x60" />

        <div className="info-block">
          <h3>Which Photos Give the Best Result</h3>
          <p>
            Clear, well lit photos give the cleanest cutouts, especially when
            the subject stands out from what is behind it. A person standing in
            front of a plain wall comes out almost perfect. A single object on a
            table with decent light usually works well too.
          </p>
          <p>
            Things get harder with fine detail. Loose strands of hair, fur, the
            fuzzy edge of a sweater or a transparent glass can look slightly
            rough after cutting. The same happens when the subject wears
            something close to the colour of the background, like a black jacket
            in front of a dark curtain. The software has trouble deciding where
            one ends and the other begins. This is how edge detection behaves in
            general, and no tool is completely free of it.
          </p>
          <p>If you can retake the photo, a few small changes help a lot:</p>
          <ul className="info-list info-list--plain">
            <li>
              Stand a little away from the wall, so there is less shadow on it.
            </li>
            <li>Face a window or a lamp so your face is evenly lit.</li>
            <li>Wear a colour that is different from the wall behind you.</li>
            <li>
              Hold the phone steady and make sure the subject is in focus.
            </li>
            <li>Avoid heavy filters, since they change edges and colours.</li>
          </ul>
        </div>

        <blockquote>
          Spending thirty seconds on lighting before you click the photo can
          save you several minutes of fixing rough edges afterwards.
        </blockquote>

        <div className="info-block">
          <h3>Mistakes That Spoil a Good Cutout</h3>
          <p>
            Most disappointing results come from the original photo, not from
            the tool. A very dark or blurry image gives the software very little
            to work with. A photo taken against a busy background full of
            patterns, shelves or other people makes the separation harder. And a
            subject that is cut off at the edge of the frame, such as a shoulder
            or a hand that goes out of the picture, can leave an odd straight
            line after the background is removed.
          </p>
          <p>
            Another common mistake is downloading too early. People remove the
            background, save the file, and only then realise they wanted a white
            colour behind it or a tighter crop. That means going back to the
            start. Decide on colour and crop first, look at the preview, and
            download once.
          </p>
        </div>

        <div className="info-block">
          <h3>Notes</h3>
          <p>
            Set the background colour and the crop before you download, because
            redoing them afterwards means starting again from the original
            photo. Your original image is not changed in any way. It stays where
            it is on your device, and nothing from the session is kept once you
            close the tab.
          </p>
        </div>

        <ToolsPageAd format="300x250" />

        <div className="info-block">
          <h3>Questions</h3>
          <div className="faq-list">
            <details className="faq-item">
              <summary>Is this free to use?</summary>
              <p>
                Yes. There is no account and no signup, and you can use it as
                many times as you like. Come back whenever you have another
                photo to clean up.
              </p>
            </details>

            <details className="faq-item">
              <summary>
                Can I put a colour behind instead of keeping it transparent?
              </summary>
              <p>
                Yes. Pick any background colour and the preview changes right
                away. If you would rather keep it transparent, just leave it as
                it is.
              </p>
            </details>

            <details className="faq-item">
              <summary>Can I crop the photo here too?</summary>
              <p>
                Yes. There is a crop option, so you can bring the frame in close
                around your subject before you download.
              </p>
            </details>

            <details className="faq-item">
              <summary>What image formats can I upload?</summary>
              <p>
                JPG and PNG both work. Whatever your phone or camera normally
                saves is usually fine, so you rarely need to convert anything
                first.
              </p>
            </details>

            <details className="faq-item">
              <summary>Why is the download a PNG?</summary>
              <p>
                PNG can store transparency and JPG cannot. If the result were
                saved as a JPG, the transparent area would turn into a solid
                background again, and the cutout would be pointless.
              </p>
            </details>

            <details className="faq-item">
              <summary>Do I have to select the subject manually?</summary>
              <p>
                No. Once your image loads, the tool separates the subject on its
                own. There is no tracing, no brush and no selecting to do
                yourself.
              </p>
            </details>

            <details className="faq-item">
              <summary>Will my original photo be changed?</summary>
              <p>
                No. Your original stays exactly as it was on your device. You
                get a new file with your edits applied, so you can always go
                back and try again from the first version.
              </p>
            </details>

            <details className="faq-item">
              <summary>
                Why do the edges around hair look rough sometimes?
              </summary>
              <p>
                Hair is one of the hardest things to separate, especially when
                the background is a similar shade. A photo with better light and
                more contrast between you and the wall usually gives a cleaner
                edge.
              </p>
            </details>

            <details className="faq-item">
              <summary>Can I use this for a passport or form photo?</summary>
              <p>
                You can remove the background and set a plain colour behind it.
                Before you submit, though, read the photo rules on the form.
                Official documents often have their own conditions for
                background colour, size and face position, and those rules come
                first.
              </p>
            </details>

            <details className="faq-item">
              <summary>Do I need to install any software?</summary>
              <p>
                No. It runs in your browser on both a laptop and a phone. There
                is nothing to download or set up.
              </p>
            </details>

            <details className="faq-item">
              <summary>
                Does it work on photos of objects, not just people?
              </summary>
              <p>
                Yes. Products, bags, shoes, plants and other objects can be cut
                out the same way. Photos with a clear outline and good light
                work best, and shiny or see-through items are the most likely to
                show rough edges.
              </p>
            </details>

            <details className="faq-item">
              <summary>The result looks wrong. What should I try?</summary>
              <p>
                Check the original first. A brighter, sharper photo with the
                subject clearly different from the background almost always
                helps. If you can, retake it near a window against a plain wall
                and upload it again.
              </p>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
}
