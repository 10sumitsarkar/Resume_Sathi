import ImageToPdf from "./ImageToPdf";
import { getToolMetadata, ToolBreadcrumb } from "../../../toolSeo";

export const metadata = getToolMetadata("/tools/image-to-pdf/");

export default function Page() {
  return (
    <>
      <ToolBreadcrumb path="/tools/image-to-pdf/" />
      <ImageToPdf />
    </>
  );
}
