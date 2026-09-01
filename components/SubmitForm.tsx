"use client";

import { useState } from "react";
import { categories } from "@/lib/categories";

type State = "idle" | "loading" | "ok" | "err";

const MIN_BODY = 200;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SubmitForm() {
  const [state, setState] = useState<State>("idle");
  const [msg, setMsg] = useState("");
  const [bodyLen, setBodyLen] = useState(0);

  const fail = (message: string, focusId?: string) => {
    setState("err");
    setMsg(message);
    if (focusId) document.getElementById(focusId)?.focus();
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get("hp_ifk")) return; // honeypot — bots fill it, autofill won't

    const payload = {
      title: String(data.get("title") ?? "").trim(),
      category: String(data.get("category") ?? ""),
      body: String(data.get("body") ?? "").trim(),
      penName: String(data.get("penName") ?? "").trim(),
      anonymous: data.get("anonymous") === "on",
      context: String(data.get("context") ?? "").trim(),
      contact: String(data.get("contact") ?? "").trim(),
    };

    // Visible, in-form validation (no native browser tooltips).
    if (payload.title.length < 2) return fail("Add a title.", "title");
    if (!payload.category) return fail("Choose a category.", "category");
    if (payload.body.length < MIN_BODY) {
      return fail(
        `The story's a little short — give us at least a few paragraphs (${MIN_BODY}+ characters, you have ${payload.body.length}).`,
        "body",
      );
    }
    if (!EMAIL_RE.test(payload.contact)) {
      return fail("Add an email we can reach you at.", "contact");
    }

    setState("loading");
    setMsg("");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "Something went wrong. Try again.");
      setState("ok");
      setMsg(
        "Received. We read every submission by hand — if it's a fit, you'll hear from us before it goes live.",
      );
      form.reset();
      setBodyLen(0);
    } catch (err) {
      setState("err");
      setMsg(
        err instanceof Error
          ? err.message
          : "Couldn't send that. Please email it to hello@ifenkili.xyz.",
      );
    }
  };

  const bodyShort = bodyLen > 0 && bodyLen < MIN_BODY;

  return (
    <form onSubmit={onSubmit} noValidate>
      <input
        type="text"
        name="hp_ifk"
        className="hp"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        data-1p-ignore
        data-lpignore="true"
        data-form-type="other"
        data-bwignore
      />

      <div className="field">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          required
          maxLength={140}
          autoComplete="off"
          placeholder="Give it a title"
        />
      </div>

      <div className="field">
        <label htmlFor="category">Category</label>
        <select id="category" name="category" required defaultValue="">
          <option value="" disabled>
            Choose one
          </option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="context">Context</label>
        <span className="hint">
          Optional. Industry, role, or setting — no real names of people or companies.
        </span>
        <input
          id="context"
          name="context"
          maxLength={160}
          autoComplete="off"
          placeholder="e.g. mid-size fintech, first management job"
        />
      </div>

      <div className="field">
        <label htmlFor="body">Your story</label>
        <textarea
          id="body"
          name="body"
          required
          placeholder="Take your time."
          onChange={(e) => setBodyLen(e.currentTarget.value.trim().length)}
        />
        <span className="hint" style={bodyShort ? { color: "var(--accent-2)" } : undefined}>
          {bodyLen === 0
            ? `${MIN_BODY} characters minimum.`
            : `${bodyLen} / ${MIN_BODY} characters`}
        </span>
      </div>

      <div className="checkbox-row">
        <input id="anonymous" name="anonymous" type="checkbox" defaultChecked />
        <label htmlFor="anonymous">
          Publish this anonymously (recommended for corporate and confession stories).
        </label>
      </div>

      <div className="field">
        <label htmlFor="penName">Name / pen name</label>
        <span className="hint">Only used if you turn off anonymous above.</span>
        <input
          id="penName"
          name="penName"
          maxLength={80}
          autoComplete="off"
          placeholder="How to credit you"
        />
      </div>

      <div className="field">
        <label htmlFor="contact">Your email</label>
        <span className="hint">Private. So we can reach you about edits or publishing.</span>
        <input
          id="contact"
          name="contact"
          type="email"
          required
          autoComplete="email"
          placeholder="you@email.com"
        />
      </div>

      <button className="btn btn-primary" type="submit" disabled={state === "loading"}>
        {state === "loading" ? "Sending…" : "Send it in →"}
      </button>

      {(state === "ok" || state === "err") && (
        <p className={`form-note ${state === "ok" ? "ok" : "err"}`} role="status">
          {msg}
        </p>
      )}
    </form>
  );
}
