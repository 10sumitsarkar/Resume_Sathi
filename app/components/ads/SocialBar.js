"use client";

import { useEffect } from "react";
import { ADS_ENABLED, AD_UNITS_ENABLED } from "./adsConfig";

export default function SocialBar({ enabled = true }) {
  useEffect(() => {
    if (!ADS_ENABLED || !AD_UNITS_ENABLED.socialBar || !enabled) return;

    const script = document.createElement("script");
    script.src = "https://pl31454623.profitableratecpmnetwork.com/6d/89/c4/6d89c46cd541d8c5225adb6f0e1df4f0.js";
    document.body.appendChild(script);

    return () => script.remove();
  }, [enabled]);

  return null;
}