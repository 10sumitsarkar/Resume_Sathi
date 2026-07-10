import ResumeListClient from "./homeClient";

export const metadata = {
  title: "ResumeKit — Create a Resume That Opens Doors",
  description:
    "Free resume builder with 5 ATS-friendly templates, career tools and government job updates. No signup, data stays on your device.",
};

export default function Page() {
  return <ResumeListClient />;
}