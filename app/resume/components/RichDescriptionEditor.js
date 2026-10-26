"use client";

import React, { useEffect, useRef, useState } from "react";
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
  const lastHtmlRef = useRef("");
  const savedSelectionRef = useRef(null);
  const [isEmpty, setIsEmpty] = useState(!value);

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

  const syncValue = () => {
    const editor = editorRef.current;
    if (!editor) return;
    const html = sanitizeDescriptionHtml(normalizeEditorHtml(editor.innerHTML));
    setIsEmpty(!editor.innerText.trim());
    lastHtmlRef.current = html;
    onChange?.(html === "<br>" ? "" : html);
  };

  const runCommand = (command) => {
    editorRef.current?.focus();
    document.execCommand(command, false, null);
    syncValue();
  };

  const createLink = () => {
    const editor = editorRef.current;
    if (!editor) return;

    const currentSelection = document.getSelection();
    const range = savedSelectionRef.current ||
      (currentSelection?.rangeCount ? currentSelection.getRangeAt(0).cloneRange() : null);
    const input = window.prompt("Enter link URL");
    savedSelectionRef.current = null;
    if (!input) return;
    const url = input.trim();
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
      window.alert("Enter a valid web, email, or phone link.");
      return;
    }

    editor.focus();
    if (range && editor.contains(range.commonAncestorContainer)) {
      const selection = document.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
    document.execCommand("createLink", false, safeUrl);
    syncValue();
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
    <div className="rs-rich-editor">
      <div className="rs-rich-toolbar" aria-label="Description formatting toolbar">
        <button type="button" title="Bold" aria-label="Bold" onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand("bold")} className="rs-rich-btn rs-rich-btn-bold">
          B
        </button>
        <button type="button" title="Italic" aria-label="Italic" onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand("italic")} className="rs-rich-btn rs-rich-btn-italic">
          I
        </button>
        <span className="rs-rich-divider" aria-hidden="true" />
        <button type="button" title="Bullet list" aria-label="Bullet list" onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand("insertUnorderedList")} className="rs-rich-btn rs-rich-btn-bullets">
          <svg className="rs-rich-bullet-icon" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M1.5 3.5h1v1h-1zM4.5 3.5h10v1h-10zM1.5 7.5h1v1h-1zM4.5 7.5h10v1h-10zM1.5 11.5h1v1h-1zM4.5 11.5h10v1h-10z" />
          </svg>
          <span>Bullet</span>
        </button>
        <span className="rs-rich-divider" aria-hidden="true" />
        <button type="button" title="Add link" aria-label="Add link" onMouseDown={preserveEditorSelection} onClick={createLink} className="rs-rich-btn rs-rich-link-btn">
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
          onBlur={syncValue}
          onPaste={(event) => {
            event.preventDefault();
            document.execCommand("insertText", false, event.clipboardData.getData("text/plain"));
            syncValue();
          }}
        />
      </div>
    </div>
  );
}
