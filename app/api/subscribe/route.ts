import { NextResponse } from "next/server";
import { addToAudience, deliver } from "@/lib/inbox";

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

  // Add to the managed Resend Audience (the real subscriber list) and send
  // a notification email in parallel. Either one succeeding is enough —
  // only fail the request if both come up empty.
  const [audience, notified] = await Promise.all([
    addToAudience(email),
    deliver({ kind: "subscribe", email }),
  ]);

  if (audience === "failed" && notified === "failed") {
    return NextResponse.json(
      { error: "Couldn't save that just now. Try again in a moment." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
