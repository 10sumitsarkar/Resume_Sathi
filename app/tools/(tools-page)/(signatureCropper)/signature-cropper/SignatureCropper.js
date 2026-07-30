"use client";

import { useMemo, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../tools-css/merge-pdf.css";
import "../../../tools-css/signature-cropper.css";

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
    return Math.max(1, Math.min(10, maxWidth / size.width, maxHeight / size.height));
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
    setSizeInput({ width: String(preset.width), height: String(preset.height) });
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
      x: dragRef.current.offset.x + (e.clientX - dragRef.current.x) / previewScale,
      y: dragRef.current.offset.y + (e.clientY - dragRef.current.y) / previewScale,
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
      <section className="merge-pdf-tool extra-tool">
        <div className="tool-header">
          <h1>
            Signature <span>Cropper</span>
          </h1>
          <p>
            Crop and resize a signature image for forms. <br />
            <span>Drag image inside the frame, then download exact size</span>
          </p>
        </div>
        {!image ? (
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
              accept="image/*"
              onChange={(e) => loadImage(e.target.files)}
            />
            <div className="drop-zone-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                Preview is enlarged. Download stays exactly {size.width} x {size.height}px.
              </div>
            </div>
            <div className="signature-controls">
              <h2 className="signature-section-title">Crop Settings</h2>
              <div className="signature-preset-row d-none">
                {PRESETS.map((preset) => (
                  <button key={preset.label} type="button" onClick={() => applyPreset(preset)}>
                    {preset.label}<span>{preset.width} x {preset.height}px</span>
                  </button>
                ))}
              </div>
              <div className="signature-size-card">
                <label>Width<input type="text" inputMode="numeric" value={sizeInput.width} onChange={(e) => updateSizeInput("width", e.target.value)} onBlur={commitSize} /></label>
                <label>Height<input type="text" inputMode="numeric" value={sizeInput.height} onChange={(e) => updateSizeInput("height", e.target.value)} onBlur={commitSize} /></label>
              </div>
              <div className="signature-adjust-card">
                <button type="button" onClick={rotateQuick}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12a9 9 0 1 1-3-6.7" />
                    <polyline points="21 3 21 9 15 9" />
                  </svg>
                  Rotate 90
                </button>
                <label>
                  Zoom
                  <input type="range" min="40" max="300" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} />
                </label>
                <label>
                  Rotate Angle
                  <input type="range" min="0" max="359" value={angle} onChange={(e) => setAngle(Number(e.target.value))} />
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
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M19 6l-1 14H6L5 6" /></svg>
            Change Image
          </button>
          <button className="tool-solid-btn" type="button" onClick={downloadCrop}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
            Download PNG
          </button>
        </div>
      )}
    </div>
  );
}
