import { typingMetadata, TypingJsonLd } from "../_lib/seo";

export const metadata = typingMetadata({ title: "Free Typing Test & Practice Modes", description: "Take a free typing test or practice with timed challenges, word drills, quotes, code snippets, and your own custom text.", path: "/typing/practice", keywords: ["free typing test", "typing speed test", "typing practice online", "code typing test"] });

export default function PracticeLayout({ children }) {
  return <><TypingJsonLd name="ResumeSathi Free Typing Test" description="A free online typing practice tool with timed tests, word drills, quotes, code snippets, and custom text." path="/typing/practice" />{children}</>;
}
