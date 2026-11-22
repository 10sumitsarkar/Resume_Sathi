export const BLOG_PAGE_SIZE = 12;

export function slugifyBlogCategory(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getBlogCategorySlug(category) {
  if (typeof category === "string") return slugifyBlogCategory(category);
  return slugifyBlogCategory(
    category?.url_name || category?.slug || category?.article_name || category?.name,
  );
}

export function getBlogCategoryHref(category) {
  const slug = getBlogCategorySlug(category);
  return slug ? `/blog/category/${slug}/` : "/blog/";
}

export function getBlogPageHref(pageNumber, basePath = "/blog/") {
  const base = `/${String(basePath || "/blog/").replace(/^\/+|\/+$/g, "")}/`;
  return pageNumber <= 1 ? base : `${base}page/${pageNumber}/`;
}
