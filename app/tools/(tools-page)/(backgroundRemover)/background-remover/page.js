import BackgroundRemover from "./BackgroundRemover";
import { getToolMetadata, ToolBreadcrumb } from "../../../toolSeo";

export const metadata = getToolMetadata("/tools/background-remover/");

export default function Page() {
  return (
    <>
      <ToolBreadcrumb path="/tools/background-remover/" />
      <BackgroundRemover />
    </>
  );
}