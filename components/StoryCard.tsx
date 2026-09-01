import Link from "next/link";
import type { Story } from "@/lib/content";
import { formatDate } from "@/lib/content";
import { getCategory } from "@/lib/categories";

export function StoryCard({ story }: { story: Story }) {
  const cat = getCategory(story.category);
  return (
    <article className="card reveal">
      <div className="pill">
        <span className="glyph">{cat?.glyph ?? "✶"}</span>
        {cat?.label ?? story.category}
      </div>
      <h3>{story.title}</h3>
      <p className="excerpt">{story.excerpt}</p>
      <div className="card-foot meta">
        <span>{story.author}</span>
        <span className="dot" />
        <span>{story.readingTime} min read</span>
        <span className="dot" />
        <span>{formatDate(story.date)}</span>
      </div>
      <Link
        href={`/stories/${story.slug}`}
        className="stretched"
        aria-label={`Read “${story.title}”`}
      />
    </article>
  );
}
