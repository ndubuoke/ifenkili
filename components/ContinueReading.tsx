"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCategory } from "@/lib/categories";
import type { ProgressEntry } from "@/components/ReadingProgress";

const KEY = "ifenkili:progress";

export function ContinueReading() {
  const [entries, setEntries] = useState<ProgressEntry[] | null>(null);

  useEffect(() => {
    try {
      const store = JSON.parse(localStorage.getItem(KEY) ?? "{}") as Record<
        string,
        ProgressEntry
      >;
      const list = Object.values(store)
        .filter((e) => e.pct >= 4 && e.pct <= 96)
        .sort((a, b) => b.updatedAt - a.updatedAt)
        .slice(0, 4);
      setEntries(list);
    } catch {
      setEntries([]);
    }
  }, []);

  if (!entries || entries.length === 0) return null;

  return (
    <section className="container section" style={{ paddingTop: 0 }}>
      <div className="section-head">
        <span className="eyebrow">Continue reading</span>
      </div>
      <div className="grid grid-4">
        {entries.map((e) => {
          const cat = getCategory(e.category);
          return (
            <Link key={e.slug} href={`/stories/${e.slug}`} className="card reveal" style={{ textDecoration: "none" }}>
              <div className="pill">
                <span className="glyph">{cat?.glyph ?? "✶"}</span>
                {cat?.label ?? e.category}
              </div>
              <h3>{e.title}</h3>
              <div className="card-foot meta">
                <span>{e.readingTime} min read</span>
                {e.mood && (
                  <>
                    <span className="dot" />
                    <span>{e.mood}</span>
                  </>
                )}
              </div>
              <div className="card-progress" aria-hidden="true">
                <span style={{ width: `${e.pct}%` }} />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
