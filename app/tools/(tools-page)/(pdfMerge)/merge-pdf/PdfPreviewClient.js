"use client";

import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function PdfPreviewClient({ file }) {
  return (
    <Document file={file}>
      <Page
        pageNumber={1}
        width={260}
        renderTextLayer={false}
        renderAnnotationLayer={false}
      />
    </Document>
  );
}