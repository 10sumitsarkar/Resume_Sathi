const OG_IMAGE = "/front-assets/images/og/home-og.png";

export function typingMetadata({ title, description, path, keywords = [] }) {
  return {
    title,
    description,
    keywords: ["typing practice", "typing test", "learn touch typing", "typing speed test", "free typing tutor", ...keywords],
    alternates: { canonical: path },
    robots: { index: true, follow: true },
    openGraph: { title, description, url: path, type: "website", siteName: "ResumeSathi", images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "ResumeSathi free typing practice" }] },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE] },
  };
}

export function TypingJsonLd({ name, description, path }) {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_FRONTEND_URL || "https://www.resumesathi.com").replace(/\/$/, "");
  const data = { "@context": "https://schema.org", "@type": "WebApplication", name, description, url: `${siteUrl}${path}`, applicationCategory: "EducationalApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "INR" }, image: `${siteUrl}${OG_IMAGE}`, publisher: { "@type": "Organization", name: "ResumeSathi", url: siteUrl } };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
