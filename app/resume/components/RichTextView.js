"use client";

import React from "react";
import { normalizeDescriptionHtml, sanitizeDescriptionHtml } from "./richTextUtils";

export default function RichTextView({ html, className = "", plainTextAsBullets = false }) {
  if (!html) return null;

  return (
    <div
      className={`rs-rich-view ${className}`.trim()}
      dangerouslySetInnerHTML={{
        __html: sanitizeDescriptionHtml(normalizeDescriptionHtml(html, plainTextAsBullets)),
      }}
    />
  );
}
