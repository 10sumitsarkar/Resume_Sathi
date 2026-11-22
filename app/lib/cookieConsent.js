export const COOKIE_CONSENT_KEY = "resumesathi-cookie-consent-v1";
export const COOKIE_CONSENT_CHANGED_EVENT = "resumesathi:cookie-consent-changed";
export const OPEN_COOKIE_SETTINGS_EVENT = "resumesathi:open-cookie-settings";

export const DEFAULT_COOKIE_PREFERENCES = {
  analytics: false,
  advertising: false,
};

function normalizePreferences(value) {
  return {
    analytics: value?.analytics === true,
    advertising: value?.advertising === true,
  };
}

export function readCookiePreferences() {
  if (typeof window === "undefined") return null;

  try {
    const stored = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    if (
      parsed?.version !== 1 ||
      typeof parsed.analytics !== "boolean" ||
      typeof parsed.advertising !== "boolean"
    ) {
      console.error("Stored cookie preferences have an unsupported format.");
      return null;
    }

    return normalizePreferences(parsed);
  } catch (error) {
    console.error("Unable to read saved cookie preferences.", error);
    return null;
  }
}

export function applyConsentSignals(preferences) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer.push(arguments);
    };

  window.gtag("consent", "update", {
    analytics_storage: preferences.analytics ? "granted" : "denied",
    ad_storage: preferences.advertising ? "granted" : "denied",
    ad_user_data: preferences.advertising ? "granted" : "denied",
    ad_personalization: preferences.advertising ? "granted" : "denied",
  });
}

export function saveCookiePreferences(preferences) {
  if (typeof window === "undefined") return false;

  const normalized = normalizePreferences(preferences);
  let saved = true;

  try {
    window.localStorage.setItem(
      COOKIE_CONSENT_KEY,
      JSON.stringify({ version: 1, ...normalized }),
    );
  } catch (error) {
    console.error("Unable to save cookie preferences.", error);
    saved = false;
  }

  applyConsentSignals(normalized);
  window.dispatchEvent(
    new CustomEvent(COOKIE_CONSENT_CHANGED_EVENT, { detail: normalized }),
  );
  return saved;
}
