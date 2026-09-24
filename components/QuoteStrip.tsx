import type { Story } from "@/lib/content";

export function QuoteStrip({ stories }: { stories: Story[] }) {
  const picks = stories.filter((s) => s.excerpt).slice(0, 4);
  if (picks.length === 0) return null;

  return (
    <div className="quote-strip">
      <div className="container">
        <div className="quote-stack">
          {picks.map((s) => (
            <blockquote key={s.slug} className="quote-text">
              &ldquo;{s.excerpt}&rdquo;
              <cite>— {s.title}</cite>
            </blockquote>
          ))}
        </div>
      </div>
    </div>
  );
}
