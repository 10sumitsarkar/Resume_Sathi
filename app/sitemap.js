import fs from 'fs';
import path from 'path';
import { DEFAULT_SITE_BASE, getApiBase } from './lib/apiConfig';
import { SEO_TEMPLATES } from './templates/seoTemplates';
import { LESSONS } from './tools/typing/_lib/lessons';

const siteUrl = DEFAULT_SITE_BASE;
const examGuidesCachePath = path.join(process.cwd(), 'data', 'exam-guides-cache.json');

function getSlug(item) {
  const raw = item?.slug || item?.url_name || item?.canonical_tag || item?.id?.toString() || '';
  const lastSegment = String(raw).split('/').filter(Boolean).pop() || raw;

  return lastSegment
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeItems(payload) {
  if (Array.isArray(payload)) return payload;
  if (!payload) return [];
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.results)) return payload.results;
  return [];
}

function readCache(filename) {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'data', filename), 'utf-8');
    return normalizeItems(JSON.parse(raw));
  } catch (error) {
    return [];
  }
}

function readExamGuides() {
  try {
    const guides = JSON.parse(fs.readFileSync(examGuidesCachePath, 'utf-8'));
    return Array.isArray(guides)
      ? guides.filter((guide) => guide && guide.is_active !== 0 && !guide.deleted_at)
      : [];
  } catch (error) {
    console.error('FATAL: could not read data/exam-guides-cache.json for sitemap.');
    return [];
  }
}

async function fetchLiveItems(endpoint, fallbackFile) {
  try {
    const response = await fetch(`${getApiBase()}${endpoint}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return normalizeItems(await response.json());
  } catch (error) {
    return readCache(fallbackFile);
  }
}

export const revalidate = 60;

export default async function sitemap() {
  const baseUrl = siteUrl.replace(/\/$/, '');
  const toolPaths = [
    '/tools/',
    '/tools/age-calculator/',
    '/tools/ats-checker/',
    '/tools/background-remover/',
    '/tools/css-animations/',
    '/tools/docx-to-pdf/',
    '/tools/gradient-generator/',
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
    '/tools/typing/stats/',
    ...LESSONS.map((lesson) => `/tools/typing/learn/lesson/${lesson.id}/`),
  ];

  const routes = [
    { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/blog/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.95 },
    { url: `${baseUrl}/exam-guides/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/resume/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/resume/resume-type/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/resume/upload-resume/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/bio-data/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/templates/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    ...SEO_TEMPLATES.map((template) => ({
      url: `${baseUrl}/templates/${encodeURIComponent(template.slug)}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.82,
    })),
{ url: `${baseUrl}/about/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
{ url: `${baseUrl}/contact/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
{ url: `${baseUrl}/privacy-policy/`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
{ url: `${baseUrl}/terms-and-conditions/`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
{ url: `${baseUrl}/disclaimer/`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    ...toolPaths.map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: path.includes('/lesson/') ? 'monthly' : 'weekly',
      priority: path === '/tools/' ? 0.8 : 0.7,
    })),
];

  const articles = await fetchLiveItems('/articles?limit=500', 'articles-cache.json');
  const seenUrls = new Set(routes.map((route) => route.url));
  articles.forEach((article) => {
    const slug = getSlug(article);
    if (slug) {
      const url = `${baseUrl}/blog/${encodeURIComponent(slug)}/`;
      if (!seenUrls.has(url)) {
        seenUrls.add(url);
        routes.push({
          url,
          lastModified: new Date(article.updated_at || article.created_at || Date.now()),
          changeFrequency: 'monthly',
          priority: 0.8,
        });
      }
    }
  });

  readCache('categories-cache.json').forEach((category) => {
    const raw = category.course_url || category.course_name || category.name || category.title || '';
    const categorySlug = String(raw)
      .toLowerCase()
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/^railways$/, 'railway');
    if (!categorySlug) return;

    const url = `${baseUrl}/exam-guides/${encodeURIComponent(categorySlug)}/`;
    if (seenUrls.has(url)) return;
    seenUrls.add(url);
    routes.push({
      url,
      lastModified: new Date(category.updated_at || category.created_at || Date.now()),
      changeFrequency: 'daily',
      priority: 0.9,
    });
  });

  readExamGuides().forEach((guide) => {
    const rawSlug = guide.slug || guide.url_name || guide.canonical_tag || '';
    const slug = String(rawSlug)
      .split('/')
      .filter(Boolean)
      .pop()
      ?.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    if (!slug) return;

    const url = `${baseUrl}/exam-guides/${encodeURIComponent(slug)}/`;
    if (seenUrls.has(url)) return;
    seenUrls.add(url);
    routes.push({
      url,
      lastModified: new Date(guide.updated_at || guide.created_at || Date.now()),
      changeFrequency: 'monthly',
      priority: 0.82,
    });
  });

  return routes;
}
