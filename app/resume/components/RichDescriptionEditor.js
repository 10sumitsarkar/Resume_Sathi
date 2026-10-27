"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { normalizeDescriptionHtml, sanitizeDescriptionHtml } from "./richTextUtils";

function htmlToPlainText(html = "") {
  if (typeof document === "undefined") return String(html || "");
  const el = document.createElement("div");
  el.innerHTML = html;
  return el.innerText || "";
}

function normalizeEditorHtml(html = "") {
  return normalizeDescriptionHtml(html)
    .replace(/<div><br><\/div>/gi, "<br>")
    .replace(/<div>/gi, "<p>")
    .replace(/<\/div>/gi, "</p>")
    .replace(/<p><br><\/p>/gi, "<br>")
    .replace(/&nbsp;/gi, " ");
}

export default function RichDescriptionEditor({
  id,
  value = "",
  onChange,
  placeholder = "",
}) {
  const editorRef = useRef(null);
  const linkModalRef = useRef(null);
  const linkModalInstanceRef = useRef(null);
  const linkInputRef = useRef(null);
  const pendingLinkUrlRef = useRef(null);
  const lastHtmlRef = useRef("");
  const savedSelectionRef = useRef(null);
  const [isEmpty, setIsEmpty] = useState(!value);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkError, setLinkError] = useState("");
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    unorderedList: false,
    link: false,
  });

  const updateActiveFormats = useCallback(() => {
    const editor = editorRef.current;
    const selection = document.getSelection();
    const selectedNode = selection?.anchorNode;
    if (!editor || !selectedNode || !editor.contains(selectedNode)) {
      setActiveFormats({ bold: false, italic: false, unorderedList: false, link: false });
      return;
    }

    let node = selectedNode.nodeType === Node.ELEMENT_NODE
      ? selectedNode
      : selectedNode.parentElement;
    let isLinkActive = false;
    while (node && node !== editor) {
      if (node.nodeName === "A") {
        isLinkActive = true;
        break;
      }
      node = node.parentElement;
    }

    setActiveFormats({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      unorderedList: document.queryCommandState("insertUnorderedList"),
      link: isLinkActive,
    });
  }, []);

  useEffect(() => {
    document.addEventListener("selectionchange", updateActiveFormats);
    return () => document.removeEventListener("selectionchange", updateActiveFormats);
  }, [updateActiveFormats]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const normalizedValue = sanitizeDescriptionHtml(normalizeEditorHtml(value));
    if (normalizedValue !== lastHtmlRef.current && (editor.innerHTML || "") !== normalizedValue) {
      editor.innerHTML = normalizedValue;
      lastHtmlRef.current = normalizedValue;
      setIsEmpty(!htmlToPlainText(value).trim());
    }
  }, [value]);

  const syncValue = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const html = sanitizeDescriptionHtml(normalizeEditorHtml(editor.innerHTML));
    setIsEmpty(!editor.innerText.trim());
    lastHtmlRef.current = html;
    onChange?.(html === "<br>" ? "" : html);
    updateActiveFormats();
  }, [onChange, updateActiveFormats]);

  const commitLink = useCallback((url) => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.focus();
    const range = savedSelectionRef.current;
    if (range && editor.contains(range.commonAncestorContainer)) {
      const selection = document.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
    document.execCommand("createLink", false, url);
    syncValue();
    updateActiveFormats();
  }, [syncValue, updateActiveFormats]);

  useEffect(() => {
    const modalElement = linkModalRef.current;
    const handleModalHidden = () => {
      const pendingUrl = pendingLinkUrlRef.current;
      pendingLinkUrlRef.current = null;
      if (pendingUrl) commitLink(pendingUrl);
      setLinkError("");
      savedSelectionRef.current = null;
    };
    const handleModalShown = () => linkInputRef.current?.focus();

    if (!modalElement) return;
    modalElement.addEventListener("hidden.bs.modal", handleModalHidden);
    modalElement.addEventListener("shown.bs.modal", handleModalShown);

    return () => {
      modalElement.removeEventListener("hidden.bs.modal", handleModalHidden);
      modalElement.removeEventListener("shown.bs.modal", handleModalShown);
    };
  }, [commitLink]);

  const runCommand = (command) => {
    editorRef.current?.focus();
    document.execCommand(command, false, null);
    syncValue();
    updateActiveFormats();
  };

  const openLinkDialog = () => {
    const editor = editorRef.current;
    if (!editor) return;

    const currentSelection = document.getSelection();
    const range = savedSelectionRef.current ||
      (currentSelection?.rangeCount ? currentSelection.getRangeAt(0).cloneRange() : null);
    savedSelectionRef.current = range && editor.contains(range.commonAncestorContainer) ? range : null;

    let existingLink = range?.startContainer;
    if (existingLink?.nodeType === Node.TEXT_NODE) existingLink = existingLink.parentElement;
    while (existingLink && existingLink !== editor && existingLink.nodeName !== "A") {
      existingLink = existingLink.parentElement;
    }

    setLinkUrl(existingLink?.nodeName === "A" ? existingLink.getAttribute("href") || "" : "");
    setLinkError("");
    if (!window.bootstrap?.Modal) {
      throw new Error("Bootstrap modal is not available.");
    }

    linkModalInstanceRef.current =
      window.bootstrap.Modal.getInstance(linkModalRef.current) ||
      new window.bootstrap.Modal(linkModalRef.current, { backdrop: "static" });
    linkModalInstanceRef.current.show();
  };

  const closeLinkDialog = () => {
    if (linkModalInstanceRef.current) {
      linkModalInstanceRef.current.hide();
    }
  };

  const applyLink = () => {
    if (!editorRef.current) return;

    const url = linkUrl.trim();
    const safeUrl = /^(https?:\/\/|mailto:|tel:)/i.test(url)
      ? url
      : /^[a-z][a-z0-9+.-]*:/i.test(url)
        ? ""
        : `https://${url}`;
    let isValidUrl = /^(mailto:|tel:)[^\s]+$/i.test(safeUrl);
    if (/^https?:\/\//i.test(safeUrl)) {
      try {
        isValidUrl = Boolean(new URL(safeUrl).hostname);
      } catch {
        isValidUrl = false;
      }
    }
    if (!isValidUrl) {
      setLinkError("Enter a valid web, email, or phone link.");
      return;
    }

    pendingLinkUrlRef.current = safeUrl;
    closeLinkDialog();
  };

  const preserveEditorSelection = (event) => {
    event.preventDefault();
    const selection = document.getSelection();
    const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
    savedSelectionRef.current =
      range && editorRef.current?.contains(range.commonAncestorContainer)
        ? range.cloneRange()
        : null;
  };

  return (
    <div className="rs-rich-editor-shell">
      <div className="rs-rich-editor">
        <div className="rs-rich-toolbar" aria-label="Description formatting toolbar">
          <button
            type="button"
            title="Bold"
            aria-label="Bold"
            aria-pressed={activeFormats.bold}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => runCommand("bold")}
            className="rs-rich-btn rs-rich-btn-bold"
          >
            B
          </button>
          <button
            type="button"
            title="Italic"
            aria-label="Italic"
            aria-pressed={activeFormats.italic}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => runCommand("italic")}
            className="rs-rich-btn rs-rich-btn-italic"
          >
            I
          </button>
          <span className="rs-rich-divider" aria-hidden="true" />
          <button
            type="button"
            title="Bullet list"
            aria-label="Bullet list"
            aria-pressed={activeFormats.unorderedList}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => runCommand("insertUnorderedList")}
            className="rs-rich-btn rs-rich-btn-bullets"
          >
            <svg className="rs-rich-bullet-icon" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M1.5 3.5h1v1h-1zM4.5 3.5h10v1h-10zM1.5 7.5h1v1h-1zM4.5 7.5h10v1h-10zM1.5 11.5h1v1h-1zM4.5 11.5h10v1h-10z" />
            </svg>
            <span>Bullet</span>
          </button>
          <span className="rs-rich-divider" aria-hidden="true" />
          <button
            type="button"
            title="Add link"
            aria-label="Add link"
            aria-pressed={activeFormats.link}
            onMouseDown={preserveEditorSelection}
            onClick={openLinkDialog}
            className="rs-rich-btn rs-rich-link-btn"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M10.6 13.4a1 1 0 0 1 0-1.4l3.4-3.4a3 3 0 0 1 4.2 4.2l-2 2a1 1 0 1 1-1.4-1.4l2-2a1 1 0 0 0-1.4-1.4L12 13.4a1 1 0 0 1-1.4 0Z" />
              <path d="M13.4 10.6a1 1 0 0 1 0 1.4L10 15.4a3 3 0 0 1-4.2-4.2l2-2a1 1 0 1 1 1.4 1.4l-2 2a1 1 0 1 0 1.4 1.4l3.4-3.4a1 1 0 0 1 1.4 0Z" />
            </svg>
            <span>Link</span>
          </button>
        </div>
        <div className="rs-rich-editor-wrap">
          {isEmpty && <span className="rs-rich-placeholder">{placeholder}</span>}
          <div
            ref={editorRef}
            id={id}
            className="rs-rich-content"
            contentEditable
            role="textbox"
            aria-multiline="true"
            suppressContentEditableWarning
            onInput={syncValue}
            onKeyUp={updateActiveFormats}
            onMouseUp={updateActiveFormats}
            onFocus={updateActiveFormats}
            onBlur={() => {
              syncValue();
              setActiveFormats({ bold: false, italic: false, unorderedList: false, link: false });
            }}
            onPaste={(event) => {
              event.preventDefault();
              document.execCommand("insertText", false, event.clipboardData.getData("text/plain"));
              syncValue();
            }}
          />
        </div>
      </div>
      <div
        ref={linkModalRef}
        className="modal fade completedModal rs-link-modal"
        tabIndex="-1"
        aria-labelledby={`${id || "description"}-link-dialog-title`}
        aria-hidden="true"
        data-bs-backdrop="static"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body py-4">
              <h5 className="heading text-center" id={`${id || "description"}-link-dialog-title`}>
                Add link
              </h5>
              <label className="form-label" htmlFor={`${id || "description"}-link-url`}>
                Link URL
              </label>
              <input
                ref={linkInputRef}
                id={`${id || "description"}-link-url`}
                type="text"
                inputMode="url"
                className="form-control"
                value={linkUrl}
                onChange={(event) => {
                  setLinkUrl(event.target.value);
                  setLinkError("");
                }}
                placeholder="https://example.com"
                aria-describedby={linkError ? `${id || "description"}-link-error` : undefined}
                aria-invalid={Boolean(linkError)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    applyLink();
                  }
                }}
              />
              {linkError && (
                <p className="rs-link-dialog-error text-danger small mt-2" id={`${id || "description"}-link-error`} role="alert">
                  {linkError}
                </p>
              )}
              <div className="btn-div mt-4">
                <button
                  type="button"
                  className="cancel-btn"
                  aria-label="Cancel adding link"
                  onClick={closeLinkDialog}
                >
                  Cancel
                </button>
                <button type="button" className="got-it-btn" onClick={applyLink}>
                  Apply link
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
