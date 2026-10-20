"use client";

import { useMemo, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../tools-css/merge-pdf.css";
import "../../../tools-css/signature-cropper.css";
import ToolsPageAd from "../../../../tools/components/ToolsPageAd";

const PRESETS = [
  { label: "Govt Default", width: 140, height: 60 },
  { label: "SSC CGL", width: 140, height: 60 },
  { label: "GDS / Railway", width: 300, height: 120 },
  { label: "Wide Signature", width: 400, height: 150 },
];

function fitScale(image, frame) {
  if (!image) return 1;
  return Math.max(frame.width / image.width, frame.height / image.height);
}

export default function SignatureCropper() {
  const inputRef = useRef(null);
  const canvasRef = useRef(null);
  const dragRef = useRef(null);
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("signature");
  const [size, setSize] = useState({ width: 140, height: 60 });
  const [sizeInput, setSizeInput] = useState({ width: "140", height: "60" });
  const [zoom, setZoom] = useState(100);
  const [angle, setAngle] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dropZoneDragOver, setDropZoneDragOver] = useState(false);

  const previewScale = useMemo(() => {
    const maxWidth = 620;
    const maxHeight = 260;
    return Math.max(
      1,
      Math.min(10, maxWidth / size.width, maxHeight / size.height),
    );
  }, [size]);

  const frameStyle = {
    width: `${size.width * previewScale}px`,
    height: `${size.height * previewScale}px`,
  };

  const imageStyle = image
    ? {
        width: `${image.width * fitScale(image, size) * (zoom / 100) * previewScale}px`,
        height: `${image.height * fitScale(image, size) * (zoom / 100) * previewScale}px`,
        transform: `translate(calc(-50% + ${offset.x * previewScale}px), calc(-50% + ${offset.y * previewScale}px)) rotate(${angle}deg)`,
      }
    : {};

  const loadImage = (rawFiles) => {
    const file = Array.from(rawFiles || []).find((item) =>
      item.type.startsWith("image/"),
    );
    if (!file) {
      toast.error("Please select an image");
      return;
    }
    if (image?.url) URL.revokeObjectURL(image.url);
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setImage({ url, width: img.width, height: img.height });
      setFileName(file.name.replace(/\.[^.]+$/, "") || "signature");
      setZoom(100);
      setAngle(0);
      setOffset({ x: 0, y: 0 });
    };
    img.src = url;
  };

  const applyPreset = (preset) => {
    setSize({ width: preset.width, height: preset.height });
    setSizeInput({
      width: String(preset.width),
      height: String(preset.height),
    });
    setOffset({ x: 0, y: 0 });
    setZoom(100);
  };

  const updateSizeInput = (key, value) => {
    if (!/^\d*$/.test(value)) return;
    setSizeInput((prev) => ({ ...prev, [key]: value }));
    if (value !== "") {
      setSize((prev) => ({ ...prev, [key]: Math.max(1, Number(value)) }));
      setOffset({ x: 0, y: 0 });
    }
  };

  const commitSize = () => {
    const width = Math.max(1, Number(sizeInput.width) || 140);
    const height = Math.max(1, Number(sizeInput.height) || 60);
    setSize({ width, height });
    setSizeInput({ width: String(width), height: String(height) });
  };

  const rotateQuick = () => {
    setAngle((prev) => (prev + 90) % 360);
  };

  const startDrag = (e) => {
    e.preventDefault();
    dragRef.current = {
      x: e.clientX,
      y: e.clientY,
      offset,
    };
    window.addEventListener("pointermove", moveImage);
    window.addEventListener("pointerup", stopDrag);
  };

  const moveImage = (e) => {
    if (!dragRef.current) return;
    setOffset({
      x:
        dragRef.current.offset.x +
        (e.clientX - dragRef.current.x) / previewScale,
      y:
        dragRef.current.offset.y +
        (e.clientY - dragRef.current.y) / previewScale,
    });
  };

  const stopDrag = () => {
    dragRef.current = null;
    window.removeEventListener("pointermove", moveImage);
    window.removeEventListener("pointerup", stopDrag);
  };

  const reset = () => {
    if (image?.url) URL.revokeObjectURL(image.url);
    setImage(null);
    setOffset({ x: 0, y: 0 });
    setZoom(100);
    setAngle(0);
  };

  const downloadCrop = () => {
    if (!image) {
      toast.error("Please upload a signature image");
      return;
    }
    const source = new Image();
    source.onload = () => {
      const canvas = canvasRef.current;
      canvas.width = size.width;
      canvas.height = size.height;
      const ctx = canvas.getContext("2d");
      const baseScale = fitScale(source, size);
      const finalScale = baseScale * (zoom / 100);

      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(size.width / 2 + offset.x, size.height / 2 + offset.y);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.scale(finalScale, finalScale);
      ctx.drawImage(source, -source.width / 2, -source.height / 2);
      ctx.restore();

      const link = document.createElement("a");
      link.download = `${fileName}-${size.width}x${size.height}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Signature downloaded!");
    };
    source.src = image.url;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDropZoneDragOver(false);
    loadImage(e.dataTransfer.files);
  };

  return (
    <div className="tools-right-div custom-container py-custom pb-120 mb-3">
      <section className="merge-pdf-tool mb-3 mb-md-5 extra-tool">
        <div className="tool-header">
          <h1>
            Signature <span>Cropper</span>
          </h1>
          <p>
            Crop and resize a signature image for forms. <br />
            <span>Drag image inside the frame, then download exact size</span>
          </p>
        </div>
        <ToolsPageAd format="728x90" />
        {!image ? (
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
              accept="image/*"
              onChange={(e) => loadImage(e.target.files)}
            />
            <div className="drop-zone-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6.13 1 6 16a2 2 0 0 0 2 2h15" />
                <path d="M1 6.13 16 6a2 2 0 0 1 2 2v15" />
              </svg>
            </div>
            <div className="drop-zone-title">Upload signature image</div>
            <div className="drop-zone-sub">PNG, JPG, or scanned signature</div>
            <button className="drop-zone-btn" type="button">
              Select Image
            </button>
          </div>
        ) : (
          <div className="signature-layout">
            <div className="signature-main">
              <h2 className="signature-section-title">Crop Preview</h2>
              <div className="signature-preview">
                <div className="signature-frame" style={frameStyle}>
                  <img
                    src={image.url}
                    alt="Uploaded signature"
                    className="signature-frame-image"
                    style={imageStyle}
                    onPointerDown={startDrag}
                    draggable={false}
                  />
                </div>
              </div>
              <div className="signature-preview-meta">
                Preview is enlarged. Download stays exactly {size.width} x{" "}
                {size.height}px.
              </div>
            </div>
            <div className="signature-controls">
              <h2 className="signature-section-title">Crop Settings</h2>
              <div className="signature-preset-row d-none">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => applyPreset(preset)}
                  >
                    {preset.label}
                    <span>
                      {preset.width} x {preset.height}px
                    </span>
                  </button>
                ))}
              </div>
              <div className="signature-size-card">
                <label>
                  Width
                  <input
                    type="text"
                    inputMode="numeric"
                    value={sizeInput.width}
                    onChange={(e) => updateSizeInput("width", e.target.value)}
                    onBlur={commitSize}
                  />
                </label>
                <label>
                  Height
                  <input
                    type="text"
                    inputMode="numeric"
                    value={sizeInput.height}
                    onChange={(e) => updateSizeInput("height", e.target.value)}
                    onBlur={commitSize}
                  />
                </label>
              </div>
              <div className="signature-adjust-card">
                <button type="button" onClick={rotateQuick}>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 12a9 9 0 1 1-3-6.7" />
                    <polyline points="21 3 21 9 15 9" />
                  </svg>
                  Rotate 90
                </button>
                <label>
                  Zoom
                  <input
                    type="range"
                    min="40"
                    max="300"
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                  />
                </label>
                <label>
                  Rotate Angle
                  <input
                    type="range"
                    min="0"
                    max="359"
                    value={angle}
                    onChange={(e) => setAngle(Number(e.target.value))}
                  />
                </label>
              </div>
              <div className="signature-current-size">
                Final PNG: {size.width} x {size.height}px
              </div>
            </div>
          </div>
        )}
        <canvas ref={canvasRef} className="d-none" />
        <ToastContainer position="top-right" />
      </section>
      {image && (
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
            Change Image
          </button>
          <button
            className="tool-solid-btn"
            type="button"
            onClick={downloadCrop}
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
            Download PNG
          </button>
        </div>
      )}

      <ToolsPageAd native />
      <section className="signature-cropper-info">
        <div className="info-block">
          <h2>Get Your Signature Into the Exact Size a Form Asks For</h2>
          <p>
            The signature box on an application form looks simple until you read
            the instructions. Somewhere in the fine print it says 140 by 60
            pixels, or 200 by 80, or some other number that has nothing to do
            with how your signature looks on paper. Upload anything else and the
            portal either squashes it into a strange shape or throws an error
            that does not explain much.
          </p>
          <p>
            Most people start with a photo of their signature taken on a plain
            sheet of paper. It is a little crooked, there is a lot of empty
            white space around it, and the file is far bigger than the form
            allows. This tool takes that raw photo and turns it into a neat,
            correctly sized signature image that the portal will accept the
            first time.
          </p>
        </div>

        <div className="info-block">
          <h3>Where People Actually Need This</h3>
          <p>
            The biggest reason is government recruitment. SSC, railway, banking
            and many state and central exam portals ask for a signature upload
            with a fixed pixel size, and a wrong size is one of the more common
            reasons an application gets stuck at the very last step. It is
            annoying because everything else is already filled in.
          </p>
          <ul className="info-list info-list--plain">
            <li>
              <strong>Exam application forms.</strong> Each notification lists
              its own signature size, and they are often different from one exam
              to the next.
            </li>
            <li>
              <strong>Bank account opening.</strong> Banks have their own size
              rules for the signature image, usually different from exam
              portals.
            </li>
            <li>
              <strong>College and scholarship forms.</strong> Many admission and
              scholarship portals want a scanned signature next to the photo.
            </li>
            <li>
              <strong>Any upload with a tilted photo.</strong> If you signed on
              paper, clicked a picture at an angle and need it straightened and
              trimmed, this does that too.
            </li>
          </ul>
        </div>

        <blockquote>
          Many applications are not rejected for a wrong answer. They get stuck
          because a signature image was a few pixels too wide.
        </blockquote>

        <div className="info-block">
          <h3>Setting the Width and Height</h3>
          <p>
            After you upload your image, you will see two fields, one for width
            and one for height. Type in the size your form asks for. The
            recruitment notification usually mentions it in the instructions
            section, so look there before you start, and keep that number in
            front of you while you work.
          </p>
          <p>
            The frame on the preview changes to match your numbers straight
            away, so you are always cropping to the right shape and never
            guessing. Whatever sits inside the black bordered frame when you
            finish is exactly what appears in your downloaded file, pixel for
            pixel.
          </p>
        </div>

        <ToolsPageAd format="300x250" />

        <div className="info-block">
          <h3>Zoom, Rotate and Position</h3>
          <p>
            A signature photographed by hand is almost never straight. That is
            why the tool gives you a few controls to line it up properly.
          </p>
          <ul className="info-list info-list--plain">
            <li>
              <strong>Rotate angle slider.</strong> Fixes small tilts, the kind
              you get when the paper was not perfectly level.
            </li>
            <li>
              <strong>Rotate 90 button.</strong> Turns the image a quarter turn,
              which helps when the photo came in sideways.
            </li>
            <li>
              <strong>Zoom slider.</strong> Moves in or out so the signature
              fills the frame instead of floating in empty white space.
            </li>
            <li>
              <strong>Drag to position.</strong> Move the image around inside
              the frame until the signature sits right where you want it.
            </li>
          </ul>
          <p>
            A good order to follow is rotate first, zoom second and drag last.
            Straightening the image before zooming means you will not have to
            redo the position when the angle changes.
          </p>
        </div>

        <div className="info-block">
          <h3>What You Get When You Download</h3>
          <p>
            The preview on your screen looks bigger than the final file. That is
            only to make editing easier. What downloads is a PNG at the exact
            width and height you typed, no larger and no smaller. If the
            notification asks for 140 by 60, that is the size of your file, and
            there are no resizing surprises waiting at the portal.
          </p>
        </div>

        <ToolsPageAd format="468x60" />

        <div className="info-block">
          <h3>Taking a Better Photo of Your Signature</h3>
          <p>
            The cleaner your starting photo, the easier the cropping becomes. A
            few small habits make a big difference.
          </p>
          <ul className="info-list info-list--plain">
            <li>
              Use plain white paper with no lines, no printed boxes and no
              folds.
            </li>
            <li>
              Sign with a dark pen, preferably black or dark blue, so the
              strokes stand out.
            </li>
            <li>
              Take the photo in daylight or under a bright lamp, and keep your
              shadow off the paper.
            </li>
            <li>
              Hold the phone directly above the paper instead of at an angle.
            </li>
            <li>
              Leave a little margin around the signature so nothing gets cut off
              at the edges.
            </li>
          </ul>
        </div>

        <blockquote>
          Thirty seconds spent on a clean photo saves a lot of fiddling with
          sliders later.
        </blockquote>

        <div className="info-block">
          <h3>Common Mistakes With Signature Uploads</h3>
          <p>
            The most frequent mistake is entering the wrong size. People guess
            or use the size from a previous form, and portals can differ even
            for similar exams. Always read the notification for the form you are
            filling right now.
          </p>
          <p>
            Another one is leaving too much blank space around the signature.
            When the final box is small, a signature that takes up only a
            quarter of the frame ends up tiny and faint after resizing. Zoom in
            until the signature fills most of the frame, without touching the
            edges. Lastly, avoid signing differently from the one on your other
            documents, since many forms later compare the two.
          </p>
        </div>

        <div className="info-block">
          <h3>Notes</h3>
          <p>
            Before you upload anywhere, confirm the exact signature size in the
            official notification. Portals can differ from each other even for
            similar exams. Try to photograph your signature on a plain, well lit
            background too, because it makes cropping and positioning much
            easier. Everything runs in your browser itself. Your signature photo
            is never sent to a server, and once you close the tab nothing from
            that session is kept anywhere.
          </p>
        </div>

        <ToolsPageAd format="300x250" />

        <div className="info-block">
          <h3>Questions</h3>
          <div className="faq-list">
            <details className="faq-item">
              <summary>Is this free to use?</summary>
              <p>
                Yes. It is completely free, no account is needed and you can use
                it as many times as you want.
              </p>
            </details>

            <details className="faq-item">
              <summary>
                How do I know what size to enter for a government form?
              </summary>
              <p>
                Check the official recruitment notification or the upload
                instructions on the portal. Most forms state the exact width and
                height they expect for a signature, often near the photo
                requirements.
              </p>
            </details>

            <details className="faq-item">
              <summary>What if my signature photo is sideways?</summary>
              <p>
                Press the Rotate 90 button to turn a fully sideways image, then
                use the rotate angle slider to fix any small tilt that is left.
              </p>
            </details>

            <details className="faq-item">
              <summary>Can I move the image around inside the frame?</summary>
              <p>
                Yes. Drag the image directly to place your signature exactly
                where you want it inside the crop area.
              </p>
            </details>

            <details className="faq-item">
              <summary>
                Is the downloaded file actually the size I entered?
              </summary>
              <p>
                Yes. The preview looks larger on screen so editing is easier,
                but the final PNG matches the width and height you entered
                exactly.
              </p>
            </details>

            <details className="faq-item">
              <summary>Does my photo get uploaded to a server?</summary>
              <p>
                No. The whole cropping process happens in your browser and your
                image never leaves your device.
              </p>
            </details>

            <details className="faq-item">
              <summary>What image formats can I upload?</summary>
              <p>
                PNG and JPG both work. A photo of your signature from a phone
                camera or a scanned copy is fine.
              </p>
            </details>

            <details className="faq-item">
              <summary>Can I change the image after uploading?</summary>
              <p>
                Yes. Use the Change Image option to swap it out and start over
                with a different photo, which is useful if the first one came
                out blurry.
              </p>
            </details>

            <details className="faq-item">
              <summary>
                Different exams ask for different signature sizes. Does this
                handle that?
              </summary>
              <p>
                Yes. Enter whatever width and height the exam or form asks for
                and the frame adjusts to match every time. You can use the same
                photo for several forms by changing the numbers.
              </p>
            </details>

            <details className="faq-item">
              <summary>Do I need any software installed for this?</summary>
              <p>
                No. It works directly in your browser on both mobile and
                desktop, and there is nothing to download separately.
              </p>
            </details>

            <details className="faq-item">
              <summary>Can I use the same file for different forms?</summary>
              <p>
                Only if the size requirement is identical. If another form asks
                for different dimensions, change the width and height and
                download a fresh file instead of reusing the old one.
              </p>
            </details>

            <details className="faq-item">
              <summary>
                My signature looks faint after cropping. What can I do?
              </summary>
              <p>
                Retake the photo with a darker pen and better light, then zoom
                in so the signature fills more of the frame. A thin pen on grey,
                shadowy paper is the usual cause.
              </p>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
}
