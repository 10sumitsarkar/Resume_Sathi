export function latestFirst(items = []) {
  return items.slice().sort((a, b) => {
    const aDate = Date.parse(a?.created_at || a?.updated_at || '') || 0;
    const bDate = Date.parse(b?.created_at || b?.updated_at || '') || 0;

    if (aDate !== bDate) return bDate - aDate;

    return String(b?.id ?? b?.url_name ?? b?.slug ?? '').localeCompare(
      String(a?.id ?? a?.url_name ?? a?.slug ?? ''),
      undefined,
      { numeric: true }
    );
  });
}
