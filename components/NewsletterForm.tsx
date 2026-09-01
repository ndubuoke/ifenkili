"use client";

import { useState } from "react";

type State = "idle" | "loading" | "ok" | "err";

export function NewsletterForm() {
  const [state, setState] = useState<State>("idle");
  const [msg, setMsg] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get("company")) return; // honeypot
    setState("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.get("email") }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Something went wrong.");
      setState("ok");
      setMsg("You're on the list. Friday, then.");
      form.reset();
    } catch (err) {
      setState("err");
      setMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <form className="inline-form" onSubmit={onSubmit}>
      <input
        type="text"
        name="company"
        className="hp"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <input
        type="email"
        name="email"
        required
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
