"use client";

import { Banner300x250, Banner320x50, Banner728x90 } from "../../components/ads";
import ViewportAd from "../../components/ads/ViewportAd";

export function TypingTopAd() {
  return (
    <div className="tf-ad-placement tf-ad-placement-top" aria-label="Advertisement">
      <ViewportAd media="(min-width: 768px)">
        <Banner728x90 />
      </ViewportAd>
      <ViewportAd media="(max-width: 767px)">
        <Banner320x50 />
      </ViewportAd>
    </div>
  );
}

export default function TypingContentAd() {
  return (
    <div className="tf-ad-placement" aria-label="Advertisement">
      <Banner300x250 />
    </div>
  );
}
