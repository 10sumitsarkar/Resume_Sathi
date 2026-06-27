// AtsPdfPreview.jsx
"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function AtsPdfPreview({ file }) {
  const [numPages, setNumPages] = useState(null);

  return (
    <div className="ats-pdf-preview">
      <Document
        file={file}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        loading={<div className="pdf-loading">Loading preview…</div>}
        error={<div className="pdf-error">Failed to load PDF.</div>}
      >
        {Array.from({ length: numPages ?? 0 }, (_, i) => (
          <Page
            key={i + 1}
            pageNumber={i + 1}
            width={468}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            devicePixelRatio={window.devicePixelRatio || 2}
          />
        ))}
      </Document>
    </div>
  );
}