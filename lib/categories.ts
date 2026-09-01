export type CategorySlug =
  | "love"
  | "poems"
  | "corporate"
  | "confessions"
  | "nigerian"
  | "coffee-break";

export type Category = {
  slug: CategorySlug;
  label: string;
  glyph: string;
  blurb: string;
};

export const categories: Category[] = [
  {
    slug: "love",
    label: "Love Stories",
    glyph: "❤",
    blurb: "First love, breakups, marriage, situationships — the whole reckless map of it.",
  },
  {
    slug: "poems",
    label: "Poems",
    glyph: "✶",
    blurb: "One poem per page. Big type, low light, nothing in the way.",
  },
  {
    slug: "corporate",
    label: "Corporate Tales",
    glyph: "▚",
    blurb: "Office confessions, told anonymously. The reply-all, the promotion that cost you, the meeting that should've been an email.",
  },
  {
    slug: "confessions",
    label: "Confessions",
    glyph: "◍",
    blurb: "Anonymous. The things you've never said out loud.",
  },
  {
    slug: "nigerian",
    label: "Nigerian Stories",
    glyph: "◆",
    blurb: "Corpers, parents, the village, japa. Home, in all its noise.",
  },
  {
    slug: "coffee-break",
    label: "Coffee Break",
    glyph: "❍",
    blurb: "Stories you can finish before the kettle boils.",
  },
];

export const categoryMap: Record<string, Category> = Object.fromEntries(
  categories.map((c) => [c.slug, c]),
);

export function getCategory(slug: string): Category | undefined {
  return categoryMap[slug];
}
