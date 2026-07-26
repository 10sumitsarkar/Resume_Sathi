"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fingerForChar, FINGER_LABEL } from "../_lib/keyboardLayout";
import Keyboard from "./Keyboard";

let keycapId = 0;

export default function TypingEngine({
  text,
  mode,
  label,
  timeLimitSec,
  showKeyboard = true,
  showFingerHint = true,
  showProgress = true,
  autoFocus = true,
  sessionControl,
  onComplete,
}) {
  const [typed, setTyped] = useState("");
  const [startedAt, setStartedAt] = useState(null);
  const [finished, setFinished] = useState(false);
  const [errorCounts, setErrorCounts] = useState({});
  const [mistakeKeystrokes, setMistakeKeystrokes] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [keycaps, setKeycaps] = useState([]);
  const [paused, setPaused] = useState(false);
  const charRefs = useRef([]);
  const containerRef = useRef(null);
  const hiddenInputRef = useRef(null);
  const textViewportRef = useRef(null);
  const keycapTimersRef = useRef(new Set());
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      keycapTimersRef.current.forEach((timer) => clearTimeout(timer));
      keycapTimersRef.current.clear();
    };
  }, []);

  // --- pause tracking ---------------------------------------------------
  // Timer must freeze whenever the person isn't actively typing: they tab
  // away, the window loses focus, or they simply stop for a couple of
  // seconds. All of that funnels through the same pause/resume refs so the
  // elapsed-time math (and the WPM/finish calculations that depend on it)
  // stays consistent no matter which of those caused the pause.
  const IDLE_PAUSE_MS = 2000;
  const pausedRef = useRef(false);
  const pauseStartRef = useRef(null);
  const totalPausedRef = useRef(0);
  const lastActivityRef = useRef(null);

  const beginPause = useCallback(() => {
    if (pausedRef.current) return;
    pausedRef.current = true;
    pauseStartRef.current = Date.now();
    setPaused(true);
  }, []);

  const endPause = useCallback(() => {
    if (!pausedRef.current) return;
    totalPausedRef.current += Date.now() - (pauseStartRef.current ?? Date.now());
    pauseStartRef.current = null;
    pausedRef.current = false;
    setPaused(false);
  }, []);

  const getElapsedMs = useCallback(
    (refNow) => {
      if (!startedAt) return 0;
      const activeEnd = pausedRef.current ? (pauseStartRef.current ?? refNow) : refNow;
      return Math.max(0, activeEnd - startedAt - totalPausedRef.current);
    },
    [startedAt],
  );

  const finish = useCallback(() => {
    if (finished) return;
    setFinished(true);
    const elapsedSec = startedAt ? getElapsedMs(Date.now()) / 1000 : 0.001;
    let correct = 0;
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === text[i]) correct++;
    }
    const grossKeystrokes = typed.length + mistakeKeystrokes;
    const accuracy = grossKeystrokes > 0 ? Math.round((correct / grossKeystrokes) * 100) : 100;
    const minutes = Math.max(elapsedSec / 60, 1 / 60);
    const wpm = Math.max(0, Math.round(correct / 5 / minutes));
    onComplete({
      date: new Date().toISOString(),
      mode,
      wpm,
      accuracy: Math.min(100, accuracy),
      durationSec: Math.round(elapsedSec),
      charErrors: errorCounts,
      label,
    });
  }, [finished, startedAt, typed, text, mistakeKeystrokes, errorCounts, mode, label, onComplete, getElapsedMs]);

  // Tick the clock, and use every tick to decide whether we should be
  // paused (idle, tab hidden, window blurred) purely from timestamps —
  // this is what stops the countdown the moment the person stops typing,
  // and stops a timed session from silently finishing in a background tab.
  useEffect(() => {
    if (!startedAt || finished) return;
    const t = setInterval(() => {
      const n = Date.now();
      setNow(n);
      const hidden = typeof document !== "undefined" && document.hidden;
      const blurred = typeof document !== "undefined" && document.activeElement !== hiddenInputRef.current;
      if (hidden || blurred) beginPause();
    }, 200);
    return () => clearInterval(t);
  }, [startedAt, finished, beginPause]);

  // Immediate pause on tab-switch / window-blur, instead of waiting for the
  // next 200ms tick — this is the fix for "sometimes typing doesn't work":
  // previously a background tab kept the timer running, so a timed session
  // could finish while the person was away, silently locking the input.
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) beginPause();
    };
    const onBlur = () => beginPause();
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", onBlur);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", onBlur);
    };
  }, [beginPause]);

  // Refocus the hidden input automatically when the window/tab becomes
  // active again, so the person doesn't have to click back into the card
  // for keystrokes to register again.
  useEffect(() => {
    const refocus = () => {
      if (!finished && hiddenInputRef.current) hiddenInputRef.current.focus();
    };
    const onVisibility = () => {
      if (!document.hidden) refocus();
    };
    window.addEventListener("focus", refocus);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("focus", refocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [finished]);

  useEffect(() => {
    if (!timeLimitSec || !startedAt || finished) return;
    const elapsed = getElapsedMs(now) / 1000;
    if (elapsed >= timeLimitSec) finish();
  }, [now, startedAt, timeLimitSec, finished, finish, getElapsedMs]);

  useEffect(() => {
    if (!finished && typed.length >= text.length && text.length > 0) {
      finish();
    }
  }, [typed, text, finished, finish]);

  const spawnKeycap = (char, ok, index) => {
    const el = charRefs.current[index];
    const box = containerRef.current ? containerRef.current.getBoundingClientRect() : null;
    let x = 20;
    if (el && box) {
      const r = el.getBoundingClientRect();
      x = r.left - box.left;
    }
    const id = ++keycapId;
    const rot = Math.random() * 30 - 15;
    setKeycaps((k) => [...k, { id, char: char === " " ? "␣" : char, x, ok, rot }]);
    const timer = setTimeout(() => {
      keycapTimersRef.current.delete(timer);
      if (mountedRef.current) setKeycaps((k) => k.filter((c) => c.id !== id));
    }, 700);
    keycapTimersRef.current.add(timer);
  };

  // Backspace/Delete/Cut are blocked at the keydown/cut level so a removed
  // character never even reaches the textarea's DOM value — this is the
  // "no backspace allowed" behaviour, enforced before React ever sees a
  // shorter value.
  const handleKeyDown = (e) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();
    }
  };
  const handleCut = (e) => {
    e.preventDefault();
  };

  const handleChange = (e) => {
    if (finished) return;
    const val = e.target.value;
    if (val.length > text.length) return;
    // Defensive fallback (e.g. some mobile keyboards / IME paths can still
    // shrink the value without a Backspace keydown): never let typed get
    // shorter than it already is.
    if (val.length < typed.length) return;

    if (!startedAt && val.length > 0) setStartedAt(Date.now());

    if (val.length > typed.length) {
      const idx = val.length - 1;
      const ch = val[idx];
      const expected = text[idx];
      const ok = ch === expected;
      if (!ok) {
        setErrorCounts((prev) => ({ ...prev, [expected]: (prev[expected] || 0) + 1 }));
        setMistakeKeystrokes((m) => m + 1);
      }
      spawnKeycap(ch, ok, idx);
      lastActivityRef.current = Date.now();
      endPause();
    }

    setTyped(val);
  };

  const restart = useCallback(() => {
    setTyped("");
    setStartedAt(null);
    setFinished(false);
    setErrorCounts({});
    setMistakeKeystrokes(0);
    setKeycaps([]);
    pausedRef.current = false;
    pauseStartRef.current = null;
    totalPausedRef.current = 0;
    lastActivityRef.current = null;
    setPaused(false);
    if (autoFocus && hiddenInputRef.current) hiddenInputRef.current.focus();
  }, [autoFocus]);

  useEffect(() => {
    restart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const nextChar = text[typed.length] ?? null;
  const nextFinger = showFingerHint && nextChar ? fingerForChar(nextChar) : null;

  const elapsed = getElapsedMs(now) / 1000;
  const remaining = timeLimitSec ? Math.max(0, timeLimitSec - elapsed) : null;

  const liveWpm = useMemo(() => {
    if (!startedAt) return 0;
    let correct = 0;
    for (let i = 0; i < typed.length; i++) if (typed[i] === text[i]) correct++;
    const minutes = Math.max(elapsed / 60, 1 / 60);
    return Math.max(0, Math.round(correct / 5 / minutes));
  }, [typed, text, startedAt, elapsed]);

  const progressPct = timeLimitSec
    ? Math.min(100, (elapsed / timeLimitSec) * 100)
    : Math.min(100, (typed.length / Math.max(text.length, 1)) * 100);

  useEffect(() => {
    const viewport = textViewportRef.current;
    const current = charRefs.current[typed.length];
    if (!viewport || !current) return;
    const lineHeight = parseFloat(getComputedStyle(current).lineHeight) || 28;
    viewport.scrollTop = Math.max(0, current.offsetTop - lineHeight * 1.4);
  }, [typed]);

  return (
    <div className="w-100">
      <div className="tf-session-bar">
        <div className="tf-session-timer"><strong>{timeLimitSec ? Math.ceil(remaining ?? timeLimitSec) : `${Math.round(progressPct)}%`}</strong><small>{timeLimitSec ? "seconds" : "progress"}</small></div>
        <div className="tf-session-wpm"><strong>{liveWpm}</strong><span>WPM</span></div>
        {sessionControl && <div className="tf-session-control">{sessionControl}</div>}
        {paused && !finished && startedAt && <span className="tf-session-paused">Paused — type to resume</span>}
        <button onClick={restart} className="tf-session-restart btn">↻ <span>Restart</span></button>
      </div>
      <div className="tf-font-mono tf-text-muted tf-fs-sm d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
        <div className="d-flex align-items-center gap-4">
          <span>
            WPM <span className="tf-text-ink fw-semibold">{liveWpm}</span>
          </span>
          {timeLimitSec ? (
            <span>
              Time <span className="tf-text-ink fw-semibold">{Math.ceil(remaining ?? 0)}s</span>
            </span>
          ) : (
            <span>
              Progress{" "}
              <span className="tf-text-ink fw-semibold">
                {typed.length}/{text.length}
              </span>
            </span>
          )}
          {paused && !finished && startedAt && (
            <span className="tf-text-rose fw-semibold">⏸ Paused — type to resume</span>
          )}
        </div>
        <button
          onClick={restart}
          className="tf-keycap tf-text-muted btn btn-sm tf-fs-xs fw-medium"
        >
          ⟲ Restart
        </button>
      </div>

      {showProgress && <div className="tf-progress-track w-100">
        <div className="tf-progress-fill" style={{ width: `${progressPct}%` }} />
      </div>}

      <div className={`tf-typing-workspace ${showKeyboard ? "has-keyboard" : ""}`}>
      <div
        ref={containerRef}
        onClick={() => hiddenInputRef.current && hiddenInputRef.current.focus()}
        className="tf-card tf-font-mono tf-cursor-text tf-select-none position-relative p-4 tf-fs-lg tf-leading-relaxed"
        style={{ letterSpacing: "0.01em" }}
      >
        {keycaps.map((k) => (
          <span
            key={k.id}
            className="tf-animate-keycap tf-keycap position-absolute d-flex align-items-center justify-content-center fw-bold"
            style={{
              top: 8,
              left: k.x,
              width: 28,
              height: 28,
              fontSize: 12,
              pointerEvents: "none",
              "--rot": `${k.rot}deg`,
              color: k.ok ? "var(--tf-mint)" : "var(--tf-rose)",
              borderColor: k.ok ? "var(--tf-mint)" : "var(--tf-rose)",
            }}
          >
            {k.char}
          </span>
        ))}

        <div ref={textViewportRef} className="tf-typing-text-viewport">
        <p className="tf-pre-wrap mb-0">
          {text.split("").map((ch, i) => {
            let style = { color: "var(--tf-text-muted)" };
            if (i < typed.length) {
              style =
                typed[i] === ch
                  ? { color: "var(--tf-mint)" }
                  : { color: "var(--tf-rose)", background: "color-mix(in srgb, var(--tf-rose) 10%, transparent)", borderRadius: 2 };
            } else if (i === typed.length) {
              style = { color: "var(--tf-text-primary)" };
            }
            return (
              <span
                key={i}
                ref={(el) => {
                  charRefs.current[i] = el;
                }}
                className="position-relative"
                style={style}
              >
                {i === typed.length && (
                  <span
                    className="tf-animate-caret tf-bg-brand position-absolute top-0"
                    style={{ left: -1, height: "100%", width: 2 }}
                  />
                )}
                {ch === " " ? "\u00A0" : ch}
              </span>
            );
          })}
        </p>
        </div>

        <textarea
          ref={hiddenInputRef}
          value={typed}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onCut={handleCut}
          onPaste={(e) => e.preventDefault()}
          autoFocus={autoFocus}
          rows={1}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          className="position-absolute top-0 start-0 w-100 h-100 tf-cursor-text"
          style={{ resize: "none", opacity: 0, border: 0, background: "transparent" }}
          aria-label="Typing input"
        />

        {finished && (
          <div className="tf-border-edge tf-bg-surface2 border rounded-3 mt-3 px-3 py-2 d-flex align-items-center justify-content-between tf-fs-sm">
            <span className="tf-text-mint fw-medium">Session complete ✓</span>
            <button onClick={restart} className="tf-text-brand btn btn-link p-0 d-none">
              Try again
            </button>
          </div>
        )}
      </div>

      {showFingerHint && nextFinger && !finished && (
        <p className="tf-finger-hint tf-text-muted tf-fs-xs text-center mt-3">
          Next key <span className="tf-text-ink tf-font-mono">{nextChar === " " ? "space" : nextChar}</span>{" "}
          → <span className="tf-text-brand">{FINGER_LABEL[nextFinger]}</span>
        </p>
      )}
      {showKeyboard && <div className="tf-typing-keyboard"><Keyboard activeKey={nextChar} /></div>}
      </div>
    </div>
  );
}
