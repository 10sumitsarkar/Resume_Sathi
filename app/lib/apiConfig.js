import apiConfig from '../../config/api-config.json';

export const DEFAULT_BACKEND_BASE = process.env.NEXT_PUBLIC_BACKEND_BASE || apiConfig.backendBase || 'https://api.resumesathi.com';

export function getBackendBase() {
  if (typeof window !== 'undefined') {
    const runtimeBase = window.RESUME_SATHI_CONFIG?.BACKEND_BASE;
    if (runtimeBase) {
      return runtimeBase.replace(/\/+$/, '');
    }
  }

  return DEFAULT_BACKEND_BASE.replace(/\/+$/, '');
}

export function getApiBase() {
  return `${getBackendBase()}/api`;
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
