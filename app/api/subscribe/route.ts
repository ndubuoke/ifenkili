import { NextResponse } from "next/server";
import { deliver } from "@/lib/inbox";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = String((body as { email?: unknown })?.email ?? "").trim();
  if (!EMAIL_RE.test(email) || email.length > 200) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  try {
    await deliver({ kind: "subscribe", email });
  } catch {
    return NextResponse.json({ error: "Could not save that. Try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
