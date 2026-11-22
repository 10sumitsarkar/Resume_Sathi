import CssAnimations from "./CssAnimations";
import { getToolMetadata, ToolBreadcrumb } from "../../../toolSeo";

export const metadata = getToolMetadata("/tools/css-animations/");

export default function ResumeTypeClientWrapper() {
  return (
    <>
      <ToolBreadcrumb path="/tools/css-animations/" />
      <CssAnimations />
    </>
  );
}
