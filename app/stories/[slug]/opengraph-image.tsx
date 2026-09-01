import { ImageResponse } from "next/og";
import { getStory } from "@/lib/content";
import { getCategory } from "@/lib/categories";
import { site } from "@/lib/site";

export const runtime = "nodejs";
export const alt = "IFENKILI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = getStory(slug);
  const title = story?.title ?? site.name;
  const label = story ? getCategory(story.category)?.label ?? "Story" : site.tagline;
  const author = story?.author ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "linear-gradient(135deg, #08080b 0%, #14101f 55%, #1e1020 100%)",
          color: "#ededf2",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#a78bfa",
          }}
        >
          {label}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: title.length > 60 ? 66 : 84,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: -2,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 28,
          }}
        >
          <span style={{ letterSpacing: 8, fontWeight: 700 }}>IFENKILI</span>
          <span style={{ color: "#8a8a99" }}>{author && `by ${author}`}</span>
        </div>
      </div>
    ),
    size,
  );
}
