"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Story } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { getCategory } from "@/lib/categories";

export function StoryListFilter({ stories }: { stories: Story[] }) {
  const [mood, setMood] = useState<string | null>(null);

  const moods = useMemo(() => {
    const set = new Set<string>();
    stories.forEach((s) => s.mood && set.add(s.mood));
    return Array.from(set).sort();
  }, [stories]);

  const visible = mood ? stories.filter((s) => s.mood === mood) : stories;

  return (
    <>
      {moods.length > 1 && (
        <div className="chip-row" style={{ marginTop: "1.1rem" }}>
          <button className={`chip ${!mood ? "active" : ""}`} onClick={() => setMood(null)}>
            Any mood
          </button>
          {moods.map((m) => (
            <button
              key={m}
              className={`chip ${mood === m ? "active" : ""}`}
              onClick={() => setMood(mood === m ? null : m)}
            >
              {m}
            </button>
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <p className="empty-note">No stories in that mood yet — try another.</p>
      ) : (
        <div className="story-list">
          {visible.map((s) => {
            const cat = getCategory(s.category);
            return (
              <article key={s.slug} className="story-row">
                <h3>
                  <Link href={`/stories/${s.slug}`} className="link-underline">
                    {s.title}
                  </Link>
                </h3>
                <span className="meta">
                  <span>{cat?.label}</span>
                  <span className="dot" />
                  <span>{s.readingTime} min</span>
                  <span className="dot" />
                  <span>{formatDate(s.date)}</span>
                  {s.mood && (
                    <>
                      <span className="dot" />
                      <span>{s.mood}</span>
                    </>
                  )}
                </span>
                <p className="excerpt">{s.excerpt}</p>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
