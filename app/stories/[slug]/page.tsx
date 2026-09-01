import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReadingProgress } from "@/components/ReadingProgress";
import { ReaderControls } from "@/components/ReaderControls";
import { ShareButton } from "@/components/ShareButton";
import { StoryCard } from "@/components/StoryCard";
import {
  getAllStories,
  getStory,
  getStoriesByCategory,
  formatDate,
} from "@/lib/content";
import { getCategory } from "@/lib/categories";

export function generateStaticParams() {
  return getAllStories().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) return {};
  return {
    title: story.title,
    description: story.excerpt,
    openGraph: {
      title: story.title,
      description: story.excerpt,
      type: "article",
      publishedTime: story.date,
      url: `/stories/${story.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: story.title,
      description: story.excerpt,
    },
  };
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) notFound();

  const cat = getCategory(story.category);
  const more = getStoriesByCategory(story.category)
    .filter((s) => s.slug !== story.slug)
    .slice(0, 3);

  return (
    <>
      <ReadingProgress />
      <article className="container article">
        <header className="article-header">
          <div className="meta" style={{ justifyContent: "space-between" }}>
            <Link href={`/category/${story.category}`} className="pill">
              <span className="glyph">{cat?.glyph ?? "✶"}</span>
              {cat?.label ?? story.category}
            </Link>
            <ReaderControls />
          </div>

          <h1>{story.title}</h1>
          {story.excerpt && <p className="excerpt">{story.excerpt}</p>}

          <div className="meta" style={{ marginTop: "1.4rem" }}>
            <span>By {story.author}</span>
            <span className="dot" />
            <span>{story.readingTime} min read</span>
            <span className="dot" />
            <span>{formatDate(story.date)}</span>
            {story.mood && (
              <>
                <span className="dot" />
                <span>{story.mood}</span>
              </>
            )}
          </div>
        </header>

        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: story.html }}
        />

        <div className="article-foot">
          <Link href="/stories" className="link-underline meta">
            ← All stories
          </Link>
          <ShareButton title={story.title} path={`/stories/${story.slug}`} />
        </div>
      </article>

      {more.length > 0 && (
        <section className="container section" style={{ paddingTop: 0 }}>
          <div className="section-head">
            <span className="eyebrow">More in {cat?.label ?? "this category"}</span>
          </div>
          <div className="grid grid-3">
            {more.map((s) => (
              <StoryCard key={s.slug} story={s} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
