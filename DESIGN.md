---
name: Jerwin Lucero Portfolio
description: A recruiter-facing personal portfolio staged as an audited ledger — paper and ink, with one yellow highlighter.
colors:
  # Light theme "Paper". Source of truth: src/app/globals.css (:root);
  # every text/background pair is contrast-tested in src/styles/palette.test.ts,
  # which also fails if per-tile colours come back.
  paper: "#f7f5f0"
  rail: "#f2efe8"
  surface: "#fffefb"
  ink: "#1a1917"
  mark: "#ffd84d"
  verified: "#17734a"
  partial: "#8a5a00"
  neutral-50: "#f0ede6"
  neutral-200: "#dfdad0"
  neutral-500: "#6b665c"
  neutral-950: "#1a1917"
  # Dark theme "Graphite" (warm charcoal #151412, ink #ebe7df, mark #f2cd4f as
  # yellow text): see the .dark block in globals.css.
typography:
  display:
    fontFamily: "\"Geist Pixel\", var(--font-geist-mono), monospace"
    fontSize: "clamp(1.5rem, 4vw, 2.4rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "normal"
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.04em"
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "24px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.full}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "{colors.ink}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.neutral-600}"
    padding: "0"
  badge-verified:
    backgroundColor: "{colors.verified}"
    textColor: "{colors.verified}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
---

# Design System: Jerwin Lucero Portfolio

> **2026-11-03 redesign (ADR 0002, palette per ADR 0003) — read this first.** The homepage
> opens on a **bento overview** (tiles linking to the full sections below) with a **profile
> rail** on desktop. Every tile and section is the same material: a paper sheet with a 1px
> hairline. **Neutrals and ink do the work; there is exactly one accent, the yellow
> highlighter (`--mark`)**, used only to mark what deserves it: the word "build" in the
> headline, the verified count on the fit tile, and the active rail link. In dark mode
> (**Graphite**, warm charcoal, never a tech-black) the highlighter becomes yellow text.
> Green / amber / grey are status signals only (verified / partial / not yet). No tinted
> tiles, no coloured glows or halos (depth = offset shadow `--lift`, on hover only), no
> glyphs as icons (lucide only), no eyebrow labels, no big-number stat tiles. The headline
> is Geist Bold ("I verify things for a living. Now I build them."); Geist Pixel stays for
> the name, scores and section titles. Never hard-code a text colour without adding its
> pair to `palette.test.ts`.

## Overview

**Creative North Star: "The Data Validation Ledger"**

This portfolio stages a career pivot as an audited, reconciled ledger rather than a generic developer-portfolio terminal. The subject is a Workday HR-transactions analyst (Cum Laude CS grad) moving into QA, Data Analysis, and AI — a pivot that is fundamentally about reconciliation and verification, so the interface borrows the visual grammar of that world: record IDs, verified/reconciled status marks, ruled ledger paper, and tabular data — rather than the halftone-dot, pixel-terminal aesthetic of a generic "indie dev" template it replaced.

The system stays flat, quiet, and confident: one warm paper ground, near-black ink for text, and a single verification-green accent used sparingly and only where it means something (a completed record, an open-to-work status). Density is low and reading-first — this is a single scrolling document a recruiter skims in under a minute, not a dashboard.

Two confirmed rejections carry forward from the redesign: no halftone/dot decoration, and no ruled-line background texture (tried once, explicitly rejected — the paper color and verified accent stay, decorative texture does not).

**Key Characteristics:**
- Flat surfaces, ledger-paper warmth, one verification-green accent used as real signal, not decoration
- Every recurring numbered/entry label reads as a record ID (`REC-01`), not a decorative index
- Pixel-font display headers (Geist Pixel) paired with a clean sans body and a monospace data voice
- One primary action per view; no competing CTAs

## Colors

A warm, restrained neutral system (paper and ink) carries the page; one saturated green is reserved entirely for verification/status signal.

