import fs from "node:fs";
import path from "node:path";

type Delivery = { kind: "subscribe" | "submission"; [k: string]: unknown };

export type DeliveryResult = "email" | "disk" | "failed";

// On Fly there is no writable volume, so default to /tmp (per-machine,
// ephemeral — a last resort so a request is never lost mid-flight).
const INBOX_DIR = process.env.INBOX_DIR || "/tmp/ifenkili-inbox";

async function sendEmail(subject: string, text: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;
  const to = process.env.MAIL_TO;
  if (!key || !from || !to) return false;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, text }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error(`[inbox] Resend responded ${res.status}: ${detail}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[inbox] Resend request failed:", err);
    return false;
  }
}

function appendToDisk(record: Delivery): boolean {
  const line =
    JSON.stringify({ ...record, receivedAt: new Date().toISOString() }) + "\n";
  for (const dir of [INBOX_DIR, "/tmp"]) {
    try {
      fs.mkdirSync(dir, { recursive: true });
      fs.appendFileSync(path.join(dir, `${record.kind}.ndjson`), line, "utf8");
      return true;
    } catch (err) {
      console.error(`[inbox] could not write to ${dir}:`, err);
    }
  }
  return false;
}

export type AudienceResult = "added" | "skipped" | "failed";

/**
 * Add a subscriber to the Resend Audience (the managed contact list).
 * No-ops when RESEND_AUDIENCE_ID isn't configured. Never throws.
 * A contact that already exists counts as success.
 */
export async function addToAudience(email: string): Promise<AudienceResult> {
  const key = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!key || !audienceId) return "skipped";

  try {
    const res = await fetch(
      `https://api.resend.com/audiences/${audienceId}/contacts`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, unsubscribed: false }),
      },
    );
    if (res.ok) return "added";
    const detail = await res.text().catch(() => "");
    if (res.status === 409 || /already exists/i.test(detail)) return "added";
    console.error(`[audience] Resend responded ${res.status}: ${detail}`);
    return "failed";
  } catch (err) {
    console.error("[audience] request failed:", err);
    return "failed";
  }
}

/**
 * Phase 1 delivery: email via Resend if configured, otherwise append to a
 * local NDJSON file. Never throws — returns which path succeeded so the
 * caller can decide what to tell the visitor.
 */
export async function deliver(record: Delivery): Promise<DeliveryResult> {
  const subject =
    record.kind === "subscribe"
      ? "IFENKILI · new subscriber"
      : "IFENKILI · new story submission";
  const text = Object.entries(record)
    .map(([k, v]) => `${k}: ${typeof v === "string" ? v : JSON.stringify(v)}`)
    .join("\n");

  if (await sendEmail(subject, text)) return "email";
  if (appendToDisk(record)) return "disk";
  return "failed";
}
