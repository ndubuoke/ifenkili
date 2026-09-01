import Link from "next/link";
import { FeaturedStory } from "@/components/FeaturedStory";
import { StoryCard } from "@/components/StoryCard";
import { CategoryStrip } from "@/components/CategoryStrip";
import { NewsletterForm } from "@/components/NewsletterForm";
import { getFeaturedStory, getLatestStories } from "@/lib/content";

export default function HomePage() {
  const featured = getFeaturedStory();
  const latest = getLatestStories(6, featured?.slug).slice(0, 6);

  return (
    <>
      <section className="container hero">
        <p className="eyebrow reveal">A home for stories that people feel</p>
        <h1 className="h-display reveal">
          Stories worth <span className="gradient-text">feeling</span>.
        </h1>
        <p className="lede reveal">
          Love, poems, corporate confessions, and the small true things that make
          people say <em>&ldquo;that happened to me.&rdquo;</em> Beautifully set, and
          quiet enough to actually read.
        </p>
        <div className="cta-row reveal">
          <Link href="/stories" className="btn btn-primary">
            Start reading
          </Link>
          <Link href="/submit" className="btn btn-ghost">
            Submit your story
          </Link>
        </div>
      </section>

      {featured && (
        <section className="container section" style={{ paddingTop: 0 }}>
          <div className="section-head">
            <span className="eyebrow">Today&rsquo;s featured story</span>
          </div>
          <FeaturedStory story={featured} />
        </section>
      )}

      {latest.length > 0 && (
        <section className="container section" style={{ paddingTop: 0 }}>
          <div className="section-head">
            <span className="eyebrow">Latest</span>
            <Link href="/stories" className="link-underline meta">
              All stories →
            </Link>
          </div>
          <div className="grid grid-3">
            {latest.map((s) => (
              <StoryCard key={s.slug} story={s} />
            ))}
          </div>
        </section>
      )}

      <section className="container section" style={{ paddingTop: 0 }}>
        <div className="section-head">
          <span className="eyebrow">Wander by mood</span>
        </div>
        <CategoryStrip />
      </section>

      <section className="container section" style={{ paddingTop: 0 }}>
        <div className="newsletter reveal">
          <h2>Five stories worth reading, every Friday.</h2>
          <p>
            No spam, no feeds, no algorithm. One quiet email to end the week with
            something human.
          </p>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}
