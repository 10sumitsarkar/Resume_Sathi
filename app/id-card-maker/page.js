import IdCardMaker from "./IdCardMaker";
import "./id-card-maker.css";

const TITLE = "ID Card Maker | Editable School, Employee & Event Cards";
const DESCRIPTION =
  "Free online ID card maker with front and back templates for school, college, employee, visitor, event, medical, press, gym and volunteer cards. Edit in the browser and download a print-ready 4K file.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "ID card maker",
    "school ID card maker",
    "college ID card design",
    "employee ID card",
    "visitor pass maker",
    "event badge maker",
    "gym membership card maker",
    "volunteer ID card",
    "front and back ID card template",
  ],
  alternates: { canonical: "/id-card-maker/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/id-card-maker/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
};

const FAQ = [
  [
    "Is the ID card maker free?",
    "Yes. You can design and download both sides at 4K without an account and without a watermark.",
  ],
  [
    "What size are the cards?",
    "CR80 is the standard plastic card size and is available in landscape and portrait. Event Badge is a taller lanyard size, and you can set any custom width and height.",
  ],
  [
    "Can I print these on PVC cards?",
    "Yes. The export is a 3840px PNG per side, which is enough resolution for most card printers.",
  ],
  [
    "Do my photos get uploaded anywhere?",
    "No. The editor runs in your browser and the image never leaves your device.",
  ],
  [
    "Can I design the back side of the card?",
    "Yes. Every template ships with a designed back side containing terms, emergency contact, QR and barcode blocks, and you can edit it exactly like the front.",
  ],
  [
    "Can I make a government ID?",
    "No. This tool is only for organisational cards such as school, employee, visitor, event, gym and volunteer IDs.",
  ],
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "ID Card Maker",
      applicationCategory: "DesignApplication",
      operatingSystem: "Any",
      description: DESCRIPTION,
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
      featureList: [
        "Front and back card templates",
        "Drag, resize and rotate elements",
        "Photo, QR and barcode blocks",
        "CR80 and event badge sizes",
        "4K PNG export for printing",
      ],
    },
    {
      "@type": "HowTo",
      name: "How to make an ID card online",
      description:
        "Design a front and back ID card in the browser and download it as a print-ready 4K image.",
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
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "/" },
        {
          "@type": "ListItem",
          position: 2,
          name: "Tools",
          item: "/tools/",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "ID Card Maker",
          item: "/id-card-maker/",
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map(([question, answer]) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <IdCardMaker />
    </>
  );
}
