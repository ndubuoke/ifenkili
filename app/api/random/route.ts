import { NextResponse } from "next/server";
import { getAllStories } from "@/lib/content";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export function GET() {
  const stories = getAllStories();
  const destination =
    stories.length === 0
      ? "/stories"
      : `/stories/${stories[Math.floor(Math.random() * stories.length)].slug}`;
  // Built from the configured site URL, not the request — behind Fly's
  // proxy, request.url reflects the internal 0.0.0.0 address, not the
  // public host.
  return NextResponse.redirect(new URL(destination, site.url));
}
