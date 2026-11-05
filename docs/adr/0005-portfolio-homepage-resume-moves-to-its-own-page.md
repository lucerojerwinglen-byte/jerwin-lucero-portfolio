# 0005 — Portfolio homepage; the résumé moves to /resume

**Status:** active · **Date:** 2026-11-05 · supersedes 0004 (homepage and visuals only; its PDF pipeline still holds)

## Context

ADR 0004 (2026-11-04) made the homepage a 2-page A4 résumé. Jerwin now wants the homepage to
follow the UI/UX of bryllim.com, a portfolio he likes: a fixed sidebar, a narrow single
column, numbered sections and playful web features. The résumé and its print-exact PDF are
still worth keeping for recruiters who forward a PDF.

What that site does (studied from live screenshots on 2026-11-05, not from its source):

- Fixed left sidebar (~220px): name, nav links, section jump links, shortcut hints
  (Alt+K ask, Alt+J typing test), live viewer count, theme switch (system/light/dark),
  sound toggle, email. On phones it becomes a top bar with a menu.
- One centered column (~620px) on a white page, black text, greys only, no accent colour.
  Geist body; a pixel/mono face for the name and headings. Halftone dot patterns as the only
  decoration; halftone black-and-white portrait.
- Sections, in order: hero (portrait, bio with inline pill chips, social links), badges row
  and stats row, then `01 — blog`, `02 — projects` (fanned card stack), `03 — experience`
  (year · role · company rows + stack tags), `04 — certifications` (cards with Verify),
  `05 — recommendations` (quote cards), `06 — affiliations`, `07 — github` (contribution
  graph drawn as dots), contact, footer with "take the tour again". A first-visit tour.

## Decision

- **The homepage becomes a portfolio page with that layout, section order and set of
  interactions.** We match the UI/UX, not the material: all code is written here from
  scratch; no HTML, CSS, scripts, images, logos or wording are taken from bryllim.com.
  Every word and number is Jerwin's own: résumé facts come from the content layer
  (`src/content/data/`); homepage-only content (badges, stats, placeholders, section order)
  lives in `src/content/home/`, outside the PDF fingerprint so editing it never forces a PDF
  rebuild. Short UI copy (hero bio, tour steps) sits in the components that show it.
- **The résumé moves to `/resume`**, unchanged. `npm run pdf`, the resume lock and
  `resume-pdf.test.ts` keep working; the homepage links to it and to the PDF.
- **Palette: neutrals only, no accent** (white page, near-black ink, greys), matching the
  reference. Status colours (live green, error red) stay. `palette.test.ts` changes from
  "exactly one accent" to "no accent besides status", and keeps its AA contrast checks.
  The résumé at `/resume` keeps pen blue so the existing PDF does not change.
- **Fonts:** Geist (already used) for body and Geist Mono for data. The heading face is
  Geist Pixel if it ships in the free `geist` package; otherwise Geist Mono. Decided in the
  hero ticket, and adding a package is asked first.
- **Reuse before building:** typing test, presence (viewer count) and the blog are reused.
  Find stays on `/resume`: it searches the text of the document, while the homepage's Alt+K
  "Ask anything" box jumps between sections, pages, projects and posts, so it is its own
  small search (Ctrl/⌘+K opens it too). The reply form stays on `/resume`; the homepage's
  contact block offers copy-email, mail app, and a link to it.
- **Sections with no real evidence yet use clearly labelled placeholders, never invented
  people or numbers.** Recommendations show 3 cards reading "Recommendation slot.
  References available on request." with a `?` avatar and "COMING SOON". Badges and
  affiliations show only real items, or are hidden when empty. Stats use real numbers only
  (e.g. 8 internal apps, 2 live apps). This keeps PRODUCT.md's "never fabricate" rule.
- **Site title** drops "Résumé" (`Jerwin Lucero — QA · Data · AI`); `/resume` titles itself "Résumé".
- **Portrait:** `public/images/jerwin-hero.png` with a halftone/greyscale treatment in CSS.

## Consequences

- DESIGN.md, PRODUCT.md and CONTEXT.md describe the old homepage and must be updated in the
  first ticket that changes it (Document, Sheet and Viewer bar become `/resume` terms).
- The homepage is no longer print-exact; only `/resume` is.
- Placeholders are visible on the live site (Vercel auto-deploys `main`). Replacing them
  means editing one data file; no layout change.
- Risk: the site will closely resemble bryllim.com in structure. Accepted by Jerwin; the
  content, portrait and code are his own.
- Planned tickets: (1) move résumé to /resume; (2) sidebar + hero + stats shell;
  (3) blog, projects stack, experience/stack; (4) certifications, recommendations
  placeholders, affiliations, GitHub dots; (5) Alt+K palette; (6) typing test, presence,
  contact in the new layout; (7) first-visit tour.
