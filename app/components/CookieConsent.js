"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  applyConsentSignals,
  COOKIE_CONSENT_CHANGED_EVENT,
  DEFAULT_COOKIE_PREFERENCES,
  OPEN_COOKIE_SETTINGS_EVENT,
  readCookiePreferences,
  saveCookiePreferences,
} from "../lib/cookieConsent";

function getPreferenceSnapshot() {
  const preferences = readCookiePreferences();
  if (!preferences) return "none";
  return `${preferences.analytics ? "1" : "0"}${preferences.advertising ? "1" : "0"}`;
}

function getServerPreferenceSnapshot() {
  return "none";
}

function subscribeToPreferences(onChange) {
  window.addEventListener(COOKIE_CONSENT_CHANGED_EVENT, onChange);
  return () =>
    window.removeEventListener(COOKIE_CONSENT_CHANGED_EVENT, onChange);
}

export default function CookieConsent() {
  const preferenceSnapshot = useSyncExternalStore(
    subscribeToPreferences,
    getPreferenceSnapshot,
    getServerPreferenceSnapshot,
  );
  const savedPreferences =
    preferenceSnapshot === "none"
      ? null
      : {
          analytics: preferenceSnapshot[0] === "1",
          advertising: preferenceSnapshot[1] === "1",
        };
  const [opened, setOpened] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [managing, setManaging] = useState(false);
  const [preferences, setPreferences] = useState(DEFAULT_COOKIE_PREFERENCES);
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    const activePreferences =
      preferenceSnapshot === "none"
        ? DEFAULT_COOKIE_PREFERENCES
        : {
            analytics: preferenceSnapshot[0] === "1",
            advertising: preferenceSnapshot[1] === "1",
          };
    applyConsentSignals(activePreferences);

    const openSettings = () => {
      setPreferences(readCookiePreferences() || DEFAULT_COOKIE_PREFERENCES);
      setStorageError(false);
      setManaging(true);
      setDismissed(false);
      setOpened(true);
    };

    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings);
    return () => {
      window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings);
    };
  }, [preferenceSnapshot]);

  const savePreferences = (nextPreferences) => {
    const saved = saveCookiePreferences(nextPreferences);
    setPreferences(nextPreferences);
    setManaging(!saved);
    setStorageError(!saved);
    if (saved) {
      setOpened(false);
      setDismissed(false);
    }
  };

  if (savedPreferences && !opened) return null;
  if (!savedPreferences && dismissed && !opened) return null;

  return (
    <section
      className="cookie-consent"
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
    >
      <div className="cookie-consent__content">
        <div className="cookie-consent__copy">
          <h2 id="cookie-consent-title">
            {managing ? "Cookie preferences" : "Your privacy choices"}
          </h2>
          <p>
            Necessary storage saves your choice.                         Analytics and Google ad storage and personalization are optional.
            Ads may still appear when optional ad storage is off. Read the{" "}
            <a href="/privacy-policy/">Privacy Policy</a> for details.
          </p>
        </div>

        {managing && (
          <div className="cookie-consent__options">
            <label className="cookie-consent__option">
              <input type="checkbox" checked disabled />
              <span>
                <strong>Necessary storage</strong>
                <small>Remembers your cookie preferences and cannot be switched off here.</small>
              </span>
            </label>
            <label className="cookie-consent__option">
              <input
                type="checkbox"
                checked={preferences.analytics}
                onChange={(event) =>
                  setPreferences((current) => ({
                    ...current,
                    analytics: event.target.checked,
                  }))
                }
              />
              <span>
                <strong>Analytics</strong>
                <small>Allows Google Analytics to measure visits and interactions.</small>
              </span>
            </label>
            <label className="cookie-consent__option">
              <input
                type="checkbox"
                checked={preferences.advertising}
                onChange={(event) =>
                  setPreferences((current) => ({
                    ...current,
                    advertising: event.target.checked,
                  }))
                }
              />
              <span>
                <strong>Advertising storage and personalization</strong>
                <small>Allows Google advertising services to use optional ad storage and personalization signals.</small>
              </span>
            </label>
          </div>
        )}

        {storageError && (
          <p className="cookie-consent__error" role="alert">
            Your choice is active for this visit, but this browser did not allow
            it to be saved. You can continue without saving.
          </p>
        )}

        <div className="cookie-consent__actions">
          {managing ? (
            <>
              <button
                type="button"
                className="cookie-consent__button cookie-consent__button--secondary"
                onClick={() => {
                  setManaging(false);
                  setStorageError(false);
                  setOpened(false);
                }}
              >
                Cancel
              </button>
              {storageError && (
                <button
                  type="button"
                  className="cookie-consent__button cookie-consent__button--secondary"
                  onClick={() => {
                    setOpened(false);
                    setDismissed(true);
                  }}
                >
                  Continue without saving
                </button>
              )}
              <button
                type="button"
                className="cookie-consent__button cookie-consent__button--primary"
                onClick={() => savePreferences(preferences)}
              >
                Save choices
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="cookie-consent__button cookie-consent__button--primary"
                onClick={() =>
                  savePreferences(DEFAULT_COOKIE_PREFERENCES)
                }
              >
                Reject optional
              </button>
              <button
                type="button"
                className="cookie-consent__button cookie-consent__button--secondary"
                onClick={() => {
                  setStorageError(false);
                  setManaging(true);
                }}
              >
                Manage choices
              </button>
              <button
                type="button"
                className="cookie-consent__button cookie-consent__button--primary"
                onClick={() =>
                  savePreferences({ analytics: true, advertising: true })
                }
              >
                Accept all
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
