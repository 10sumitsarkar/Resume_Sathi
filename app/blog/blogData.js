import fs from "node:fs";
import path from "node:path";
import { latestFirst } from "./articleSort";
import { BLOG_PAGE_SIZE, getBlogCategorySlug } from "./blogRoutes";

function readArrayCache(filename) {
  const filePath = path.join(process.cwd(), "data", filename);
  let data;

  try {
    data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    console.error(`FATAL: could not read data/${filename}. Did scripts/fetch-articles.js run before build?`, error);
    throw error;
  }

  if (!Array.isArray(data)) {
    throw new TypeError(`Expected data/${filename} to contain an array.`);
  }

  return data;
}

export function getBlogArticles() {
  return latestFirst(readArrayCache("articles-cache.json"));
}

export function getBlogCategories() {
  return readArrayCache("article-categories-cache.json");
}

export function getArticleSlug(article) {
  const raw =
    typeof article === "string"
      ? article
      : article?.url_name || article?.slug || article?.canonical_tag || "";
  const lastSegment = String(raw).trim().split("/").filter(Boolean).pop() || "";

  try {
    return decodeURIComponent(lastSegment)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  } catch {
    return lastSegment.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }
}

export function getArticleCategoryId(article) {
  return Number(article?.category?.id || article?.category_id || article?.article_type || 0);
}

export function getArticlesInCategory(category, articles = getBlogArticles()) {
  const categoryId = Number(category?.id || 0);
  const categorySlug = getBlogCategorySlug(category);

  return latestFirst(articles).filter((article) => {
    const articleCategoryId = getArticleCategoryId(article);
    if (categoryId && articleCategoryId) return categoryId === articleCategoryId;
    return getBlogCategorySlug(article?.category) === categorySlug;
  });
}

export function getBlogPageCount(articles = getBlogArticles()) {
  return Math.ceil(articles.length / BLOG_PAGE_SIZE);
}

export function getBlogCategoryBySlug(slug, categories = getBlogCategories()) {
  return categories.find((category) => getBlogCategorySlug(category) === slug) || null;
}

export function getRelatedBlogArticles(article, articles = getBlogArticles(), limit = 4) {
  const articleSlug = getArticleSlug(article);
  const categoryId = getArticleCategoryId(article);
  const categorySlug = getBlogCategorySlug(article?.category);
  const sortedArticles = latestFirst(articles).filter(
    (candidate) => getArticleSlug(candidate) !== articleSlug,
  );
  const sameCategory = sortedArticles.filter((candidate) => {
    if (categoryId && getArticleCategoryId(candidate)) {
      return categoryId === getArticleCategoryId(candidate);
    }
    return getBlogCategorySlug(candidate?.category) === categorySlug;
  });

  return [...sameCategory, ...sortedArticles.filter((candidate) => !sameCategory.includes(candidate))]
    .slice(0, limit)
    .map((candidate) => ({
      slug: getArticleSlug(candidate),
      title:
        candidate.article_title ||
        candidate.title ||
        candidate.meta_title ||
        "Read article",
      category:
        candidate.category?.article_name ||
        candidate.category?.name ||
        candidate.category?.title ||
        "",
    }));
}

export function getContextualArticleLinks(article) {
  const identifier = [
    article?.article_title,
    article?.title,
    article?.url_name,
    article?.slug,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (/\bmerge\b|\bcombine\b/.test(identifier) && /\bpdf\b/.test(identifier)) {
    return [
      { href: "/tools/merge-pdf/", label: "merge PDF files" },
      { href: "/tools/", label: "explore other document tools" },
    ];
  }
  if (/\bcompress(?:ion)?\b/.test(identifier) && /\bpdf\b/.test(identifier)) {
    return [
      { href: "/tools/pdf-compressor/", label: "compress a PDF file" },
      { href: "/tools/", label: "browse PDF and document tools" },
    ];
  }
  if (/\bsplit\b/.test(identifier) && /\bpdf\b/.test(identifier)) {
    return [
      { href: "/tools/split-pdf/", label: "split a PDF into separate files" },
      { href: "/tools/", label: "browse PDF and document tools" },
    ];
  }
  if (/\bimage\b/.test(identifier) && /\bpdf\b/.test(identifier)) {
    return [
      { href: "/tools/image-to-pdf/", label: "convert images to PDF" },
      { href: "/tools/", label: "browse PDF and document tools" },
    ];
  }
  if (/\bdocx\b|\bword\b.*\bpdf\b/.test(identifier)) {
    return [
      { href: "/tools/docx-to-pdf/", label: "convert a Word document to PDF" },
      { href: "/tools/", label: "browse PDF and document tools" },
    ];
  }
  if (/\bpdf\b/.test(identifier)) {
    return [
      { href: "/tools/", label: "browse PDF and document tools" },
      { href: "/tools/pdf-compressor/", label: "compress a PDF file" },
    ];
  }

  const categoryName = String(
    article?.category?.article_name ||
      article?.category?.name ||
      article?.category?.title ||
      "",
  ).toLowerCase();

  if (/wbpsc/.test(identifier)) {
    return [
      {
        href: "/exam-guides/wbpsc-clerkship-syllabus-exam-pattern-eligibility-salary/",
        label: "read the WBPSC Clerkship exam guide",
      },
      { href: "/exam-guides/", label: "browse all exam guides" },
      { href: "/tools/typing/practice/", label: "practice typing" },
    ];
  }
  if (/rrb\s*ntpc|rrb-ntpc/.test(identifier)) {
    return [
      {
        href: "/exam-guides/rrb-ntpc-12th-level-exam-syllabus-pattern-eligibility-salary/",
        label: "read the RRB NTPC exam guide",
      },
      { href: "/exam-guides/", label: "browse all exam guides" },
      { href: "/tools/typing/practice/", label: "practice typing" },
    ];
  }
  if (/\bupsc\b|\bssc\b|\bpsc\b|government job|exam preparation/.test(identifier)) {
    return [
      { href: "/exam-guides/", label: "browse exam guides and syllabus resources" },
      { href: "/tools/typing/practice/", label: "practice typing" },
      { href: "/resume/", label: "prepare your application with the resume builder" },
    ];
  }
  if (categoryName === "resume tips" || /\bresume\b|\bcv\b|biodata/.test(identifier)) {
    return [
      { href: "/templates/", label: "browse resume templates" },
      { href: "/resume/", label: "build a resume with guided sections" },
      { href: "/tools/ats-checker/", label: "check resume keywords with the ATS checker" },
    ];
  }

  return [
    { href: "/resume/", label: "build a resume with guided sections" },
    { href: "/templates/", label: "compare resume templates" },
    { href: "/tools/ats-checker/", label: "review resume keywords with the ATS checker" },
  ];
}
