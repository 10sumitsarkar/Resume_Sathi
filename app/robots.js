import { DEFAULT_SITE_BASE } from './lib/apiConfig';

const SITE_URL = DEFAULT_SITE_BASE.replace(/\/+$/, '');

export const dynamic = 'force-static';

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
