import GradientGenerator from "./GradientGenerator";
import { getToolMetadata, ToolBreadcrumb } from "../../../toolSeo";

export const metadata = getToolMetadata("/tools/gradient-generator/");

export default function ResumeTypeClientWrapper() {
  return (
    <>
      <ToolBreadcrumb path="/tools/gradient-generator/" />
      <GradientGenerator />
    </>
  );
}
