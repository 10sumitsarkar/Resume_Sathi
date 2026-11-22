import fs from "fs";
import path from "path";
import {
  getArticleAuthorSlug,
  getAuthorProfileBySlug,
  getAuthorProfiles,
} from "../blog/articleMetadata";
import { resolveApiMediaUrl } from "../lib/apiConfig";
import {
  isExamGuide,
  resolveExamGuideMediaUrl,
} from "../exam-guides/examGuideData";

function readCache(filename) {
  const filePath = path.join(process.cwd(), "data", filename);
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  if (!Array.isArray(data)) {
    throw new TypeError(`data/${filename} must contain an item array.`);
  }
  return data;
}

export function getAuthorArticles(authorSlug) {
  const articles = readCache("articles-cache.json")
    .filter((article) => getArticleAuthorSlug(article) === authorSlug)
    .map((article) => ({ ...article, contentType: "blog" }));
  const guides = readCache("exam-guides-cache.json")
    .filter(
      (guide) =>
        isExamGuide(guide) && getArticleAuthorSlug(guide) === authorSlug,
    )
    .map((guide) => ({ ...guide, contentType: "exam-guide" }));

  return [...articles, ...guides]
    .sort(
      (left, right) =>
        Date.parse(right.updated_at || right.created_at || 0) -
        Date.parse(left.updated_at || left.created_at || 0),
    );
}

export function getAuthorTopics(articles) {
  return [
    ...new Set(
      articles
        .map(
          (article) =>
            article.contentType === "exam-guide"
              ? "Exam Guides"
              : article.category?.article_name ||
                article.category?.name ||
                article.category?.title,
        )
        .filter(Boolean),
    ),
  ].sort((left, right) => left.localeCompare(right));
}

export function getAuthorArticleSlug(article) {
  const raw =
    article?.url_name ||
    article?.slug ||
    article?.canonical_tag ||
    "";
  let slug = String(raw).trim().split("/").filter(Boolean).pop() || "";
  try {
    slug = decodeURIComponent(slug);
  } catch {
    // Keep malformed URI sequences usable.
  }
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getAuthorArticleTitle(article) {
  return (
    article?.article_title ||
    article?.title ||
    article?.meta_title ||
    "Article"
  );
}

export function getAuthorArticleDescription(article) {
  return (
    article?.description ||
    article?.meta_description ||
    article?.short_description ||
    article?.excerpt ||
    ""
  );
}

export function getAuthorArticleCategory(article) {
  if (article?.contentType === "exam-guide") return "Exam Guide";
  return (
    article?.category?.article_name ||
    article?.category?.name ||
    article?.category?.title ||
    "Career Article"
  );
}

export function getAuthorArticleImage(article) {
  const image =
    article?.hero_image ||
    article?.image ||
    article?.meta_image ||
    article?.og_image;
  const fallback = "/front-assets/images/og/blog-og.webp";

  return article?.contentType === "exam-guide"
    ? resolveExamGuideMediaUrl(image, fallback)
    : resolveApiMediaUrl(image, fallback);
}

export { getAuthorProfileBySlug, getAuthorProfiles };
