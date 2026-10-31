import apiConfig from '../../config/api-config.json';

const EXAM_GUIDE_BACKEND_BASE =
  process.env.NEXT_PUBLIC_BACKEND_BASE || apiConfig.backendBase;

export function isExamGuide(item) {
  return Boolean(
    item &&
    typeof item.slug === 'string' &&
    item.slug.trim() &&
    typeof item.canonical_tag === 'string' &&
    /^exam-guides\//i.test(item.canonical_tag.trim()),
  );
}

export function getExamGuideBackendBase() {
  return EXAM_GUIDE_BACKEND_BASE.replace(/\/+$/, '');
}

export function getExamGuideApiBase() {
  return `${getExamGuideBackendBase()}/api`;
}

export function resolveExamGuideMediaUrl(url, fallbackImage) {
  if (!url) return fallbackImage;
  if (/^https?:\/\//i.test(url) || String(url).startsWith('//')) return url;
  return `${getExamGuideBackendBase()}/${String(url).replace(/^\/+/, '')}`;
}
