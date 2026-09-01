import type { Metadata } from "next";
import { SubmitForm } from "@/components/SubmitForm";

export const metadata: Metadata = {
  title: "Submit a story",
  description:
    "Send in your love story, poem, or anonymous corporate tale. Every submission is read by hand.",
};

export default function SubmitPage() {
  return (
    <section className="container article" style={{ maxWidth: "44rem" }}>
      <p className="eyebrow">Write for IFENKILI</p>
      <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", margin: "1rem 0 1.2rem" }}>
        Send us something true.
      </h1>
      <p className="lede" style={{ marginBottom: "2.4rem" }}>
        A love story. A poem. The office moment you&rsquo;ve never told anyone.
        We read everything by hand and only publish what earns its place — with
        your byline or fully anonymous, your call.
      </p>

      <div className="newsletter" style={{ marginBottom: "2.6rem", padding: "1.6rem" }}>
        <p className="eyebrow" style={{ marginBottom: "0.8rem" }}>
          Before you send
        </p>
        <ul style={{ paddingLeft: "1.2rem", color: "var(--text-dim)", fontFamily: "var(--font-serif)", lineHeight: 1.7 }}>
          <li>No real names of people or companies. Change identifying details.</li>
          <li>Write what happened to you, or what you witnessed — not rumours.</li>
          <li>200 words minimum. There&rsquo;s no maximum, but tighter is better.</li>
          <li>By submitting you confirm the work is yours and you&rsquo;re happy for us to publish and edit it lightly.</li>
        </ul>
      </div>

      <SubmitForm />
    </section>
  );
}
