import PdfCompressor from "./PdfCompressor";
import { getToolMetadata, ToolBreadcrumb } from "../../../toolSeo";

export const metadata = getToolMetadata("/tools/pdf-compressor/");

export default function Page() {
  return (
    <>
      <ToolBreadcrumb path="/tools/pdf-compressor/" />
      <PdfCompressor />
    </>
  );
}
