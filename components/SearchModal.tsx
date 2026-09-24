"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getCategory } from "@/lib/categories";

export type SearchEntry = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  mood: string | null;
};

export function SearchModal({ stories }: { stories: SearchEntry[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return stories.slice(0, 8);
    return stories
      .filter((s) =>
        [s.title, s.excerpt, s.category, s.mood ?? ""].some((f) =>
          f.toLowerCase().includes(q),
        ),
      )
      .slice(0, 10);
  }, [query, stories]);

  const open = () => {
    setQuery("");
    setActive(0);
    dialogRef.current?.showModal();
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const close = () => dialogRef.current?.close();

  const go = (slug: string) => {
    close();
    router.push(`/stories/${slug}`);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isOpen = dialogRef.current?.open;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        isOpen ? close() : open();
        return;
      }
      if (!isOpen) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((a) => Math.min(a + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
      } else if (e.key === "Enter") {
        const pick = results[active];
        if (pick) go(pick.slug);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results, active]);

  return (
    <>
      <button className="icon-btn" onClick={open} aria-label="Search stories" title="Search (⌘K)">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </button>

      <dialog
        ref={dialogRef}
        className="search-modal"
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <div className="search-box">
          <div className="search-input-row">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              placeholder="Search titles, moods, moments…"
              aria-label="Search stories"
            />
            <kbd>Esc</kbd>
          </div>

          <div className="search-results">
            {results.length === 0 ? (
              <p className="search-empty">Nothing matches yet — try another word.</p>
            ) : (
              results.map((s, i) => {
                const cat = getCategory(s.category);
                return (
                  <button
                    key={s.slug}
                    className={`search-result ${i === active ? "active" : ""}`}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(s.slug)}
                    style={{ width: "100%", textAlign: "left", background: "none", border: 0, cursor: "pointer" }}
                  >
                    <h4>{s.title}</h4>
                    <span>
                      {cat?.label ?? s.category}
                      {s.mood ? ` · ${s.mood}` : ""}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
