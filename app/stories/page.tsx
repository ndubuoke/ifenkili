import type { Metadata } from "next";
import Link from "next/link";
import { getAllStories, formatDate } from "@/lib/content";
import { categories, getCategory } from "@/lib/categories";

export const metadata: Metadata = {
  title: "Stories",
  description: "Every story on IFENKILI — love, poems, corporate confessions, and more.",
};

export default async function StoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const all = getAllStories();
  const active = category && getCategory(category) ? category : undefined;
  const stories = active ? all.filter((s) => s.category === active) : all;

  return (
    <>
      <section className="container page-intro">
        <p className="eyebrow">The full shelf</p>
        <h1>Stories</h1>
        <p>
          {all.length} {all.length === 1 ? "piece" : "pieces"} and counting. Filter
          by mood, or just start at the top.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", marginTop: "1.6rem" }}>
          <Link href="/stories" className="pill" aria-current={!active ? "page" : undefined}>
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/stories?category=${c.slug}`}
              className="pill"
              aria-current={active === c.slug ? "page" : undefined}
            >
              <span className="glyph">{c.glyph}</span>
              {c.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="container section" style={{ paddingTop: "1rem" }}>
        {stories.length === 0 ? (
          <p className="lede">Nothing here yet. Check back soon.</p>
        ) : (
          <div className="story-list">
            {stories.map((s) => {
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
                  </span>
                  <p className="excerpt">{s.excerpt}</p>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
