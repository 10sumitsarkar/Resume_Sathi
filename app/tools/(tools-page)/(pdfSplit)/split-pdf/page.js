import SplitPdf from "./SplitPdf";
import { getToolMetadata, ToolBreadcrumb } from "../../../toolSeo";

export const metadata = getToolMetadata("/tools/split-pdf/");

export default function Page() {
  return (
    <>
      <ToolBreadcrumb path="/tools/split-pdf/" />
      <SplitPdf />
    </>
  );
}
