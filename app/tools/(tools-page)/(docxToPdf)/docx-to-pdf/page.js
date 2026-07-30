import DocxToPdf from "./DocxToPdf";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.resumesathi.com";

export const metadata = {
  title: "DOCX to PDF",
  description: "Convert Word DOCX documents to PDF online for free.",
  keywords: ["DOCX to PDF", "Word to PDF", "online PDF converter"],
  alternates: { canonical: `${siteUrl}/tools/docx-to-pdf` },
};

export default function Page() {
  return <DocxToPdf />;
}
