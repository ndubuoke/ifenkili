"use client";

import Link from "next/link";
import { useState } from "react";
import { site } from "@/lib/site";
import { SearchModal, type SearchEntry } from "@/components/SearchModal";
import { ThemeToggle } from "@/components/ThemeToggle";

export function SiteHeader({ stories }: { stories: SearchEntry[] }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container">
        <Link href="/" className="wordmark" onClick={() => setOpen(false)}>
          IFEN<span className="gradient-text">KILI</span>
        </Link>

        <nav className={`nav-links ${open ? "open" : ""}`}>
          {site.nav.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-right">
          <div className="header-tools">
            <SearchModal stories={stories} />
            <ThemeToggle />
          </div>

          <button
            className="nav-toggle"
            aria-expanded={open}
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>
    </header>
  );
}
