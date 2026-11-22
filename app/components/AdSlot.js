"use client";

import { useEffect, useRef, useState } from "react";

export const ADS_ENABLED = false;

export default function AdSlot() {
  const markerRef = useRef(null);
  const [isBelowFold, setIsBelowFold] = useState(false);

  useEffect(() => {
    if (!ADS_ENABLED || !markerRef.current) return;

    const documentTop =
      markerRef.current.getBoundingClientRect().top + window.scrollY;
    setIsBelowFold(documentTop >= window.innerHeight);
  }, []);

  if (!ADS_ENABLED) return null;
  if (!isBelowFold) {
    return (
      <span
        ref={markerRef}
        aria-hidden="true"
        style={{ display: "block", height: 0, overflow: "hidden" }}
      />
    );
  }

  return (
    <div
      aria-label="Advertisement"
      className="adsense-ad-slot"
      style={{ minHeight: 280 }}
    />
  );
}
