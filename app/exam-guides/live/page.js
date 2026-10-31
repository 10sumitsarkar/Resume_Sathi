import GuideDetailClient from "../[slug]/GuideDetailClient";

export const metadata = {
  title: "Exam Guides Live Updates",
  robots: { index: false, follow: true },
};

export default function LiveExamGuidePage() {
  return <GuideDetailClient article={null} slug="" />;
}
