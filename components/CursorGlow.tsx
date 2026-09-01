"use client";

import { useEffect, useRef } from "react";

/**
 * Soft light that follows the pointer. Ported from the portfolio's
 * `.cursor-glow`, tuned to IFENKILI's palette. Writes `transform`
 * directly on mousemove (compositor-only, cheap — same approach as the
 * portfolio). Reduced-motion users get nothing; touch devices are
 * hidden via CSS (`@media (pointer: coarse)`).
 */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e: MouseEvent) => {
      el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      el.style.opacity = "1";
    };

    const onLeave = () => {
      el.style.opacity = "0";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <div ref={ref} className="cursor-glow" aria-hidden="true" />;
}
