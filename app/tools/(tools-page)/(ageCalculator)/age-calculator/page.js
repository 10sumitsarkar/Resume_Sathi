import AgeCalculator from "./AgeCalculator";
import { getToolMetadata, ToolBreadcrumb } from "../../../toolSeo";

export const metadata = getToolMetadata("/tools/age-calculator/");

export default function Page() {
  return (
    <>
      <ToolBreadcrumb path="/tools/age-calculator/" />
      <AgeCalculator />
    </>
  );
}
