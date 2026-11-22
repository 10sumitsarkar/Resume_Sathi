import MergePdf from "./MergePdf";
import { getToolMetadata, ToolBreadcrumb } from "../../../toolSeo";

export const metadata = getToolMetadata("/tools/merge-pdf/");

export default function Page() {
  return (
    <>
      <ToolBreadcrumb path="/tools/merge-pdf/" />
      <MergePdf />
    </>
  );
}
