import Link from "next/link";
import { site } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="cols">
          <Link href="/stories">Stories</Link>
          <Link href="/submit">Submit a story</Link>
          <Link href="/about">About</Link>
          <a href={site.instagram} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
        </div>
        <span className="fine">
          © {year} {site.name} · {site.tagline}
        </span>
      </div>
    </footer>
  );
}
