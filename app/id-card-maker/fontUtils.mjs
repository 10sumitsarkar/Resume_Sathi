export const FONT_WEIGHT_OPTIONS = [
  { label: "Light 300", value: 300 },
  { label: "Regular 400", value: 400 },
  { label: "Medium 500", value: 500 },
  { label: "Semi Bold 600", value: 600 },
  { label: "Bold 700", value: 700 },
  { label: "Extra Bold 800", value: 800 },
  { label: "Black 900", value: 900 },
];

export const resolveFontWeight = (item = {}) => {
  if (typeof item.fontWeight === "number" && Number.isFinite(item.fontWeight)) {
    return item.fontWeight;
  }

  if (typeof item.fontWeight === "string" && item.fontWeight.trim()) {
    const parsed = Number(item.fontWeight);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return item.bold ? 800 : 500;
};
