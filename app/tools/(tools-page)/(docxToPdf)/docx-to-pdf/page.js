import DocxToPdf from "./DocxToPdf";
import { getToolMetadata, ToolBreadcrumb } from "../../../toolSeo";

export const metadata = getToolMetadata("/tools/docx-to-pdf/");

export default function Page() {
  return (
    <>
      <ToolBreadcrumb path="/tools/docx-to-pdf/" />
      <DocxToPdf />
    </>
  );
}
