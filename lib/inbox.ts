import fs from "node:fs";
import path from "node:path";

type Delivery = { kind: "subscribe" | "submission"; [k: string]: unknown };

const INBOX_DIR = process.env.INBOX_DIR || path.join(process.cwd(), "data");

async function sendEmail(subject: string, text: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;
  const to = process.env.MAIL_TO;
  if (!key || !from || !to) return false;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, text }),
  });
  return res.ok;
}

function appendToDisk(record: Delivery): void {
  fs.mkdirSync(INBOX_DIR, { recursive: true });
  const file = path.join(INBOX_DIR, `${record.kind}.ndjson`);
  fs.appendFileSync(
    file,
    JSON.stringify({ ...record, receivedAt: new Date().toISOString() }) + "\n",
    "utf8",
  );
}

/**
 * Phase 1 delivery: email via Resend if configured, otherwise append to
 * ./data/<kind>.ndjson on the server. Never throws on the disk path.
 */
export async function deliver(record: Delivery): Promise<void> {
  const subject =
    record.kind === "subscribe"
      ? `IFENKILI · new subscriber`
      : `IFENKILI · new story submission`;
  const text = Object.entries(record)
    .map(([k, v]) => `${k}: ${typeof v === "string" ? v : JSON.stringify(v)}`)
    .join("\n");

  try {
    const emailed = await sendEmail(subject, text);
    if (emailed) return;
  } catch {
    /* fall through to disk */
  }
  appendToDisk(record);
}
