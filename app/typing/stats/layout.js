import { typingMetadata, TypingJsonLd } from "../_lib/seo";

export const metadata = typingMetadata({ title: "Typing Speed & Accuracy Progress Tracker", description: "Track typing speed, accuracy, streaks, and commonly missed keys privately in your browser with ResumeSathi Typing.", path: "/typing/stats", keywords: ["typing progress tracker", "typing accuracy tracker", "WPM tracker"] });

export default function StatsLayout({ children }) {
  return <><TypingJsonLd name="ResumeSathi Typing Progress Tracker" description="A private browser-based dashboard for tracking typing speed, accuracy, practice streaks, and missed keys." path="/typing/stats" /><h1 className="visually-hidden">Typing Speed and Accuracy Progress Tracker</h1>{children}</>;
}
