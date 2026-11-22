import { notFound } from "next/navigation";
import BlogPageClient from "../../BlogPageClient";
import {
  getBlogArticles,
  getBlogCategories,
  getBlogPageCount,
} from "../../blogData";
import { BLOG_PAGE_SIZE } from "../../blogRoutes";
import { DEFAULT_SITE_BASE } from "../../../lib/apiConfig";

export const dynamicParams = false;

function getPageNumber(value) {
  const pageNumber = Number(value);
  return Number.isInteger(pageNumber) && pageNumber >= 2 ? pageNumber : null;
}

export function generateStaticParams() {
  const pageCount = getBlogPageCount();
  return Array.from({ length: Math.max(0, pageCount - 1) }, (_, index) => ({
    pageNum: String(index + 2),
  }));
}

export async function generateMetadata({ params }) {
  const { pageNum } = await params;
  const pageNumber = getPageNumber(pageNum);

  if (!pageNumber || pageNumber > getBlogPageCount()) {
    return {
      title: "Blog Page Not Found | ResumeSathi",
      robots: { index: false, follow: true },
    };
  }

  const canonical = `${DEFAULT_SITE_BASE.replace(/\/+$/, "")}/blog/page/${pageNumber}/`;
  const title = `Blog, Page ${pageNumber}`;
  const description = `Browse page ${pageNumber} of career articles, resume tips, and job-search guidance from ResumeSathi.`;

  return {
    title,
    description,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: { title, description, url: canonical, type: "website" },
  };
}

export default async function BlogPaginationPage({ params }) {
  const { pageNum } = await params;
  const pageNumber = getPageNumber(pageNum);
  const articles = getBlogArticles();

  if (!pageNumber || pageNumber > getBlogPageCount(articles)) notFound();

  return (
    <BlogPageClient
      initialArticles={articles}
      initialCategories={getBlogCategories()}
      initialPage={pageNumber}
      initialPageSize={BLOG_PAGE_SIZE}
      paginationBase="/blog/"
    />
  );
}