### Primary
- **Ledger Ink** (`#1b1d19` light / `#ede9dd` dark): primary text, primary button fill, active nav state. Near-black on paper in light mode; inverts to warm off-white on the "night audit" dark background.

### Secondary
- **Verified Green** (`#1f7a4d` light / `#34c176` dark): reserved for verification signal only — the hero's "open to work" status badge, the checkmark on evidence-carrying section headers (Projects, Experience). Contrast-checked at 4.84:1 (light) and 7.95:1 (dark) against the page background. Never used decoratively.

### Neutral
- **Ledger Paper** (`#f6f4ee` light) / **Night Audit** (`#14140f` dark): page background.
- **Neutral 50–950**: an 11-step warm-gray ramp (`#efece3` → `#14140f` in light mode, inverted in dark) used for borders, muted text, card backgrounds, and hover states. Step 400/500 (`#a39a80` / `#7d7460`) is the muted-text tier; step 200 (`#dcd5c2`) is the standard hairline border.

### Named Rules
**The Reserved Signal Rule.** Verified Green appears only on confirmed, evidence-backed states (a completed record, an "open to work" status). It never decorates a hover state, an icon, or a heading for emphasis alone — if it appears, something specific is being verified.

## Typography

**Display Font:** Geist Pixel (with Geist Mono, monospace fallback)
**Body Font:** Geist (with ui-sans-serif, system-ui, sans-serif fallback)
**Label/Mono Font:** Geist Mono (with ui-monospace, monospace fallback)

**Character:** A pixel-grid display face gives headers a stamped, technical character against a clean, highly legible sans body; monospace carries every record ID, timestamp, and data value so the ledger metaphor reads at the type level, not just in color.

### Hierarchy
- **Display** (Geist Pixel throughout): used at four scales — the hero name (`text-3xl` scaling to `2.4rem`, leading-none), section record headers (`REC-01 — PROJECTS`), blog post titles (`text-2xl`/`text-[2rem]`, tight leading), and the nav wordmark (`text-[14px]`–`text-[15px]`) in all three of its placements (desktop sidebar, mobile bar, mobile overlay). It is the system's only display face — Geist Mono/Geist never substitute for it at these roles.
- **Title** (400–600 weight, `text-sm`–`text-base`, still Geist Pixel): section record headers specifically; primary sections (Projects, Experience) step up to `text-base` + ink color + a verified checkmark, secondary sections stay `text-sm` + muted.
- **Body** (400 weight, `15px`, 1.6 line-height, max `max-w-xl` ≈ 65ch): paragraph copy.
- **Label** (500 weight, `10px`–`12px`, uppercase, `0.04em`–`0.08em` tracking): record IDs, dates, status badges, nav numbers.

### Named Rules
**The Mono-Is-Data Rule.** Monospace is reserved for genuinely tabular or identifier content — record IDs, dates, WPM stats, keyboard shortcuts. It is never used as a "technical-looking" costume on prose.

## Layout

Single scrolling column, `max-w-2xl` (42rem), horizontally centered with `px-6` gutters. On `lg+` viewports a fixed `w-56` sidebar nav sits to the left (`lg:pl-56` offset on the content column); below `lg` the nav collapses to a sticky top bar plus a full-screen overlay menu. Each homepage section is a `Section` wrapper with `py-10 sm:py-12` vertical rhythm and a `mt-6` gap between its record header and body content. Content reveals on scroll via a shared `reveal-scroll` intersection-observer pattern, staggered `d1`–`d5` (0.04s increments) for grouped elements.

## Elevation & Depth

Flat by default — no shadow tokens exist for page-level surfaces; depth is conveyed through hairline borders (`border-border`, 1px) and background-color steps (`bg-card` / neutral-50) rather than shadows. The one exception is the command palette overlay (`shadow-2xl`), which genuinely floats above page content as a modal dialog — every other surface (cards, inputs, nav) stays flush with the page.

