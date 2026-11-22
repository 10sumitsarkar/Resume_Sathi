import IdCardMaker from "./IdCardMaker";
import JsonLd from "../../components/JsonLd";
import { getToolMetadata, ToolJsonLd } from "../toolSeo";
import "./id-card-maker.css";

const HOW_TO = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to make an ID card online",
  description:
    "Design a front and back ID card in the browser and download it as a print-ready image.",
  totalTime: "PT5M",
  step: [
    {
      "@type": "HowToStep",
      name: "Pick a template",
      text: "Choose a category and open a layout that already has both sides designed.",
    },
    {
      "@type": "HowToStep",
      name: "Replace the details",
      text: "Click any text to edit it, then upload a photo into the existing frame.",
    },
    {
      "@type": "HowToStep",
      name: "Match your brand",
      text: "Set the card background, tweak colours and add your logo as an upload.",
    },
    {
      "@type": "HowToStep",
      name: "Download and print",
      text: "Export the front and back at 4K and send the ZIP to your card printer.",
    },
  ],
};

export const metadata = getToolMetadata("/tools/id-card-maker/");

export default function Page() {
  return (
    <>
      <ToolJsonLd path="/tools/id-card-maker/" />
      <JsonLd data={HOW_TO} />
      <IdCardMaker />
    </>
  );
}
