"use client";

import {
  Banner300x250,
  Banner320x50,
  Banner468x60,
  Banner728x90,
  NativeBanner,
} from "../../components/ads";

const AD_UNITS = {
  "300x250": Banner300x250,
  "320x50": Banner320x50,
  "468x60": Banner468x60,
  "728x90": Banner728x90,
};

export default function ToolsPageAd({ format = "300x250", native = false }) {
  const AdUnit = AD_UNITS[format];

  return (
    <div className="d-flex justify-content-center my-4">
      {native ? <NativeBanner /> : AdUnit ? <AdUnit /> : null}
    </div>
  );
}