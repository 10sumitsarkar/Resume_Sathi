import AgeCalculator from "./AgeCalculator";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.resumesathi.com";

export const metadata = {
  title: "Age Calculator",
  description: "Calculate exact age in years, months, and days online.",
  keywords: ["age calculator", "date of birth calculator", "calculate age"],
  alternates: { canonical: `${siteUrl}/tools/age-calculator` },
};

export default function Page() {
  return <AgeCalculator />;
}
