# Sahil Kumar — Portfolio

A premium, production-ready personal portfolio built with **Next.js (App Router), React, TypeScript, Tailwind CSS v4, Framer Motion, and Lucide icons**.

## Features

- Dark theme by default with a light/dark toggle (preference saved, no flash on load)
- Sections: Hero (code-inspired visual), About, Experience timeline, Featured Projects with detail modals, Skills by category, Education, live GitHub activity (public GitHub API with graceful error/loading states), Contact
- Validated contact form (React Hook Form + Zod) backed by `/api/contact`
- SEO: metadata + Open Graph, sitemap, robots, monogram favicon
- Accessible: semantic HTML, focus states, keyboard-friendly modal, `prefers-reduced-motion` support
- Fully responsive

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

Production:

```bash
npm run build
npm run start
```

Quality checks:

```bash
npm run lint
npm run typecheck
```

## Environment variables (optional — contact form email)

The contact form works out of the box with a mailto fallback. To enable real email delivery via [Resend](https://resend.com), set these **server-side** variables (see `.env.example`):

| Variable             | Purpose                                      |
| -------------------- | -------------------------------------------- |
| `RESEND_API_KEY`     | Resend API key                               |
| `CONTACT_FROM_EMAIL` | Verified sender address in Resend            |
| `CONTACT_TO_EMAIL`   | Inbox receiving messages (optional override) |

Without them, the form explains the situation and offers a one-click "Open in Email App" fallback with the message pre-filled.

## Content & assets

- All site content lives in `src/data/content.ts` (typed) — edit there to update text, links, projects, and skills.
- Resume: place the PDF at `public/Sahil_Kumar_Resume.pdf` (already included). Replace the file to update the download.
- The availability badge in the hero is controlled by `showAvailability` in `src/data/content.ts`.

## Deploy on Vercel

Import this repository in Vercel — it auto-detects Next.js. Add the env vars above in Project Settings if you want form email delivery, then deploy. No other configuration is required.
