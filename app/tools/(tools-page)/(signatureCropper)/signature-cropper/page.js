import SignatureCropper from "./SignatureCropper";
import { DEFAULT_SITE_BASE } from "../../../../lib/apiConfig";

const siteUrl = DEFAULT_SITE_BASE.replace(/\/+$/, "");

export const metadata = {
  title: "Signature Cropper",
  description: "Crop signature images to a custom width and height online.",
  keywords: ["signature cropper", "crop signature", "resize signature"],
  alternates: { canonical: `${siteUrl}/tools/signature-cropper/` },
};

export default function Page() {
  return <SignatureCropper />;
}
