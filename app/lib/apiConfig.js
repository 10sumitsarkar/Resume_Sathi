import apiConfig from '../../config/api-config.json';

export const DEFAULT_SITE_BASE = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_FRONTEND_URL || apiConfig.frontendBase;
export const DEFAULT_BACKEND_BASE = process.env.NEXT_PUBLIC_BACKEND_BASE || apiConfig.backendBase;

export function getSiteBase() {
  return DEFAULT_SITE_BASE.replace(/\/+$/, '');
}

export function getBackendBase() {
  return DEFAULT_BACKEND_BASE.replace(/\/+$/, '');
}

export function getApiBase() {
  return `${getBackendBase()}/api`;
}

export function getSiteUrl(path = '') {
  return `${getSiteBase()}${path ? `/${String(path).replace(/^\/+/, '')}` : ''}`;
}

export function withTrailingSlash(url = '/') {
  const value = String(url || '/');
  if (!value || value === '#') return value;
  if (/^(mailto:|tel:|https?:\/\/|\/\/)/i.test(value)) return value;

  const [pathWithHash, query = ''] = value.split('?');
  const [path, hash = ''] = pathWithHash.split('#');

  if (!path || path.endsWith('/') || /\.[a-z0-9]+$/i.test(path)) {
    return value;
  }

  return `${path}/${query ? `?${query}` : ''}${hash ? `#${hash}` : ''}`;
}

export function getSiteCanonical(path = '/') {
  return `${getSiteBase()}${withTrailingSlash(path)}`;
}

export function getContentCacheUrl(filename) {
  return `${getApiBase()}/public-cache/${String(filename).replace(/^\/+/, '')}`;
}

export function resolveApiMediaUrl(url, fallbackImage) {
  if (!url) return fallbackImage;
  if (/^https?:\/\//i.test(url) || String(url).startsWith('//')) {
    return url;
  }

  return `${getBackendBase()}/${String(url).replace(/^\/+/, '')}`;
}
