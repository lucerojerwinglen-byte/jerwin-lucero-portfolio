---
target: the homepage / overall UI-UX design
total_score: 22
max_score: 32
na_heuristics: 7,10
p0_count: 2
p1_count: 2
timestamp: 2026-08-24T08-31-16Z
slug: src-app-page-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Active-section nav, form `isSubmitting`, toasts, live WPM all present; presence indicator fails silently with no retry signal. |
| 2 | Match Between System and Real World | 2 | Numbered dev-terminal labels ("01 — projects", ⌘K) speak developer language, not recruiter language. |
| 3 | User Control and Freedom | 3 | Command palette, closable filter chip, theme switch all present. No back-to-top on a long single page. |
| 4 | Consistency and Standards | 2 | Contact absent from the nav's section list; "Certifications" (Nav) vs "Certifications & Seminars" (CommandPalette) — same target, different names. |
| 5 | Error Prevention | 3 | Zod + react-hook-form validation, honeypot anti-spam. No visible "what's required" affordance before submit. |
| 6 | Recognition Rather Than Recall | 3 | Persistent left nav on desktop; no mobile equivalent. |
| 7 | Flexibility and Efficiency of Use | n/a | One-time-visit marketing surface — efficiency-for-repeat-use doesn't apply. |
| 8 | Aesthetic and Minimalist Design | 3 | Genuinely restrained and clutter-free — but restraint reads as "safe template," not "edited down from something bolder." |
| 9 | Error Recovery | 3 | Field-level errors with `role="alert"`, reasonable contrast. No inline retry guidance on network failure. |
| 10 | Help and Documentation | n/a | Not applicable to a portfolio; the ⌘K hint is adequate in-context help for what little is needed. |
| **Total** | | **22/32** | **Acceptable (69%)** — solid execution, held back by identity/hierarchy gaps, not competence gaps. |

## Design Specificity Verdict

This does not read as authored for Jerwin specifically. The visual system — pixel-font mono headers, numbered sections, halftone dot textures, ⌘K palette, a "people viewing" presence pill — is a direct, acknowledged clone (commit `9249cb5 Redesign portfolio to match bryllim.com's design system`). Nothing in the color, type, motion, or iconography derives from the actual story — a Workday HR-transactions analyst with a Cum Laude CS degree pivoting into QA/Data/AI. The typing-speed game and presence indicator are novelty flourishes bolted onto a borrowed shell. Real content (actual employer, actual thesis, actual certs) is the only specific thing here, dropped into a shell that would look identical for any other CS grad's portfolio.

Deterministic scan: the bundled slop detector found exactly one flag across `src` — `overused-font` on `globals.css:7` (Geist), likely a false positive since Geist is Vercel's first-party font and the sensible default for this stack. Otherwise clean: no gradient-text, cookie-cutter shadow/spacing, or generic-palette flags. Execution isn't sloppy; identity is borrowed.

Visual overlays: unavailable this run — no browser automation tool exposed in this session, so no live-page injection/overlay was possible. Visual judgments come from source-code reading, not a screenshot.

## Overall Impression

Craftsmanship is real — accessibility is handled properly, the component architecture is clean, zero slop-detector hits. But the site is a well-executed skin over someone else's design system, wearing this candidate's résumé. The biggest opportunity is authorship, not polish.

## What's Working

- Accessibility is actually handled, not an afterthought: always-visible `:focus-visible` outline, a skip-to-content link, `aria-invalid`/`aria-describedby`/`role="alert"` wired through every form field, and `prefers-reduced-motion` respected in at least six separate places across CSS and JS.
- A genuinely coherent spacing/typography system via the shared `Section.tsx` wrapper — every section gets identical rhythm and a scroll-triggered reveal.
- Real spam prevention and validation on the contact form (honeypot + Zod schema).

## Priority Issues

**[P0] Contact is missing from the primary nav.** `Nav.tsx:23-30` lists About/Projects/Experience/Stack/Certifications/Typing-test but not Contact — the actual destination is demoted to a secondary "Hire me" link, visually indistinguishable from "Blog." Fix: promote Contact into `sectionLinks` with its own number/icon. Suggested command: `/impeccable shape`

**[P0] No visual hierarchy between "core evidence" and "novelty" sections.** Projects/Experience and the Typing Test render with byte-identical header styling (`Section.tsx:39-53`). Fix: give Projects/Experience heavier visual weight; de-emphasize or relocate the Typing Test. Suggested command: `/impeccable layout`

**[P1] Hero has 4 competing CTAs with no clear primary action.** `Hero.tsx:74-114` puts "Download resume," "Hire me," GitHub, and email at near-equal visual weight. Fix: make "Hire me" the single filled/primary button; demote the rest. Suggested command: `/impeccable distill`

**[P1] The whole visual identity is a borrowed template, disconnected from the actual differentiator.** Nothing about the halftone/pixel-font/terminal aesthetic connects to the HR-systems-analyst-to-QA/Data/AI pivot. Fix: reground the visual system in the actual pivot story. Suggested command: `/impeccable shape`

**[P2] Mobile users lose all wayfinding.** The desktop `IntersectionObserver` active-section state (`Nav.tsx:58-75`) has no mobile equivalent. Fix: add a slim progress/active-section indicator to the mobile bar. Suggested command: `/impeccable adapt`

## Persona Red Flags

**Jordan (recruiter skimming in <60s)**: Lands on Hero and sees "Workday Transactions Analyst" as the title, which doesn't match a "software engineering job-seeker" framing. By Contact, Jordan has passed a WASD typing minigame positioned right before the ask.

**Casey (mobile)**: Full-screen nav overlay gives zero scroll-progress feedback. The Hero's cursor-tilt parallax never fires on touch, so Casey gets a static image with dead code behind it. The ⌘K hint is meaningless copy clutter on a phone.

**Sam (accessibility-dependent)**: Solid baseline, but the typing game's correct/incorrect character spans rely purely on color, and the "N people viewing" presence pill updates live with no `aria-live` region.

## Minor Observations

- `CommandPalette.tsx:30` "Certifications & Seminars" vs `Nav.tsx:28` "Certifications" — inconsistent naming for the same destination.
- Blog index reuses the homepage's "01 —" numbering scheme for an unrelated single page.
- Education entries go back to 2009 primary school — dilutes the more relevant CS degree line.
- Three projects are dated 2026, ahead of the résumé's stated employment — worth double-checking.
- Tagline leads with the Workday analyst title before QA/Data/AI, an unresolved framing tension.
- Résumé download is a plain `<a download>` with no confirmation the file exists.
- Detector's `Geist` "overused font" flag is almost certainly a false positive here.

## Questions to Consider

1. If you stripped away the halftone textures, pixel font, and command palette — the parts borrowed from bryllim.com's system — what would actually be left that says "this is Jerwin"?
2. Is the typing-speed game earning its placement right before the hiring CTA, or is it a flex a recruiter-first design would cut or relocate?
3. What would this page look like if the whole IA were organized around proving the QA/Data/AI pivot, instead of a generic section list copied from someone else's story?
