"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import FooterNav from "../components/FooterNav";
import { getContentCacheUrl, resolveApiMediaUrl } from "../lib/apiConfig";
import "../../public/front-assets/css/home.css";

// ── SVG Icon Library ──────────────────────────────────────────────────────
const Icon = {
  IconFileZip: () => (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M12 14v1a1 1 0 0 0 1 1h0a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h0" />
    </svg>
  ),
  Shield: () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Zap: () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Download: () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  ArrowRight: () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  Eye: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  FileText: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  ClipboardCheck: () => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  Files: () => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" />
      <polyline points="15 2 15 8 21 8" />
      <path d="M9 18V12M9 12l-2 2M9 12l2 2" />
    </svg>
  ),
  Type: () => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="4 7 4 4 20 4 20 7" />
      <line x1="9" y1="20" x2="15" y2="20" />
      <line x1="12" y1="4" x2="12" y2="20" />
    </svg>
  ),
  Gradient: () => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="13.5" cy="6.5" r="2.5" />
      <circle cx="19" cy="17" r="2" />
      <circle cx="6" cy="17" r="3" />
      <path d="M6 17 Q13 6 19 17" />
    </svg>
  ),
  Code: () => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  Mail: () => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  MapPin: () => (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Calendar: () => (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Users: () => (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Lock: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  Sparkle: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l2.4 7.6H22l-6.4 4.6 2.4 7.6L12 17.2 6 21.8l2.4-7.6L2 9.6h7.6z" />
    </svg>
  ),
  ChevRight: () => (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  ChevDown: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  ChevLeft: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  ChevRightNav: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  Star: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  QuoteIcon: () => (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="currentColor"
      opacity="0.12"
    >
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>
  ),
  Check: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  CheckCircle: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  Rocket: () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  ),
};

const DEFAULT_JOB_IMAGE = "/front-assets/images/job-hero.webp";
const DEFAULT_BLOG_IMAGE = "/front-assets/images/blog-hero.webp";

function resolveMediaUrl(url, fallback = "") {
  return resolveApiMediaUrl(url, fallback);
}

function getSlug(item) {
  const raw = item?.slug || item?.url_name || item?.canonical_tag || "";
  let value = String(raw).trim().split("/").filter(Boolean).pop() || "";
  try {
    value = decodeURIComponent(value);
  } catch {
    // Use the source value if it contains malformed URI sequences.
  }
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getArticleTitle(item) {
  return (
    item?.article_title ||
    item?.title ||
    item?.meta_title ||
    item?.topic_name ||
    item?.name ||
    "Career Guide"
  );
}

function getArticleDescription(item) {
  return (
    item?.description ||
    item?.meta_description ||
    item?.short_description ||
    item?.summary ||
    "Discover practical resume, interview, and career advice for your next move."
  );
}

function getArticleCategory(item) {
  return (
    item?.category?.article_name ||
    item?.category?.course_name ||
    item?.category?.name ||
    item?.category?.title ||
    "Career Insights"
  );
}

function getJobTitle(item) {
  return (
    item?.title ||
    item?.topic_name ||
    item?.meta_title ||
    "Latest Job Opportunity"
  );
}

function getJobDescription(item) {
  return (
    item?.description ||
    item?.meta_description ||
    item?.short_description ||
    "Explore this opportunity and apply before the deadline."
  );
}

function getCompanyName(item) {
  return item?.company || item?.company_name || item?.organization || "";
}

function getLocation(item) {
  return item?.location || item?.city || item?.place || "India";
}

function getApplicationStart(item) {
  return (
    item?.application_begin ||
    item?.applicationStart ||
    item?.start_date ||
    item?.startDate ||
    item?.begin_date ||
    item?.date_start ||
    ""
  );
}

function getApplicationEnd(item) {
  return (
    item?.last_date_for_apply ||
    item?.lastDateForApply ||
    item?.deadline ||
    item?.apply_until ||
    item?.end_date ||
    item?.date_end ||
    item?.last_date ||
    ""
  );
}

// 👇 NAYA: expiry timestamp nikalne ke liye
function getJobExpiryTimestamp(item) {
  const endDate = getApplicationEnd(item);
  if (!endDate) return null;
  const d = new Date(endDate);
  return Number.isNaN(d.getTime()) ? null : d.getTime();
}

// 👇 NAYA: jaldi expire hone wali jobs pehle, already-expired jobs sabse last me
function sortJobsByExpiry(items) {
  const now = Date.now();
  return items.slice().sort((a, b) => {
    const aTime = getJobExpiryTimestamp(a);
    const bTime = getJobExpiryTimestamp(b);
    const aExpired = aTime !== null && aTime < now;
    const bExpired = bTime !== null && bTime < now;

    if (aExpired !== bExpired) return aExpired ? 1 : -1;

    if (aExpired && bExpired) {
      if (aTime === null) return 1;
      if (bTime === null) return -1;
      return bTime - aTime;
    }

    if (aTime === null && bTime === null) return 0;
    if (aTime === null) return 1;
    if (bTime === null) return -1;
    return aTime - bTime;
  });
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDay(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", { weekday: "long" });
}

// ── Owl Carousel loader + hook ────────────────────────────────────────────
// Loads jQuery + Owl Carousel from CDN once, then initializes on the given ref.
// This guarantees items never overflow/crop on any screen size, since Owl
// Carousel measures the real container width at runtime instead of using
// fixed pixel widths.
let owlAssetsPromise = null;

function loadOwlAssets() {
  if (typeof window === "undefined") return Promise.resolve();
  if (owlAssetsPromise) return owlAssetsPromise;

  owlAssetsPromise = new Promise((resolve) => {
    if (window.jQuery && window.jQuery.fn && window.jQuery.fn.owlCarousel) {
      resolve();
      return;
    }

    const ensureCss = (href) => {
      if (document.querySelector(`link[href="${href}"]`)) return;
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    };
    ensureCss(
      "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css",
    );
    ensureCss(
      "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.theme.default.min.css",
    );

    const loadScript = (src) =>
      new Promise((res) => {
        const existing = document.querySelector(`script[src="${src}"]`);
        if (existing) {
          if (existing.getAttribute("data-loaded") === "1") {
            res();
            return;
          }
          existing.addEventListener("load", () => res());
          return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => {
          script.setAttribute("data-loaded", "1");
          res();
        };
        document.body.appendChild(script);
      });

    loadScript(
      "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js",
    )
      .then(() =>
        loadScript(
          "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js",
        ),
      )
      .then(resolve);
  });

  return owlAssetsPromise;
}

function useOwlCarousel(ref, sourceRef, options, deps = []) {
  useEffect(() => {
    let cancelled = false;
    let $el = null;
    let carousel = null;

    const applyDotLabels = () => {
      const dotButtons = Array.from(document.querySelectorAll('.owl-dot'));
      dotButtons.forEach((button, index) => {
        const label = `Go to slide ${index + 1}`;
        button.setAttribute('aria-label', label);
        button.setAttribute('title', label);
        button.setAttribute('type', 'button');

        button.querySelectorAll('.rk-sr-only').forEach((node) => node.remove());
      });
    };

    loadOwlAssets().then(() => {
      if (cancelled || !ref.current || !sourceRef.current || !window.jQuery)
        return;
      const $ = window.jQuery;
      carousel = ref.current;
      // Owl is allowed to restructure only cloned nodes. React keeps ownership
      // of the hidden source, so route unmounts cannot clash with Owl's DOM API.
      carousel.replaceChildren(
        ...Array.from(sourceRef.current.children).map((child) =>
          child.cloneNode(true),
        ),
      );
      $el = $(carousel);
      if ($el.hasClass("owl-loaded")) {
        $el.trigger("destroy.owl.carousel");
        $el.removeClass("owl-loaded");
      }
      $el.owlCarousel(options);
      requestAnimationFrame(applyDotLabels);
      setTimeout(applyDotLabels, 100);
    });

    const observer = new MutationObserver(() => {
      applyDotLabels();
    });
    if (ref.current) {
      observer.observe(ref.current, { childList: true, subtree: true });
    }

    return () => {
      cancelled = true;
      observer.disconnect();
      if ($el && $el.hasClass && $el.hasClass("owl-loaded")) {
        $el.trigger("destroy.owl.carousel");
      }
      if (carousel) carousel.replaceChildren();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

// ── OwlSlider (used for Tools, Jobs, Blog, Testimonials) ──────────────────
function OwlSlider({
  children,
  options = {},
  className = "",
  ariaLabel = "carousel",
}) {
  const sourceRef = useRef(null);
  const carouselRef = useRef(null);
  const router = useRouter();
  const count = React.Children.count(children);
  const merged = {
    loop: false,
    margin: 20,
    nav: true,
    dots: true,
    autoplay: false,
    mouseDrag: true,
    touchDrag: true,
    smartSpeed: 400,
    stagePadding: 0,
    navText: [
      '<span class="rk-owl-arrow rk-owl-arrow--prev"></span>',
      '<span class="rk-owl-arrow rk-owl-arrow--next"></span>',
    ],
    responsive: {
      0: { items: 1 },
      768: { items: 2 },
      1024: { items: 3 },
    },
    ...options,
  };

  useOwlCarousel(carouselRef, sourceRef, merged, [count]);

  const handleCarouselClick = (event) => {
    const link = event.target.closest("a[href]");
    const href = link?.getAttribute("href");
    if (
      !href ||
      !href.startsWith("/") ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;

    event.preventDefault();
    router.push(href);
  };

  return (
    <div
      className={`rk-owl-host ${className}`}
      role="region"
      aria-label={ariaLabel}
      onClick={handleCarouselClick}
    >
      <div className="rk-owl-source" ref={sourceRef} aria-hidden="true">
        {children}
      </div>
      <div className="owl-carousel rk-owl" ref={carouselRef} />
    </div>
  );
}

// ── Resume Coverflow (A4 template preview carousel) ──────────────────────
const resumeShowcaseImages = [
  {
    src: "/front-assets/images/resume-img/resume-1.webp",
    label: "Modern Sidebar Resume",
  },
  {
    src: "/front-assets/images/resume-img/resume-2.webp",
    label: "Classic ATS Resume",
  },
  {
    src: "/front-assets/images/resume-img/resume-3.webp",
    label: "Executive Resume",
  },
  {
    src: "/front-assets/images/resume-img/resume-4.webp",
    label: "Bold Accent Resume",
  },
];

function ResumeCoverflow() {
  const [active, setActive] = useState(1);
  const timerRef = useRef(null);
  const count = resumeShowcaseImages.length;

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActive((a) => (a + 1) % count);
    }, 3200);
    return () => clearInterval(timerRef.current);
  }, [count]);

  const goTo = (i) => setActive(((i % count) + count) % count);

  return (
    <div className="rk-coverflow">
      <div className="rk-coverflow-stage">
        {resumeShowcaseImages.map((img, i) => {
          let offset = i - active;
          if (offset > count / 2) offset -= count;
          if (offset < -count / 2) offset += count;
          const abs = Math.abs(offset);
          if (abs > 2) return null;
          const translateX = offset * 42;
          const scale = offset === 0 ? 1 : abs === 1 ? 0.8 : 0.64;
          const rotateY = offset === 0 ? 0 : offset > 0 ? -18 : 18;
          const zIndex = 10 - abs;
          const opacity = abs > 2 ? 0 : 1 - abs * 0.28;

          return (
            <button
              type="button"
              key={img.src}
              className={`rk-cf-item${offset === 0 ? " rk-cf-item--active" : ""}`}
              style={{
                transform: `translate(-50%, -50%) translateX(${translateX}%) scale(${scale}) rotateY(${rotateY}deg)`,
                zIndex,
                opacity,
              }}
              onClick={() => goTo(i)}
              aria-label={`Show ${img.label}`}
            >
              <Image
                src={img.src}
                alt={`${img.label} — free ATS-friendly resume template preview A4 size`}
                width={640}
                height={480}
                className="rk-cf-img"
                loading="lazy"
                decoding="async"
              />
            </button>
          );
        })}
      </div>
      <div className="rk-cf-dots">
        {resumeShowcaseImages.map((img, i) => (
          <button
            type="button"
            key={img.src}
            className={`rk-dot${i === active ? " rk-dot--active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Go to ${img.label}`}
          />
        ))}
      </div>
    </div>
  );
}

// ── Daily Resume Counter (grows all day, resets to 0 at local midnight) ───
const DAILY_TARGET = 4300; // roughly how many "resumes" the counter reaches by end of day
const RATE_PER_SEC = DAILY_TARGET / 86400;

function useDailyResumeCounter() {
  const [count, setCount] = useState(0);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    let tickTimeout;
    let midnightTimeout;
    let cancelled = false;

    const secondsSinceMidnight = () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return (now - start) / 1000;
    };

    setCount(Math.max(0, Math.floor(secondsSinceMidnight() * RATE_PER_SEC)));

    const scheduleTick = () => {
      const delay = 3000 + Math.random() * 5000; // every 3-8s
      tickTimeout = setTimeout(() => {
        if (cancelled) return;
        const add = Math.floor(Math.random() * 3) + 1; // +1, +2, or +3
        setCount((c) => c + add);
        setFlash(true);
        setTimeout(() => setFlash(false), 500);
        scheduleTick();
      }, delay);
    };
    scheduleTick();

    const scheduleMidnightReset = () => {
      const now = new Date();
      const nextMidnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0,
        0,
        2,
      );
      midnightTimeout = setTimeout(() => {
        if (cancelled) return;
        setCount(0);
        scheduleMidnightReset();
      }, nextMidnight - now);
    };
    scheduleMidnightReset();

    return () => {
      cancelled = true;
      clearTimeout(tickTimeout);
      clearTimeout(midnightTimeout);
    };
  }, []);

  return { count, flash };
}

// ── Hero Image (simple, static) ───────────────────────────────────────────
function HeroVideo() {
  return (
    <div className="rk-hero-image-wrap">
      <video
        className="rk-hero-video"
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        poster="/front-assets/images/hero-poster.svg"
        controlsList="nodownload noplaybackrate"
        onContextMenu={(e) => e.preventDefault()}
      >
        <source
          src="/front-assets/images/hero-video-2.webm"
          type="video/webm"
        />
      </video>
      <div className="rk-float-badge rk-float-badge--tl">
        <div className="rk-fb-icon">
          <Icon.Lock />
        </div>
        <div>
          <div className="rk-fb-title">Data stays local</div>
          <div className="rk-fb-sub">No server. Ever.</div>
        </div>
      </div>
      <div className="rk-float-badge rk-float-badge--br">
        <Icon.Sparkle />
        <span>100% Free forever</span>
      </div>
    </div>
  );
}

// ── Template Mini Preview ─────────────────────────────────────────────────
function TemplateMini({ accent, bg }) {
  return (
    <div className="rk-tmini" style={{ "--ta": accent, "--tb": bg }}>
      <div className="rk-tmini-head">
        <div className="rk-tmini-av" />
        <div style={{ flex: 1 }}>
          <div className="rk-tmini-bar rk-tmini-bar--nm" />
          <div className="rk-tmini-bar" style={{ width: "42%" }} />
        </div>
      </div>
      <div className="rk-tmini-rule" />
      <div className="rk-tmini-body">
        <div className="rk-tmini-bar rk-tmini-bar--sec" />
        <div className="rk-tmini-bar" style={{ width: "92%" }} />
        <div className="rk-tmini-bar" style={{ width: "78%" }} />
        <div className="rk-tmini-bar" style={{ width: "86%" }} />
        <div
          className="rk-tmini-bar rk-tmini-bar--sec"
          style={{ marginTop: 8 }}
        />
        <div className="rk-tmini-bar" style={{ width: "68%" }} />
        <div className="rk-tmini-bar" style={{ width: "58%" }} />
      </div>
    </div>
  );
}

// ── Template Card ─────────────────────────────────────────────────────────
const templates = [
  {
    id: 1,
    name: "Classic",
    desc: "Single-column, ATS-safe. Best for corporate & govt roles.",
    accent: "#cc0000",
    bg: "#fff5f5",
    path: "/resume/templates/ResumeTemplate1",
    image: "/front-assets/images/resume-img/template1-preview.jpg",
  },
];

function TemplateCard({ tpl, className = "" }) {
  return (
    <Image
      src={tpl.image}
      alt={tpl.name}
      width={400}
      height={260}
      className="rk-template-img"
      loading="lazy"
    />
  );
}

function TemplateCarousel() {
  return (
    <div className="rk-template-single">
      {templates.map((tpl) => (
        <TemplateCard key={tpl.id} tpl={tpl} className="" />
      ))}
    </div>
  );
}

// ── Tools ─────────────────────────────────────────────────────────────────
const tools = [
  {
    icon: <Icon.ClipboardCheck />,
    name: "ATS Checker",
    desc: "Analyze your resume for ATS compatibility and keyword alignment.",
    href: "/tools/ats-checker",
  },
  {
    icon: <Icon.Files />,
    name: "Merge PDF",
    desc: "Combine multiple PDFs into one. Drag to reorder before merging.",
    href: "/tools/merge-pdf",
  },
  {
    icon: <Icon.Files />,
    name: "Split PDF",
    desc: "Split PDF pages into separate files and download them in a ZIP.",
    href: "/tools/split-pdf",
  },
  {
    icon: <Icon.Files />,
    name: "Remove PDF Pages",
    desc: "Delete unwanted PDF pages and reorder the pages you keep.",
    href: "/tools/pdf-remove",
  },
  {
    href: "/tools/pdf-compressor",
    icon: <Icon.IconFileZip />,
    name: "Compress PDF",
    desc: "Reduce file size for easy sharing on job portals.",
    tag: "PDF only",
  },
  {
    icon: <Icon.FileText />,
    name: "DOCX to PDF",
    desc: "Convert Word documents into simple PDF files in your browser.",
    href: "/tools/docx-to-pdf",
  },
  {
    icon: <Icon.Files />,
    name: "Image to PDF",
    desc: "Convert JPG and PNG images into one clean PDF.",
    href: "/tools/image-to-pdf",
  },
  {
    icon: <Icon.FileText />,
    name: "Signature Cropper",
    desc: "Crop and resize signatures for government forms.",
    href: "/tools/signature-cropper",
  },
  {
    icon: <Icon.Calendar />,
    name: "Age Calculator",
    desc: "Calculate exact age in years, months, days, and total days.",
    href: "/tools/age-calculator",
  }
];

// ── Why Free Comparison ────────────────────────────────────────────────
const comparisonRows = [
  {
    feature: "Price",
    us: "Always free, forever",
    others: "Free trial, then paid plans",
  },
  {
    feature: "Account / Signup",
    us: "Not required",
    others: "Signup usually required",
  },
  {
    feature: "PDF Download",
    us: "Unlimited, no watermark",
    others: "Often locked or watermarked",
  },
  {
    feature: "Your Data",
    us: "Stays only in your browser",
    others: "Uploaded to their server",
  },
  {
    feature: "Premium Templates",
    us: "Every template is free",
    others: "Best templates are paid",
  },
  {
    feature: "Hidden Charges",
    us: "None, ever",
    others: "Common at checkout/export",
  },
];

function WhyFreeSection() {
  return (
    <section className="rk-section rk-section--gray" id="why-free">
      <div className="container-fluid custom-container">
        <div className="rk-sec-head">
          <div className="rk-eyebrow">Why ResumeSathi</div>
          <h2 className="rk-sec-title fs-mob-24">Free means free. No catch.</h2>
          <p className="rk-sec-sub mx-auto fs-mob-14">
            A lot of "free" resume builders ask you to pay right when you hit
            download. We don't do that — every template and every download stays
            free, always.
          </p>
        </div>

        <div className="rk-compare-grid">
          {comparisonRows.map((row) => (
            <div className="rk-compare-card" key={row.feature}>
              <div className="rk-compare-feature">{row.feature}</div>
              <div className="rk-compare-side rk-compare-side--us">
                <span className="rk-compare-icon rk-compare-icon--yes">
                  <Icon.Check />
                </span>
                <div>
                  <div className="rk-compare-tag">ResumeSathi</div>
                  <div className="rk-compare-value">{row.us}</div>
                </div>
              </div>
              <div className="rk-compare-side rk-compare-side--them">
                <span className="rk-compare-icon rk-compare-icon--no">✕</span>
                <div>
                  <div className="rk-compare-tag">Most Others</div>
                  <div className="rk-compare-value">{row.others}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rk-resume-showcase-cta">
          <Link
            prefetch={false}
            href="/resume/resume-type"
            className="rk-btn rk-btn--primary rk-btn--lg"
          >
            Build My Resume <Icon.ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Jobs ─────────────────────────────────────────────────────────────────
function TypingPromo() {
  return (
    <section className="rk-typing-promo" id="typing-practice">
      <div className="container-fluid custom-container">
        <div className="rk-typing-promo-card">
          <div className="rk-typing-copy">
            <div className="rk-typing-label">
              <Icon.Zap /> Free typing practice
            </div>
            <h2 className="rk-typing-title fs-mob-24">
              Type faster. Apply with confidence.
            </h2>
            <p className="rk-typing-text fs-mob-14">
              Build speed and accuracy with guided lessons, focused practice,
              and progress tracking—right in your browser.
            </p>
            <div className="rk-typing-points">
              <span>
                <Icon.CheckCircle /> Guided lessons
              </span>
              <span>
                <Icon.CheckCircle /> Live WPM tracking
              </span>
              <span>
                <Icon.CheckCircle /> No signup needed
              </span>
            </div>
            <Link
              prefetch={false}
              href="/typing"
              className="rk-btn rk-typing-button"
            >
              Start typing practice <Icon.ArrowRight />
            </Link>
          </div>

          <div className="rk-typing-visual" aria-hidden="true">
            <div className="rk-typing-speed">
              62 <span>WPM</span>
            </div>
            <div className="rk-typing-progress">
              <span />
            </div>
            <div className="rk-keyboard">
              {[
                "Q W E R T Y U I O P",
                "A S D F G H J K L",
                "Z X C V B N M",
              ].map((row) => (
                <div className="rk-key-row" key={row}>
                  {row.split(" ").map((key) => (
                    <span key={key}>{key}</span>
                  ))}
                </div>
              ))}
              <div className="rk-key-row rk-key-row--space">
                <span>SPACE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function JobCard({ job, href }) {
  const startDate = getApplicationStart(job);
  const endDate = getApplicationEnd(job);
  const companyName = getCompanyName(job);
  const imageUrl = resolveMediaUrl(
    job.hero_image || job.image,
    DEFAULT_JOB_IMAGE,
  );
  const today = new Date();
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;
  const status =
    !start && !end
      ? "Awaited"
      : start && end && today < start
        ? "Upcoming"
        : end && today > end
          ? "Closed"
          : "Open";
  return (
    <div className="rk-jc h-100">
      <div className="rk-jc-thumb">
        {companyName ? <span className="rk-jc-org">{companyName}</span> : null}
        <Image
          src={imageUrl}
          alt={getJobTitle(job)}
          width={640}
          height={380}
          className="rk-bc-img"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.currentTarget.src = DEFAULT_JOB_IMAGE;
          }}
        />
        <span className={`rk-jc-badge rk-jc-badge--${status.toLowerCase()}`}>
          {status}
        </span>
      </div>
      <div className="rk-jc-title">{getJobTitle(job)}</div>
      <p className="rk-jc-desc">{getJobDescription(job)}</p>
      <div className="rk-jc-meta rk-jc-meta-split">
        {startDate ? (
          <div className="rk-jc-meta-block rk-jc-meta-block-left">
            <span className="rk-jc-meta-label">Start date</span>
            <span className="rk-jc-meta-date">{formatDate(startDate)}</span>
            <span className="rk-jc-meta-day">{formatDay(startDate)}</span>
          </div>
        ) : (
          <div className="rk-jc-meta-block rk-jc-meta-block-left">
            <span className="rk-jc-meta-label">Start date</span>
            <span className="rk-jc-meta-date">TBA</span>
          </div>
        )}
        {endDate ? (
          <div className="rk-jc-meta-block rk-jc-meta-block-right">
            <span className="rk-jc-meta-label">End date</span>
            <span className="rk-jc-meta-date">{formatDate(endDate)}</span>
            <span className="rk-jc-meta-day">{formatDay(endDate)}</span>
          </div>
        ) : (
          <div className="rk-jc-meta-block rk-jc-meta-block-right">
            <span className="rk-jc-meta-label">End date</span>
            <span className="rk-jc-meta-date">TBA</span>
          </div>
        )}
      </div>
      <div className="rk-jc-actions">
        <Link
          prefetch={false}
          href={href}
          className="rk-jc-apply rk-btn rk-btn--primary rk-btn--sm"
        >
          Apply now <Icon.ChevRight />
        </Link>
      </div>
    </div>
  );
}

// ── Blog ──────────────────────────────────────────────────────────────────
function BlogCard({ blog, href }) {
  const imageUrl = resolveMediaUrl(
    blog.hero_image || blog.image || blog.img,
    DEFAULT_BLOG_IMAGE,
  );
  const title = getArticleTitle(blog);
  const description = getArticleDescription(blog);
  const category = getArticleCategory(blog);
  const publishedDate = blog.created_at || blog.date || "";

  return (
    <article className="rk-bc h-100">
      <div className="rk-bc-thumb">
        <Image
          src={imageUrl}
          alt={title}
          width={640}
          height={380}
          className="rk-bc-img"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.currentTarget.src = DEFAULT_BLOG_IMAGE;
          }}
        />
        <span className="rk-bc-cat">{category}</span>
      </div>
      <div className="rk-bc-body">
        <h3 className="rk-bc-title">{title}</h3>
        <p className="rk-bc-desc">{description}</p>
      </div>
      <div className="rk-bc-foot">
        <span className="rk-bc-date">
          <Icon.Calendar />{" "}
          {publishedDate ? formatDate(publishedDate) : "Updated recently"}
        </span>
        <Link
          prefetch={false}
          href={href}
          className="rk-bc-read"
          aria-label={`Read more about ${title}`}
        >
          Read full article <Icon.ArrowRight />
        </Link>
      </div>
    </article>
  );
}

// ── Testimonials — 2 per screen ───────────────────────────────────────────
const testimonials = [
  {
    name: "Priya Sharma",
    role: "Software Engineer, MNC",
    avatar: "PS",
    text: "ResumeSathi completely transformed my resume. I used Template 2 and got an interview call within three days. Knowing my data stays local made me feel completely safe.",
    rating: 5,
  },
  {
    name: "Rahul Verma",
    role: "SSC CGL Qualifier, Delhi",
    avatar: "RV",
    text: "I used the Classic template for SSC CGL. It was incredibly clean and professional. The examiner even complimented my resume. Highly recommend!",
    rating: 5,
  },
  {
    name: "Ananya Singh",
    role: "UX Designer, Bengaluru",
    avatar: "AS",
    text: "Bold Accent template was perfect for my field. No signup, no data upload — that's what I loved most. Free and premium quality at the same time.",
    rating: 5,
  },
  {
    name: "Karan Mehta",
    role: "Product Manager, Pune",
    avatar: "KM",
    text: "I tried three different templates before finding the perfect match. The ATS Checker helped me fine-tune it further. My resume finally feels complete.",
    rating: 5,
  },
  {
    name: "Deepika Nair",
    role: "Bank PO, SBI",
    avatar: "DN",
    text: "Found this site while preparing for IBPS PO. Built my resume and checked job vacancies all in one place — incredibly convenient.",
    rating: 5,
  },
  {
    name: "Arjun Patel",
    role: "Civil Engineer, Ahmedabad",
    avatar: "AP",
    text: "Created my resume with the Executive template. The output was so polished that the interviewer asked if I had it professionally made. Amazing quality for free!",
    rating: 5,
  },
];

function TestimonialCarousel() {
  return (
    <OwlSlider
      ariaLabel="Customer testimonials"
      options={{
        margin: 24,
        responsive: {
          0: { items: 1 },
          768: { items: 2 },
        },
      }}
    >
      {testimonials.map((t, i) => (
        <div key={i} className="item">
          <div className="rk-tcard">
            <div className="rk-tcard-quote">
              <Icon.QuoteIcon />
            </div>
            <p className="rk-tcard-text">&quot;{t.text}&quot;</p>
            <div className="rk-tcard-stars">
              {Array(t.rating)
                .fill(0)
                .map((_, s) => (
                  <Icon.Star key={s} />
                ))}
            </div>
            <div className="rk-tcard-author">
              <div className="rk-tcard-av">{t.avatar}</div>
              <div>
                <div className="rk-tcard-name">{t.name}</div>
                <div className="rk-tcard-role">{t.role}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </OwlSlider>
  );
}

// ── Companies ─────────────────────────────────────────────────────────────
const companies = [
  { name: "Infosys", logo: "/front-assets/images/companies/infosys.svg" },
  { name: "TCS", logo: "/front-assets/images/companies/tcs.svg" },
  { name: "Wipro", logo: "/front-assets/images/companies/wipro.svg" },
  { name: "HDFC Bank", logo: "/front-assets/images/companies/hdfc-bank.svg" },
  { name: "Zomato", logo: "/front-assets/images/companies/zomato.svg" },
];

// ── FAQ ───────────────────────────────────────────────────────────────────
const faqs = [
  {
    q: "Is ResumeSathi completely free?",
    a: "Yes, ResumeSathi is 100% free and always will be. No hidden charges, no premium plans. All templates and all tools are completely free.",
  },
  {
    q: "Where is my data saved?",
    a: "Your data is saved only in your browser's localStorage. No server, no database, no account required. Your data stays safe on your device until you choose to clear it.",
  },
  {
    q: "Do I need to create an account to build a resume?",
    a: "Absolutely not. No signup, no login, no email verification. Simply choose a template, fill in your details, and download. That's it.",
  },
  {
    q: "How do I download my resume as a PDF?",
    a: "Once you complete your resume, click the 'Download PDF' button. The browser print dialog will open — select 'Save as PDF' to save it to your device. No extra software needed.",
  },
  {
    q: "Can I use more than one template at the same time?",
    a: "Yes. Each template works independently. You can create separate resumes in multiple templates and all data is stored under different localStorage keys.",
  },
];

function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <>
      <div className="rk-faq-list">
        {faqs.map((f, i) => (
          <div
            key={i}
            className={`rk-faq-item${open === i ? " rk-faq-item--open" : ""}`}
          >
            <button
              className="rk-faq-q"
              onClick={() => setOpen(open === i ? null : i)}
            >
              <span>{f.q}</span>
              <span
                className={`rk-faq-icon${open === i ? " rk-faq-icon--open" : ""}`}
              >
                <Icon.ChevDown />
              </span>
            </button>
            <div className="rk-faq-a-wrap">
              <p className="rk-faq-a">{f.a}</p>
            </div>
          </div>
        ))}
      </div>
      <FooterNav />
    </>
  );
}

// ── Root Component ────────────────────────────────────────────────────────
export default function ResumeListClient({
  initialJobs = [],
  initialBlogs = [],
}) {
  const [jobs, setJobs] = useState(() => sortJobsByExpiry(initialJobs));
  const [blogs, setBlogs] = useState(initialBlogs);
  const { count: dailyCount, flash: dailyFlash } = useDailyResumeCounter();
  const skippedInitialFetch = useRef(false);

  useEffect(() => {
    // 👇 SSR se already jobs/blogs data mil chuka hai to pehla client
    // fetch skip karo — taaki Googlebot ke render mein good data
    // overwrite/empty na ho agar API robots.txt se blocked ho.
    if (!skippedInitialFetch.current) {
      skippedInitialFetch.current = true;
      if (initialJobs.length > 0 && initialBlogs.length > 0) {
        return;
      }
    }

    const fetchData = async () => {
      try {
        const [jobsResponse, articlesResponse] = await Promise.all([
          fetch(`${getContentCacheUrl('jobs.json')}?v=${Date.now()}`, { cache: 'no-store' }),
          fetch(`${getContentCacheUrl('articles.json')}?v=${Date.now()}`, { cache: 'no-store' }),
        ]);

        const jobsData = jobsResponse.ok ? await jobsResponse.json() : [];
        const articlesData = articlesResponse.ok
          ? await articlesResponse.json()
          : [];

        const normalizedJobs = Array.isArray(jobsData)
          ? jobsData
          : jobsData.items || jobsData.results || [];
        const normalizedArticles = Array.isArray(articlesData)
          ? articlesData
          : articlesData.items || articlesData.results || [];

        setJobs(sortJobsByExpiry(normalizedJobs).slice(0, 6));
        setBlogs(normalizedArticles.slice(0, 6));
      } catch (error) {
        console.error("Failed to load homepage content", error);
        // 👇 SSR data already hai to khaali mat karo
      }
    };

    fetchData();
  }, []);

  return (
    <div className="rk-root">
      <NavBar />

      <section className="rk-hero">
        <div className="container-fluid custom-container">
          <div className="row g-4">
            <div className="col-lg-6 col-md-10 mx-auto hero-left-part">
              <div className="rk-hero-badge">
                <span className="rk-hero-badge-dot" />
                No signup · Always free · 100% local
              </div>
              <h1 className="rk-hero-title fs-mob-32">
                Build your{" "}
                <span className="rk-hero-hl">ATS-friendly resume </span>
                in minutes
              </h1>
              <p className="rk-hero-sub fs-mob-14">
                Create professional resumes, cover letters, and job-ready
                documents for free with simple tools and clean resume templates.
              </p>

              <div className="rk-local-box">
                <div className="rk-local-box-icon">
                  <Icon.Lock />
                </div>
                <div>
                  <div className="rk-local-box-title fs-mob-14">
                    Your data stays private
                  </div>
                  <div className="rk-local-box-sub fs-mob-12">
                    Everything is saved in your browser. No account, no server,
                    and no sharing needed.
                  </div>
                </div>
              </div>

              <div className="rk-hero-actions">
                <Link
                  prefetch={false}
                  href="/resume/resume-type"
                  className="rk-btn rk-btn--primary rk-btn--lg"
                >
                  Choose a Template <Icon.ArrowRight />
                </Link>
                <Link
                  prefetch={false}
                  href="/tools"
                  className="rk-btn rk-btn--outline rk-btn--lg"
                >
                  Explore Tools
                </Link>
              </div>

              <div className="rk-trust-row">
                {[
                  { i: <Icon.Shield />, t: "100% Private" },
                  { i: <Icon.Zap />, t: "Ready in 5 min" },
                  { i: <Icon.Download />, t: "PDF Download" },
                ].map(({ i, t }) => (
                  <div key={t} className="rk-trust-chip">
                    {i}
                    {t}
                  </div>
                ))}
              </div>
            </div>

            <div className="col-lg-6 d-none d-lg-block">
              <HeroVideo />
            </div>
          </div>
        </div>
      </section>

      <section className="rk-stats-section">
        <div className="container-fluid custom-container">
          <div className="rk-stats-flex">
            <div className="rk-live-highlight">
              <span className="rk-live-highlight-dot" />
              <span
                className={`rk-live-highlight-num${dailyFlash ? " rk-live-flash" : ""}`}
              >
                {dailyCount.toLocaleString("en-IN")}
              </span>
              <span className="rk-live-highlight-label">
                resumes created today — join them
              </span>
            </div>

            <div className="rk-stats-simple-divider" />

            <div className="rk-stats-simple">
              {[
                { icon: <Icon.FileText />, n: "ATS", l: "Ready Templates" },
                { icon: <Icon.Lock />, n: "₹0", l: "Forever Free" },
                { icon: <Icon.Shield />, n: "100%", l: "Privacy Guaranteed" },
              ].map(({ icon, n, l }) => (
                <div key={l} className="rk-stat-simple">
                  <span className="rk-stat-simple-icon">{icon}</span>
                  <span className="rk-stat-simple-num">{n}</span>
                  <span className="rk-stat-simple-label">{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rk-resume-showcase" id="resume-preview">
        <div className="container-fluid custom-container">
          <div className="rk-sec-head">
            <div className="rk-eyebrow">Your Resume, Ready to Impress</div>
            <h2 className="rk-sec-title fs-mob-24">
              See your resume come to life
            </h2>
            <p className="rk-sec-sub mx-auto fs-mob-14">
              Every ResumeSathi resume is formatted for A4 print, ATS-friendly,
              and built without ever sending your data anywhere.
            </p>
          </div>
          <ResumeCoverflow />
          <div className="rk-resume-showcase-cta">
            <Link
              prefetch={false}
              href="/resume/resume-type"
              className="rk-btn rk-btn--primary rk-btn--lg"
            >
              Get Started <Icon.ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      <section className="rk-section rk-section--white" id="templates">
        <div className="container-fluid custom-container">
          <div className="rk-sec-head-row">
            <div>
              <div className="rk-eyebrow">Career Tools</div>
              <h2 className="rk-sec-title fs-mob-24">
                Free tools for better job applications
              </h2>
              <p className="rk-sec-sub fs-mob-14">
                Use ATS checker, PDF tools, and simple resume helpers to improve
                your applications and save time.
              </p>
            </div>
            <Link
              prefetch={false}
              href="/tools"
              className="rk-btn rk-btn--outline rk-btn--sm"
            >
              All tools <Icon.ArrowRight />
            </Link>
          </div>

          <OwlSlider
            ariaLabel="Free career tools"
            options={{
              responsive: {
                0: { items: 1 },
                576: { items: 2 },
                767: { items: 3 },
                1200: { items: 4 },
              },
            }}
          >
            {tools.map((tool) => (
              <div key={tool.name} className="item">
                <Link
                  prefetch={false}
                  href={tool.href}
                  className="rk-tool-card"
                >
                  <div className="rk-tool-icon">{tool.icon}</div>
                  <div className="rk-tool-name">{tool.name}</div>
                  <div className="rk-tool-desc">{tool.desc}</div>
                  <div className="rk-tool-link">
                    Open tool <Icon.ArrowRight />
                  </div>
                </Link>
              </div>
            ))}
          </OwlSlider>
        </div>
      </section>

      <section className="rk-hired-at">
        <div className="container-fluid custom-container">
          <div className="rk-hired-label">
            Our candidates have been hired at
          </div>
          <div className="rk-hired-logos">
            {companies.map((c) => (
              <div key={c.name} className="rk-hired-logo">
                <Image
                  src={c.logo}
                  alt={`${c.name} logo`}
                  width={120}
                  height={34}
                  className="rk-hired-logo-img img-fluid"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    if (e.currentTarget.nextSibling)
                      e.currentTarget.nextSibling.style.display = "inline-block";
                  }}
                />
                <span
                  className="rk-hired-logo-fallback"
                  style={{ display: "none" }}
                >
                  {c.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <WhyFreeSection />
      <TypingPromo />
      <section className="rk-section rk-section--white" id="jobs">
        <div className="container-fluid custom-container">
          <div className="rk-sec-head-row">
            <div>
              <div className="rk-eyebrow">Jobs</div>
              <h2 className="rk-sec-title fs-mob-24">
                Latest job openings for job seekers
              </h2>
              <p className="rk-sec-sub fs-mob-14">
                Find fresh opportunities, check deadlines, and apply with a
                stronger resume.
              </p>
            </div>
            <Link
              prefetch={false}
              href="/jobs"
              className="rk-btn rk-btn--outline rk-btn--sm"
            >
              All jobs <Icon.ArrowRight />
            </Link>
          </div>
          {jobs.length > 0 ? (
            <OwlSlider ariaLabel="Latest job openings">
              {jobs.slice(0, 6).map((j) => (
                <div key={j.id || getSlug(j)} className="item">
                  <JobCard job={j} href={`/jobs/${getSlug(j)}`} />
                </div>
              ))}
            </OwlSlider>
          ) : (
            <p className="rk-sec-sub">Loading latest job openings...</p>
          )}
        </div>
      </section>

      <section className="rk-section rk-section--gray" id="testimonials">
        <div className="container-fluid custom-container">
          <div className="rk-sec-head">
            <div className="rk-eyebrow">Testimonials</div>
            <h2 className="rk-sec-title fs-mob-24">
              Trusted by thousands of job seekers
            </h2>
            <p className="rk-sec-sub mx-auto fs-mob-14">
              Real stories from people who built their resumes on ResumeSathi
              and landed their dream jobs.
            </p>
          </div>
          <TestimonialCarousel />
        </div>
      </section>

      <section className="rk-section rk-section--white" id="blog">
        <div className="container-fluid custom-container">
          <div className="rk-sec-head-row">
            <div>
              <div className="rk-eyebrow">Career Blog</div>
              <h2 className="rk-sec-title fs-mob-24">
                Resume tips and career guidance
              </h2>
            </div>
            <Link
              prefetch={false}
              href="/blog"
              className="rk-btn rk-btn--outline rk-btn--sm"
            >
              All articles <Icon.ArrowRight />
            </Link>
          </div>
          {blogs.length > 0 ? (
            <OwlSlider ariaLabel="Career blog articles">
              {blogs.map((b) => (
                <div key={b.id || getSlug(b)} className="item">
                  <BlogCard blog={b} href={`/blog/${getSlug(b)}`} />
                </div>
              ))}
            </OwlSlider>
          ) : (
            <p className="rk-sec-sub">Loading latest career articles...</p>
          )}
        </div>
      </section>

      <section className="rk-section rk-section--gray" id="faq">
        <div className="container-fluid custom-container rk-faq-wrap">
          <div className="rk-faq-left">
            <div className="rk-eyebrow">FAQ</div>
            <h2 className="rk-sec-title fs-mob-24">
              Frequently asked
              <br />
              questions
            </h2>
            <p className="rk-sec-sub fs-mob-14">
              Have more questions? Contact us — we are here to help.
            </p>
            <Link
              prefetch={false}
              href="/contact"
              className="rk-btn rk-btn--primary rk-btn--sm"
              style={{ marginTop: 24 }}
            >
              Contact us <Icon.ArrowRight />
            </Link>
          </div>
          <div className="rk-faq-right">
            <FAQ />
          </div>
        </div>
      </section>

      <section className="rk-cta" id="cta">
        <div className="rk-cta-bg-text" aria-hidden="true">
          <svg viewBox="0 0 260 120" role="img" aria-label="FREE">
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="currentColor">
              FREE
            </text>
          </svg>
        </div>

        <div className="container-fluid custom-container rk-cta-inner">
          <div className="rk-cta-content">
            <div className="rk-cta-badge">
              <Icon.Sparkle /> No signup required · Always free
            </div>

            <h2 className="rk-cta-title fs-mob-28">
              Build your resume today.
              <br />
              It&apos;s 100% free.
            </h2>

            <p className="rk-cta-sub fs-mob-14">
              Join thousands of job seekers who built professional resumes on
              ResumeSathi (Resume Maker). No account, no fee, no compromise on quality.
            </p>

            <div className="rk-cta-actions">
              <Link
                prefetch={false}
                href="/resume/resume-type"
                className="rk-cta-btn-primary"
              >
                Choose a Template <Icon.ArrowRight />
              </Link>
              <Link prefetch={false} href="/tools" className="rk-cta-btn-ghost">
                <Icon.Rocket /> Explore Free Tools
              </Link>
            </div>

            <p className="rk-cta-footnote">
              <Icon.Lock /> No data leaves your device · 100% local ·
              ATS-optimized templates
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