### Named Rules
**The Flat-By-Default Rule.** Shadows are reserved for content that must visually separate from the whole page (the command palette). A card, input, or badge never gets a shadow — a border and a background step do the job.

## Shapes

- **Full (`9999px`)**: pills — primary buttons, status badges, the filter chip, the theme-switch track.
- **Large (`12px` / `rounded-lg`)**: form inputs (text fields, textarea).
- **Medium (`8px` / `rounded-md`)**: nav row items, the hero photo frame, command-palette list items.
- **Sharp/Card (`rounded-xl`, ~`12px`+)**: the typing-test box and the command palette panel — the two floating/framed surfaces in the system.

Borders are always 1px, using the `border-border` neutral-200 token; no heavier or colored border weights appear anywhere in the system.

## Components

### Buttons
- **Shape:** full pill (`rounded-full`).
- **Primary:** `bg-ink` fill, `text-background` label, `px-4 py-2`, `hover:opacity-80`, `active:scale-[0.97]`. Exactly one primary button per view (the Distill pass removed competing CTAs from the hero).
- **Secondary/Ghost:** no fill — a plain text link with an icon (`text-gray-600 hover:text-ink`), used for every non-primary action (résumé download, GitHub, email).

### Badges
- **Verified status** (hero, section headers): `border-verified/30 bg-verified/10 text-verified`, full pill, mono uppercase label, `CheckCircle2` icon at 12–14px.
- **Record ID** (section headers, nav): plain mono uppercase text, no border/background — `REC-01` style, muted-500 color.

### Cards / Containers
- **Corner style:** `rounded-xl` for the typing-test box and command palette; `rounded-md` for the hero photo frame.
- **Background:** `bg-card` (neutral-50) or `bg-background`.
- **Shadow strategy:** none, except the command palette (`shadow-2xl`) per the Flat-By-Default Rule.
- **Border:** 1px `border-border` throughout.

### Inputs / Fields
- **Style:** `rounded-lg`, `border-border`, `bg-background`, `px-3 py-2`, `text-sm`.
- **Focus:** border shifts to `border-accent` (ink), no glow/ring.
- **Error:** field-level `role="alert"` message in `text-red-500` beneath the field; `aria-invalid`/`aria-describedby` wired.
- **Disabled:** `opacity-60`.

### Navigation
- **Desktop (`lg+`):** fixed left sidebar, `w-56`, mono `13px` link list, active section gets `text-ink` + a `REC-NN` mono tag; a hairline divider separates section links from utility links (Blog).
- **Mobile:** sticky top bar with the wordmark, a scroll-tracked active-section label (mono, centered), and a hamburger opening a full-screen overlay menu with the same link structure at larger touch targets.
- **Hover/Active:** `text-gray-500` at rest, `hover:bg-gray-50 hover:text-ink`, active state is `text-ink` (color only, no background fill on the persistent sidebar).

## Do's and Don'ts

### Do:
- **Do** reserve Verified Green for genuine verification/status signal (badges, checkmarks on evidence sections) — see The Reserved Signal Rule.
- **Do** use monospace exclusively for record IDs, dates, and tabular data — see The Mono-Is-Data Rule.
- **Do** keep exactly one primary (filled, pill) button per view; every other action is a plain text link.
- **Do** use 1px hairline borders and background-color steps for surface separation instead of shadows — see The Flat-By-Default Rule.

### Don't:
- **Don't** reintroduce halftone/dot decoration or the ruled-line background texture — both were tried and explicitly rejected.
- **Don't** add shadows to cards, inputs, or badges; the command palette is the only surface allowed one.
- **Don't** let a section's record-ID number ("01", "02"...) carry meaning outside the homepage's own section sequence — the blog page's reuse of that numbering was a documented defect, now fixed to its own "LOG" label.
- **Don't** stack more than one filled/primary-weight CTA in the same view.
