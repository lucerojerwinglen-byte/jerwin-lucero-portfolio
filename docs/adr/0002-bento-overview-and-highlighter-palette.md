# 0002 — Bento overview, profile rail, Highlighter / Night Audit palettes

**Status:** active · **Date:** 2026-11-03 · amends the visual rules in `DESIGN.md`

## Context

Jerwin wanted a full UI/UX redesign with the "aura" of two reference portfolios:
bryllim.com (quiet monochrome, pixel/mono type, sidebar, credibility numbers) and
portfolio.brewedops.cloud (one-screen bento dashboard, bold one-line promise, tool
marquee, colourful tiles, one dark CTA). An earlier version of this site was a direct
bryllim clone and was critiqued as "identity borrowed", so copying either site's signature
pieces (halftone portrait, greeting cursor) was ruled out.

Three directions were mocked with real content (A Ledger Bento, B Mono Studio, C Soft
Glass); A was chosen, then its colours were judged too quiet. Four palettes were tried
live on A; Highlighter (light) + Night Audit (dark) won. Four headlines were tried;
"I verify things for a living. Now I build them." won.

## Decision

- Homepage opens on an **Overview** bento: headline + CTA, a "Tools I work with" logo
  marquee (simple-icons, CC0), and tiles for Check my fit (live preview of the QA preset),
  Projects, Stats, Experience, Credential and Contact. Full sections follow as white sheets.
- Desktop nav becomes a **profile rail** with an ID card (photo on a highlighter backdrop,
  open-to-work pill) and colour-dot links that match the tiles.
- Light = **Highlighter**, dark = **Night Audit**, as tokens in `globals.css`.

## Consequences

- Every text/background pair in both themes is unit-tested for WCAG AA 4.5:1
  (`src/styles/palette.test.ts`); a new coloured surface needs a new pair in that test.
- Stats are only ever countable facts (`src/content/data/stats.ts`). No testimonials until
  real ones exist.
- `simple-icons` is a runtime dependency, but it is used only in a server component, so
  icons ship as inline SVG with no client JavaScript.
- The old `Hero.tsx` is unused and can be deleted once its uncommitted edits are committed.
