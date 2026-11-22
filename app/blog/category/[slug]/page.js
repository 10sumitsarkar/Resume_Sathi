import { notFound } from "next/navigation";
import BlogPageClient from "../../BlogPageClient";
import {
  getBlogArticles,
  getBlogCategories,
  getBlogCategoryBySlug,
  getArticlesInCategory,
} from "../../blogData";
import { BLOG_PAGE_SIZE } from "../../blogRoutes";
import { DEFAULT_SITE_BASE } from "../../../lib/apiConfig";

export const dynamicParams = false;

export function generateStaticParams() {
  const articles = getBlogArticles();
  return getBlogCategories()
    .filter((category) => getArticlesInCategory(category, articles).length > 0)
    .map((category) => ({
      slug: category.url_name || category.slug,
    }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = getBlogCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Blog Category Not Found | ResumeSathi",
      robots: { index: false, follow: true },
    };
  }

  const categorySlug = category.url_name || category.slug;
  const canonical = `${DEFAULT_SITE_BASE.replace(/\/+$/, "")}/blog/category/${categorySlug}/`;
  const name = category.article_name || category.name || category.title || "Career";
  const description =
    category.article_description ||
    `Browse ${name.toLowerCase()} articles from ResumeSathi.`;
  const title = `${name} | ResumeSathi Blog`;

  return {
    title,
    description,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: { title, description, url: canonical, type: "website" },
  };
}

export default async function BlogCategoryPage({ params }) {
  const { slug } = await params;
  const category = getBlogCategoryBySlug(slug);

  if (!category) notFound();

  const articles = getBlogArticles();
  const categoryArticles = getArticlesInCategory(category, articles);
  if (!categoryArticles.length) notFound();

  return (
    <BlogPageClient
      initialArticles={articles}
      initialCategories={getBlogCategories()}
      initialCategoryId={category.id}
      initialPage={1}
      initialPageSize={Math.max(BLOG_PAGE_SIZE, categoryArticles.length)}
      paginationBase={`/blog/category/${category.url_name || category.slug}/`}
      heroEyebrow="Blog Category"
      heroTitle={category.article_name || category.name || category.title}
      heroDescription={category.article_description}
    />
  );
}
