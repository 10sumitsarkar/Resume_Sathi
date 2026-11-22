import SignatureCropper from "./SignatureCropper";
import { getToolMetadata, ToolBreadcrumb } from "../../../toolSeo";

export const metadata = getToolMetadata("/tools/signature-cropper/");

export default function Page() {
  return (
    <>
      <ToolBreadcrumb path="/tools/signature-cropper/" />
      <SignatureCropper />
    </>
  );
}
