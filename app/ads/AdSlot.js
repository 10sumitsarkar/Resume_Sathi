"use client";

import { useEffect } from "react";
import { getAdById, isAdsGloballyEnabled } from "./adRegistry";

function injectScript(src, attributes = {}, target = "body") {
  if (typeof document === "undefined") return null;

  const key = attributes["data-ad-id"] || src;
  const existing = document.querySelector(`script[data-ad-id="${key}"]`);
  if (existing) return existing;

  const script = document.createElement("script");
  script.src = src;
  script.async = true;
  script.defer = true;

  Object.entries(attributes).forEach(([name, value]) => {
    if (value !== undefined && value !== null) {
      script.setAttribute(name, String(value));
    }
  });

  if (target === "head") {
    document.head.appendChild(script);
  } else {
    document.body.appendChild(script);
  }

  return script;
}

function addHighRevenueFormatConfig(ad) {
  if (!ad?.config) return;
  window.atOptions = { ...ad.config };
}

export default function AdSlot({ id, enabled, className = "" }) {
  const ad = getAdById(id);
  const shouldRender = typeof enabled === "boolean" ? enabled : ad?.enabled;

  useEffect(() => {
    if (!ad || !isAdsGloballyEnabled() || !shouldRender) return undefined;

    const adIdAttr = `ad-script-${ad.id}`;

    if (ad.type === "adsense") {
      if (!window.adsbygoogle) {
        window.adsbygoogle = window.adsbygoogle || [];
      }

      const containerSelector = `[data-ad-container="${ad.id}"]`;
      const container = document.querySelector(containerSelector);
      if (container && !container.querySelector("ins.adsbygoogle")) {
        const ins = document.createElement("ins");
        ins.className = "adsbygoogle";
        ins.style.display = "block";
        ins.setAttribute("data-ad-client", ad.client);
        ins.setAttribute("data-ad-slot", ad.slot);
        ins.setAttribute("data-ad-format", "auto");
        ins.setAttribute("data-full-width-responsive", "true");
        container.appendChild(ins);
      }

      if (!document.querySelector(`script[src="${ad.scriptSrc}"]`)) {
        injectScript(ad.scriptSrc, { "data-ad-id": adIdAttr }, "head");
      }

      if (window.adsbygoogle && container) {
        window.adsbygoogle.push({});
      }

      return undefined;
    }

    if (ad.type === "profitablerate-inline") {
      const target = document.querySelector(`[data-ad-container="${ad.id}"]`);
      if (target && !target.querySelector(`#${ad.containerId}`)) {
        const container = document.createElement("div");
        container.id = ad.containerId;
        target.appendChild(container);
      }

      if (!document.querySelector(`script[src="${ad.scriptSrc}"]`)) {
        injectScript(ad.scriptSrc, { "data-ad-id": adIdAttr }, "body");
      }
      return undefined;
    }

    if (ad.type === "script-only") {
      injectScript(ad.scriptSrc, { "data-ad-id": adIdAttr }, "body");
      return undefined;
    }

    if (ad.type === "highrevenueformat") {
      addHighRevenueFormatConfig(ad);
      injectScript(ad.scriptSrc, { "data-ad-id": adIdAttr }, "body");
      return undefined;
    }

    if (ad.config) {
      addHighRevenueFormatConfig(ad);
    }

    injectScript(ad.scriptSrc, { "data-ad-id": adIdAttr }, "body");
    return undefined;
  }, [ad, enabled, shouldRender]);

  if (!ad) {
    return null;
  }

  return (
    <div
      className={className}
      data-ad-container={ad.id}
      data-ad-enabled={String(shouldRender && isAdsGloballyEnabled())}
      aria-label={ad.label}
    >
      {ad.containerId ? <div id={ad.containerId} /> : null}
    </div>
  );
}
