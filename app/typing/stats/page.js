"use client";

import { useEffect, useState } from "react";
import { readHistory, aggregate, clearHistory } from "../_lib/stats";

function WpmTrend({ history }) {
  const points = history.slice(-30);
  if (points.length < 2) {
    return (
      <div className="tf-text-muted d-flex align-items-center justify-content-center tf-fs-sm" style={{ height: 160 }}>
        Complete at least 2 sessions to see a trend.
      </div>
    );
  }
  const max = Math.max(...points.map((p) => p.wpm), 10);
  const w = 600;
  const h = 160;
  const step = w / (points.length - 1);
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - (p.wpm / max) * (h - 20) - 10}`)
    .join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ height: 160, width: "100%" }} preserveAspectRatio="none">
      <path d={path} fill="none" stroke="var(--rk-brand, #7c5cfc)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <circle key={i} cx={i * step} cy={h - (p.wpm / max) * (h - 20) - 10} r={3} fill="var(--rk-brand, #7c5cfc)" />
      ))}
    </svg>
  );
}

export default function StatsPage() {
  const [history, setHistory] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setHistory(readHistory());
    setLoaded(true);
  }, []);

  const agg = aggregate(history);

  if (!loaded) return null;

  return (
    <main className="tf-page tf-animate-rise">
      <div className="container-fluid custom-container">
      <div className="mb-4 d-flex flex-wrap align-items-end justify-content-between gap-3">
        <div>
          <span className="tf-eyebrow">Stats</span>
          <h1 className="tf-font-display tf-display-1 tf-tracking-tight mt-1">Your progress</h1>
          <p className="tf-text-muted tf-max-w-2xl mt-2">
            All data is saved locally in this browser only — nothing is ever sent anywhere.
          </p>
        </div>
        {history.length > 0 && (
          <button
            onClick={() => {
              clearHistory();
              setHistory([]);
            }}
            className="tf-keycap tf-text-muted tf-font-mono btn tf-fs-xs px-3 py-2"
          >
            Reset history
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="tf-card p-5 text-center">
          <p className="tf-text-muted mb-0">
            No sessions yet. Complete a lesson or a practice round and your
            stats will show up here.
          </p>
        </div>
      ) : (
        <>
          <div className="row g-3">
            {[
              [agg.avgWpm, "avg WPM"],
              [agg.bestWpm, "best WPM"],
              [`${agg.avgAccuracy}%`, "avg accuracy"],
              [agg.totalMinutes, "minutes practiced"],
              [agg.streak, "day streak 🔥"],
            ].map(([v, l]) => (
              <div key={l} className="col-6 col-sm-4 col-lg">
                <div className="tf-card p-3 text-center h-100">
                  <div className="tf-font-display tf-text-gradient tf-display-2">{v}</div>
                  <div className="tf-text-muted tf-fs-xs mt-1">{l}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="tf-card mt-4 p-4">
            <h2 className="tf-font-display tf-display-3 mb-3">WPM trend (last 30)</h2>
            <WpmTrend history={history} />
          </div>

          <div className="row g-3 mt-1">
            <div className="col-12 col-lg-6">
              <div className="tf-card p-4 h-100">
                <h2 className="tf-font-display tf-display-3 mb-3">Most frequently missed keys</h2>
                {agg.topErrors.length === 0 ? (
                  <p className="tf-text-muted tf-fs-sm mb-0">No consistent mistakes — great job!</p>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {agg.topErrors.map((e) => {
                      const pct = (e.count / agg.topErrors[0].count) * 100;
                      return (
                        <div key={e.char} className="d-flex align-items-center gap-3">
                          <span className="tf-keycap tf-text-rose tf-font-mono d-flex align-items-center justify-content-center flex-shrink-0 tf-fs-xs" style={{ width: 28, height: 28 }}>
                            {e.char === " " ? "␣" : e.char}
                          </span>
                          <div className="tf-bg-surface2 flex-grow-1 rounded-pill overflow-hidden" style={{ height: 8 }}>
                            <div style={{ width: `${pct}%`, height: "100%", backgroundColor: "var(--tf-rose)" }} />
                          </div>
                          <span className="tf-text-muted tf-font-mono tf-fs-xs" style={{ width: 24, textAlign: "right" }}>{e.count}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="col-12 col-lg-6">
              <div className="tf-card p-4 h-100">
                <h2 className="tf-font-display tf-display-3 mb-3">Recent sessions</h2>
                <div className="tf-scroll-y d-flex flex-column gap-2" style={{ maxHeight: 224 }}>
                  {[...history].reverse().slice(0, 12).map((h, i) => (
                    <div key={i} className="tf-border-edge tf-bg-surface2 border rounded-3 d-flex align-items-center justify-content-between px-3 py-2 tf-fs-sm">
                      <span className="tf-text-muted">
                        {new Date(h.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} ·{" "}
                        <span className="tf-text-brand tf-font-mono text-uppercase" style={{ fontSize: 10 }}>{h.mode}</span>
                      </span>
                      <span className="tf-font-mono">
                        {h.wpm} wpm · {h.accuracy}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      </div>
    </main>
  );
}
