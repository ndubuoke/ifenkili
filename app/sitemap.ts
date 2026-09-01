import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { categories } from "@/lib/categories";
import { getAllStories } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const staticRoutes = ["", "/stories", "/submit", "/about"].map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
  }));

  const categoryRoutes = categories.map((c) => ({
    url: `${base}/category/${c.slug}`,
    lastModified: new Date(),
  }));

  const storyRoutes = getAllStories().map((s) => ({
    url: `${base}/stories/${s.slug}`,
    lastModified: new Date(s.date),
  }));

  return [...staticRoutes, ...categoryRoutes, ...storyRoutes];
}
