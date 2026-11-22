
import AtsChecker from "./atsChecker";
import { getToolMetadata, ToolBreadcrumb } from "../../../toolSeo";

export const metadata = getToolMetadata("/tools/ats-checker/");

export default function Page() {
  return (
    <>
      <ToolBreadcrumb path="/tools/ats-checker/" />
      <AtsChecker />
    </>
  );
}
