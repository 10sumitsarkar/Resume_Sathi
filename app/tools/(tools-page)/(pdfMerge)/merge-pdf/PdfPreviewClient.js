"use client";

import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc =
  `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PdfPreviewClient({ file }) {
  return (
    <Document
      file={file}
      loading={<div className="pdf-thumb-loading">Loading…</div>}
      error={<div className="pdf-thumb-error">Preview failed</div>}
      onLoadError={(err) => console.error("PdfPreviewClient load error:", err)}
    >
      <Page
        pageNumber={1}
        width={260}
        renderTextLayer={false}
        renderAnnotationLayer={false}
      />
    </Document>
  );
}