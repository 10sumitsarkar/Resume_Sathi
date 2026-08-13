import DocxToPdf from "./DocxToPdf";
import { DEFAULT_SITE_BASE } from "../../../../lib/apiConfig";

const siteUrl = DEFAULT_SITE_BASE.replace(/\/+$/, "");

export const metadata = {
  title: "DOCX to PDF",
  description: "Convert Word DOCX documents to PDF online for free.",
  keywords: ["DOCX to PDF", "Word to PDF", "online PDF converter"],
  alternates: { canonical: `${siteUrl}/tools/docx-to-pdf/` },
};

export default function Page() {
  return <DocxToPdf />;
}
