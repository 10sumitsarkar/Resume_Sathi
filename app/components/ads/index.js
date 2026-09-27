"use client";

import AdSlot from "./AdSlot";
export { default as SocialBar } from "./SocialBar";

export function Banner468x60({ enabled }) {
  return <AdSlot name="banner468x60" enabled={enabled} keyId="c4dc96f6bdc10e06a7b5d93db97f2365" width={468} height={60} />;
}

export function Banner300x250({ enabled }) {
  return <AdSlot name="banner300x250" enabled={enabled} keyId="03d1b75431857c740d92990181bae63c" width={300} height={250} />;
}

export function Banner160x300({ enabled }) {
  return <AdSlot name="banner160x300" enabled={enabled} keyId="b52e74090d7b6099b7a7978be93f7333" width={160} height={300} />;
}

export function Banner160x600({ enabled }) {
  return <AdSlot name="banner160x600" enabled={enabled} keyId="848f0552d5d690d7a1e26a2f204e2327" width={160} height={600} />;
}

export function Banner320x50({ enabled }) {
  return <AdSlot name="banner320x50" enabled={enabled} keyId="2dc4c4bb89d86c2e2913a6dd66713323" width={320} height={50} />;
}

export function Banner728x90({ enabled }) {
  return <AdSlot name="banner728x90" enabled={enabled} keyId="4f4d65ff2ae7ca08e79ab9c9cabc10d7" width={728} height={90} />;
}

export function NativeBanner({ enabled }) {
  return <AdSlot name="nativeBanner" enabled={enabled} />;
}