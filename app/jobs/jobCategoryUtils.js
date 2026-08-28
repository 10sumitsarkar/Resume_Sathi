export function getCategoryName(category) {
  return category?.course_name || category?.article_name || category?.name || category?.title || 'Jobs';
}

export function slugifyCategory(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getCategorySlug(categoryOrSlug) {
  const raw =
    typeof categoryOrSlug === 'string'
      ? categoryOrSlug
      : categoryOrSlug?.course_url || getCategoryName(categoryOrSlug);

  let slug = slugifyCategory(raw);
  if (!slug) return '';

  if (slug === 'railways') slug = 'railway';
  if (!slug.endsWith('jobs') && !slug.endsWith('job')) {
    slug = `${slug}-jobs`;
  }

  return slug;
}
