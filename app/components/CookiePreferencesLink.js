"use client";

import { OPEN_COOKIE_SETTINGS_EVENT } from "../lib/cookieConsent";

export default function CookiePreferencesLink() {
  return (
    <a
      href="#cookie-settings"
      onClick={(event) => {
        event.preventDefault();
        window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT));
      }}
    >
      Manage cookie choices
    </a>
  );
}
