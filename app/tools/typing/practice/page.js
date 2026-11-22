"use client";

import { useEffect, useState } from "react";
import TypingEngine from "../_components/TypingEngine";
import { generateWordSequence } from "../_lib/wordBank";
import { QUOTES, CODE_SNIPPETS } from "../_lib/texts";
import { addSession } from "../_lib/stats";
const MODES = [
  { id: "time", label: "Time attack", tag: "15s / 30s / 60s", icon: "T" },
  { id: "words", label: "Word rush", tag: "25 / 50 / 100 words", icon: "W" },
  { id: "quote", label: "Quotes", tag: "Typed prose", icon: "Q" },
  { id: "code", label: "Code", tag: "Real snippets", icon: "</>" },
  { id: "custom", label: "Custom text", tag: "Paste text to practise", icon: "✎" },
];

export default function PracticePage() {
  const [mode, setMode] = useState("time");
  const [timeOpt, setTimeOpt] = useState(30);
  const [wordOpt, setWordOpt] = useState(25);
  const [customText, setCustomText] = useState("");
  const [seed, setSeed] = useState(0);
  const [lastResult, setLastResult] = useState(null);
  const [text, setText] = useState("");
  const [modeMenuOpen, setModeMenuOpen] = useState(false);

  useEffect(() => {
    if (mode === "time") return setText(generateWordSequence(220).join(" "));
    if (mode === "words") return setText(generateWordSequence(wordOpt).join(" "));
    if (mode === "quote") return setText(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    if (mode === "code") return setText(CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)]);
    setText(customText.trim() || "Paste your text in the box below, then type it here.");
  }, [mode, wordOpt, seed, customText]);

  const resetSession = () => { setLastResult(null); setSeed((value) => value + 1); };
  const chooseMode = (id) => { setMode(id); setModeMenuOpen(false); resetSession(); };
  const handleComplete = (result) => { addSession(result); setLastResult(result); };
  const practiceOptions = (className = "") => {
    const values = mode === "time" ? [15, 30, 60] : mode === "words" ? [25, 50, 100] : null;
    const selected = mode === "time" ? timeOpt : wordOpt;
    const label = mode === "time" ? "Time limit" : "Word count";
    if (!values) return null;

    return <div className={`tf-option-row ${className}`} role="radiogroup" aria-label={label}>{values.map((value) => <button key={value} onClick={() => { mode === "time" ? setTimeOpt(value) : setWordOpt(value); resetSession(); }} className={`btn tf-option ${selected === value ? "is-active" : ""}`} role="radio" aria-checked={selected === value}>{mode === "time" ? `${value}s` : `${value} words`}</button>)}</div>;
  };

  return (
    <main className="tf-page tf-practice-page tf-animate-rise">
      <div className="container-fluid custom-container">
        {!lastResult && <>
          <div className="tf-mode-grid" aria-label="Practice mode">
            {MODES.map((item) => <button key={item.id} onClick={() => chooseMode(item.id)} className={`tf-mode-card btn text-start ${mode === item.id ? "is-active" : ""}`}>
              <span className={`tf-mode-icon tf-mode-icon-${item.id}`}>{item.icon}</span>
              <span><span className="tf-mode-title">{item.label}</span><span className="tf-mode-tag">{item.tag}</span></span>
              {mode === item.id && <span className="tf-mode-check">✓</span>}
            </button>)}
          </div>

          <div className="tf-mobile-mode-select">
            <span className="tf-mode-select-label">Practice mode</span>
            <button type="button" className="tf-mode-select-trigger" onClick={() => setModeMenuOpen((open) => !open)} aria-expanded={modeMenuOpen} aria-haspopup="listbox">
              <span><b>{MODES.find((item) => item.id === mode)?.label}</b><small>{MODES.find((item) => item.id === mode)?.tag}</small></span><i aria-hidden="true">⌄</i>
            </button>
            {modeMenuOpen && <div className="tf-mode-select-menu">{MODES.map((item) => <button type="button" key={item.id} onClick={() => chooseMode(item.id)} className={mode === item.id ? "is-selected" : ""}><span className={`tf-mode-icon tf-mode-icon-${item.id}`}>{item.icon}</span><span><b>{item.label}</b><small>{item.tag}</small></span>{mode === item.id && <em>✓</em>}</button>)}</div>}
          </div>

          {practiceOptions("tf-practice-option-row")}
          {mode === "custom" && <textarea value={customText} onChange={(event) => setCustomText(event.target.value)} placeholder="Paste your paragraph, email draft, or anything else here…" rows={3} className="tf-custom-text tf-border-edge tf-bg-surface tf-text-ink form-control mb-4 tf-fs-sm" />}

          {text && <TypingEngine key={`${mode}-${seed}-${timeOpt}-${wordOpt}-${customText.length}`} text={text} mode={mode} timeLimitSec={mode === "time" ? timeOpt : undefined} autoFocus={mode !== "custom"} sessionControl={practiceOptions("tf-session-option-row")} onComplete={handleComplete} />}
        </>}

        {lastResult && <section className="tf-session-result" aria-live="polite"><div className="tf-result-grid">
          <div className="tf-result-card"><span className="tf-result-icon speed">↗</span><div><div className="tf-result-number">{lastResult.wpm}</div><div className="tf-result-label">Words Per Minute</div></div></div>
          <div className="tf-result-card"><span className="tf-result-icon accuracy">◎</span><div><div className="tf-result-number">{lastResult.accuracy}%</div><div className="tf-result-label">Accuracy</div></div></div>
          <div className="tf-result-card"><span className="tf-result-icon duration">◷</span><div><div className="tf-result-number">{lastResult.durationSec}s</div><div className="tf-result-label">Time Taken</div></div></div>
        </div><div className="tf-result-actions"><button onClick={resetSession} className="tf-btn-brand px-4 py-2">Try again</button></div></section>}
        <section className="tf-card p-4 p-sm-5 mt-5">
          <h2 className="tf-font-display tf-display-3">Typing practice modes</h2>
          <p className="tf-text-muted tf-leading-relaxed mt-3">Use practice mode when you want flexible typing exercises instead of a guided lesson. Time attack is useful for measuring speed, word rush helps with rhythm, quote typing builds sentence flow, and code typing is helpful for developers who want to practice symbols and indentation.</p>
          <p className="tf-text-muted tf-leading-relaxed">Custom text lets you work with your own paragraph or other writing. Choose a short time limit or word count when you want a quick round, then repeat the same mode later to compare how consistent your typing feels.</p>
          <p className="tf-text-muted tf-leading-relaxed">After each completed round, check your WPM and accuracy together. Speed is useful, but accuracy is what makes typing feel controlled and reliable during real work. If errors increase, slow down and focus on clean keystrokes before trying to beat your previous score.</p>
          <h3 className="tf-font-display tf-display-4 mt-4">Choose a format that fits your practice goal</h3>
          <p className="tf-text-muted tf-leading-relaxed mt-3">
            Time attack offers 15, 30, or 60 seconds and is useful when you want
            a short, clearly bounded round. Word rush lets you choose 25, 50, or
            100 words, so you can focus on completing a passage instead of
            watching a countdown. Both modes use a generated sequence of words;
            repeat a similar length when you want to compare how controlled your
            typing feels from one attempt to another.
          </p>
          <p className="tf-text-muted tf-leading-relaxed">
            Quote mode presents a sentence to copy and gives you practice with
            ordinary prose, punctuation, and changing word lengths. Code mode
            uses short snippets with symbols, brackets, and line breaks, which
            can make it a useful change from plain sentences. The snippets are
            practice passages, not a coding exercise: the task is to reproduce
            the visible text accurately.
          </p>
          <p className="tf-text-muted tf-leading-relaxed">
            Custom text lets you paste a paragraph you choose and type it in the
            same practice area. Use a passage that is comfortable to share with
            yourself in the browser, and avoid pasting private information. You
            can change the mode or start another round after a result appears.
            The result screen reports words per minute, accuracy, and time taken
            so you can review more than speed alone.
          </p>
          <h3 className="tf-font-display tf-display-4 mt-4">A practical routine for steady progress</h3>
          <p className="tf-text-muted tf-leading-relaxed mt-3">
            Begin with a short round and keep your eyes on the text rather than
            the keyboard. Use a light touch and return to the home row between
            reaches. If the score shows lower accuracy than you expected, take
            the next attempt more slowly; a clean, consistent rhythm is more
            useful than rushing through mistakes. If a key or symbol repeatedly
            interrupts your flow, revisit the related unit in the{" "}
            <a href="/tools/typing/learn/">touch typing lessons</a>.
          </p>
          <p className="tf-text-muted tf-leading-relaxed">
            There is no single practice mode that suits every session. Timed
            rounds can help you check pace, word counts give you a clear finish
            point, quotes and custom passages resemble everyday writing, and
            code exposes punctuation that is less common in prose. Try one
            format at a time, note both the WPM and accuracy result, and choose
            another format when you want to practise a different kind of text.
          </p>
          <p className="tf-text-muted tf-leading-relaxed">
            Completed sessions are added to the typing history stored in your
            browser. That history can help the lesson list show a best result
            for a unit, but it does not sync across browsers or devices. Clearing
            browser storage can remove that local record. Practice results are
            personal checkpoints, not a certification or a measure of every
            typing task you may do outside this page.
          </p>
        </section>
      </div>
    </main>
  );
}
