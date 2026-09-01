import { NextResponse } from "next/server";
import { deliver } from "@/lib/inbox";
import { categoryMap } from "@/lib/categories";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function s(v: unknown, max: number): string {
  return String(v ?? "").trim().slice(0, max);
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const title = s(body.title, 140);
  const category = s(body.category, 40);
  const story = s(body.body, 20000);
  const penName = s(body.penName, 80);
  const context = s(body.context, 160);
  const contact = s(body.contact, 200);
  const anonymous = body.anonymous === true;

  if (title.length < 2) {
    return NextResponse.json({ error: "Add a title." }, { status: 400 });
  }
  if (!categoryMap[category]) {
    return NextResponse.json({ error: "Pick a category." }, { status: 400 });
  }
  if (story.length < 200) {
    return NextResponse.json(
      { error: "The story is a little short — give us at least a few paragraphs." },
      { status: 400 },
    );
  }
  if (!EMAIL_RE.test(contact)) {
    return NextResponse.json({ error: "Add an email we can reach you at." }, { status: 400 });
  }

  try {
    await deliver({
      kind: "submission",
      title,
      category,
      anonymous,
      penName: anonymous ? "" : penName,
      context,
      contact,
      body: story,
    });
  } catch {
    return NextResponse.json({ error: "Could not send that. Try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
