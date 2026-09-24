import Link from "next/link";
import { FeaturedStory } from "@/components/FeaturedStory";
import { StoryCard } from "@/components/StoryCard";
import { CategoryStrip } from "@/components/CategoryStrip";
import { NewsletterForm } from "@/components/NewsletterForm";
import { QuoteStrip } from "@/components/QuoteStrip";
import { ContinueReading } from "@/components/ContinueReading";
import { VideoTrailer } from "@/components/VideoTrailer";
import { getAllStories, getFeaturedStory, getLatestStories } from "@/lib/content";
import { categories } from "@/lib/categories";

export const revalidate = 300;

export default function HomePage() {
  const all = getAllStories();
  const featured = getFeaturedStory();
  const latest = getLatestStories(6, featured?.slug).slice(0, 6);
  const quotable = getLatestStories(4, featured?.slug);

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div>
              <p className="eyebrow reveal">Read · feel · return</p>
              <h1 className="h-display reveal">
                Stories worth <span className="gradient-text">feeling</span>.
              </h1>
              <p className="lede reveal">
                Love, poems, corporate confessions, and the small true things that
                make people say &ldquo;that happened to me.&rdquo; Beautifully set,
                and quiet enough to actually read.
              </p>
              <div className="cta-row reveal">
                <Link href="/stories" className="btn btn-primary">
                  Start reading →
                </Link>
                <Link href="/submit" className="btn btn-ghost">
                  Submit your story
                </Link>
              </div>
              <div className="stat-row reveal">
                <div className="stat">
                  <b>{all.length}</b>
                  <span>Stories</span>
                </div>
                <div className="stat">
                  <b>{categories.length}</b>
                  <span>Moods to wander</span>
                </div>
                <div className="stat">
                  <b>0</b>
                  <span>Algorithms</span>
                </div>
              </div>
            </div>

            <div className="hero-aside reveal">
              <div className="hero-card">
                <p className="note">
                  &ldquo;Some people become memories before they become
                  strangers.&rdquo;
                  <cite>IFENKILI</cite>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <QuoteStrip stories={quotable} />

      <ContinueReading />

      <section className="container section" style={{ paddingTop: 0 }}>
        <div className="section-head">
          <span className="eyebrow">Featured collections</span>
        </div>
        <CategoryStrip />
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
          <span className="eyebrow">Watch</span>
        </div>
        <div style={{ maxWidth: 640 }}>
          <VideoTrailer
            poster="/trailer.jpg"
            src="/trailer.mp4"
            title="IFENKILI — Stories worth feeling"
          />
          <p className="meta" style={{ marginTop: "0.9rem" }}>
            A 20-second feel for the whole idea.
          </p>
        </div>
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
