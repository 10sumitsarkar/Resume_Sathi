"use client";

/**
 * Single stroke-based icon set for the ID Card Maker.
 * Every icon inherits `currentColor`, so theme colors apply automatically.
 */

const PATHS = {
  /* ---- left rail / editor ---- */
  templates: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <path d="M3 9h18M9 9v11" />
    </>
  ),
  elements: (
    <>
      <rect x="3" y="3" width="8" height="8" rx="1.8" />
      <circle cx="17" cy="7" r="4" />
      <path d="M7 13.5 11 21H3z" />
      <path d="M14 15h7" />
    </>
  ),
  text: (
    <>
      <path d="M5 6.5V5h14v1.5M12 5v14M9 19h6" />
    </>
  ),
  brand: (
    <>
      <path d="M12 3a9 9 0 0 0 0 18c1.3 0 2-.8 2-1.7 0-1.4-1-1.6-1-2.6 0-.8.7-1.4 1.6-1.4H17a4 4 0 0 0 4-4c0-4.6-4-8.3-9-8.3z" />
      <circle cx="7.5" cy="11" r="1.1" />
      <circle cx="11" cy="7.5" r="1.1" />
      <circle cx="15.5" cy="9" r="1.1" />
    </>
  ),
  uploads: (
    <>
      <path d="M12 16V4m0 0-4 4m4-4 4 4" />
      <path d="M4 15v3.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V15" />
    </>
  ),
  properties: (
    <>
      <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
      <circle cx="16" cy="7" r="2.2" />
      <circle cx="10" cy="17" r="2.2" />
    </>
  ),

  /* ---- shapes ---- */
  rectangle: <rect x="3.5" y="6" width="17" height="12" rx="2" />,
  circle: <circle cx="12" cy="12" r="7.5" />,
  pill: <rect x="2.5" y="8" width="19" height="8" rx="4" />,
  line: <path d="M3 12h18" />,
  triangle: <path d="M12 5.5 20 18.5H4z" />,
  star: (
    <path d="m12 4 2.3 4.9 5.2.7-3.8 3.7.9 5.3-4.6-2.6-4.6 2.6.9-5.3L4.5 9.6l5.2-.7z" />
  ),

  /* ---- categories ---- */
  all: (
    <>
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.6" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.6" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.6" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.6" />
    </>
  ),
  school: (
    <>
      <path d="m12 4 9 4.5-9 4.5-9-4.5z" />
      <path d="M6.5 10.8V16c0 1.6 2.5 3 5.5 3s5.5-1.4 5.5-3v-5.2" />
      <path d="M21 8.5v5" />
    </>
  ),
  college: (
    <>
      <path d="M4 20V9.5L12 5l8 4.5V20" />
      <path d="M2.5 20h19" />
      <path d="M9.5 20v-5h5v5" />
      <circle cx="12" cy="10.5" r="1.2" />
    </>
  ),
  employee: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2.4" />
      <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" />
      <path d="M3 12.5h18" />
    </>
  ),
  visitor: (
    <>
      <circle cx="10" cy="8.5" r="3.2" />
      <path d="M4 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" />
      <path d="M17.5 8h5M20 5.5v5" />
    </>
  ),
  event: (
    <>
      <path d="M3 9.5V7.5A1.5 1.5 0 0 1 4.5 6h15A1.5 1.5 0 0 1 21 7.5v2a2.5 2.5 0 0 0 0 5v2a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 16.5v-2a2.5 2.5 0 0 0 0-5z" />
      <path d="M13 6v12" strokeDasharray="2 2.5" />
    </>
  ),
  medical: (
    <>
      <path d="M6 3v5a4.5 4.5 0 0 0 9 0V3" />
      <path d="M6 3H4.5M15 3h1.5" />
      <path d="M10.5 12.4V15a4.5 4.5 0 0 0 9 0v-1.2" />
      <circle cx="19.5" cy="11.5" r="2" />
    </>
  ),
  press: (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0" />
      <path d="M12 18v3M9 21h6" />
    </>
  ),
  gym: (
    <>
      <path d="M3 9.5v5M6.5 7v10M17.5 7v10M21 9.5v5" />
      <path d="M6.5 12h11" />
    </>
  ),
  volunteer: (
    <>
      <path d="M12 20s-7-4.4-7-9.2A3.9 3.9 0 0 1 12 8.4a3.9 3.9 0 0 1 7 2.4c0 4.8-7 9.2-7 9.2z" />
    </>
  ),
  blank: <path d="M12 5v14M5 12h14" />,

  /* ---- landing / feature ---- */
  bolt: <path d="M13 3 5.5 13.5H11l-1 7.5L18.5 10H13z" />,
  shield: (
    <>
      <path d="M12 3.5 5 6.2v5.1c0 4.2 2.9 7.6 7 9.2 4.1-1.6 7-5 7-9.2V6.2z" />
      <path d="m9.2 12 2 2 3.6-3.8" />
    </>
  ),
  download: (
    <>
      <path d="M12 4v10m0 0 3.5-3.5M12 14l-3.5-3.5" />
      <path d="M5 17v1.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V17" />
    </>
  ),
  mobile: (
    <>
      <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
      <path d="M10.5 18.5h3" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 8.5 4.5L12 12 3.5 7.5z" />
      <path d="m3.5 12.5 8.5 4.5 8.5-4.5" />
    </>
  ),
  flip: (
    <>
      <rect x="2.5" y="6" width="12" height="14" rx="2.2" />
      <path d="M8 4.5h11A2.5 2.5 0 0 1 21.5 7v10" />
      <path d="M5.5 11h6M5.5 15h4" />
    </>
  ),
  cursor: (
    <>
      <path d="M6 3.5 18 11l-5.2 1.4L10.6 18z" />
      <path d="m13.5 14 4.5 5" />
    </>
  ),
  qr: (
    <>
      <rect x="3.5" y="3.5" width="6.5" height="6.5" rx="1.4" />
      <rect x="14" y="3.5" width="6.5" height="6.5" rx="1.4" />
      <rect x="3.5" y="14" width="6.5" height="6.5" rx="1.4" />
      <path d="M14 14h3v3h-3zM20.5 14v3M17.5 20.5h3" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7" />,
  arrow: <path d="M5 12h13m0 0-5-5m5 5-5 5" />,
  warning: (
    <>
      <path d="M12 4 2.8 20h18.4z" />
      <path d="M12 10v4.5M12 17.4v.1" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
};

export default function Icon({ name, size = 20, className = "", strokeWidth }) {
  const glyph = PATHS[name] || PATHS.rectangle;
  return (
    <svg
      className={`rk-icon ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth || 1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {glyph}
    </svg>
  );
}

export const CATEGORY_ICONS = {
  All: "all",
  School: "school",
  College: "college",
  Employee: "employee",
  Visitor: "visitor",
  Event: "event",
  Medical: "medical",
  Press: "press",
  Gym: "gym",
  Volunteer: "volunteer",
  "Blank Canvas": "blank",
};
