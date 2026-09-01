"use client";

import { useState } from "react";

export function ShareButton({ title, path }: { title: string; path: string }) {
  const [copied, setCopied] = useState(false);

  const onShare = async () => {
    const url =
      typeof window !== "undefined" ? window.location.origin + path : path;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        /* user cancelled — fall through to copy */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  return (
    <button className="btn btn-ghost btn-sm" onClick={onShare}>
      {copied ? "Link copied" : "Share ↗"}
    </button>
  );
}
