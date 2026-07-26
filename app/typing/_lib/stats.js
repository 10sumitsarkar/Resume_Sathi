const KEY = "typeforge:history:v1";
const MAX_HISTORY = 200;

export function readHistory() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addSession(result) {
  const history = readHistory();
  const next = [...history, result].slice(-MAX_HISTORY);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  }
  return next;
}

export function clearHistory() {
  if (typeof window !== "undefined") window.localStorage.removeItem(KEY);
}

export function aggregate(history) {
  if (history.length === 0) {
    return {
      count: 0,
      avgWpm: 0,
      bestWpm: 0,
      avgAccuracy: 0,
      totalMinutes: 0,
      streak: 0,
      topErrors: [],
    };
  }
  const avgWpm = Math.round(history.reduce((s, h) => s + h.wpm, 0) / history.length);
  const bestWpm = Math.max(...history.map((h) => h.wpm));
  const avgAccuracy = Math.round(history.reduce((s, h) => s + h.accuracy, 0) / history.length);
  const totalMinutes = Math.round(history.reduce((s, h) => s + h.durationSec, 0) / 60);

  const errorMap = {};
  for (const h of history) {
    for (const [char, count] of Object.entries(h.charErrors || {})) {
      errorMap[char] = (errorMap[char] || 0) + count;
    }
  }
  const topErrors = Object.entries(errorMap)
    .map(([char, count]) => ({ char, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const days = new Set(history.map((h) => h.date.slice(0, 10)));
  let streak = 0;
  const cursor = new Date();
  for (;;) {
    const iso = cursor.toISOString().slice(0, 10);
    if (days.has(iso)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else break;
  }

  return { count: history.length, avgWpm, bestWpm, avgAccuracy, totalMinutes, streak, topErrors };
}

export function lessonBestWpm(history, lessonId) {
  const matches = history.filter((h) => h.mode === "lesson" && h.label === lessonId);
  if (matches.length === 0) return null;
  return Math.max(...matches.map((m) => m.wpm));
}
