import React from "react";
import { Text, View } from "@react-pdf/renderer";

const decodeEntities = (value = "") =>
  String(value)
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");

const stripTags = (value = "") => decodeEntities(String(value).replace(/<[^>]*>/g, "")).trim();

const parseStyle = (tag = "") => {
  const styleMatch = tag.match(/style=["']([^"']*)["']/i);
  if (!styleMatch) return {};

  return styleMatch[1].split(";").reduce((style, rule) => {
    const [rawKey, rawValue] = rule.split(":");
    const key = rawKey?.trim().toLowerCase();
    const value = rawValue?.trim();
    if (!key || !value) return style;
    if (key === "color") style.color = value;
    if (key === "background-color") style.backgroundColor = value;
    return style;
  }, {});
};

const parseInline = (html = "", baseStyle = {}) => {
  const output = [];
  const stack = [baseStyle];
  const tokenRegex = /(<\/?[^>]+>)/g;
  let cursor = 0;
  let match;

  const pushText = (text) => {
    const clean = decodeEntities(text);
    if (!clean) return;
    output.push(
      <Text key={output.length} style={stack[stack.length - 1]}>
        {clean}
      </Text>
    );
  };

  while ((match = tokenRegex.exec(html))) {
    pushText(html.slice(cursor, match.index));
    const tag = match[1];
    const tagName = (tag.match(/^<\/?\s*([a-z0-9]+)/i)?.[1] || "").toLowerCase();
    const closing = /^<\//.test(tag);

    if (tagName === "br") {
      pushText("\n");
    } else if (closing) {
      if (stack.length > 1) stack.pop();
    } else {
      const current = stack[stack.length - 1];
      const next = { ...current };
      if (tagName === "b" || tagName === "strong") next.fontWeight = "700";
      if (tagName === "i" || tagName === "em") next.fontStyle = "italic";
      if (tagName === "u") next.textDecoration = "underline";
      if (tagName === "s" || tagName === "strike") next.textDecoration = "line-through";
      if (tagName === "span") Object.assign(next, parseStyle(tag));
      if (["b", "strong", "i", "em", "u", "s", "strike", "span", "a"].includes(tagName)) {
        stack.push(next);
      }
    }

    cursor = match.index + tag.length;
  }

  pushText(html.slice(cursor));
  return output;
};

const splitBlocks = (html = "") => {
  const normalized = String(html || "")
    .replace(/<div><br><\/div>/gi, "<br>")
    .replace(/<div/gi, "<p")
    .replace(/<\/div>/gi, "</p>")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");

  const blocks = [];
  const listRegex = /<(ol|ul)[^>]*>([\s\S]*?)<\/\1>/gi;
  let cursor = 0;
  let match;

  const pushParagraphs = (chunk) => {
    chunk
      .replace(/<br\s*\/?>/gi, "\n")
      .split(/<\/p>|<\/h[1-6]>|\n/gi)
      .map((part) => part.replace(/<p[^>]*>|<h[1-6][^>]*>/gi, "").trim())
      .filter((part) => stripTags(part))
      .forEach((part) => blocks.push({ type: "p", html: part }));
  };

  while ((match = listRegex.exec(normalized))) {
    pushParagraphs(normalized.slice(cursor, match.index));
    const ordered = match[1].toLowerCase() === "ol";
    const items = Array.from(match[2].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)).map((item) => item[1]);
    blocks.push({ type: ordered ? "ol" : "ul", items });
    cursor = match.index + match[0].length;
  }

  pushParagraphs(normalized.slice(cursor));
  return blocks;
};

export default function PdfRichText({ html, style, bulletStyle, itemStyle }) {
  const blocks = splitBlocks(html);
  if (!blocks.length) return null;

  return (
    <View>
      {blocks.map((block, index) => {
        if (block.type === "p") {
          return (
            <Text key={index} style={style}>
              {parseInline(block.html, style)}
            </Text>
          );
        }

        return (
          <View key={index}>
            {block.items.map((item, itemIndex) => (
              <View key={itemIndex} style={[{ flexDirection: "row" }, itemStyle]}>
                <Text style={[style, bulletStyle]}>{block.type === "ol" ? `${itemIndex + 1}.` : "-"}</Text>
                <Text style={[style, { flex: 1 }]}>{parseInline(item, style)}</Text>
              </View>
            ))}
          </View>
        );
      })}
    </View>
  );
}
