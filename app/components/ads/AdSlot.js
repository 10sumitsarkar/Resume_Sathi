"use client";

import { useEffect, useRef } from "react";
import { ADS_ENABLED, AD_UNITS_ENABLED } from "./adsConfig";

const adsterraQueue = [];
let isLoadingAdsterra = false;

function processAdsterraQueue() {
  if (isLoadingAdsterra || adsterraQueue.length === 0) return;

  const { container, key, width, height } = adsterraQueue.shift();
  if (!container?.isConnected) {
    processAdsterraQueue();
    return;
  }

  isLoadingAdsterra = true;
  window.atOptions = {
    key,
    format: "iframe",
    height,
    width,
    params: {},
  };

  const script = document.createElement("script");
  script.src = `https://www.highrevenueformat.com/${key}/invoke.js`;
  script.async = false;
  script.onload = script.onerror = () => {
    isLoadingAdsterra = false;
    processAdsterraQueue();
  };
  container.appendChild(script);
}

export default function AdSlot({ name, enabled = true, keyId, width, height }) {
  const containerRef = useRef(null);
  const isEnabled = ADS_ENABLED && AD_UNITS_ENABLED[name] && enabled;

  useEffect(() => {
    if (!isEnabled || !containerRef.current) return;
    const container = containerRef.current;
    if (container.dataset.adRequested) return;
    container.dataset.adRequested = "true";

    if (name === "nativeBanner") {
      const script = document.createElement("script");
      script.async = true;
      script.dataset.cfasync = "false";
      script.src = "https://pl31454620.profitableratecpmnetwork.com/fd6c124f7e1d2e430eb5ef067f720094/invoke.js";
      container.appendChild(script);
      return;
    }

    adsterraQueue.push({ container, key: keyId, width, height });
    processAdsterraQueue();
  }, [enabled, height, isEnabled, keyId, name, width]);

  if (!isEnabled) return null;

  const isNativeBanner = name === "nativeBanner";

  return (
    <div
      ref={containerRef}
      className="resume-sathi-ad-slot"
      style={{
        width: width ?? "100%",
        height: height ?? "auto",
        minHeight: height,
        maxWidth: "100%",
        overflow: isNativeBanner ? "visible" : "hidden",
      }}
      aria-label={`${name} advertisement`}
    >
      {isNativeBanner && (
        <div id="container-fd6c124f7e1d2e430eb5ef067f720094" />
      )}
    </div>
  );
}