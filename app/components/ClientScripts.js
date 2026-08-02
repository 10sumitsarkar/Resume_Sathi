"use client";

import { useEffect } from "react";

const GA_MEASUREMENT_ID = "G-GMDRJBQDWL";

function addScript(src, async = true) {
  if (typeof document === "undefined") return;
  const existing = document.querySelector(`script[src="${src}"]`);
  if (existing) return;
  const script = document.createElement("script");
  script.src = src;
  script.async = async;
  document.body.appendChild(script);
}

function loadGoogleAnalytics() {
  if (typeof window === "undefined") return;
  if (window.dataLayer) return;

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.onload = () => {
    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID);
  };
  document.head.appendChild(script);
}

export default function ClientScripts() {
  useEffect(() => {
    loadGoogleAnalytics();
    addScript("/api-config.js");
    addScript("/front-assets/js/bootstrap.bundle.min.js");
  }, []);

  return null;
}
