import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: site.description,
};

export default function AboutPage() {
  return (
    <section className="container article" style={{ maxWidth: "42rem" }}>
      <p className="eyebrow">About</p>
      <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", margin: "1rem 0 1.5rem" }}>
        A quiet place to feel something.
      </h1>

      <div className="prose">
        <p>
          IFENKILI started as a series of love poems and small stories on
          Instagram. This is where they get room to breathe — and where other
          people&rsquo;s stories join them.
        </p>
        <p>
          The idea is simple: everything here should be worth feeling. Not a feed.
          Not an algorithm deciding what you see next. Just one story at a time,
          set in type that respects your attention, on a page that gets out of the
          way.
        </p>
        <p>
          Some pieces are mine. Many aren&rsquo;t. Corporate confessions,
          relationship diaries, the strange tender things that happen in Nigerian
          households — sent in by readers, published anonymously when it matters.
        </p>
        <p>
          If you have one, <Link href="/submit">send it in</Link>. If you just want
          to read, start <Link href="/stories">here</Link> — or come find the
          series on{" "}
          <a href={site.instagram} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
          .
        </p>
      </div>
    </section>
  );
}
