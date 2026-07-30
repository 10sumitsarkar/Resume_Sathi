import ArticleDetailPageClient from "../[slug]/ArticleDetailPageClient";

export const metadata = {
  title: "Blog Article | ResumeSathi",
  robots: { index: true, follow: true },
};

export default function LiveBlogDetailPage() {
  return <ArticleDetailPageClient article={null} slug="" />;
}
