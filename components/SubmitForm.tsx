"use client";

import { useState } from "react";
import { categories } from "@/lib/categories";

type State = "idle" | "loading" | "ok" | "err";

export function SubmitForm() {
  const [state, setState] = useState<State>("idle");
  const [msg, setMsg] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get("company_url")) return; // honeypot

    const payload = {
      title: data.get("title"),
      category: data.get("category"),
      body: data.get("body"),
      penName: data.get("penName"),
      anonymous: data.get("anonymous") === "on",
      context: data.get("context"),
      contact: data.get("contact"),
    };

    setState("loading");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Something went wrong.");
      setState("ok");
      setMsg(
        "Received. We read every submission by hand — if it's a fit, you'll hear from us before it goes live.",
      );
      form.reset();
    } catch (err) {
      setState("err");
      setMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        name="company_url"
        className="hp"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className="field">
        <label htmlFor="title">Title</label>
        <input id="title" name="title" required maxLength={140} placeholder="Give it a title" />
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
          placeholder="e.g. mid-size fintech, first management job"
        />
      </div>

      <div className="field">
        <label htmlFor="body">Your story</label>
        <textarea id="body" name="body" required minLength={200} placeholder="Take your time." />
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
        <input id="penName" name="penName" maxLength={80} placeholder="How to credit you" />
      </div>

      <div className="field">
        <label htmlFor="contact">Your email</label>
        <span className="hint">Private. So we can reach you about edits or publishing.</span>
        <input id="contact" name="contact" type="email" required placeholder="you@email.com" />
      </div>

      <button className="btn btn-primary" type="submit" disabled={state === "loading"}>
        {state === "loading" ? "Sending…" : "Send it in →"}
      </button>

      {(state === "ok" || state === "err") && (
        <p className={`form-note ${state === "ok" ? "ok" : "err"}`}>{msg}</p>
      )}
    </form>
  );
}
