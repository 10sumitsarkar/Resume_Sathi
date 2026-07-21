const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://www.resumesathi.com';
const backendBase = (process.env.NEXT_PUBLIC_BACKEND_BASE || 'https://api.resumesathi.com').replace(/\/$/, '');

function getSlug(item) {
  return item?.slug || item?.url_name || item?.canonical_tag || item?.id?.toString() || '';
}

function normalizeItems(payload) {
  if (Array.isArray(payload)) return payload;
  if (!payload) return [];
  return payload.items || payload.results || [];
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
  { url: `${baseUrl}/tools/pdf-compressor/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ];

  try {
    const [articlesResponse, jobsResponse] = await Promise.all([
      fetch(`${backendBase}/api/articles?limit=500`, { next: { revalidate: 60 } }),
      fetch(`${backendBase}/api/courses?limit=500`, { next: { revalidate: 60 } }),
    ]);

    if (articlesResponse.ok) {
      const articles = normalizeItems(await articlesResponse.json());
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
    }

    if (jobsResponse.ok) {
      const jobs = normalizeItems(await jobsResponse.json());
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
    }
  } catch (error) {
    console.error('Failed to generate sitemap entries', error);
  }

  return routes;
}
