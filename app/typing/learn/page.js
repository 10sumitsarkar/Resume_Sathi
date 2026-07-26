"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LESSONS } from "../_lib/lessons";
import { readHistory, lessonBestWpm } from "../_lib/stats";

export default function LearnPage() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(readHistory());
  }, []);

  return (
    <main className="tf-page tf-learn-page tf-animate-rise">
      <div className="container-fluid custom-container">
        <div className="mb-4">
          <span className="tf-eyebrow">Learn</span>
          <h1 className="tf-font-display tf-display-1 tf-tracking-tight mt-1">
            8 units, from the basics to the next level
          </h1>
          <p className="tf-text-muted tf-max-w-2xl mt-2">
            Each lesson teaches a new finger reach. Go in order — every unit
            builds on the one before it.
          </p>
        </div>
      </div>

      <div className="container-fluid custom-container">
        <div className="row g-3">
          {LESSONS.map((lesson) => {
            const best = lessonBestWpm(history, lesson.id);
            return (
              <div key={lesson.id} className="col-12 col-sm-6">
                <Link
                  href={`/typing/learn/lesson?id=${lesson.id}`}
                  prefetch={false}
                  className="tf-card tf-hover-border-brand tf-lift-hover d-flex align-items-start gap-3 p-4 h-100"
                >
                  <span
                    className="tf-keycap tf-text-brand tf-font-mono d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                    style={{ width: 44, height: 44 }}
                  >
                    {String(lesson.unit).padStart(2, "0")}
                  </span>
                  <div className="tf-min-w-0">
                    <h2 className="tf-font-display tf-display-3 mb-0">
                      {lesson.title}
                    </h2>
                    <p className="tf-text-muted tf-fs-sm mt-1">{lesson.goal}</p>
                    <div className="tf-font-mono tf-fs-xs mt-2 d-flex align-items-center gap-2">
                      {best !== null ? (
                        <span className="tf-text-mint">Best: {best} WPM</span>
                      ) : (
                        <span className="tf-text-muted">Not started</span>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
