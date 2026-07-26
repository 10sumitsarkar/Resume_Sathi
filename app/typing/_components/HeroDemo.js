"use client";

import TypingEngine from "./TypingEngine";

const LINES = [
  "type this line to feel the flow.",
  "your fingers already know the way.",
  "speed is just accuracy, repeated.",
];

export default function HeroDemo() {
  return (
    <TypingEngine
      text={LINES[0]}
      mode="custom"
      showKeyboard={false}
      showFingerHint={false}
      showProgress={false}
      onComplete={() => {}}
    />
  );
}
