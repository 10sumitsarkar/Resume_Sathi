"use client";

import { KEYBOARD_ROWS, HOME_ROW } from "../_lib/keyboardLayout";

const FINGER_COLOR = {
  "L-pinky": "#f5b942",
  "L-ring": "#3ddc97",
  "L-middle": "#7c5cfc",
  "L-index": "#fb6b7c",
  "R-index": "#fb6b7c",
  "R-middle": "#7c5cfc",
  "R-ring": "#3ddc97",
  "R-pinky": "#f5b942",
  thumb: "#8b90a0",
};

export default function Keyboard({ activeKey }) {
  const active = activeKey ? activeKey.toLowerCase() : null;

  return (
    <div className="tf-card tf-keyboard mx-auto p-2 p-sm-3" style={{ maxWidth: 640 }}>
      {/*
        Fixed 36px keys with no breakpoint used to overflow phone
        screens (13-key rows at 36px + gaps run well past 375px).
        Key size now comes from --tf-key / --tf-key-gap, which the
        stylesheet scales down under 768px and 400px. A horizontal
        scroller is still the safety net for anything narrower than
        that so the keyboard never breaks the page layout.
      */}
      <div className="tf-keyboard-scroll">
        <div
          className="d-flex flex-column align-items-center gap-2"
          style={{ width: "max-content", marginInline: "auto" }}
        >
          {KEYBOARD_ROWS.map((row, ri) => (
            <div
              key={ri}
              className="tf-keyboard-row d-flex"
              style={{ marginLeft: `calc(var(--tf-key) * ${(ri * 0.33).toFixed(2)})` }}
            >
              {row.map((k) => {
                const isActive = active === k.key || active === k.shiftKey;
                const isHome = HOME_ROW.includes(k.key);
                return (
                  <div
                    key={k.key}
                    className={`tf-keycap tf-font-mono tf-transition d-flex align-items-center justify-content-center text-uppercase tf-fs-xs ${
                      isActive ? "" : "tf-text-muted"
                    }`}
                    style={{
                      width: "var(--tf-key)",
                      height: "var(--tf-key)",
                      flexShrink: 0,
                      transform: isActive ? "translateY(-4px)" : undefined,
                      backgroundColor: isActive ? FINGER_COLOR[k.finger] : undefined,
                      borderColor: isActive ? FINGER_COLOR[k.finger] : undefined,
                      color: isActive ? "#0a0b0e" : undefined,
                      boxShadow: isHome && !isActive ? "inset 0 0 0 1px var(--rk-brand, #cc0000)" : undefined,
                    }}
                    title={k.finger}
                  >
                    {k.key}
                  </div>
                );
              })}
            </div>
          ))}
          <div className="mt-1 d-flex">
            <div
              className={`tf-keycap tf-transition d-flex align-items-center justify-content-center text-uppercase ${
                active === " " ? "" : "tf-text-muted"
              }`}
              style={{
                width: "calc(var(--tf-key) * 5.8)",
                height: "var(--tf-key)",
                fontSize: 10,
                letterSpacing: "0.2em",
                transform: active === " " ? "translateY(-4px)" : undefined,
                backgroundColor: active === " " ? FINGER_COLOR.thumb : undefined,
              }}
            >
              space
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
