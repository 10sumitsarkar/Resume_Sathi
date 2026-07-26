import { typingMetadata, TypingJsonLd } from "../_lib/seo";

export const metadata = typingMetadata({ title: "Learn Touch Typing: Free Step-by-Step Lessons", description: "Learn touch typing step by step with free lessons that build finger placement, accuracy, and typing speed at your own pace.", path: "/typing/learn", keywords: ["touch typing lessons", "learn typing online", "typing tutor for beginners"] });

export default function LearnLayout({ children }) {
  return <><TypingJsonLd name="ResumeSathi Touch Typing Lessons" description="Free progressive lessons for learning touch typing, finger placement, speed, and accuracy." path="/typing/learn" />{children}</>;
}
