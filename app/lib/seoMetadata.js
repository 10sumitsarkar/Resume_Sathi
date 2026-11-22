function trimAtWordBoundary(value, maxLength) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (text.length <= maxLength) return text;
  const truncated = text.slice(0, maxLength + 1);
  const boundary = truncated.lastIndexOf(" ");
  return (boundary >= Math.floor(maxLength * 0.65)
    ? truncated.slice(0, boundary)
    : truncated.slice(0, maxLength)
  ).trim();
}

export function getSeoTitle(value, maxLength = 45) {
  return trimAtWordBoundary(value, maxLength);
}

export function getSeoDescription(value, fallback = "") {
  let description = String(value || fallback).replace(/\s+/g, " ").trim();
  if (description.length > 158) {
    description = trimAtWordBoundary(description, 158);
  }
  if (description.length < 120) {
    description = trimAtWordBoundary(
      `${description} Read more on ResumeSathi to review the details and plan your next step.`,
      158,
    );
  }
  return description;
}
