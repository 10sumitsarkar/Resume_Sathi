"use client";

import { useEffect } from "react";

const GA_MEASUREMENT_ID = "G-GMDRJBQDWL";

function addScript(src, async = false) {
  if (typeof document === "undefined") return;
  const existing = document.querySelector(`script[src="${src}"]`);
  if (existing) return;
  const script = document.createElement("script");
  script.src = src;
  script.async = async;
  script.defer = true;
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
  script.defer = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.onload = () => {
    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID);
  };
  document.head.appendChild(script);
}

function suppressInjectedPerformanceError() {
  if (typeof window === "undefined") return undefined;

  const isInjectedPerformanceError = (message, stack = "") => {
    const text = `${message || ""} ${stack || ""}`;
    return (
      text.includes("Cannot read properties of undefined (reading 'startTime')") &&
      text.includes("reportAllChanges")
    );
  };

  const handleWindowError = (event) => {
    if (isInjectedPerformanceError(event.message, event.error?.stack)) {
      event.preventDefault();
      return true;
    }
    return false;
  };

  const handleUnhandledRejection = (event) => {
    const reason = event.reason;
    if (isInjectedPerformanceError(reason?.message || String(reason), reason?.stack)) {
      event.preventDefault();
    }
  };

  window.addEventListener("error", handleWindowError);
  window.addEventListener("unhandledrejection", handleUnhandledRejection);

  return () => {
    window.removeEventListener("error", handleWindowError);
    window.removeEventListener("unhandledrejection", handleUnhandledRejection);
  };
}

export default function ClientScripts() {
  useEffect(() => {
    const cleanupInjectedErrorFilter = suppressInjectedPerformanceError();
    loadGoogleAnalytics();
    addScript("/api-config.js");
    addScript("/front-assets/js/bootstrap.bundle.min.js");

    return cleanupInjectedErrorFilter;
  }, []);

  return null;
}
