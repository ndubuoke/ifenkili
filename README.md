# IFENKILI — Phase 1

A dark, editorial reading site for love stories, poems, and anonymous corporate
tales. Next.js 15 (App Router), plain CSS, Markdown content files, deployable to
Fly.io.

## What's in Phase 1

- Home: hero, featured story, latest grid, category strip, newsletter capture
- `/stories` — full list with category filter
- `/stories/[slug]` — reader with progress bar, reading time, text-size control, share, per-story share-card image
- `/category/[slug]` — six categories (love, poems, corporate, confessions, nigerian, coffee-break)
- `/submit` — moderated submission form (no accounts) with anonymity + guidelines
- `/about`
- `sitemap.xml`, `robots.txt`, dynamic Open Graph images

No database, no auth. Submissions and newsletter signups are emailed to you (via
Resend) or appended to `data/*.ndjson` on the server.

## Run locally

```bash
npm install
cp .env.example .env      # optional; sensible defaults work without it
npm run dev
```

Open http://localhost:3000

## Writing content

Add a Markdown file to `content/stories/`. The filename becomes the URL slug.

```markdown
---
title: The Title
excerpt: One or two sentences shown on cards and in previews.
category: love        # love | poems | corporate | confessions | nigerian | coffee-break
author: Ifenkili      # ignored when anonymous: true
anonymous: false
date: 2026-08-28      # YYYY-MM-DD, controls ordering
featured: false       # at most one; the newest is used if none set
mood: Tender          # optional label
---

Body in Markdown. Reading time is calculated from word count.
```

Files starting with `_` are ignored. Restart `npm run dev` after adding files.

## Form delivery

Set these to have submissions emailed instead of written to disk:

| var | meaning |
| --- | --- |
| `RESEND_API_KEY` | API key from resend.com |
| `MAIL_FROM` | verified sender, e.g. `IFENKILI <hello@ifenkili.xyz>` |
| `MAIL_TO` | where submissions land |

Without them, entries append to `${INBOX_DIR:-./data}/submission.ndjson` and
`subscribe.ndjson`.

## Deploy to Fly.io

```bash
fly launch --no-deploy        # claim an app name; keep the Dockerfile
fly volumes create data --size 1 --region jnb   # persist the on-disk inbox
fly secrets set NEXT_PUBLIC_SITE_URL=https://ifenkili.xyz
# optional:
fly secrets set RESEND_API_KEY=... MAIL_FROM=... MAIL_TO=...
fly deploy
```

Then point `ifenkili.xyz` at the app:

```bash
fly certs add ifenkili.xyz
fly certs add www.ifenkili.xyz
```

and add the A/AAAA (or CNAME) records Fly prints to your DNS.

## Design tokens

Colours, fonts, radii and shadows live at the top of `app/globals.css` under
`:root`. Fonts are Space Grotesk (UI), Lora (reading), JetBrains Mono (labels),
loaded via `next/font`.

## Notes / Phase 2 candidates

- Story HTML is rendered from trusted, hand-moderated Markdown (`marked`) with
  `dangerouslySetInnerHTML`. Keep moderation manual; add sanitisation before any
  untrusted authoring.
- Next: writer accounts + bylines, likes/bookmarks, moderated comments, audio
  narration, full-text search.
