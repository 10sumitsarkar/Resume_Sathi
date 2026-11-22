import PdfRemove from "./PdfRemoveClient";
import { getToolMetadata, ToolBreadcrumb } from "../../../toolSeo";

export const metadata = getToolMetadata("/tools/pdf-remove/");

export default function Page() {
  return (
    <>
      <ToolBreadcrumb path="/tools/pdf-remove/" />
      <PdfRemove />
    </>
  );
}
