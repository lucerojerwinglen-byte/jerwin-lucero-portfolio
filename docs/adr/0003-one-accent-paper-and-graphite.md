# 0003 — One accent: Paper (light) and Graphite (dark)

**Status:** active · **Date:** 2026-11-03 · amends ADR 0002 (palette only; layout stands)

## Context

ADR 0002's Highlighter / Night Audit palettes shipped and were rejected on review: six
tinted tiles plus coloured nav dots and project squares read as too many colours, and
Night Audit (neon green on green-black, coloured glows) read as generic "AI" styling. The
ask: colour that is simple but effective and appealing. Redone with the `impeccable`
skill's `quieter` playbook and craft floor.

## Decision

- One material for every tile and section: a paper sheet with a hairline border.
- One accent, the yellow highlighter `--mark`, on three things only: "build" in the
  headline, the verified count on the fit tile, the active rail link.
- Status colours (green verified, amber partial, grey not yet) appear only on statuses.
- Dark mode is warm graphite (`#151412`); the highlighter turns into yellow text there.
- Removed: per-tile colours, the stats tile (hero-metric pattern), Unicode glyph icons,
  the "Daily drivers" eyebrow, coloured glows and the pulse animation.

## Consequences

- `palette.test.ts` now also fails if any `--tile-*` token reappears, and checks the
  highlighter pairs (ink on yellow in light, yellow on graphite in dark).
- The "8 apps in production / 58 decisions" numbers are no longer on the overview;
  the Team Operations Suite project card still states them.
