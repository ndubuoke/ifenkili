import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container center-screen">
      <p className="eyebrow">404</p>
      <h1 className="h-section">This page slipped away.</h1>
      <p className="lede" style={{ maxWidth: "40ch" }}>
        The story you&rsquo;re looking for isn&rsquo;t here — or isn&rsquo;t here
        anymore.
      </p>
      <Link href="/stories" className="btn btn-primary">
        Browse all stories
      </Link>
    </section>
  );
}
