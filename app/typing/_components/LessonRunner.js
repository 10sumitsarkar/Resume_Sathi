"use client";

import Link from "next/link";
import { useState } from "react";
import TypingEngine from "./TypingEngine";
import { addSession } from "../_lib/stats";

export default function LessonRunner({ lesson, nextLesson }) {
  const [drillIdx, setDrillIdx] = useState(0);
  const [results, setResults] = useState([]);
  const done = drillIdx >= lesson.drills.length;

  const handleComplete = (result) => {
    addSession(result);
    setResults((r) => [...r, result]);
  };

  const avgWpm = results.length
    ? Math.round(results.reduce((s, r) => s + r.wpm, 0) / results.length)
    : 0;
  const avgAcc = results.length
    ? Math.round(results.reduce((s, r) => s + r.accuracy, 0) / results.length)
    : 0;

  return (
    <div className="tf-animate-rise">
      <div className="container-fluid custom-container">
        <div className="mb-4 tf-lesson-header">
          <Link
            href="/typing/learn/"
            prefetch={false}
            className="tf-lesson-back btn"
          >
            ← All lessons
          </Link>
          <div className="tf-lesson-heading d-flex align-items-center flex-wrap gap-2 gap-sm-3">
            <span
              className="tf-keycap tf-text-brand tf-font-mono d-flex align-items-center justify-content-center fw-bold tf-fs-sm"
              style={{ width: 40, height: 40, flexShrink: 0 }}
            >
              {String(lesson.unit).padStart(2, "0")}
            </span>
            <h1 className="tf-font-display tf-display-2 tf-tracking-tight tf-min-w-0 mb-0">
              {lesson.title}
            </h1>
          </div>
          <p className="tf-text-muted mt-2 tf-max-w-2xl">{lesson.goal}</p>
          {lesson.newKeys.length > 0 && (
            <div className="mt-3 d-flex flex-wrap gap-2">
              {lesson.newKeys.map((k) => (
                <span
                  key={k}
                  className="tf-keycap tf-text-brand tf-font-mono d-flex align-items-center justify-content-center tf-fs-xs px-2"
                  style={{ height: 28, minWidth: 28 }}
                >
                  {k === " " ? "space" : k}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="container-fluid custom-container">
        <div className="mb-4 d-flex gap-2">
          {lesson.drills.map((_, i) => (
            <div
              key={i}
              className="rounded-pill"
              style={{
                height: 6,
                flex: 1,
                backgroundColor:
                  i < drillIdx
                    ? "var(--tf-mint)"
                    : i === drillIdx
                      ? "var(--rk-brand, #7c5cfc)"
                      : "var(--tf-bg-surface-2)",
              }}
            />
          ))}
        </div>

        {!done ? (
          <TypingEngine
            key={drillIdx}
            text={lesson.drills[drillIdx]}
            mode="lesson"
            label={lesson.id}
            onComplete={handleComplete}
          />
        ) : (
          <div className="tf-animate-rise tf-card p-4 p-sm-5 text-center">
            <p
              className="tf-text-mint tf-font-mono tf-fs-xs text-uppercase mb-0"
              style={{ letterSpacing: "0.15em" }}
            >
              Lesson complete
            </p>
            <h2 className="tf-font-display tf-display-3 mt-2">Well done!</h2>
            <div
              className="tf-font-mono mx-auto mt-4 d-flex justify-content-around"
              style={{ maxWidth: 260 }}
            >
              <div>
                <div className="tf-text-ink fs-3 fw-bold">{avgWpm}</div>
                <div className="tf-text-muted tf-fs-xs">avg WPM</div>
              </div>
              <div>
                <div className="tf-text-ink fs-3 fw-bold">{avgAcc}%</div>
                <div className="tf-text-muted tf-fs-xs">avg accuracy</div>
              </div>
            </div>
            <div className="mt-4 d-flex flex-column flex-sm-row justify-content-center gap-3 buttons-row-mobile-full">
              <button
                onClick={() => {
                  setDrillIdx(0);
                  setResults([]);
                }}
                className="tf-keycap btn tf-fs-sm fw-medium px-4 py-2"
              >
                Try again
              </button>
              {nextLesson ? (
                <Link
                  href={`/typing/learn/lesson/${nextLesson.id}/`}
                  prefetch={false}
                  className="tf-btn-brand tf-brand-glow btn tf-fs-sm fw-medium px-4 py-2"
                >
                  Next: {nextLesson.title} →
                </Link>
              ) : (
                <Link
                  href="/typing/practice/"
                  prefetch={false}
                  className="tf-btn-brand tf-brand-glow btn tf-fs-sm fw-medium px-4 py-2"
                >
                  Try practice mode →
                </Link>
              )}
            </div>
          </div>
        )}

        {!done && (
          <div className="mt-4 text-center">
            <button
              onClick={() =>
                setDrillIdx((i) => Math.min(i + 1, lesson.drills.length))
              }
              className="tf-lesson-skip btn mb-4"
            >
              Drill {drillIdx + 1}/{lesson.drills.length} — skip →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
