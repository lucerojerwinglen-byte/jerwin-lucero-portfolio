---
name: Jerwin Lucero — Résumé
description: The site is the résumé. A typeset two-page A4 document, framed like a PDF viewer, that prints to exactly the PDF you download.
colors:
  # Source of truth: src/styles/document.css (:root and .dark). Contrast-tested by
  # src/styles/palette.test.ts, which also fails if a second accent appears.
  canvas: "#e6e6e4"   # the desk behind the paper
  page: "#ffffff"
  ink: "#1b1b1a"
  muted: "#5e5e5b"
  faint: "#71716d"
  rule: "#dcdcd8"
  pen: "#1f3a8a"      # the one accent: links, margin notes, active states
  live: "#2f7d52"     # status only
  error: "#b42318"    # status only
  # Dark "reading lamp": canvas #111112, page #1b1b1d, ink #e8e7e3, pen #a9bdff.
typography:
  head: "Source Serif 4 (optical sizes) — name, entry titles, summary, margin notes"
  body: "Geist 13px/1.5 — running text"
  data: "Geist Mono — dates, tags, links, running heads, folios"
---

# Design

> **Two surfaces.** The homepage (`/`) follows ADR 0005: a portfolio page, described in
> "Homepage" at the end. Everything else in this file describes the résumé at `/resume`
> (ADR 0004), which is unchanged.

Decision and reasons: [ADR 0004](docs/adr/0004-the-site-is-the-resume.md).

## Principles

1. **The document is the product.** What you see on the two sheets is exactly what prints.
2. **Paper first.** Neutrals do the work; pen blue is the only accent and marks only links,
   pen notes and the active thing. No tinted tiles, no glows, no gradients.
3. **Web features earn their place** by doing what paper can't, and none of them print:
   find, contents, margin notes, evidence trace, copy actions, reader count, reply form,
   typing test.
4. **Every claim is checkable.** Linked work gets a footnote that prints as a real URL;
   skills point at the entries that prove them.

## Layout

- Desktop: 794×1123px sheets (A4 at 96 dpi) on a grey desk, 48px viewer bar on top, contents
  in the left gutter and margin notes in the right gutter from 1280px.
- Phone (≤840px): no frame; the paper fills the screen and entries stack.
- Print: `@page A4, margin 0`; each sheet is exactly 210×297mm with overflow hidden, so
  `npm run pdf` refuses to write a PDF if anything overflows. Phone rules are `screen`-only,
  because A4 (794px) is narrower than the phone breakpoint.

## Icons

- UI and contact icons: `lucide-react`, 14px, stroke 1.7, always next to a text label or with
  a tooltip.
- Tech tags: monochrome `simple-icons` glyphs in the tag's grey, never brand colours.
- Status: green dot "live", lock "internal", GitHub mark "open source".

## Motion

Sheets settle in (0.7s, ease-out quint) and details expand by height. The progress line is
driven by scroll alone, and tooltips appear after 250ms. Everything is off under
`prefers-reduced-motion`.

## Homepage (ADR 0005)

- **Layout:** fixed 224px sidebar (pages, section jumps, Alt+K / Alt+J hints, viewer count,
  system/light/dark switch, email) and one centered 624px column. At ≤900px the sidebar
  becomes a top bar with a menu.
- **Colour:** neutrals only, no accent: white page, near-black ink, greys. Live green and
  error red stay status-only. Tokens override the résumé's names on `html:has(.home)` so
  reused components (typing test) follow; checked by `palette.test.ts`.
- **Type:** Geist Pixel Square (from the `geist` package) for the name, card titles and
  "say hello"; Geist body; Geist Mono for data, labels and section numbers.
- **Decoration:** halftone only. A faded dot grid in corners and between blocks, and the
  portrait in greyscale with a 3px dot screen.
- **Sections:** `NN — title` headers over a dashed rule, renumbered when one is hidden.
  Projects are a fanned stack of three cards; GitHub contributions are drawn as dots sized
  0–4 by activity.
- **Motion:** card fan 0.5s ease-out quint; overlays fade/rise in about 0.2s; all off under
  `prefers-reduced-motion`.
