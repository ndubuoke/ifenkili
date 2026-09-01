export const site = {
  name: "IFENKILI",
  tagline: "Stories worth feeling.",
  description:
    "A home for stories that people actually feel — love, poems, corporate confessions, and everyday human experiences, beautifully set.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ifenkili.xyz").replace(/\/$/, ""),
  instagram: "https://www.instagram.com/ifenkili.series/",
  instagramHandle: "@ifenkili.series",
  nav: [
    { label: "Stories", href: "/stories" },
    { label: "Corporate", href: "/category/corporate" },
    { label: "Poems", href: "/category/poems" },
    { label: "Submit", href: "/submit" },
    { label: "About", href: "/about" },
  ],
} as const;
