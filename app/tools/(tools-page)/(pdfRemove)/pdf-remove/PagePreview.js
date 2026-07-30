"use client";

import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PagePreview({ file, pageNumber }) {
  return (
    <Document
      file={file}
      loading={<div className="pdf-thumb-loading">Loading...</div>}
      error={<div className="pdf-thumb-error">Preview failed</div>}
      onLoadError={(error) => console.error("PagePreview load error:", error)}
    >
      <Page
        pageNumber={pageNumber}
        width={260}
        renderTextLayer={false}
        renderAnnotationLayer={false}
      />
    </Document>
  );
}
