export const FINGER_LABEL = {
  "L-pinky": "Left pinky",
  "L-ring": "Left ring",
  "L-middle": "Left middle",
  "L-index": "Left index",
  "R-index": "Right index",
  "R-middle": "Right middle",
  "R-ring": "Right ring",
  "R-pinky": "Right pinky",
  thumb: "Thumb",
};

// QWERTY rows, left-to-right, finger-assigned per touch-typing convention.
export const KEYBOARD_ROWS = [
  [
    { key: "`", shiftKey: "~", finger: "L-pinky" },
    { key: "1", shiftKey: "!", finger: "L-pinky" },
    { key: "2", shiftKey: "@", finger: "L-ring" },
    { key: "3", shiftKey: "#", finger: "L-middle" },
    { key: "4", shiftKey: "$", finger: "L-index" },
    { key: "5", shiftKey: "%", finger: "L-index" },
    { key: "6", shiftKey: "^", finger: "R-index" },
    { key: "7", shiftKey: "&", finger: "R-index" },
    { key: "8", shiftKey: "*", finger: "R-middle" },
    { key: "9", shiftKey: "(", finger: "R-ring" },
    { key: "0", shiftKey: ")", finger: "R-pinky" },
    { key: "-", shiftKey: "_", finger: "R-pinky" },
    { key: "=", shiftKey: "+", finger: "R-pinky" },
  ],
  [
    { key: "q", finger: "L-pinky" },
    { key: "w", finger: "L-ring" },
    { key: "e", finger: "L-middle" },
    { key: "r", finger: "L-index" },
    { key: "t", finger: "L-index" },
    { key: "y", finger: "R-index" },
    { key: "u", finger: "R-index" },
    { key: "i", finger: "R-middle" },
    { key: "o", finger: "R-ring" },
    { key: "p", finger: "R-pinky" },
    { key: "[", shiftKey: "{", finger: "R-pinky" },
    { key: "]", shiftKey: "}", finger: "R-pinky" },
  ],
  [
    { key: "a", finger: "L-pinky" },
    { key: "s", finger: "L-ring" },
    { key: "d", finger: "L-middle" },
    { key: "f", finger: "L-index" },
    { key: "g", finger: "L-index" },
    { key: "h", finger: "R-index" },
    { key: "j", finger: "R-index" },
    { key: "k", finger: "R-middle" },
    { key: "l", finger: "R-ring" },
    { key: ";", shiftKey: ":", finger: "R-pinky" },
    { key: "'", shiftKey: '"', finger: "R-pinky" },
  ],
  [
    { key: "z", finger: "L-pinky" },
    { key: "x", finger: "L-ring" },
    { key: "c", finger: "L-middle" },
    { key: "v", finger: "L-index" },
    { key: "b", finger: "L-index" },
    { key: "n", finger: "R-index" },
    { key: "m", finger: "R-index" },
    { key: ",", shiftKey: "<", finger: "R-middle" },
    { key: ".", shiftKey: ">", finger: "R-ring" },
    { key: "/", shiftKey: "?", finger: "R-pinky" },
  ],
];

export const HOME_ROW = ["a", "s", "d", "f", "j", "k", "l", ";"];

export function fingerForChar(char) {
  const lower = char.toLowerCase();
  if (lower === " ") return "thumb";
  for (const row of KEYBOARD_ROWS) {
    for (const k of row) {
      if (k.key === lower || k.shiftKey === lower) return k.finger;
    }
  }
  return null;
}
