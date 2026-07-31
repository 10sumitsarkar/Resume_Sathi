import fs from 'fs';
import path from 'path';
import { DEFAULT_SITE_BASE } from './lib/apiConfig';

const siteUrl = DEFAULT_SITE_BASE;

function getSlug(item) {
  return item?.slug || item?.url_name || item?.canonical_tag || item?.id?.toString() || '';
}

function normalizeItems(payload) {
  if (Array.isArray(payload)) return payload;
  if (!payload) return [];
  return payload.items || payload.results || [];
}

function readCache(filename) {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'data', filename), 'utf-8');
    return normalizeItems(JSON.parse(raw));
  } catch (error) {
    return [];
  }
}

export const revalidate = 60;

export default async function sitemap() {
  const baseUrl = siteUrl.replace(/\/$/, '');

  const routes = [
    { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/blog/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.95 },
    { url: `${baseUrl}/jobs/`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.95 },
    { url: `${baseUrl}/resume/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/resume/resume-type/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/resume/upload-resume/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/tools/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/tools/ats-checker/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.82 },
    { url: `${baseUrl}/tools/merge-pdf/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  { url: `${baseUrl}/tools/split-pdf/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  { url: `${baseUrl}/tools/pdf-remove/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  { url: `${baseUrl}/tools/pdf-compressor/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  { url: `${baseUrl}/tools/docx-to-pdf/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.78 },
  { url: `${baseUrl}/tools/image-to-pdf/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.78 },
  { url: `${baseUrl}/tools/signature-cropper/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.76 },
  { url: `${baseUrl}/tools/age-calculator/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.76 },
  { url: `${baseUrl}/tools/gradient-generator/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  { url: `${baseUrl}/tools/css-animations/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  { url: `${baseUrl}/typing/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
{ url: `${baseUrl}/typing/practice/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
{ url: `${baseUrl}/typing/learn/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
{ url: `${baseUrl}/typing/learn/lesson/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
{ url: `${baseUrl}/typing/stats/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
];

  const articles = readCache('articles-cache.json');
  const seenBlogUrls = new Set(routes.map((route) => route.url));
  articles.forEach((article) => {
    const slug = getSlug(article);
    if (slug) {
      const url = `${baseUrl}/blog/${encodeURIComponent(slug)}/`;
      if (!seenBlogUrls.has(url)) {
        seenBlogUrls.add(url);
        routes.push({
          url,
          lastModified: new Date(article.updated_at || article.created_at || Date.now()),
          changeFrequency: 'monthly',
          priority: 0.8,
        });
      }
    }
  });

  const jobs = readCache('jobs-cache.json');
  const seenJobUrls = new Set(routes.map((route) => route.url));
  jobs.forEach((job) => {
    const slug = getSlug(job);
    if (slug) {
      const url = `${baseUrl}/jobs/${encodeURIComponent(slug)}/`;
      if (!seenJobUrls.has(url)) {
        seenJobUrls.add(url);
        routes.push({
          url,
          lastModified: new Date(job.updated_at || job.created_at || Date.now()),
          changeFrequency: 'daily',
          priority: 0.85,
        });
      }
    }
  });

  return routes;
}
