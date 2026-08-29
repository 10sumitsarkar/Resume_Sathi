import ArticleDetailPageClient from "../[slug]/ArticleDetailPageClient";

export const metadata = {
  title: "Job Opening | ResumeSathi",
  robots: { index: false, follow: true },
};

export default function LiveJobDetailPage() {
  return <ArticleDetailPageClient article={null} slug="" />;
}
