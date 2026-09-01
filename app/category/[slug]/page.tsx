import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoryCard } from "@/components/StoryCard";
import { categories, getCategory } from "@/lib/categories";
import { getStoriesByCategory } from "@/lib/content";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) return {};
  return { title: cat.label, description: cat.blurb };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) notFound();

  const stories = getStoriesByCategory(slug);

  return (
    <>
      <section className="container page-intro">
        <p className="eyebrow">
          <span className="glyph">{cat.glyph}</span> Category
        </p>
        <h1>{cat.label}</h1>
        <p>{cat.blurb}</p>
      </section>

      <section className="container section" style={{ paddingTop: "1rem" }}>
        {stories.length === 0 ? (
          <p className="lede">No stories here yet — yours could be the first.</p>
        ) : (
          <div className="grid grid-3">
            {stories.map((s) => (
              <StoryCard key={s.slug} story={s} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
