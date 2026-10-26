export function normalizeDescriptionHtml(value = "", plainTextAsBullets = false) {
  const text = String(value || "").trim();
  if (!text) return "";

  if (/<\/?(?:a|b|strong|i|em|u|s|ol|ul|li|p|br|div|span)\b[^>]*>/i.test(text)) {
    return text;
  }

  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  const escapeHtml = (line) =>
    line
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  if (plainTextAsBullets) {
    return `<ul>${lines
      .map((line) => `<li>${escapeHtml(line.replace(/^[-•\s]+/, ""))}</li>`)
      .join("")}</ul>`;
  }

  return lines.map((line) => `<p>${escapeHtml(line)}</p>`).join("");
}

function safeColor(value) {
  return /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(value)
    ? value
    : "";
}

export function sanitizeDescriptionHtml(html = "") {
  const allowedTags = new Set(["b", "strong", "i", "em", "u", "s", "ol", "ul", "li", "p", "br", "a", "span"]);

  return String(html || "")
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<div><br\s*\/?><\/div>/gi, "<br>")
    .replace(/<div\b[^>]*\/>/gi, "")
    .replace(/<div\b[^>]*>/gi, "<p>")
    .replace(/<\/div>/gi, "</p>")
    .replace(/<\/?([a-z0-9]+)\b([^>]*)>/gi, (tag, name, attributes) => {
      const tagName = name.toLowerCase();
      if (!allowedTags.has(tagName)) return "";
      if (tag.startsWith("</")) return tagName === "br" ? "" : `</${tagName}>`;
      if (tagName === "br") return "<br>";

      if (tagName === "a") {
        const href = attributes.match(/\bhref\s*=\s*(["'])(.*?)\1/i)?.[2] || "";
        const safeHref = /^(https?:\/\/|mailto:|tel:)/i.test(href) ? href.replace(/["<>]/g, "") : "";
        return safeHref
          ? `<a href="${safeHref}" target="_blank" rel="noopener noreferrer">`
          : "<a>";
      }

      if (tagName === "span") {
        const style = attributes.match(/\bstyle\s*=\s*(["'])(.*?)\1/i)?.[2] || "";
        const color = safeColor(style.match(/(?:^|;)\s*color\s*:\s*([^;]+)/i)?.[1]?.trim() || "");
        const backgroundColor = safeColor(
          style.match(/(?:^|;)\s*background-color\s*:\s*([^;]+)/i)?.[1]?.trim() || "",
        );
        const safeStyle = [
          color ? `color:${color}` : "",
          backgroundColor ? `background-color:${backgroundColor}` : "",
        ]
          .filter(Boolean)
          .join(";");
        return safeStyle ? `<span style="${safeStyle}">` : "<span>";
      }

      return `<${tagName}>`;
    });
}
