import Link from "next/link";
import HeroDemo from "./_components/HeroDemo";
import { typingMetadata } from "./_lib/seo";

export const metadata = typingMetadata({
  title: "Free Typing Practice: Improve Speed & Accuracy",
  description: "Practice typing for free with guided touch-typing lessons, timed speed tests, code typing, quotes, and private WPM tracking.",
  path: "/typing",
  keywords: ["online typing practice", "typing speed practice", "WPM test"],
});

const FEATURES = [
  {
    tag: "Guided",
    title: "8 progressive lessons",
    body: "Start at the home row and build up to full sentences — every lesson comes with a finger guide.",
    href: "/typing/learn",
    cta: "View lessons",
  },
  {
    tag: "Practice",
    title: "4 practice modes",
    body: "Time attack, word rush, quote typing, and real code snippets — pick whatever mood you're in.",
    href: "/typing/practice",
    cta: "Start practicing",
  },
  {
    tag: "Insight",
    title: "Deep stats dashboard",
    body: "WPM trend, accuracy, streaks, and your weakest keys — all saved locally.",
    href: "/typing/stats",
    cta: "View stats",
  },
];

export default function TypingHome() {
  return (
    <div className="tf-scope tf-typing-home">
      <div className="tf-animate-rise">
        <div className="container-fluid custom-container">
          <div className="row g-4 align-items-center tf-home-hero">
            <div className="col-12 col-lg-7">
              <span className="tf-home-badge"><span /> Premium typing trainer</span>
              <h1 className="tf-home-title">
                Learn typing like
                <br />
                <span>a craft</span>, not a chore.
              </h1>
              <p className="tf-home-sub">
                TypeForge isn't just a speed test. It's a complete system of
                finger-by-finger lessons, multiple practice modes, and mistake
                tracking — all at your own pace.
              </p>
              <div className="tf-home-actions buttons-row-mobile-full">
                <Link
                  href="/typing/learn"
                  prefetch={false}
                  className="tf-home-btn-primary"
                >
                  Start learning
                </Link>
                <Link
                  href="/typing/practice"
                  prefetch={false}
                  className="tf-home-btn-outline"
                >
                  Jump straight to practice
                </Link>
              </div>
            </div>

            <div className="col-12 col-lg-5">
              <p
                className="tf-text-muted tf-font-mono tf-fs-xs text-uppercase text-center mb-2"
                style={{ letterSpacing: "0.15em" }}
              >
                type below to try it ↓
              </p>
              <HeroDemo />
            </div>
          </div>
        </div>
        <div className="container-fluid custom-container">
          <div className="row g-3 mt-2">
            {FEATURES.map((f) => (
              <div key={f.href} className="col-12 col-sm-4">
                <Link
                  href={f.href}
                  prefetch={false}
                  className="tf-card tf-hover-border-brand tf-lift-hover d-block p-4 h-100"
                >
                  <span className="tf-text-brand tf-font-mono tf-fs-xs">
                    {f.tag}
                  </span>
                  <h3 className="tf-font-display tf-display-3 mt-2">
                    {f.title}
                  </h3>
                  <p className="tf-text-muted tf-fs-sm tf-leading-relaxed mt-2">
                    {f.body}
                  </p>
                  <span className="tf-text-ink tf-fs-sm fw-medium mt-3 d-inline-flex align-items-center gap-1">
                    {f.cta} <span aria-hidden>→</span>
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div className="container-fluid custom-container">
          <div className="tf-card tf-py-10 mt-5 p-4 p-sm-5">
            <div className="row g-4 text-center text-sm-start">
              {[
                ["8", "guided lessons"],
                ["4", "practice modes"],
                ["100%", "local & private"],
                ["0₹", "no signup needed"],
              ].map(([n, l]) => (
                <div key={l} className="col-6 col-sm-3">
                  <div className="tf-font-display tf-text-gradient tf-display-2">
                    {n}
                  </div>
                  <div className="tf-text-muted tf-fs-sm mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
