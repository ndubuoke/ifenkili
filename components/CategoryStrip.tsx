import Link from "next/link";
import { categories } from "@/lib/categories";
import { getAllStories } from "@/lib/content";

const TINTS = [
  "radial-gradient(120% 120% at 100% 0%, color-mix(in srgb, var(--c-rust) 55%, transparent), transparent 60%)",
  "radial-gradient(120% 120% at 0% 0%, color-mix(in srgb, var(--c-rust) 45%, transparent), transparent 60%)",
  "radial-gradient(120% 120% at 100% 100%, color-mix(in srgb, var(--c-rust) 40%, transparent), transparent 60%)",
  "radial-gradient(120% 120% at 0% 100%, color-mix(in srgb, var(--c-rust) 50%, transparent), transparent 60%)",
];

export function CategoryStrip() {
  const all = getAllStories();
  const counts = Object.fromEntries(
    categories.map((c) => [c.slug, all.filter((s) => s.category === c.slug).length]),
  );

  return (
    <div className="collections-grid reveal">
      {categories.map((c, i) => (
        <Link
          key={c.slug}
          href={`/category/${c.slug}`}
          className="collection-card"
          style={{ ["--tint" as string]: TINTS[i % TINTS.length] }}
        >
          <span className="cat-name">
            {c.glyph} {c.label}
          </span>
          <span className="cat-count">
            {counts[c.slug]} {counts[c.slug] === 1 ? "piece" : "pieces"}
          </span>
        </Link>
      ))}
    </div>
  );
}
