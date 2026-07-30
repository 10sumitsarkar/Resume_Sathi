import SignatureCropper from "./SignatureCropper";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.resumesathi.com";

export const metadata = {
  title: "Signature Cropper",
  description: "Crop signature images to a custom width and height online.",
  keywords: ["signature cropper", "crop signature", "resize signature"],
  alternates: { canonical: `${siteUrl}/tools/signature-cropper` },
};

export default function Page() {
  return <SignatureCropper />;
}
