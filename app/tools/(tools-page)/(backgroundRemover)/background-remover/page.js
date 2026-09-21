import BackgroundRemover from "./BackgroundRemover";
import { DEFAULT_SITE_BASE } from "../../../../lib/apiConfig";

const siteUrl = DEFAULT_SITE_BASE.replace(/\/+$/, "");

export const metadata = {
  title: "Background Remover",
  description: "Remove a plain image background online and download a transparent PNG for free.",
  keywords: ["background remover", "remove image background", "transparent PNG"],
  alternates: { canonical: `${siteUrl}/tools/background-remover/` },
};

export default function Page() {
  return <BackgroundRemover />;
}