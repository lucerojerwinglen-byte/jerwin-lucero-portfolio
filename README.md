# Jerwin Lucero — Portfolio

Personal portfolio site for Jerwin Glen A. Lucero, a Computer Science graduate. Built
with Next.js (App Router), TypeScript, and Tailwind CSS, hosted on Vercel.

## Features

- Sections for projects, experience, education, skills, and certifications/seminars,
  driven by a single typed content layer in `src/content/data/`
- MDX-powered blog (`src/content/blog/`)
- A ⌘K / Ctrl+J command palette (`cmdk`)
- A self-contained typing speed test
- A live "people viewing" presence indicator via Supabase Realtime (degrades
  gracefully if unconfigured)
- A working contact form backed by Resend (degrades gracefully if unconfigured)
- Light/dark theme toggle
- A resume PDF generated at build time from the same content data as the site

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in Resend/Supabase keys if you want those features live
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Content

Edit the typed data files in `src/content/data/` to update projects, experience,
skills, or certifications — both the website and the generated resume PDF
(`npm run generate:resume`) read from the same source.

Blog posts live in `src/content/blog/*.mdx`.

## Deployment

Deployed on Vercel, connected to this repo for auto-deploy on push to `main`. See
`.env.example` for the environment variables the contact form and presence indicator
need.
