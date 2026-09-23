import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import type { CategorySlug } from "./categories";

const STORIES_DIR = path.join(process.cwd(), "content", "stories");

export type Story = {
  slug: string;
  title: string;
  excerpt: string;
  category: CategorySlug;
  author: string;
  anonymous: boolean;
  mood?: string;
  date: string; // ISO yyyy-mm-dd
  featured: boolean;
  readingTime: number; // minutes
  wordCount: number;
  html: string;
  raw: string;
};

marked.setOptions({ gfm: true, breaks: false });

function readStoryFile(fileName: string): Story {
  const slug = fileName.replace(/\.mdx?$/, "");
  const full = path.join(STORIES_DIR, fileName);
  const file = fs.readFileSync(full, "utf8");
  const { data, content } = matter(file);

  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.round(words / 200));
  const anonymous = Boolean(data.anonymous);

  // YAML parses an unquoted `date: 2026-08-24` as a native Date, not a
  // string — String(date) then yields a localized, non-ISO format. Normalize
  // both that case and a plain string back to yyyy-mm-dd.
  const date =
    data.date instanceof Date
      ? data.date.toISOString().slice(0, 10)
      : String(data.date ?? "1970-01-01");

  return {
    slug,
    title: String(data.title ?? slug),
    excerpt: String(data.excerpt ?? ""),
    category: (data.category ?? "love") as CategorySlug,
    author: anonymous ? "Anonymous" : String(data.author ?? "Ifenkili"),
    anonymous,
    mood: data.mood ? String(data.mood) : undefined,
    date,
    featured: Boolean(data.featured),
    readingTime,
    wordCount: words,
    html: marked.parse(content) as string,
    raw: content,
  };
}

let cache: Story[] | null = null;

// A story whose `date` is in the future is scheduled, not published — it's
// parsed and cached like any other file, but stays invisible until that date
// (UTC midnight) arrives. Combined with `export const revalidate` on the
// listing pages, this lets a scheduled story go live on its own without a
// redeploy.
function isPublished(story: Story): boolean {
  return new Date(`${story.date}T00:00:00Z`).getTime() <= Date.now();
}

function getRawStories(): Story[] {
  if (cache && process.env.NODE_ENV === "production") return cache;
  if (!fs.existsSync(STORIES_DIR)) return [];
  const files = fs
    .readdirSync(STORIES_DIR)
    .filter((f) => /\.mdx?$/.test(f) && !f.startsWith("_"));
  const stories = files
    .map(readStoryFile)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  cache = stories;
  return stories;
}

export function getAllStories(): Story[] {
  return getRawStories().filter(isPublished);
}

export function getStory(slug: string): Story | undefined {
  return getAllStories().find((s) => s.slug === slug);
}

export function getStoriesByCategory(category: string): Story[] {
  return getAllStories().filter((s) => s.category === category);
}

export function getFeaturedStory(): Story | undefined {
  const all = getAllStories();
  return all.find((s) => s.featured) ?? all[0];
}

export function getLatestStories(limit = 6, excludeSlug?: string): Story[] {
  return getAllStories()
    .filter((s) => s.slug !== excludeSlug)
    .slice(0, limit);
}

export function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
