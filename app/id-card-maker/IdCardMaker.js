"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import JSZip from "jszip";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import FooterNav from "../components/FooterNav";
import Icon, { CATEGORY_ICONS } from "./id-card-icons";
import {
  CATEGORIES,
  SIZES,
  TEMPLATES,
  blankElements,
  element,
  uid,
} from "./id-card-templates";

const fitTextToContent = (item) => {
  if (item.type !== "text" || typeof document === "undefined") return item;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = `${item.bold ? 800 : 500} ${item.fontSize || 16}px Arial`;
  const lines = String(item.text || "").split("\n");
  const contentWidth = Math.max(
    ...lines.map((line) => context.measureText(line || " ").width),
  );
  return {
    ...item,
    width: Math.max(28, Math.ceil(contentWidth * 1.06 + 10)),
    height: Math.max(
      20,
      Math.ceil(lines.length * (item.fontSize || 16) * 1.25 + 4),
    ),
  };
};

const getTemplatePreviewWidth = (template, maxWidth = 186, maxHeight = 126) => {
  const size = SIZES[template.size] || SIZES["CR80 Landscape"];
  const scale = Math.min(maxWidth / size.width, maxHeight / size.height);
  return Math.round(size.width * scale);
};

export default function IdCardMaker() {
  const [category, setCategory] = useState("All");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [elements, setElements] = useState([]);
  const [side, setSide] = useState("front");
  const [sideFlipping, setSideFlipping] = useState(false);
  const [sides, setSides] = useState({ front: [], back: [] });
  const [cardBg, setCardBg] = useState({ front: "#ffffff", back: "#ffffff" });
  const [selectedId, setSelectedId] = useState(null);
  const [sizeName, setSizeName] = useState("CR80 Landscape");
  const [cardSize, setCardSize] = useState(SIZES["CR80 Landscape"]);
  const [viewportMode, setViewportMode] = useState("desktop");
  const [pinchZoom, setPinchZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [rotationGuide, setRotationGuide] = useState(null);
  const [guides, setGuides] = useState(true);
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const [showEditor, setShowEditor] = useState(false);
  const [activePanel, setActivePanel] = useState("elements");
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const stageRef = useRef(null);
  const fileRef = useRef(null);
  const categoryScrollRef = useRef(null);
  const pinchRef = useRef(null);
  const canvasAreaRef = useRef(null);

  useEffect(() => {
    const updateViewportMode = () => {
      setViewportMode(window.innerWidth <= 640 ? "mobile" : "desktop");
    };

    updateViewportMode();
    window.addEventListener("resize", updateViewportMode);

    return () => window.removeEventListener("resize", updateViewportMode);
  }, []);

  useEffect(() => {
    if (!canvasAreaRef.current) return undefined;
    const updateCanvasWidth = () => {
      setCanvasWidth(canvasAreaRef.current?.clientWidth || 0);
    };
    const observer = new ResizeObserver(updateCanvasWidth);
    observer.observe(canvasAreaRef.current);
    updateCanvasWidth();
    return () => observer.disconnect();
  }, [showEditor]);

  const fitScale = canvasWidth
    ? Math.min(1, Math.max(0.1, (canvasWidth - 24) / cardSize.width))
    : 1;
  const desktopScale = canvasWidth
    ? Math.max(0.1, (canvasWidth * 0.5) / cardSize.width)
    : 0.5;
  const baseScale = viewportMode === "mobile" ? fitScale : desktopScale;
  const stageScale = baseScale * pinchZoom;

  const getTouchDistance = (touchA, touchB) =>
    Math.hypot(touchA.clientX - touchB.clientX, touchA.clientY - touchB.clientY);

  const handleStageTouchStart = (event) => {
    if (event.touches.length !== 2) return;
    const [touchA, touchB] = Array.from(event.touches);
    pinchRef.current = {
      distance: getTouchDistance(touchA, touchB),
      zoom: pinchZoom,
      midpoint: {
        x: (touchA.clientX + touchB.clientX) / 2,
        y: (touchA.clientY + touchB.clientY) / 2,
      },
      pan,
    };
  };

  const handleStageTouchMove = (event) => {
    if (event.touches.length !== 2 || !pinchRef.current) return;
    event.preventDefault();
    const [touchA, touchB] = Array.from(event.touches);
    const nextDistance = getTouchDistance(touchA, touchB);
    const scaleRatio = nextDistance / pinchRef.current.distance;
    const nextMidpoint = {
      x: (touchA.clientX + touchB.clientX) / 2,
      y: (touchA.clientY + touchB.clientY) / 2,
    };
    const nextZoom = Math.min(
      viewportMode === "mobile" ? 2.2 : 1.25,
      Math.max(0.8, pinchRef.current.zoom * scaleRatio),
    );
    setPinchZoom(nextZoom);
    setPan({
      x: pinchRef.current.pan.x + nextMidpoint.x - pinchRef.current.midpoint.x,
      y: pinchRef.current.pan.y + nextMidpoint.y - pinchRef.current.midpoint.y,
    });
  };

  const handleStageTouchEnd = () => {
    pinchRef.current = null;
  };

  const handleStageWheel = (event) => {
    if (viewportMode === "mobile") return;
    event.preventDefault();
    setPinchZoom((current) =>
      Math.min(2.5, Math.max(0.5, current * (event.deltaY < 0 ? 1.1 : 0.9))),
    );
  };

  const filtered =
    category === "All"
      ? TEMPLATES
      : TEMPLATES.filter((template) => template.category === category);
  const selected = elements.find((item) => item.id === selectedId);

  const commit = (next) => {
    setHistory((previous) => [...previous.slice(-29), elements]);
    setFuture([]);
    setElements(next);
    setSides((previous) => ({ ...previous, [side]: next }));
  };

  const loadTemplate = (template) => {
    const prepare = (list) =>
      (list || []).map((item) => fitTextToContent({ ...item, id: uid() }));
    const front = template
      ? prepare(template.elements)
      : blankElements().map(fitTextToContent);
    const back = template ? prepare(template.back) : [];

    if (template?.size && SIZES[template.size]) {
      setSizeName(template.size);
      setCardSize(SIZES[template.size]);
    }

    setCardBg({
      front: template?.frontBg || "#ffffff",
      back: template?.backBg || template?.frontBg || "#ffffff",
    });
    setSelectedTemplate(template?.id || "blank");
    setElements(front);
    setSides({ front, back });
    setSide("front");
    setSelectedId(front[0]?.id || null);
    setActivePanel("properties");
    setMobileSheetOpen(false);
    setHistory([]);
    setFuture([]);
    setPinchZoom(1);
    setPan({ x: 0, y: 0 });
    setShowEditor(true);
  };

  const updateSelected = (patch) => {
    if (!selected) return;
    commit(
      elements.map((item) =>
        item.id === selected.id
          ? fitTextToContent({ ...item, ...patch })
          : item,
      ),
    );
  };

  const addElement = (type, shape = "rectangle") => {
    const defaults =
      type === "text"
        ? {
            text:
              shape === "heading"
                ? "Heading"
                : shape === "subheading"
                  ? "Subheading"
                  : "Body text",
            fontSize:
              shape === "heading" ? 28 : shape === "subheading" ? 20 : 16,
            color: "#111827",
            bold: shape === "heading",
          }
        : type === "photo"
          ? { width: 110, height: 132 }
          : type === "qr"
            ? { width: 88, height: 88 }
            : type === "barcode"
              ? { width: 180, height: 26 }
              : {
                  text: "",
                  shape,
                  bg: "#dbe2ff",
                  fillMode: "solid",
                  borderColor: "#001691",
                  borderWidth: 2,
                  radius: shape === "circle" ? 50 : shape === "pill" ? 999 : 6,
                  width: shape === "circle" || shape === "star" ? 72 : 120,
                  height: shape === "line" ? 8 : 72,
                };
    const next = [
      ...elements,
      fitTextToContent(element(type, { x: 40, y: 40, ...defaults })),
    ];
    commit(next);
    setSelectedId(next[next.length - 1].id);
    setActivePanel("properties");
    setMobileSheetOpen(true);
  };

  const deleteSelected = () => {
    if (!selected) return;
    commit(elements.filter((item) => item.id !== selected.id));
    setSelectedId(null);
    setActivePanel("none");
    setMobileSheetOpen(false);
  };

  const duplicateSelected = () => {
    if (!selected) return;
    const copy = {
      ...selected,
      id: uid(),
      x: selected.x + 14,
      y: selected.y + 14,
    };
    commit([...elements, copy]);
    setSelectedId(copy.id);
  };

  const moveSelected = (direction) => {
    if (!selected) return;
    const next = [...elements];
    const index = next.findIndex((item) => item.id === selected.id);
    const target =
      direction === "forward"
        ? Math.min(next.length - 1, index + 1)
        : Math.max(0, index - 1);
    [next[index], next[target]] = [next[target], next[index]];
    commit(next);
  };

  const undo = () => {
    const previous = history.at(-1);
    if (!previous) return;
    setFuture((current) => [elements, ...current]);
    setHistory((current) => current.slice(0, -1));
    setElements(previous);
    setSides((current) => ({ ...current, [side]: previous }));
  };

  const redo = () => {
    const next = future[0];
    if (!next) return;
    setHistory((current) => [...current, elements]);
    setFuture((current) => current.slice(1));
    setElements(next);
    setSides((current) => ({ ...current, [side]: next }));
  };

  const switchSide = (nextSide) => {
    if (nextSide === side) return;
    setSides((current) => ({ ...current, [side]: elements }));
    const next = sides[nextSide] || [];
    setSideFlipping(true);
    setSide(nextSide);
    setElements(next);
    setSelectedId(next[0]?.id || null);
    window.setTimeout(() => setSideFlipping(false), 520);
  };

  const onPointerDown = (event, item) => {
    event.stopPropagation();
    if (item.locked) return;
    let activeItem = item;

    if (event.altKey) {
      activeItem = {
        ...item,
        id: uid(),
        x: item.x + 14,
        y: item.y + 14,
        locked: false,
      };
      commit([...elements, activeItem]);
    }

    setSelectedId(activeItem.id);
    const start = { x: event.clientX, y: event.clientY, item: activeItem };
    const pointerTarget = event.currentTarget;
    const pointerId = event.pointerId;
    pointerTarget.setPointerCapture?.(pointerId);
    let dragging = true;
    const move = (moveEvent) => {
      if (!dragging) return;
      const scale = stageScale;
      setElements((current) =>
        current.map((entry) =>
          entry.id === activeItem.id
            ? {
                ...entry,
                x: Math.max(
                  0,
                  start.item.x + (moveEvent.clientX - start.x) / scale,
                ),
                y: Math.max(
                  0,
                  start.item.y + (moveEvent.clientY - start.y) / scale,
                ),
              }
            : entry,
        ),
      );
    };
    const stop = () => {
      if (!dragging) return;
      dragging = false;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
      pointerTarget.releasePointerCapture?.(pointerId);
      setSides((current) => ({ ...current, [side]: elements }));
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
  };

  const onResizeStart = (event, item, corner = "se") => {
    event.stopPropagation();
    if (item.locked) return;
    const start = { x: event.clientX, y: event.clientY, item };
    const pointerTarget = event.currentTarget;
    const pointerId = event.pointerId;
    pointerTarget.setPointerCapture?.(pointerId);
    let resizing = true;
    const resize = (resizeEvent) => {
      if (!resizing) return;
      const scale = stageScale;
      const deltaX = (resizeEvent.clientX - start.x) / scale;
      const deltaY = (resizeEvent.clientY - start.y) / scale;
      const nextWidth = Math.max(
        28,
        start.item.width + (corner.includes("e") ? deltaX : -deltaX),
      );
      const nextHeight = Math.max(
        20,
        start.item.height + (corner.includes("s") ? deltaY : -deltaY),
      );
      const nextX = corner.includes("w")
        ? Math.max(0, start.item.x + deltaX)
        : start.item.x;
      const nextY = corner.includes("n")
        ? Math.max(0, start.item.y + deltaY)
        : start.item.y;
      setElements((current) =>
        current.map((entry) =>
          entry.id === item.id
            ? {
                ...entry,
                x: nextX,
                y: nextY,
                width: nextWidth,
                height: nextHeight,
              }
            : entry,
        ),
      );
    };
    const stop = () => {
      if (!resizing) return;
      resizing = false;
      window.removeEventListener("pointermove", resize);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
      pointerTarget.releasePointerCapture?.(pointerId);
    };
    window.addEventListener("pointermove", resize);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
  };

  const onRotateStart = (event, item) => {
    event.stopPropagation();
    if (item.locked) return;
    const elementBox = event.currentTarget.parentElement.getBoundingClientRect();
    const pointerTarget = event.currentTarget;
    const pointerId = event.pointerId;
    pointerTarget.setPointerCapture?.(pointerId);
    const centerX = elementBox.left + elementBox.width / 2;
    const centerY = elementBox.top + elementBox.height / 2;
    const startAngle = Math.atan2(
      event.clientY - centerY,
      event.clientX - centerX,
    );
    const startRotation = item.rotation || 0;
    let rotating = true;
    const rotate = (rotateEvent) => {
      if (!rotating) return;
      const angle = Math.atan2(
        rotateEvent.clientY - centerY,
        rotateEvent.clientX - centerX,
      );
      const rotation = startRotation + ((angle - startAngle) * 180) / Math.PI;
      const normalized = ((rotation % 360) + 360) % 360;
      const straightAngles = [0, 90, 180, 270, 360];
      const closestAngle = straightAngles.reduce((closest, candidate) =>
        Math.abs(candidate - normalized) < Math.abs(closest - normalized)
          ? candidate
          : closest,
      );
      setRotationGuide(
        Math.abs(closestAngle - normalized) <= 1
          ? { id: item.id, angle: closestAngle % 360 }
          : null,
      );
      setElements((current) =>
        current.map((entry) =>
          entry.id === item.id ? { ...entry, rotation } : entry,
        ),
      );
    };
    const stop = () => {
      if (!rotating) return;
      rotating = false;
      window.removeEventListener("pointermove", rotate);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
      pointerTarget.releasePointerCapture?.(pointerId);
      setRotationGuide(null);
      setSides((current) => ({ ...current, [side]: elements }));
    };
    window.addEventListener("pointermove", rotate);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
  };

  const uploadPhoto = (event) => {
    const file = event.target.files?.[0];
    if (!file || !selected || selected.type !== "photo") return;
    const url = URL.createObjectURL(file);
    updateSelected({ src: url });
    event.target.value = "";
  };

  const exportCard = async () => {
    if (!stageRef.current) return;
    const originalSide = side;
    const originalElements = elements;
    const exportScale = 3840 / Math.max(cardSize.width, cardSize.height);

    const captureSide = async (sideName) => {
      const exportStage = stageRef.current.cloneNode(true);
      exportStage.classList.remove("show-guides");
      exportStage.querySelectorAll(".selected").forEach((node) => {
        node.classList.remove("selected");
      });
      exportStage
        .querySelectorAll(".resize-handle, .rotate-handle")
        .forEach((node) => node.remove());
      exportStage.style.position = "fixed";
      exportStage.style.left = "-10000px";
      exportStage.style.top = "0";
      exportStage.style.transform = "none";
      document.body.appendChild(exportStage);

      try {
        const canvas = await html2canvas(exportStage, {
          scale: exportScale,
          backgroundColor: null,
        });
        const blob = await new Promise((resolve) =>
          canvas.toBlob(resolve, "image/png"),
        );
        return { name: `id-card-${sideName}-4k.png`, blob };
      } finally {
        exportStage.remove();
      }
    };

    const zip = new JSZip();
    try {
      const frontElements = sides.front || (originalSide === "front" ? originalElements : []);
      const backElements = sides.back || (originalSide === "back" ? originalElements : []);
      setSide("front");
      setElements(frontElements);
      await new Promise(requestAnimationFrame);
      await new Promise(requestAnimationFrame);
      const frontImage = await captureSide("front");
      zip.file(frontImage.name, frontImage.blob);

      setSide("back");
      setElements(backElements);
      await new Promise(requestAnimationFrame);
      await new Promise(requestAnimationFrame);
      const backImage = await captureSide("back");
      zip.file(backImage.name, backImage.blob);

      const archive = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.download = "id-card-front-back-4k.zip";
      link.href = URL.createObjectURL(archive);
      link.click();
      URL.revokeObjectURL(link.href);
    } finally {
      setSide(originalSide);
      setElements(originalElements);
    }
  };

  const changeSize = (value) => {
    setSizeName(value);
    setCardSize(SIZES[value]);
  };

  const updateCustomSize = (dimension, value) => {
    const nextValue = Math.max(40, Number(value) || 40);
    setSizeName("Custom");
    setCardSize((current) => ({ ...current, [dimension]: nextValue }));
  };

  const railItems = [
    { id: "templates", icon: "templates", label: "Templates" },
    { id: "elements", icon: "elements", label: "Elements" },
    { id: "text", icon: "text", label: "Text" },
    { id: "brand", icon: "brand", label: "Brand" },
    { id: "uploads", icon: "uploads", label: "Uploads" },
  ];

  const openPanel = (panel) => {
    setActivePanel(panel);
    setMobileSheetOpen(true);
  };

  const currentPanelLabel =
    railItems.find((item) => item.id === activePanel)?.label ||
    (activePanel === "properties" ? "Edit" : "Menu");

  const selectElement = (id) => {
    setSelectedId(id);
    setActivePanel("properties");
    setMobileSheetOpen(true);
  };

  const renderContextPanel = () => {
    if (activePanel === "none") return null;
    if (activePanel === "properties")
      return (
        <>
          {selected ? (
            <Properties
              item={selected}
              update={updateSelected}
              remove={deleteSelected}
              duplicate={duplicateSelected}
              layer={moveSelected}
              uploadPhoto={uploadPhoto}
              fileRef={fileRef}
            />
          ) : (
            <div className="empty-properties">Select an object to edit it.</div>
          )}
        </>
      );
    if (activePanel === "templates")
      return (
        <>
          <div className="context-panel-title">Templates</div>
          <p className="context-panel-note">Choose a ready-made card layout.</p>
          <div className="context-template-list">
            {TEMPLATES.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => loadTemplate(template)}
              >
                <span
                  className="context-template-swatch"
                  style={{ background: template.frontBg }}
                >
                  <i style={{ background: template.color }} />
                </span>
                <span className="context-template-copy">
                  <strong>{template.name}</strong>
                  <small>{template.category}</small>
                </span>
              </button>
            ))}
            <button type="button" onClick={() => loadTemplate(null)}>
              <span className="context-template-swatch blank">
                <Icon name="plus" size={16} />
              </span>
              <span className="context-template-copy">
                <strong>Blank canvas</strong>
                <small>Start from scratch</small>
              </span>
            </button>
          </div>
        </>
      );
    if (activePanel === "text")
      return (
        <>
          <div className="context-panel-title">Text</div>
          <p className="context-panel-note">
            Select text on the card to edit its font, size, color and rotation.
          </p>
          <button
            className="context-add-button"
            onClick={() => addElement("text")}
          >
            Add text box
          </button>
        </>
      );
    if (activePanel === "uploads")
      return (
        <>
          <div className="context-panel-title">Uploads</div>
          <p className="context-panel-note">
            If a photo frame already exists, this will replace the image in it.
          </p>
          <button
            className="context-add-button"
            onClick={() => {
              const existing = elements.find((item) => item.type === "photo");

              if (existing) {
                setSelectedId(existing.id);
                setActivePanel("properties");
                setMobileSheetOpen(true);
                setTimeout(() => fileRef.current?.click(), 0);
                return;
              }

              const photo = fitTextToContent(
                element("photo", { x: 64, y: 60, width: 120, height: 140 }),
              );
              commit([...elements, photo]);
              setSelectedId(photo.id);
              setActivePanel("properties");
              setMobileSheetOpen(true);
              setTimeout(() => fileRef.current?.click(), 0);
            }}
          >
            Add photo frame & upload
          </button>
        </>
      );
    if (activePanel === "brand")
      return (
        <>
          <div className="context-panel-title">Brand</div>
          <p className="context-panel-note">
            Keep organisation colors and text consistent across your card.
          </p>
          <label className="panel-label">
            Card size
            <div className="size-grid">
              {Object.keys(SIZES).map((name) => (
                <button
                  key={name}
                  className={sizeName === name ? "active" : ""}
                  onClick={() => changeSize(name)}
                >
                  <span
                    className={`size-icon size-${name.toLowerCase().replaceAll(" ", "-")}`}
                  />
                  <span>{name.replace("CR80 ", "")}</span>
                </button>
              ))}
            </div>
          </label>
          {sizeName === "Custom" && (
            <div className="custom-size-fields">
              <label>
                Width
                <input
                  type="number"
                  min="40"
                  value={cardSize.width}
                  onChange={(event) => updateCustomSize("width", event.target.value)}
                />
              </label>
              <label>
                Height
                <input
                  type="number"
                  min="40"
                  value={cardSize.height}
                  onChange={(event) => updateCustomSize("height", event.target.value)}
                />
              </label>
            </div>
          )}
          <label className="panel-label bg-label">
            Card background ({side})
            <div className="bg-color-row">
              <input
                type="color"
                value={cardBg[side] || "#ffffff"}
                onChange={(event) =>
                  setCardBg((current) => ({
                    ...current,
                    [side]: event.target.value,
                  }))
                }
              />
              <div className="bg-swatch-row">
                {["#ffffff", "#0f172a", "#eef2ff", "#ecfdf5", "#fff7ed", "#fef2f2"].map(
                  (tone) => (
                    <button
                      key={tone}
                      type="button"
                      aria-label={`Background ${tone}`}
                      style={{ background: tone }}
                      onClick={() =>
                        setCardBg((current) => ({ ...current, [side]: tone }))
                      }
                    />
                  ),
                )}
              </div>
            </div>
          </label>
          <label className="guide-toggle">
            <input
              type="checkbox"
              checked={guides}
              onChange={(event) => setGuides(event.target.checked)}
            />{" "}
            Safe-area guides
          </label>
        </>
      );
    return (
      <>
        <div className="context-panel-title">Elements</div>
        <p className="context-panel-note">
          Shapes, codes and photo frames. Text and uploads have their own tabs.
        </p>
        <div className="quick-add-grid">
          <button type="button" onClick={() => addElement("photo")}>
            <Icon name="uploads" size={18} />
            Photo frame
          </button>
          <button type="button" onClick={() => addElement("qr")}>
            <Icon name="qr" size={18} />
            QR code
          </button>
          <button type="button" onClick={() => addElement("barcode")}>
            <Icon name="layers" size={18} />
            Barcode
          </button>
        </div>
        <div className="shape-picker">
          <strong>Shapes</strong>
          <div className="shape-picker-grid">
            {[
              { shape: "rectangle", label: "Rectangle" },
              { shape: "circle", label: "Circle" },
              { shape: "pill", label: "Rounded" },
              { shape: "line", label: "Line" },
              { shape: "triangle", label: "Triangle" },
              { shape: "star", label: "Star" },
            ].map((option) => (
              <button
                key={option.shape}
                type="button"
                onClick={() => addElement("shape", option.shape)}
              >
                <Icon name={option.shape} size={22} />
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </>
    );
  };

  useEffect(() => {
    if (!showEditor) return undefined;
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "Your ID card changes may be lost. Do you want to leave?";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [showEditor]);

  useEffect(() => {
    if (!showEditor) return undefined;
    const handleKeyDown = (event) => {
      const target = event.target;
      const isTyping =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement;
      if (isTyping) return;

      if ((event.key === "Delete" || event.key === "Backspace") && selectedId) {
        event.preventDefault();
        deleteSelected();
      } else if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "d" &&
        selectedId
      ) {
        event.preventDefault();
        duplicateSelected();
      } else if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "z"
      ) {
        event.preventDefault();
        undo();
      } else if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "y"
      ) {
        event.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showEditor, selectedId, elements, history, future, side]);

  const templateCount = (name) =>
    name === "All"
      ? TEMPLATES.length
      : name === "Blank Canvas"
        ? 1
        : TEMPLATES.filter((item) => item.category === name).length;

  const goTemplates = () =>
    document.getElementById("templates")?.scrollIntoView({ behavior: "smooth" });

  const scrollCategories = (direction) => {
    categoryScrollRef.current?.scrollBy({
      left: direction * 240,
      behavior: "smooth",
    });
  };

  if (!showEditor) {
    return (
      <>
        <NavBar />
        <main className="id-maker-shell rk-root idm-page">
        {/* ============================ HERO ============================ */}
        <section className="idm-hero">
          <div className="container">
            <div className="row align-items-center g-4 g-lg-5">
              <div className="col-lg-6">
                <span className="idm-pill">
                  <i className="idm-dot" /> No signup &middot; Always free &middot; 100% local
                </span>
                <h1 className="idm-h1">
                  Make a printable <span>ID card</span> in minutes
                </h1>
                <p className="idm-lead">
                  Ready front and back templates for school, college, employee,
                  visitor, event, medical, press, gym and volunteer cards. Edit
                  in your browser and download a print-ready 4K file.
                </p>

                <div className="idm-note">
                  <strong>
                    <Icon name="shield" size={15} /> Your photos stay private
                  </strong>
                  <span>
                    Everything is processed in your browser. No account, no
                    upload, no server.
                  </span>
                </div>

                <div className="idm-hero-actions">
                  <button
                    type="button"
                    className="btn idm-btn idm-btn-primary"
                    onClick={goTemplates}
                  >
                    Choose a Template <Icon name="arrow" size={16} />
                  </button>
                  <button
                    type="button"
                    className="btn idm-btn idm-btn-outline"
                    onClick={() => loadTemplate(null)}
                  >
                    <Icon name="plus" size={16} /> Blank Canvas
                  </button>
                </div>

              </div>

              <div className="col-lg-6">
                <div className="idm-hero-art" aria-hidden="true">
                  <div className="idm-hero-card idm-hero-card-back">
                    <MiniCard template={TEMPLATES[2]} face="back" width={554} fluid />
                  </div>
                  <div className="idm-hero-card idm-hero-card-front">
                    <MiniCard template={TEMPLATES[2]} face="front" width={554} fluid />
                  </div>
                  <span className="idm-hero-flag">
                    <Icon name="flip" size={13} /> Front &amp; back included
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================= RED STAT STRIP ========================= */}
        <section className="idm-strip">
          <div className="container">
            <ul>
              <li>
                <Icon name="layers" size={17} /> <strong>{TEMPLATES.length}</strong> Ready Templates
              </li>
              <li>
                <Icon name="flip" size={17} /> <strong>Front + Back</strong> Both Sides Designed
              </li>
              <li>
                <Icon name="download" size={17} /> <strong>4K PNG</strong> Print Ready
              </li>
              <li>
                <Icon name="shield" size={17} /> <strong>100%</strong> Privacy Guaranteed
              </li>
            </ul>
          </div>
        </section>

        {/* ========================= SHOWCASE ========================= */}
        <section className="idm-section idm-section-soft">
          <div className="container text-center">
            <span className="idm-kicker">YOUR CARD, READY TO PRINT</span>
            <h2 className="idm-h2 idm-h2-center">See your ID card come to life</h2>
            <p className="idm-sub idm-sub-center">
              Every card is built on standard CR80 and lanyard badge sizes, with
              a designed reverse side, so it prints exactly like the preview.
            </p>
            <div className="idm-showcase" aria-hidden="true">
              <div className="idm-showcase-card idm-showcase-l">
                <MiniCard template={TEMPLATES[8]} face="front" width={190} />
              </div>
              <div className="idm-showcase-card idm-showcase-c">
                <MiniCard template={TEMPLATES[4]} face="front" width={240} />
              </div>
              <div className="idm-showcase-card idm-showcase-r">
                <MiniCard template={TEMPLATES[14]} face="front" width={190} />
              </div>
            </div>
            <button
              type="button"
              className="btn idm-btn idm-btn-primary"
              onClick={goTemplates}
            >
              Get Started <Icon name="arrow" size={16} />
            </button>
          </div>
        </section>

        {/* ========================= TEMPLATES ========================= */}
        <section className="idm-section" id="templates">
          <div className="container">
            <span className="idm-kicker">TEMPLATES</span>
            <div className="idm-section-head">
              <div>
                <h2 className="idm-h2">ID card templates for every team</h2>
                <p className="idm-sub">
                  Pick a category, open a layout, replace the details. Hover any
                  card to preview its back side.
                </p>
              </div>
              <button
                type="button"
                className="idm-link"
                onClick={() => setCategory("All")}
              >
                All templates <Icon name="arrow" size={15} />
              </button>
            </div>

            <div className="idm-cats-wrap">
              <button
                type="button"
                className="idm-cats-arrow idm-cats-arrow--left"
                aria-label="Scroll categories left"
                onClick={() => scrollCategories(-1)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
              </button>
              <div className="idm-cats" ref={categoryScrollRef}>
                {CATEGORIES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={category === item ? "active" : ""}
                    onClick={() => setCategory(item)}
                  >
                    <Icon name={CATEGORY_ICONS[item] || "all"} size={15} />
                    {item}
                    <i>{templateCount(item)}</i>
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="idm-cats-arrow idm-cats-arrow--right"
                aria-label="Scroll categories right"
                onClick={() => scrollCategories(1)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
              </button>
            </div>

            <div className="row g-3 g-md-4">
              {category === "Blank Canvas" ? (
                <div className="col-12 col-md-6 col-lg-3">
                  <button
                    type="button"
                    className="idm-tpl idm-tpl-blank"
                    onClick={() => loadTemplate(null)}
                  >
                    <span className="idm-tpl-plus">
                      <Icon name="plus" size={26} />
                    </span>
                    <strong>Blank Canvas</strong>
                    <small>Start from an empty card</small>
                  </button>
                </div>
              ) : (
                filtered.map((template) => (
                  <div className="col-12 col-md-6 col-lg-3" key={template.id}>
                    <article className="idm-tpl">
                      <div className="idm-tpl-thumb">
                        <div className="idm-face idm-face-front">
                          <MiniCard template={template} face="front" width={getTemplatePreviewWidth(template)} />
                        </div>
                        <div className="idm-face idm-face-back">
                          <MiniCard template={template} face="back" width={getTemplatePreviewWidth(template)} />
                        </div>
                      </div>
                      <strong>{template.name}</strong>
                      <small>{template.blurb}</small>
                      <div className="idm-tpl-meta">
                        <span className="idm-tag">
                          <Icon
                            name={CATEGORY_ICONS[template.category] || "all"}
                            size={11}
                          />
                          {template.category}
                        </span>
                        <span className="idm-tag idm-tag-quiet">{template.size}</span>
                      </div>
                      <button
                        type="button"
                        className="idm-tpl-cta"
                        onClick={() => loadTemplate(template)}
                      >
                        Use template <Icon name="arrow" size={14} />
                      </button>
                    </article>
                  </div>
                ))
              )}
            </div>

            <div className="idm-disclaimer">
              <Icon name="warning" size={18} />
              <p>
                <strong>Design responsibly.</strong> This tool is for
                organisational, school and event ID cards only. Do not create
                government ID lookalikes such as Aadhaar, PAN, Voter ID, driving
                licence or passport.
              </p>
            </div>
          </div>
        </section>

        {/* ========================= TOOLS / FEATURES ========================= */}
        <section className="idm-section idm-section-soft">
          <div className="container">
            <span className="idm-kicker">EDITOR TOOLS</span>
            <div className="idm-section-head">
              <div>
                <h2 className="idm-h2">Everything you need to finish the card</h2>
                <p className="idm-sub">
                  Built for people who are not designers. No software to install.
                </p>
              </div>
            </div>
            <div className="row g-3 g-md-4">
              {[
                {
                  icon: "flip",
                  title: "Front & back editor",
                  text: "Flip sides with one tap and export both in a single ZIP.",
                },
                {
                  icon: "cursor",
                  title: "Drag, resize, rotate",
                  text: "Move anything freely, snap to straight angles, undo with Ctrl+Z.",
                },
                {
                  icon: "brand",
                  title: "Your brand colours",
                  text: "Change card background, text colour and accent shapes instantly.",
                },
                {
                  icon: "qr",
                  title: "QR & barcode blocks",
                  text: "Add scan-at-gate placeholders and library or member codes.",
                },
                {
                  icon: "download",
                  title: "4K print export",
                  text: "3840px PNG per side, sharp enough for PVC card printing.",
                },
                {
                  icon: "mobile",
                  title: "Works on mobile",
                  text: "Pinch to zoom and edit from a bottom sheet on your phone.",
                },
                {
                  icon: "uploads",
                  title: "Photo upload",
                  text: "Drop a student or staff photo straight into the frame.",
                },
                {
                  icon: "layers",
                  title: "CR80 & badge sizes",
                  text: "Landscape, portrait, lanyard badge or any custom size.",
                },
              ].map((tool) => (
                <div className="col-12 col-lg-3" key={tool.title}>
                  <div className="idm-tool">
                    <span className="idm-tool-icon">
                      <Icon name={tool.icon} size={18} />
                    </span>
                    <strong>{tool.title}</strong>
                    <p>{tool.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================= WHY FREE TABLE ========================= */}
        <section className="idm-section">
          <div className="container">
            <div className="text-center">
              <span className="idm-kicker">WHY RESUMESATHI</span>
              <h2 className="idm-h2 idm-h2-center">Free means free. No catch.</h2>
              <p className="idm-sub idm-sub-center">
                Most ID card makers let you design for free and then ask for money
                at download. We don&apos;t do that &mdash; every template and every
                download stays free.
              </p>
            </div>
            <div className="idm-compare">
              {[
                ["Price", "Always free, forever", "Free trial, then paid plans"],
                ["Account / Signup", "Not required", "Signup usually required"],
                ["PNG Download", "Unlimited, no watermark", "Often locked or watermarked"],
                ["Your Photos", "Stay only in your browser", "Uploaded to their server"],
                ["Back Side Design", "Included in every template", "Front only or premium"],
                ["Hidden Charges", "None, ever", "Common at checkout or export"],
              ].map(([label, us, them]) => (
                <div className="idm-compare-row" key={label}>
                  <span className="idm-compare-label">{label}</span>
                  <span className="idm-compare-us">
                    <Icon name="check" size={14} />
                    <span>
                      <b>RESUMESATHI</b>
                      {us}
                    </span>
                  </span>
                  <span className="idm-compare-them">
                    <span>
                      <b>MOST OTHERS</b>
                      {them}
                    </span>
                  </span>
                </div>
              ))}
            </div>
            <div className="text-center">
              <button
                type="button"
                className="btn idm-btn idm-btn-primary"
                onClick={goTemplates}
              >
                Build My ID Card <Icon name="arrow" size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* ========================= HOW IT WORKS ========================= */}
        <section className="idm-section idm-section-soft">
          <div className="container">
            <span className="idm-kicker">HOW IT WORKS</span>
            <div className="idm-section-head">
              <div>
                <h2 className="idm-h2">From template to printed card in four steps</h2>
                <p className="idm-sub">About five minutes, start to finish.</p>
              </div>
            </div>
            <div className="row g-3 g-md-4">
              {[
                {
                  title: "Pick a template",
                  text: "Choose a category and open a layout that already has both sides designed.",
                },
                {
                  title: "Replace the details",
                  text: "Click any text to edit it, then upload a photo into the existing frame.",
                },
                {
                  title: "Match your brand",
                  text: "Set the card background, tweak colours and add your logo as an upload.",
                },
                {
                  title: "Download & print",
                  text: "Export front and back at 4K and send the ZIP to your card printer.",
                },
              ].map((step, index) => (
                <div className="col-12 col-md-6 col-lg-3" key={step.title}>
                  <div className="idm-step">
                    <span className="idm-step-no">{index + 1}</span>
                    <strong>{step.title}</strong>
                    <p>{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================= USE CASES ========================= */}
        <section className="idm-section">
          <div className="container">
            <span className="idm-kicker">USE CASES</span>
            <div className="idm-section-head">
              <div>
                <h2 className="idm-h2">Who makes ID cards here</h2>
                <p className="idm-sub">
                  Same editor, a different starting layout for each team.
                </p>
              </div>
            </div>
            <div className="row g-3">
              {[
                ["School", "Student cards with class, roll number, bus route and blood group."],
                ["College", "Enrolment number, library code and hostel block on one card."],
                ["Employee", "Staff IDs with department, access level and scan barcode."],
                ["Visitor", "Day passes with host, time-in and escort rules on the back."],
                ["Event", "Speaker and attendee badges sized for lanyards."],
                ["Medical", "Clinician cards and patient emergency information cards."],
                ["Press", "Accreditation passes with zone access printed on the reverse."],
                ["Gym", "Member cards with plan validity and scan-in barcode."],
                ["Volunteer", "Field badges with shift, team and coordinator contact."],
              ].map(([name, text]) => (
                <div className="col-12 col-md-6 col-lg-4" key={name}>
                  <button
                    type="button"
                    className="idm-usecase"
                    onClick={() => {
                      setCategory(name);
                      goTemplates();
                    }}
                  >
                    <span className="idm-usecase-icon">
                      <Icon name={CATEGORY_ICONS[name]} size={18} />
                    </span>
                    <span>
                      <strong>{name} ID cards</strong>
                      <small>{text}</small>
                    </span>
                    <Icon name="arrow" size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================= FAQ ========================= */}
        <section className="idm-section idm-section-soft idm-faq-section">
          <div className="container">
            <div className="row g-4 g-lg-5">
              <div className="col-lg-4">
                <span className="idm-kicker">FAQ</span>
                <h2 className="idm-h2">Frequently asked questions</h2>
                <p className="idm-sub">
                  Have more questions? Contact us &mdash; we are here to help.
                </p>
                <a className="btn idm-btn idm-btn-primary idm-btn-sm" href="/contact/">
                  Contact us <Icon name="arrow" size={15} />
                </a>
              </div>
              <div className="col-lg-8">
                <div className="idm-faq">
                  {[
                    [
                      "Is the ID card maker completely free?",
                      "Yes. You can design and download both sides at 4K without an account and without a watermark. There is no paid tier and no export charge.",
                    ],
                    [
                      "What size are the ID cards?",
                      "CR80 is the standard plastic card size and is available in landscape and portrait. Event Badge is a taller lanyard size, and you can set any custom width and height in millimetres of pixels.",
                    ],
                    [
                      "Can I print these on PVC cards?",
                      "Yes. Each side exports as a 3840px PNG, which is enough resolution for most card printers. Send both files to your printer and ask for CR80 stock.",
                    ],
                    [
                      "Does my photo get uploaded anywhere?",
                      "No. The editor runs entirely in your browser and the photo never leaves your device.",
                    ],
                    [
                      "Can I design the back side of the card?",
                      "Yes. Every template ships with a designed back side containing terms, emergency contact, QR and barcode blocks. You can edit it exactly like the front.",
                    ],
                    [
                      "Can I make a government ID card?",
                      "No. This tool is only for organisational cards such as school, employee, visitor, event, gym and volunteer IDs. Creating government ID lookalikes is not allowed.",
                    ],
                  ].map(([question, answer]) => (
                    <details key={question}>
                      <summary>
                        <span>{question}</span>
                        <i aria-hidden="true" />
                      </summary>
                      <p>{answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================= FINAL CTA ========================= */}
        <section className="idm-cta">
          <div className="idm-cta-bg-text" aria-hidden="true">FREE</div>
          <div className="container text-center">
            <div className="idm-cta-content">
              <span className="idm-cta-pill">No signup required &middot; Always free</span>
              <h2>
                Make your ID card today.
                <br />
                It&apos;s 100% free.
              </h2>
              <p>
                Join the teams who design school, office and event ID cards on
                ResumeSathi. No account, no fee, no compromise on quality.
              </p>
              <div className="idm-cta-actions">
                <button
                  type="button"
                  className="btn idm-btn idm-btn-light"
                  onClick={goTemplates}
                >
                  Choose a Template <Icon name="arrow" size={16} />
                </button>
                <button
                  type="button"
                  className="btn idm-btn idm-btn-ghost-light"
                  onClick={() => loadTemplate(null)}
                >
                  <Icon name="plus" size={16} /> Start Blank
                </button>
              </div>
              <span className="idm-cta-foot"> 
                <Icon name="shield" size={13} /> No data leaves your device &middot;
                100% local &middot; Print-ready output
              </span>
            </div>
          </div>
        </section>
        </main>
        <Footer />
        <FooterNav />
      </>
    );
  }

  return (
    <main className="id-maker-app rk-root">
      <header className="id-maker-toolbar">
        <button
          className="brand-back"
          onClick={() => {
            if (window.confirm("Your ID card changes may be lost. Do you want to leave?")) {
              setShowEditor(false);
            }
          }}
        >
          ID Card Maker
        </button>
        <div className="toolbar-actions">
          <button aria-label="Undo" title="Undo" onClick={undo} disabled={!history.length}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7 4 12l5 5M4 12h9a7 7 0 0 1 7 7" /></svg>
          </button>
          <button aria-label="Redo" title="Redo" onClick={redo} disabled={!future.length}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 7 5 5-5 5M20 12h-9a7 7 0 0 0-7 7" /></svg>
          </button>
          <button className="export-action" aria-label="Download front and back 4K ZIP" title="Download front and back 4K ZIP" onClick={exportCard}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 20h14" /></svg>
          </button>
        </div>
      </header>
      <div className="id-editor-layout">
        <aside className="id-panel id-left-panel">
          <div className="id-maker-rail">
            {railItems.map((item) => (
              <button
                key={item.id}
                className={activePanel === item.id ? "active" : ""}
                onClick={() => openPanel(item.id)}
                type="button"
              >
                <span>
                  <Icon name={item.icon} size={21} />
                </span>
                <small>{item.label}</small>
              </button>
            ))}
          </div>
          <div
            className={`id-maker-context${activePanel === "none" ? " context-rail-only" : ""}`}
          >
            {renderContextPanel()}
          </div>
        </aside>
        <div
          className={`mobile-sheet-overlay ${mobileSheetOpen ? "open" : ""}`}
          onClick={() => setMobileSheetOpen(false)}
        >
          <div
            className="mobile-sheet"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mobile-sheet-header">
              <span>{currentPanelLabel}</span>
              <button type="button" onClick={() => setMobileSheetOpen(false)}>
                ×
              </button>
            </div>
            <div className="mobile-sheet-body">{renderContextPanel()}</div>
          </div>
        </div>
        <footer className="mob-footer-nav id-card-footer-nav">
          <div className="footer-main-div">
            <div className="footer-all-tab">
              {railItems.map((item) => (
                <button
                  key={item.id}
                  className={`footer-each-tab ${activePanel === item.id ? "active" : ""}`}
                  type="button"
                  onClick={() => openPanel(item.id)}
                >
                  <span>
                    <Icon name={item.icon} size={22} />
                  </span>
                  <p>{item.label}</p>
                </button>
              ))}
            </div>
          </div>
        </footer>
        <section className="id-canvas-area">
          <div className="card-side-controls" aria-label="Card side">
            <button
              className="card-side-toggle"
              type="button"
              aria-label={`Showing ${side}. Switch to ${side === "front" ? "back" : "front"}`}
              title={`Showing ${side}. Click to switch`}
              onClick={() => switchSide(side === "front" ? "back" : "front")}
            >
              <svg viewBox="0 0 32 24" aria-hidden="true">
                <rect x="2" y="5" width="21" height="15" rx="3" />
                <rect x="9" y="2" width="21" height="15" rx="3" />
                <path d="M14 9h10M14 13h6" />
              </svg>
              <span>{side === "front" ? "Front" : "Back"}</span>
            </button>
          </div>
          <div className="card-stage-wrap" ref={canvasAreaRef}>
            <div
              className={`card-stage-viewport${sideFlipping ? " side-flipping" : ""}`}
              onWheel={handleStageWheel}
              style={{
                width: cardSize.width * stageScale,
                height: cardSize.height * stageScale,
                transform: `translate(${pan.x}px, ${pan.y}px)`,
              }}
            >
              <div
                ref={stageRef}
                className={`card-stage ${guides ? "show-guides" : ""}`}
                onTouchStart={handleStageTouchStart}
                onTouchMove={handleStageTouchMove}
                onTouchEnd={handleStageTouchEnd}
                onTouchCancel={handleStageTouchEnd}
                style={{
                  width: cardSize.width,
                  height: cardSize.height,
                  transform: `scale(${stageScale})`,
                  transformOrigin: "top left",
                  background: cardBg[side] || "#ffffff",
                }}
                onPointerDown={() => {
                  setSelectedId(null);
                  setActivePanel("none");
                  setMobileSheetOpen(false);
                }}
              >
                {elements
                  .filter((item) => !item.hidden)
                  .map((item) => (
                    <CardElement
                      key={item.id}
                      item={item}
                      selected={selectedId === item.id}
                      onPointerDown={onPointerDown}
                      onResizeStart={onResizeStart}
                      onRotateStart={onRotateStart}
                      rotationGuide={rotationGuide}
                      onSelect={selectElement}
                    />
                  ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function CardElement({
  item,
  selected,
  onPointerDown,
  onResizeStart,
  onRotateStart,
  rotationGuide,
  onSelect,
}) {
  const style = {
    left: item.x,
    top: item.y,
    width: item.width,
    height: item.height,
    transform: `rotate(${item.rotation}deg)`,
    opacity: item.opacity,
    color: item.color,
    background:
      item.type === "shape" && item.fillMode !== "stroke" ? item.bg : undefined,
    border:
      item.type === "shape" && item.fillMode === "stroke"
        ? `${item.borderWidth || 2}px solid ${item.borderColor || "#b42318"}`
        : undefined,
    borderRadius:
      item.shape === "circle"
        ? "50%"
        : item.shape === "pill"
          ? "999px"
          : item.type === "shape"
            ? `${item.radius ?? 6}px`
            : undefined,
    clipPath:
      item.shape === "triangle"
        ? "polygon(50% 0, 100% 100%, 0 100%)"
        : item.shape === "star"
          ? "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)"
          : undefined,
    fontSize: item.fontSize,
    fontWeight: item.bold ? 800 : 500,
  };
  const content =
    item.type === "photo" ? (
      item.src ? (
        <img
          src={item.src}
          alt="Uploaded card photo"
          draggable="false"
          onDragStart={(event) => event.preventDefault()}
        />
      ) : (
        <span className="photo-placeholder">Photo</span>
      )
    ) : item.type === "qr" ? (
      <span className="qr-placeholder">QR</span>
    ) : item.type === "barcode" ? (
      <span className="barcode-placeholder">||||||||||||</span>
    ) : item.type === "shape" ? (
      item.text
    ) : (
      item.text?.split("\n").map((line, index) => (
        <span key={index}>
          {line}
          {index < item.text.split("\n").length - 1 && <br />}
        </span>
      ))
    );
  return (
    <div
      className={`card-element element-${item.type}${selected ? " selected" : ""}${item.locked ? " locked" : ""}`}
      style={style}
      onPointerDown={(event) => onPointerDown(event, item)}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(item.id);
      }}
    >
      <div className="element-content">{content}</div>
      {selected && rotationGuide?.id === item.id && (
        <span
          className="rotation-guide-line"
          title={`${rotationGuide.angle} degrees`}
          aria-hidden="true"
        />
      )}
      {selected && !item.locked && (
        <>
          <span
            className="rotate-handle"
            title="Rotate"
            aria-label="Rotate element"
            onPointerDown={(event) => onRotateStart(event, item)}
          >
            ↻
          </span>
          <span
            className="resize-handle resize-nw"
            onPointerDown={(event) => onResizeStart(event, item, "nw")}
          />
          <span
            className="resize-handle resize-ne"
            onPointerDown={(event) => onResizeStart(event, item, "ne")}
          />
          <span
            className="resize-handle resize-sw"
            onPointerDown={(event) => onResizeStart(event, item, "sw")}
          />
          <span
            className="resize-handle resize-se"
            onPointerDown={(event) => onResizeStart(event, item, "se")}
          />
        </>
      )}
    </div>
  );
}

function Properties({
  item,
  update,
  remove,
  duplicate,
  layer,
  uploadPhoto,
  fileRef,
}) {
  return (
    <div className="properties-form">
      {(item.type === "text" || item.type === "shape") && (
        <label>
          {item.type === "text" ? "Text / label" : "Label"}
          <textarea
            value={item.text || ""}
            onChange={(event) => update({ text: event.target.value })}
          />
        </label>
      )}
      {item.type === "photo" && (
        <>
          <button
            className="property-button"
            onClick={() => fileRef.current?.click()}
          >
            {item.src ? "Replace photo" : "Upload photo"}
          </button>
          <input
            ref={fileRef}
            hidden
            type="file"
            accept="image/*"
            onChange={uploadPhoto}
          />
        </>
      )}
      {item.type === "shape" ? (
        <>
          <label>
            Shape fill
            <select
              value={item.fillMode || "solid"}
              onChange={(event) => update({ fillMode: event.target.value })}
            >
              <option value="solid">Solid</option>
              <option value="stroke">Stroke</option>
            </select>
          </label>
          <label>
            {item.fillMode === "stroke" ? "Stroke color" : "Fill color"}
            <input
              type="color"
              value={
                item.fillMode === "stroke"
                  ? item.borderColor || "#b42318"
                  : item.bg || "#fecaca"
              }
              onChange={(event) =>
                update(
                  item.fillMode === "stroke"
                    ? { borderColor: event.target.value }
                    : { bg: event.target.value },
                )
              }
            />
          </label>
          <label>
            Thickness
            <input
              type="number"
              min="1"
              max="20"
              value={item.borderWidth || 2}
              onChange={(event) =>
                update({ borderWidth: Number(event.target.value) })
              }
            />
          </label>
          <label>
            Corner radius
            <input
              type="range"
              min="0"
              max="60"
              value={item.radius ?? 6}
              onChange={(event) =>
                update({ radius: Number(event.target.value) })
              }
            />
          </label>
        </>
      ) : (
        item.type !== "photo" && (
          <>
            <label>
              Text color
              <input
                type="color"
                value={item.color || "#111827"}
                onChange={(event) => update({ color: event.target.value })}
              />
            </label>
            <label>
              Font size
              <input
                type="number"
                min="8"
                max="72"
                value={item.fontSize || 16}
                onChange={(event) =>
                  update({ fontSize: Number(event.target.value) })
                }
              />
            </label>
          </>
        )
      )}
      <label>
        Opacity
        <input
          type="range"
          min="0.2"
          max="1"
          step="0.1"
          value={item.opacity}
          onChange={(event) => update({ opacity: Number(event.target.value) })}
        />
      </label>
      <div className="property-action-dock">
        <div className="property-toggles">
          <button
            className={item.locked ? "active" : ""}
            aria-label={item.locked ? "Unlock element" : "Lock element"}
            title={item.locked ? "Unlock" : "Lock"}
            onClick={() => update({ locked: !item.locked })}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d={item.locked ? "M7 10V7a5 5 0 0 1 10 0v3M5 10h14v10H5z" : "M7 10V7a5 5 0 0 1 9.5-2.5M5 10h14v10H5z"} /></svg>
          </button>
          <button
            className={item.hidden ? "active" : ""}
            aria-label={item.hidden ? "Show element" : "Hide element"}
            title={item.hidden ? "Show" : "Hide"}
            onClick={() => update({ hidden: !item.hidden })}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d={item.hidden ? "M3 3l18 18M10.6 5.2A10.8 10.8 0 0 1 12 5c5 0 8.5 5 8.5 5a15 15 0 0 1-3 3.3M6.2 6.3C4.5 7.5 3.5 10 3.5 10s3.5 5 8.5 5c.9 0 1.7-.1 2.4-.4" : "M2.5 12s3.5-5 9.5-5 9.5 5 9.5 5-3.5 5-9.5 5-9.5-5-9.5-5zM12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"} /></svg>
          </button>
        </div>
        <div className="property-actions">
          <button aria-label="Duplicate" title="Duplicate" onClick={duplicate}><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="11" height="11" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg></button>
          <button aria-label="Send backward" title="Send backward" onClick={() => layer("back")}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8h12M8 12h8M10 16h4M12 3v17M8 16l4 4 4-4" /></svg></button>
          <button aria-label="Bring forward" title="Bring forward" onClick={() => layer("forward")}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 16h12M8 12h8M10 8h4M12 21V4M8 8l4-4 4 4" /></svg></button>
          <button className="danger-button" aria-label="Delete" title="Delete" onClick={remove}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" /></svg></button>
        </div>
      </div>
    </div>
  );
}

function MiniCard({ template, face = "front", width = 196, fluid = false }) {
  const cardRef = useRef(null);
  const [fluidWidth, setFluidWidth] = useState(() => {
    if (!fluid || typeof window === "undefined") return width;
    const viewportWidth = window.innerWidth;
    if (viewportWidth < 992) return Math.max(width, viewportWidth - 48);
    return Math.max(width, Math.min(554, (viewportWidth - 120) / 2 - 36));
  });
  const size = SIZES[template.size] || SIZES["CR80 Landscape"];
  useLayoutEffect(() => {
    if (!fluid || !cardRef.current) return undefined;
    const parent = cardRef.current.closest(".idm-hero-art");
    if (!parent) return undefined;
    const updateWidth = () => {
      const nextWidth = Math.max(1, parent.clientWidth);
      const nextScale = nextWidth / size.width;
      const stage = cardRef.current.querySelector(".rk-mini-stage");
      cardRef.current.style.width = `${nextWidth}px`;
      cardRef.current.style.height = `${size.height * nextScale}px`;
      if (stage) {
        stage.style.width = `${size.width * nextScale}px`;
        stage.style.height = `${size.height * nextScale}px`;
      }
      setFluidWidth(nextWidth);
    };
    const observer = new ResizeObserver(updateWidth);
    observer.observe(parent);
    updateWidth();
    return () => observer.disconnect();
  }, [fluid, width]);
  const renderWidth = fluid ? fluidWidth : width;
  const scale = renderWidth / size.width;
  const list = face === "front" ? template.elements : template.back || [];
  const background =
    face === "front"
      ? template.frontBg || "#ffffff"
      : template.backBg || template.frontBg || "#ffffff";

  return (
    <div
      ref={cardRef}
      className="rk-mini"
      style={{ width: renderWidth, height: size.height * scale }}
      aria-hidden="true"
    >
      <div
        className="rk-mini-stage"
        style={{
          width: size.width * scale,
          height: size.height * scale,
          background,
        }}
      >
        {list.map((item) => {
          const style = {
            left: item.x * scale,
            top: item.y * scale,
            width: item.width * scale,
            height: item.height * scale,
            transform: `rotate(${item.rotation || 0}deg)`,
            opacity: item.opacity ?? 1,
            color: item.color,
            fontSize: (item.fontSize || 16) * scale,
            fontWeight: item.bold ? 800 : 500,
            borderWidth: item.borderWidth ? item.borderWidth * scale : undefined,
            background:
              item.type === "shape" && item.fillMode !== "stroke"
                ? item.bg
                : undefined,
            borderRadius:
              item.shape === "circle"
                ? "50%"
                : item.shape === "pill"
                  ? "999px"
                  : item.type === "shape"
                    ? `${(item.radius ?? 6) * scale}px`
                    : item.type === "photo"
                      ? `${item.radius === 50 ? 50 : 6 * scale}px`
                      : undefined,
            clipPath:
              item.shape === "triangle"
                ? "polygon(50% 0, 100% 100%, 0 100%)"
                : undefined,
          };

          if (item.type === "photo") {
            return (
              <div key={item.id} className="rk-mini-el rk-mini-photo" style={style}>
                <svg viewBox="0 0 24 24" width="38%" height="38%" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <circle cx="12" cy="9" r="3.6" />
                  <path d="M4.5 20c0-3.6 3.3-6 7.5-6s7.5 2.4 7.5 6" />
                </svg>
              </div>
            );
          }
          if (item.type === "qr") {
            return (
              <div key={item.id} className="rk-mini-el rk-mini-qr" style={style} />
            );
          }
          if (item.type === "barcode") {
            return (
              <div key={item.id} className="rk-mini-el rk-mini-barcode" style={style} />
            );
          }
          return (
            <div key={item.id} className="rk-mini-el rk-mini-text" style={style}>
              {item.type === "text"
                ? String(item.text || "")
                    .split("\n")
                    .map((line, index) => <span key={index}>{line}</span>)
                : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
