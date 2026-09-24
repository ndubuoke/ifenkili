import { NextResponse } from "next/server";
import { getAllStories } from "@/lib/content";

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const stories = getAllStories();
  const destination =
    stories.length === 0
      ? "/stories"
      : `/stories/${stories[Math.floor(Math.random() * stories.length)].slug}`;
  return NextResponse.redirect(new URL(destination, request.url));
}
