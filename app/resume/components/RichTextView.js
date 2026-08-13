"use client";

import React from "react";

function sanitizeHtml(html = "") {
  return String(html || "")
    .replace(/<div><br><\/div>/gi, "<br>")
    .replace(/<div>/gi, "<p>")
    .replace(/<\/div>/gi, "</p>")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/<(?!\/?(b|strong|i|em|u|s|ol|ul|li|p|br|a|span)\b)[^>]*>/gi, "")
    .replace(/<a\b(?![^>]*\btarget=)/gi, '<a target="_blank" rel="noopener noreferrer"');
}

export default function RichTextView({ html, className = "" }) {
  if (!html) return null;

  return (
    <div
      className={`rs-rich-view ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
    />
  );
}
