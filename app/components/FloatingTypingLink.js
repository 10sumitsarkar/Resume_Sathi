"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FloatingTypingLink() {
  const pathname = usePathname();

  const hideOn =
    pathname === "/typing" ||
    pathname.startsWith("/typing/") ||
    pathname === "/resume" ||
    pathname.startsWith("/resume/");

  if (hideOn) return null;

  return (
    <Link
      prefetch={false}
      href="/typing/"
      className="rk-fixed-typing-link"
      aria-label="Start typing practice"
    >
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="2.5" y="6" width="19" height="12" rx="2.5" />
        <path d="M6.5 10h.01M10 10h.01M13.5 10h.01M17 10h.01M6.5 14h.01M10 14h4M17 14h.01" />
        <path d="M12 3v2M10.5 3.5 12 2l1.5 1.5" />
      </svg>

      <span>Typing Practice</span>
    </Link>
  );
}
