import fs from 'fs';
import path from 'path';
import { DEFAULT_SITE_BASE } from './lib/apiConfig';
import { SEO_TEMPLATES } from './templates/seoTemplates';
import { getExamGuideLastUpdated, isExamGuide } from './exam-guides/examGuideData';
import { getArticleLastUpdatedAt } from './blog/articleMetadata';
import {
  getArticleSlug as getBlogArticleSlug,
  getArticlesInCategory,
  getBlogArticles,
  getBlogCategories,
  getBlogPageCount,
} from './blog/blogData';
import { BLOG_PAGE_SIZE, getBlogCategorySlug } from './blog/blogRoutes';

const baseUrl = DEFAULT_SITE_BASE.replace(/\/+$/, '');
const examGuidesCachePath = path.join(process.cwd(), 'data', 'exam-guides-cache.json');

export const dynamic = 'force-static';

function readExamGuides() {
  const guides = JSON.parse(fs.readFileSync(examGuidesCachePath, 'utf-8'));
  if (!Array.isArray(guides)) {
    throw new TypeError('Expected data/exam-guides-cache.json to contain an array.');
  }
  return guides.filter(isExamGuide);
}

function getExamGuideSlug(guide) {
  const raw = guide?.slug || guide?.url_name || guide?.canonical_tag || '';
  const lastSegment = String(raw).split('/').filter(Boolean).pop() || '';

  try {
    return decodeURIComponent(lastSegment)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  } catch {
    return lastSegment.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }
}

function getLatestDate(items, getDate) {
  const dates = items
    .map(getDate)
    .filter((value) => value && !Number.isNaN(Date.parse(value)))
    .map((value) => new Date(value));

  return dates.length
    ? dates.reduce((latest, date) => (date > latest ? date : latest))
    : undefined;
}

function addLastModified(entry, date) {
  return date ? { ...entry, lastModified: date } : entry;
}

export default function sitemap() {
  const articles = getBlogArticles();
  const guides = readExamGuides();
  const latestArticleDate = getLatestDate(articles, getArticleLastUpdatedAt);
  const latestGuideDate = getLatestDate(guides, getExamGuideLastUpdated);
  const toolPaths = [
    '/tools/',
    '/tools/age-calculator/',
    '/tools/ats-checker/',
    '/tools/background-remover/',
    '/tools/docx-to-pdf/',
    '/tools/id-card-maker/',
    '/tools/image-to-pdf/',
    '/tools/merge-pdf/',
    '/tools/pdf-compressor/',
    '/tools/pdf-remove/',
    '/tools/split-pdf/',
    '/tools/signature-cropper/',
    '/tools/typing/',
    '/tools/typing/learn/',
    '/tools/typing/practice/',
  ];

  const staticPaths = [
    '/',
    '/blog/',
    '/exam-guides/',
    '/resume/',
    '/bio-data/',
    '/templates/',
    ...SEO_TEMPLATES.map((template) => `/templates/${encodeURIComponent(template.slug)}/`),
    '/about/',
    '/authors/',
    '/authors/nitu-dey/',
    '/authors/sumit-sarkar/',
    '/editorial-policy/',
    '/contact/',
    '/privacy-policy/',
    '/terms-and-conditions/',
    '/disclaimer/',
    ...toolPaths,
  ];
  const routes = staticPaths.map((route) => ({ url: `${baseUrl}${route}` }));
  const seenUrls = new Set(routes.map((route) => route.url));
  const addRoute = (route, date) => {
    const url = `${baseUrl}${route}`;
    if (seenUrls.has(url)) return;
    seenUrls.add(url);
    routes.push(addLastModified({ url }, date));
  };

  const blogIndex = routes.find((route) => route.url === `${baseUrl}/blog/`);
  if (latestArticleDate) blogIndex.lastModified = latestArticleDate;
  const examIndex = routes.find((route) => route.url === `${baseUrl}/exam-guides/`);
  if (latestGuideDate) examIndex.lastModified = latestGuideDate;

  for (let pageNumber = 2; pageNumber <= getBlogPageCount(articles); pageNumber += 1) {
    const pageArticles = articles.slice(
      (pageNumber - 1) * BLOG_PAGE_SIZE,
      pageNumber * BLOG_PAGE_SIZE,
    );
    addRoute(
      `/blog/page/${pageNumber}/`,
      getLatestDate(pageArticles, getArticleLastUpdatedAt),
    );
  }

  const categories = getBlogCategories();
  categories.forEach((category) => {
    const categorySlug = getBlogCategorySlug(category);
    if (!categorySlug || getArticlesInCategory(category, articles).length === 0) return;

    addRoute(
      `/blog/category/${encodeURIComponent(categorySlug)}/`,
      getLatestDate(
        getArticlesInCategory(category, articles),
        getArticleLastUpdatedAt,
      ),
    );
  });

  articles.forEach((article) => {
    const slug = getBlogArticleSlug(article);
    if (!slug) return;
    addRoute(
      `/blog/${encodeURIComponent(slug)}/`,
      getLatestDate([article], getArticleLastUpdatedAt),
    );
  });

  guides.forEach((guide) => {
    const slug = getExamGuideSlug(guide);
    if (!slug) return;

    const url = `${baseUrl}/exam-guides/${encodeURIComponent(slug)}/`;
    if (seenUrls.has(url)) return;
    seenUrls.add(url);
    routes.push(addLastModified({ url }, getLatestDate([guide], getExamGuideLastUpdated)));
  });

  return routes;
}
