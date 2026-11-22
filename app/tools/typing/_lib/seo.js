import Link from "next/link";
import JsonLd from "../../../components/JsonLd";
import { DEFAULT_SITE_BASE, withTrailingSlash } from "../../../lib/apiConfig";

const OG_IMAGE = "/front-assets/images/og/home-og.webp";
const SITE_URL = DEFAULT_SITE_BASE.replace(/\/+$/, "");
const TYPING_HOME = "/tools/typing/";

export function typingMetadata({ title, description, path }) {
  return {
    title,
    description,
    alternates: { canonical: withTrailingSlash(path) },
    openGraph: {
      title,
      description,
      url: path,
      type: "website",
      siteName: "ResumeSathi",
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "ResumeSathi free typing practice" }],
    },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE] },
  };
}

function getBreadcrumbItems(path, currentName) {
  const normalizedPath = withTrailingSlash(path);
  const items = [
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools/" },
  ];

  if (normalizedPath !== TYPING_HOME) {
    items.push({ name: "Typing Practice", path: TYPING_HOME });
  }

  if (normalizedPath.includes("/learn/lesson/")) {
    items.push({ name: "Learn", path: "/tools/typing/learn/" });
  } else if (normalizedPath !== TYPING_HOME) {
    const sectionNames = {
      "/tools/typing/learn/": "Learn",
      "/tools/typing/practice/": "Practice",
      "/tools/typing/stats/": "Stats",
    };
    const sectionName = sectionNames[normalizedPath];
    if (sectionName) return [...items, { name: sectionName, path: normalizedPath }];
  }

  return [...items, { name: currentName, path: normalizedPath }];
}

export function TypingJsonLd({ name, description, path, breadcrumbName = name }) {
  const breadcrumbItems = getBreadcrumbItems(path, breadcrumbName);
  const normalizedPath = withTrailingSlash(path);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebApplication",
              name,
              description,
              url: `${SITE_URL}${normalizedPath}`,
              applicationCategory: "EducationalApplication",
              operatingSystem: "Web",
              offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
              image: `${SITE_URL}${OG_IMAGE}`,
              publisher: { "@type": "Organization", name: "ResumeSathi", url: SITE_URL },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: breadcrumbItems.map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: item.name,
                item: `${SITE_URL}${item.path}`,
              })),
            },
          ],
        }}
      />
      <nav className="tf-breadcrumb container-fluid custom-container" aria-label="Breadcrumb">
        <ol>
          {breadcrumbItems.map((item, index) => (
            <li
              key={`${item.path}-${index}`}
              aria-current={index === breadcrumbItems.length - 1 ? "page" : undefined}
            >
              {index === breadcrumbItems.length - 1 ? (
                <span>{item.name}</span>
              ) : (
                <Link href={item.path}>{item.name}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
