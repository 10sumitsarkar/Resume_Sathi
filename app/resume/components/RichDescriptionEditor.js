"use client";

import React, { useEffect, useRef, useState } from "react";

function htmlToPlainText(html = "") {
  if (typeof document === "undefined") return String(html || "");
  const el = document.createElement("div");
  el.innerHTML = html;
  return el.innerText || "";
}

function normalizeEditorHtml(html = "") {
  return String(html || "")
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
  const [isEmpty, setIsEmpty] = useState(!value);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const normalizedValue = normalizeEditorHtml(value);
    if (normalizedValue !== lastHtmlRef.current && (editor.innerHTML || "") !== normalizedValue) {
      editor.innerHTML = normalizedValue;
      lastHtmlRef.current = normalizedValue;
      setIsEmpty(!htmlToPlainText(value).trim());
    }
  }, [value]);

  const syncValue = () => {
    const editor = editorRef.current;
    if (!editor) return;
    const html = normalizeEditorHtml(editor.innerHTML);
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
    editorRef.current?.focus();
    const url = window.prompt("Enter link URL");
    if (!url) return;
    document.execCommand("createLink", false, url);
    syncValue();
  };

  const applyColor = (event) => {
    editorRef.current?.focus();
    document.execCommand("foreColor", false, event.target.value);
    syncValue();
  };

  const applyHighlight = (event) => {
    editorRef.current?.focus();
    document.execCommand("hiliteColor", false, event.target.value);
    syncValue();
  };

  return (
    <div className="rs-rich-editor">
      <div className="rs-rich-toolbar" aria-label="Description formatting toolbar">
        <button type="button" title="Bold" onClick={() => runCommand("bold")} className="rs-rich-btn rs-rich-btn-bold">
          B
        </button>
        <button type="button" title="Italic" onClick={() => runCommand("italic")} className="rs-rich-btn rs-rich-btn-italic">
          I
        </button>
        <button type="button" title="Underline" onClick={() => runCommand("underline")} className="rs-rich-btn rs-rich-btn-underline">
          U
        </button>
        <button type="button" title="Strikethrough" onClick={() => runCommand("strikeThrough")} className="rs-rich-btn rs-rich-btn-strikeThrough">
          S
        </button>
        <span className="rs-rich-divider" />
        <button type="button" title="Numbered list" onClick={() => runCommand("insertOrderedList")} className="rs-rich-btn rs-rich-btn-list">
          <span>1</span>
          <i />
        </button>
        <button type="button" title="Bullet list" onClick={() => runCommand("insertUnorderedList")} className="rs-rich-btn rs-rich-btn-bullets">
          <span />
          <i />
        </button>
        <span className="rs-rich-divider" />
        <button type="button" title="Add link" onClick={createLink} className="rs-rich-btn rs-rich-icon-btn">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M10.6 13.4a1 1 0 0 1 0-1.4l3.4-3.4a3 3 0 0 1 4.2 4.2l-2 2a1 1 0 1 1-1.4-1.4l2-2a1 1 0 0 0-1.4-1.4L12 13.4a1 1 0 0 1-1.4 0Z" />
            <path d="M13.4 10.6a1 1 0 0 1 0 1.4L10 15.4a3 3 0 0 1-4.2-4.2l2-2a1 1 0 1 1 1.4 1.4l-2 2a1 1 0 1 0 1.4 1.4l3.4-3.4a1 1 0 0 1 1.4 0Z" />
          </svg>
        </button>
        <span className="rs-rich-divider" />
        <label className="rs-rich-color" title="Text color">
          <span className="rs-rich-color-text">A</span>
          <input type="color" defaultValue="#4b5563" onChange={applyColor} />
        </label>
        <label className="rs-rich-color" title="Highlight color">
          <span className="rs-rich-color-fill" />
          <input type="color" defaultValue="#eef2ff" onChange={applyHighlight} />
        </label>
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
        />
      </div>
    </div>
  );
}
