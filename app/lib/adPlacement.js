function getVisibleText(html) {
  return String(html || "")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&(?:#x[\da-f]+|#\d+|[a-z][\da-z]+);/gi, " ");
}

function isConclusionHeading(html) {
  const heading = getVisibleText(html).replace(/\s+/g, " ").trim();

  return /^(?:(?:in\s+)?conclusions?|final thoughts?|closing thoughts?|summary|key takeaways?|final takeaways?|wrapping up)\b/i.test(
    heading,
  );
}

function hasNearbyAction(html, insertionPoint) {
  const start = Math.max(0, insertionPoint - 300);
  const end = Math.min(html.length, insertionPoint + 300);
  const nearbyHtml = html.slice(start, end);

  return (
    /<(?:button|nav)\b/i.test(nearbyHtml) ||
    /<a\b[^>]*(?:download|class=["'][^"']*(?:btn|cta|nav)|aria-label=["'][^"']*(?:download|cta|nav))[^>]*>/i.test(
      nearbyHtml,
    )
  );
}

export function findArticleAdPlacement(htmlSections) {
  if (!Array.isArray(htmlSections) || htmlSections.length === 0) return null;

  const sections = htmlSections.map((html) => String(html || ""));
  const combinedHtml = sections.join("\n");
  const text = getVisibleText(combinedHtml);
  const wordCount = text.match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu)?.length || 0;

  if (wordCount < 400) return null;

  const paragraphs = [...combinedHtml.matchAll(/<p\b[^>]*>[\s\S]*?<\/p\s*>/gi)];
  if (paragraphs.length < 2) return null;

  const secondParagraph = paragraphs[1];
  const insertionPoint = secondParagraph.index + secondParagraph[0].length;
  const conclusion = [...combinedHtml.matchAll(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]\s*>/gi)]
    .find((heading) => heading.index > insertionPoint && isConclusionHeading(heading[1]));

  if (!conclusion || hasNearbyAction(combinedHtml, insertionPoint)) return null;

  let sectionStart = 0;
  for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex += 1) {
    const sectionEnd = sectionStart + sections[sectionIndex].length;
    if (insertionPoint <= sectionEnd) {
      return {
        sectionIndex,
        offset: insertionPoint - sectionStart,
      };
    }
    sectionStart = sectionEnd + 1;
  }

  return null;
}
