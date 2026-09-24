import Link from "next/link";
import { site } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-brand">
          <span className="wordmark">
            IFEN<span className="gradient-text">KILI</span>
          </span>
          <span className="fine">A beauty to behold.</span>
        </div>

        <div className="cols">
          <Link href="/stories">Stories</Link>
          <Link href="/submit">Submit a story</Link>
          <Link href="/about">About</Link>
          <a href={site.instagram} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
          <a href="/api/random" className="btn btn-ghost btn-sm">
            Surprise me ✶
          </a>
        </div>

        <span className="fine">
          © {year} {site.name} · {site.tagline}
        </span>
      </div>
    </footer>
  );
}
