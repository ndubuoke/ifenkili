import Link from "next/link";
import { categories } from "@/lib/categories";

export function CategoryStrip() {
  return (
    <div className="cat-list reveal">
      {categories.map((c) => (
        <Link key={c.slug} href={`/category/${c.slug}`}>
          <span className="cat-name">
            <span className="glyph">{c.glyph}</span>
            {c.label}
          </span>
          <span className="cat-blurb">{c.blurb}</span>
        </Link>
      ))}
    </div>
  );
}
