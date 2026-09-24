"use client";

import { useEffect, useState } from "react";

const KEY = "ifenkili:progress";
const MAX_ENTRIES = 12;

export type ProgressEntry = {
  slug: string;
  title: string;
  category: string;
  mood: string | null;
  readingTime: number;
  pct: number;
  updatedAt: number;
};

type StoryMeta = {
  slug: string;
  title: string;
  category: string;
  mood: string | null;
  readingTime: number;
};

function readStore(): Record<string, ProgressEntry> {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}

function writeStore(store: Record<string, ProgressEntry>) {
  const entries = Object.values(store)
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, MAX_ENTRIES);
  const trimmed = Object.fromEntries(entries.map((e) => [e.slug, e]));
  try {
    localStorage.setItem(KEY, JSON.stringify(trimmed));
  } catch {
    /* ignore quota errors */
  }
}

export function ReadingProgress({ story }: { story?: StoryMeta }) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let lastSaved = 0;
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      const value = max > 0 ? Math.min(100, (el.scrollTop / max) * 100) : 0;
      setPct(value);

      if (!story) return;
      const now = Date.now();
      if (now - lastSaved < 800) return;
      lastSaved = now;
      const store = readStore();
      store[story.slug] = {
        slug: story.slug,
        title: story.title,
        category: story.category,
        mood: story.mood,
        readingTime: story.readingTime,
        pct: Math.round(value),
        updatedAt: now,
      };
      writeStore(store);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [story?.slug]);

  return (
    <div
      className="reading-progress"
      style={{ width: `${pct}%` }}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    />
  );
}
