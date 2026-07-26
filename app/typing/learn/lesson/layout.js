import { typingMetadata, TypingJsonLd } from "../../_lib/seo";

export const metadata = typingMetadata({ title: "Typing Lesson Practice: Build Speed & Accuracy", description: "Complete guided typing lesson practice to strengthen finger placement, improve accuracy, and build touch-typing speed.", path: "/typing/learn/lesson", keywords: ["typing lesson practice", "typing exercises", "finger placement practice"] });

export default function LessonLayout({ children }) {
  return <><TypingJsonLd name="ResumeSathi Guided Typing Lesson" description="An interactive typing lesson designed to improve touch-typing accuracy and speed." path="/typing/learn/lesson" />{children}</>;
}
