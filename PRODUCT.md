# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Recruiters and hiring managers screening candidates for junior/associate **QA, data analysis
and AI** roles, usually in under a minute, often between other applicants, sometimes
forwarding the résumé to a hiring manager who reads it later, on paper or as a PDF.
Target market: Philippine employers first (Metro Manila, on-site or hybrid), and open to
international remote roles (UTC+8).

## Product Purpose

Jerwin Glen A. Lucero's personal site **is his résumé**: one document that reads well on
screen, prints or downloads as a clean 2-page PDF, and makes the case for a career pivot from
Workday HR transactions into QA, data and AI. Success: a recruiter understands the fit in one
skim and either downloads the PDF or sends a message.

## Positioning

A working analyst who verifies data for a living and builds real, shipped tools on the side:
a live end-to-end-encrypted app (Lovewin), a live optimizer with a validated data pipeline
(Barato), and an 8-app internal suite in production. The site itself demonstrates the
precision it claims: the web page and the PDF are the same, verified document.

## Operating Context

- Read on desktop during screening and on phones in between; printed or forwarded as PDF.
- The PDF is generated from the page (`npm run pdf`, headless Edge via playwright-core),
  committed, and guarded by a staleness test. Vercel auto-deploys `main`.
- Content lives in the typed content layer (`src/content/data/`), the single source.

## Capabilities and Constraints

- Next.js 16 (App Router) + TypeScript + Tailwind 4; tests via `node:test` (`npm test`).
- Web-only features (never printed): find-in-document (Ctrl+K), contact form (Resend),
  Appendix A typing test, live reader count (Supabase), margin notes, page counter.
- Zero budget: no paid services or recurring bills.
- The fit-check feature was removed by decision (2026-11-04); recoverable from commit ddeeb4c.

## Brand Commitments

- Name: Jerwin Glen A. Lucero (short: Jerwin Lucero). Role line: "QA · Data · AI — Workday
  Transactions Analyst at Sagility".
- Honest framing of the pivot: never overstate titles, numbers, or skills.

## Evidence on Hand

- Projects, experience, education, skills, credentials: `src/content/data/`.
- Live apps: Lovewin (https://lovewin.ottie.workers.dev), Barato (https://barato.pages.dev).
- Internal suite facts (8 apps, 58 recorded decisions) — employer-internal: anonymized, no
  company names, no links, no screenshots.
- Portrait: `public/images/jerwin-hero.png` (transparent background).
- **Absent, never fabricate:** testimonials, recommendations, metrics beyond the above,
  employer endorsements.

## Product Principles

1. The document is the product: what you see is exactly what prints.
2. Every claim is checkable: link or footnote the evidence; show gaps honestly.
3. A recruiter's minute is the budget: strongest evidence first, nothing decorative.
4. Paper-first restraint; web features earn their place by doing what paper can't.

## Accessibility & Inclusion

WCAG AA contrast in both themes (enforced by `src/styles/palette.test.ts`), full keyboard
use, readable when printed in black and white.
