import apiConfig from '../../config/api-config.json';

const EXAM_GUIDE_BACKEND_BASE =
  process.env.NEXT_PUBLIC_BACKEND_BASE || apiConfig.backendBase;

export function isExamGuide(item) {
  return Boolean(
    item &&
    typeof item.slug === 'string' &&
    item.slug.trim() &&
    typeof item.canonical_tag === 'string' &&
    /^exam-guides\//i.test(item.canonical_tag.trim()) &&
    (item.is_active === true || item.is_active === 1 || item.is_active === '1') &&
    item.status !== false &&
    item.status !== 0 &&
    item.status !== '0' &&
    !item.deleted_at,
  );
}

export function getExamGuideLastUpdated(item) {
  const timestamps = [
    item?.created_at,
    item?.updated_at,
    ...(Array.isArray(item?.contents)
      ? item.contents.flatMap((content) => [content?.created_at, content?.updated_at])
      : []),
  ].filter((value) => value && !Number.isNaN(Date.parse(value)));

  return timestamps.reduce((latest, value) =>
    !latest || Date.parse(value) > Date.parse(latest) ? value : latest,
  '');
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
