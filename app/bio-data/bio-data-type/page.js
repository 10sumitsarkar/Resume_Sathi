import { redirect } from "next/navigation";

export const metadata = {
  title: "Bio-Data Builder Redirect",
  description: "Redirecting to the ResumeSathi bio-data builder.",
  alternates: { canonical: "/bio-data/resume-type/" },
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
};

export default function BioDataTypeRedirect() {
  redirect("/bio-data/resume-type");
}
