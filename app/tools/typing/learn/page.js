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
          <h1 className="tf-font-display tf-display-1 tf-tracking-tight mt-1">8 units, from the basics to the next level</h1>
          <p className="tf-text-muted tf-max-w-2xl mt-2">Each lesson teaches a new finger reach. Go in order — every unit builds on the one before it.</p>
        </div>
      </div>

      <div className="container-fluid custom-container">
        <div className="row g-3">
          {LESSONS.map((lesson) => {
            const best = lessonBestWpm(history, lesson.id);
            return (
              <div key={lesson.id} className="col-12 col-sm-6">
                <Link href={`/tools/typing/learn/lesson/${lesson.id}/`} prefetch={false} className="tf-card tf-hover-border-brand tf-lift-hover d-flex align-items-start gap-3 p-4 h-100">
                  <span className="tf-keycap tf-text-brand tf-font-mono d-flex align-items-center justify-content-center fw-bold flex-shrink-0" style={{ width: 44, height: 44 }}>
                    {String(lesson.unit).padStart(2, "0")}
                  </span>
                  <div className="tf-min-w-0">
                    <h2 className="tf-font-display tf-display-3 mb-0">{lesson.title}</h2>
                    <p className="tf-text-muted tf-fs-sm mt-1">{lesson.goal}</p>
                    <div className="tf-font-mono tf-fs-xs mt-2 d-flex align-items-center gap-2">
                      {best !== null ? <span className="tf-text-mint">Best: {best} WPM</span> : <span className="tf-text-muted">Not started</span>}
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
      <section className="container-fluid custom-container mt-5">
        <div className="tf-card p-4 p-sm-5">
          <h2 className="tf-font-display tf-display-3">Learn touch typing one row at a time</h2>
          <p className="tf-text-muted tf-leading-relaxed mt-3">The lesson path starts with the home row and gradually adds the top row, bottom row, numbers, punctuation, capitals, common words, and mixed practice. Each unit focuses on a small group of keys so you can build muscle memory without rushing.</p>
          <p className="tf-text-muted tf-leading-relaxed">Each lesson gives you short drills for its key group. Keep your fingers near the home row, look at the screen instead of your hands, and aim for accurate keystrokes before increasing your pace.</p>
          <p className="tf-text-muted tf-leading-relaxed">Work through the lessons in order if you are new to typing practice. Repeat any lesson where your accuracy drops, then move into practice mode when the key positions feel familiar. You can revisit a unit whenever a particular reach still feels awkward.</p>
          <h3 className="tf-font-display tf-display-4 mt-4">What each typing unit practises</h3>
          <p className="tf-text-muted tf-leading-relaxed mt-3">
            The first unit anchors both hands on A, S, D, F and J, K, L, and the
            semicolon. The next two units introduce reaches to the top and bottom
            rows, helping you return to the home position after each new key. The
            number unit adds the digits, while the punctuation unit gives you
            practice with commas, full stops, apostrophes, quotation marks,
            question marks, and exclamation marks.
          </p>
          <p className="tf-text-muted tf-leading-relaxed">
            Later lessons introduce capital letters with the Shift key, repeat
            frequent English words, and combine letters, numbers, capitals, and
            punctuation in complete sentences. Moving through these groups in
            order makes it easier to notice which key reaches need more attention.
            You do not need to finish a unit in one sitting; reopen it and practise
            its drills again when you want more repetition.
          </p>
          <h3 className="tf-font-display tf-display-4 mt-4">Build accuracy before speed</h3>
          <p className="tf-text-muted tf-leading-relaxed mt-3">
            Touch typing depends on repeatable finger placement, not on watching
            your hands move quickly. Sit comfortably, keep your wrists relaxed,
            and let your fingers return to their starting positions between
            reaches. If you make several errors in the same part of a drill,
            slow down and repeat that pattern rather than trying to compensate
            by typing faster.
          </p>
          <p className="tf-text-muted tf-leading-relaxed">
            The lesson list shows a best words-per-minute result when a saved
            lesson result is available in this browser. Treat that number as a
            personal reference rather than a target you must reach immediately:
            steady accuracy is a useful foundation for later speed. Your lesson
            history is stored locally in the browser, so it is associated with
            this device and browser rather than a ResumeSathi account.
          </p>
          <p className="tf-text-muted tf-leading-relaxed">
            Once the keys in a unit feel more familiar, open the free typing
            practice page for timed rounds, word-count challenges, quotes, code,
            or custom text. The guided units and open practice serve different
            purposes: lessons introduce keyboard reaches, while practice lets
            you apply them in varied passages. Return to a lesson whenever a
            particular row or punctuation mark needs more deliberate work.
          </p>
        </div>
      </section>
    </main>
  );
}
