import Link from "next/link";
import type { Story } from "@/lib/content";
import { formatDate } from "@/lib/content";
import { getCategory } from "@/lib/categories";

export function FeaturedStory({ story }: { story: Story }) {
  const cat = getCategory(story.category);
  return (
    <article className="featured reveal">
      <div className="panel">
        <div className="pill">
          <span className="glyph">{cat?.glyph ?? "✶"}</span>
          Featured
        </div>
        <h2>{story.title}</h2>
        <p className="excerpt">{story.excerpt}</p>
        <div className="meta">
          <span>{story.author}</span>
          <span className="dot" />
          <span>{story.readingTime} min read</span>
          <span className="dot" />
          <span>{formatDate(story.date)}</span>
        </div>
        <div style={{ marginTop: "0.6rem" }}>
          <Link href={`/stories/${story.slug}`} className="btn btn-primary">
            Read the story →
          </Link>
        </div>
      </div>
      <div className="art" aria-hidden="true" />
    </article>
  );
}
