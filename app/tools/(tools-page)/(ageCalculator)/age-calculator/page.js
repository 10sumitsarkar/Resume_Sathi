import AgeCalculator from "./AgeCalculator";
import { DEFAULT_SITE_BASE } from "../../../../lib/apiConfig";

const siteUrl = DEFAULT_SITE_BASE.replace(/\/+$/, "");

export const metadata = {
  title: "Age Calculator",
  description: "Calculate exact age in years, months, and days online.",
  keywords: ["age calculator", "date of birth calculator", "calculate age"],
  alternates: { canonical: `${siteUrl}/tools/age-calculator` },
};

export default function Page() {
  return <AgeCalculator />;
}
