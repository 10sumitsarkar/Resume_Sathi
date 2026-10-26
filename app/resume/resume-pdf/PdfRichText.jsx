import React from "react";
import { Link, Text, View } from "@react-pdf/renderer";
import { normalizeDescriptionHtml } from "../components/richTextUtils";

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

const parseInline = (html = "") => {
  const output = [];
  const stack = [{}];
  const tokenRegex = /(<\/?[^>]+>)/g;
  let cursor = 0;
  let match;

  const pushText = (text) => {
    const clean = decodeEntities(text);
    if (!clean) return;
    const { link, ...textStyle } = stack[stack.length - 1] || {};
    output.push(
      link ? (
        <Link key={output.length} src={link} style={textStyle}>
          {clean}
        </Link>
      ) : (
        <Text key={output.length} style={textStyle}>
          {clean}
        </Text>
      )
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
      if (tagName === "u" || tagName === "a") next.textDecoration = "underline";
      if (tagName === "s" || tagName === "strike") next.textDecoration = "line-through";
      if (tagName === "a") {
        const href = decodeEntities(tag.match(/\bhref=["']([^"']+)["']/i)?.[1] || "");
        if (/^(https?:\/\/|mailto:|tel:)/i.test(href)) next.link = href;
        next.color = "#2563eb";
      }
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
    .replace(/<div><br><\/div>/gi, "<p><br></p>")
    .replace(/<div/gi, "<p")
    .replace(/<\/div>/gi, "</p>")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");

  const blocks = [];
  const listRegex = /<(ol|ul)[^>]*>([\s\S]*?)<\/\1>/gi;
  let cursor = 0;
  let match;

  const pushParagraphs = (chunk) => {
    const paragraphRegex = /<p\b[^>]*>([\s\S]*?)<\/p>|<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/gi;
    let paragraphCursor = 0;
    let paragraphMatch;

    const pushLooseText = (text) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const withoutBreaks = trimmed.replace(/<br\s*\/?>/gi, "").trim();
      if (!stripTags(withoutBreaks) && /<br\s*\/?>/i.test(trimmed)) {
        const breakCount = (trimmed.match(/<br\s*\/?>/gi) || []).length;
        for (let index = 0; index < breakCount; index += 1) {
          blocks.push({ type: "spacer" });
        }
        return;
      }
      if (stripTags(trimmed)) blocks.push({ type: "p", html: trimmed });
    };

    while ((paragraphMatch = paragraphRegex.exec(chunk))) {
      pushLooseText(chunk.slice(paragraphCursor, paragraphMatch.index));
      const content = paragraphMatch[1] ?? paragraphMatch[2];
      blocks.push(stripTags(content) ? { type: "p", html: content.trim() } : { type: "spacer" });
      paragraphCursor = paragraphMatch.index + paragraphMatch[0].length;
    }

    pushLooseText(chunk.slice(paragraphCursor));
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

const getContentStyle = (style = {}) => {
  const contentStyle = { ...style };
  delete contentStyle.flex;
  delete contentStyle.flexBasis;
  delete contentStyle.flexGrow;
  delete contentStyle.flexShrink;
  delete contentStyle.marginTop;
  delete contentStyle.marginBottom;
  return contentStyle;
};

export default function PdfRichText({
  html,
  style,
  bulletStyle,
  itemStyle,
  plainTextAsBullets = false,
}) {
  const blocks = splitBlocks(normalizeDescriptionHtml(html, plainTextAsBullets));
  if (!blocks.length) return null;
  const contentStyle = getContentStyle(style);
  const fontSize = style?.fontSize || 10;
  const lineHeight =
    typeof style?.lineHeight === "number"
      ? fontSize * style.lineHeight
      : fontSize * 1.2;
  const paragraphGap = fontSize * 0.35;
  const listTopGap = fontSize * 0.25;
  const listBottomGap = fontSize * 0.5;

  return (
    <View style={{ marginTop: style?.marginTop, marginBottom: style?.marginBottom }}>
      {blocks.map((block, index) => {
        if (block.type === "spacer") {
          return <View key={index} style={{ height: lineHeight }} />;
        }

        if (block.type === "p") {
          return (
            <View
              key={index}
              style={{
                marginBottom:
                  index < blocks.length - 1 && blocks[index + 1].type !== "ul" && blocks[index + 1].type !== "ol"
                    ? paragraphGap
                    : 0,
              }}
            >
              <Text style={contentStyle}>{parseInline(block.html)}</Text>
            </View>
          );
        }

        return (
          <View
            key={index}
            style={{
              marginTop:
                index > 0 && blocks[index - 1].type === "p" ? 0 : listTopGap,
              marginBottom: listBottomGap,
            }}
          >
            {block.items.map((item, itemIndex) => {
              return (
                <View
                  key={itemIndex}
                  style={[
                    { flexDirection: "row", alignItems: "flex-start" },
                    itemStyle,
                  ]}
                >
                  <View
                    style={{
                      width: block.type === "ol" ? 22 : 12,
                      height: lineHeight,
                      flexShrink: 0,
                      paddingRight: 4,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {block.type === "ol" ? (
                      <Text
                        style={[
                          contentStyle,
                          bulletStyle,
                          {
                            flex: 0,
                            fontSize,
                            lineHeight: style?.lineHeight,
                            marginTop: 0,
                            marginRight: 0,
                          },
                        ]}
                      >
                        {`${itemIndex + 1}.`}
                      </Text>
                    ) : (
                      <View
                        style={{
                          width: 4,
                          height: 4,
                          borderRadius: 2,
                          marginTop: 2,
                          backgroundColor: bulletStyle?.color || style?.color || "#000000",
                        }}
                      />
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[contentStyle, { marginTop: 1 }]}>
                      {parseInline(item)}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        );
      })}
    </View>
  );
}
