export const AD_REGISTRY = {
  globalEnabled: true,
  ads: [
    {
      id: "highrevenueformat-468x60",
      label: "High Revenue Format 468x60",
      enabled: true,
      type: "highrevenueformat",
      config: {
        key: "c4dc96f6bdc10e06a7b5d93db97f2365",
        format: "iframe",
        height: 60,
        width: 468,
        params: {}
      },
      scriptSrc: "https://www.highrevenueformat.com/c4dc96f6bdc10e06a7b5d93db97f2365/invoke.js"
    },
    {
      id: "highrevenueformat-300x250",
      label: "High Revenue Format 300x250",
      enabled: true,
      type: "highrevenueformat",
      config: {
        key: "03d1b75431857c740d92990181bae63c",
        format: "iframe",
        height: 250,
        width: 300,
        params: {}
      },
      scriptSrc: "https://www.highrevenueformat.com/03d1b75431857c740d92990181bae63c/invoke.js"
    },
    {
      id: "highrevenueformat-160x300",
      label: "High Revenue Format 160x300",
      enabled: true,
      type: "highrevenueformat",
      config: {
        key: "b52e74090d7b6099b7a7978be93f7333",
        format: "iframe",
        height: 300,
        width: 160,
        params: {}
      },
      scriptSrc: "https://www.highrevenueformat.com/b52e74090d7b6099b7a7978be93f7333/invoke.js"
    },
    {
      id: "highrevenueformat-160x600",
      label: "High Revenue Format 160x600",
      enabled: true,
      type: "highrevenueformat",
      config: {
        key: "848f0552d5d690d7a1e26a2f204e2327",
        format: "iframe",
        height: 600,
        width: 160,
        params: {}
      },
      scriptSrc: "https://www.highrevenueformat.com/848f0552d5d690d7a1e26a2f204e2327/invoke.js"
    },
    {
      id: "highrevenueformat-320x50",
      label: "High Revenue Format 320x50",
      enabled: true,
      type: "highrevenueformat",
      config: {
        key: "2dc4c4bb89d86c2e2913a6dd66713323",
        format: "iframe",
        height: 50,
        width: 320,
        params: {}
      },
      scriptSrc: "https://www.highrevenueformat.com/2dc4c4bb89d86c2e2913a6dd66713323/invoke.js"
    },
    {
      id: "highrevenueformat-728x90",
      label: "High Revenue Format 728x90",
      enabled: true,
      type: "highrevenueformat",
      config: {
        key: "4f4d65ff2ae7ca08e79ab9c9cabc10d7",
        format: "iframe",
        height: 90,
        width: 728,
        params: {}
      },
      scriptSrc: "https://www.highrevenueformat.com/4f4d65ff2ae7ca08e79ab9c9cabc10d7/invoke.js"
    },
    {
      id: "profitablerate-fd6c124f7e1d2e430eb5ef067f720094",
      label: "Profitablerate Network 728x90",
      enabled: true,
      type: "profitablerate-inline",
      scriptSrc: "https://pl31454620.profitableratecpmnetwork.com/fd6c124f7e1d2e430eb5ef067f720094/invoke.js",
      containerId: "container-fd6c124f7e1d2e430eb5ef067f720094"
    },
    {
      id: "profitablerate-static-script",
      label: "Profitablerate static script",
      enabled: true,
      type: "script-only",
      scriptSrc: "https://pl31454623.profitableratecpmnetwork.com/6d/89/c4/6d89c46cd541d8c5225adb6f0e1df4f0.js"
    },
    {
      id: "adsense-top-banner",
      label: "AdSense sample banner",
      enabled: false,
      type: "adsense",
      client: "ca-pub-XXXXXXXXXXXX",
      slot: "XXXXXXXXXX",
      scriptSrc: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
    }
  ]
};

export function isAdsGloballyEnabled() {
  return AD_REGISTRY.globalEnabled === true;
}

export function setAdsEnabled(enabled) {
  AD_REGISTRY.globalEnabled = Boolean(enabled);
  return AD_REGISTRY.globalEnabled;
}

export function getAdById(id) {
  return AD_REGISTRY.ads.find((ad) => ad.id === id) || null;
}

export function getEnabledAds() {
  return AD_REGISTRY.ads.filter((ad) => ad.enabled && isAdsGloballyEnabled());
}

export function setAdEnabled(id, enabled) {
  const ad = getAdById(id);
  if (!ad) return false;

  ad.enabled = Boolean(enabled);
  return ad.enabled;
}

export default AD_REGISTRY;
