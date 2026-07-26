"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const TABS = [
  {
    href: "/typing",
    label: "Home",
    match: (p) => p === "/typing",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11.5 12 4l9 7.5" />
        <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
      </svg>
    ),
  },
  {
    href: "/typing/learn",
    label: "Learn",
    match: (p) => p.startsWith("/typing/learn"),
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    href: "/typing/practice",
    label: "Practice",
    match: (p) => p.startsWith("/typing/practice"),
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M7 16h10M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01" />
      </svg>
    ),
  },
  {
    href: "/typing/stats",
    label: "Stats",
    match: (p) => p.startsWith("/typing/stats"),
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="M7 15l4-5 3 3 5-7" />
      </svg>
    ),
  },
];

export default function TypingSubNav() {
  const pathname = usePathname() || "/typing";
  const router = useRouter();

  return (
    <div className="tf-subnav-wrap">
      <div className="container-fluid custom-container tf-subnav-row p-0 px-md-3">
        <button
          type="button"
          className="tf-subnav-back"
          aria-label="Go back"
          onClick={() => router.back()}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="tf-subnav-pill">
          {TABS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              prefetch={false}
              className={`tf-subnav-item ${t.match(pathname) ? "active" : ""}`}
            >
              {t.icon}
              {t.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
