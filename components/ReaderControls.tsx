"use client";

import { useEffect, useState } from "react";

const KEY = "ifenkili:reader-scale";
const MIN = 0.9;
const MAX = 1.4;
const STEP = 0.1;

export function ReaderControls() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const stored = Number(localStorage.getItem(KEY));
    if (stored >= MIN && stored <= MAX) setScale(stored);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--reader-scale", String(scale));
    localStorage.setItem(KEY, String(scale));
  }, [scale]);

  const bump = (dir: number) =>
    setScale((s) => Math.min(MAX, Math.max(MIN, Math.round((s + dir * STEP) * 10) / 10)));

  return (
    <div className="reader-controls" aria-label="Text size">
      <button onClick={() => bump(-1)} aria-label="Smaller text" disabled={scale <= MIN}>
        A−
      </button>
      <button onClick={() => bump(1)} aria-label="Larger text" disabled={scale >= MAX}>
        A+
      </button>
    </div>
  );
}
