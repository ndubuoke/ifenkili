"use client";

import { useState } from "react";

type State = "idle" | "loading" | "ok" | "err";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewsletterForm() {
  const [state, setState] = useState<State>("idle");
  const [msg, setMsg] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const email = String(data.get("email") ?? "").trim();
    if (!EMAIL_RE.test(email)) {
      setState("err");
      setMsg("Enter a valid email address.");
      return;
    }

    setState("loading");
    setMsg("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "Something went wrong. Try again.");
      setState("ok");
      setMsg("You're on the list. Friday, then.");
      form.reset();
    } catch (err) {
      setState("err");
      setMsg(err instanceof Error ? err.message : "Something went wrong. Try again.");
    }
  };

  return (
    <form className="inline-form" onSubmit={onSubmit} noValidate>
      <input
        type="email"
        name="email"
        required
        autoComplete="email"
        placeholder="you@email.com"
        aria-label="Email address"
      />
      <button className="btn btn-primary" type="submit" disabled={state === "loading"}>
        {state === "loading" ? "…" : "Subscribe"}
      </button>
      {(state === "ok" || state === "err") && (
        <p className={`form-note ${state === "ok" ? "ok" : "err"}`} style={{ width: "100%" }}>
          {msg}
        </p>
      )}
    </form>
  );
}
