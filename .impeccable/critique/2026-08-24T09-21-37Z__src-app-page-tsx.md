---
target: the homepage / overall UI-UX design
total_score: 32
max_score: 36
na_heuristics: 10
p0_count: 0
p1_count: 0
timestamp: 2026-08-24T09-21-37Z
slug: src-app-page-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 4 | Active-section nav, live WPM/accuracy, submit state, presence indicator all give continuous feedback. |
| 2 | Match Between System and Real World | 4 | Ledger metaphor maps directly onto the candidate's actual audit/reconciliation job — no borrowed dev-portfolio tropes left. |
| 3 | User Control and Freedom | 3 | Mobile menu, typing-test reset, tag filter all reversible; keyboard/ESC behavior in the command palette not live-verified. |
| 4 | Consistency and Standards | 3 | REC-NN pattern is consistent everywhere except Contact, which drops out of the "primary" visual tier despite being the funnel's destination. |
| 5 | Error Prevention | 4 | Zod schema + aria-invalid/aria-describedby + honeypot field. |
| 6 | Recognition Rather Than Recall | 4 | Persistent left nav always shows where you are; ⌘K hint visible inline, not hidden. |
| 7 | Flexibility and Efficiency of Use | 3 | Command palette genuinely serves power users (resume download, theme toggle, email copy, section jump). |
| 8 | Aesthetic and Minimalist Design | 4 | Flat ledger-paper palette, no shadows except the command palette per the documented Flat-By-Default Rule. |
| 9 | Error Recovery | 3 | Field-level errors + toast on failure; no inline format hint before first failed validation. |
| 10 | Help and Documentation | n/a | Portfolio/Persuade-mode site; the typing test's inline instructions are the only help text needed. |
| **Total** | | **32/36** | **Good (89%)**, just shy of Excellent. |

## Design Specificity Verdict

The redesign genuinely lands. The ledger/audit metaphor is load-bearing, not cosmetic: REC-NN record IDs, a verified-green accent reserved only for evidence-backed sections (Projects, Experience), and Experience copy that already reads like reconciliation work ("validating input completeness and accuracy," "maintain complete transaction logs for audit and compliance") make the visual system and the actual job reinforce each other. Credentials correctly does NOT get the verified checkmark — seminars/workshops aren't hard technical certs — which is an honest, disciplined application of the system rather than decorating everything. This reads as authored for this specific pivot story.

Deterministic scan: 35 findings, but the profile changed meaningfully since DESIGN.md now exists as an enforcement target. 25 are `design-system-font-size` (literal `text-[Npx]` values off the documented type ramp — pre-existing pixel-value labels like dates/tags, not new regressions), 7 are `design-system-color` (mostly in `opengraph-image.tsx` and the separate PDF-resume renderer, which run outside the Tailwind/CSS token system entirely — legitimate scope mismatches, not real drift), 1 `overused-font` (Geist — the known, accepted false positive), 1 `design-system-radius` (the `2px` focus-ring offset in globals.css, a functional value not a component radius), 1 `design-system-font` (Helvetica in the PDF resume generator, a different rendering context). None of these are regressions from this session's work; they're pre-existing patterns newly visible now that a token scale exists to check against.

## Overall Impression

This is now a genuinely strong, specific portfolio. Every P0 and P1 from the baseline critique is resolved. What remains is fine-grained: the CTA section itself (Contact) doesn't inherit the visual weight the redesign gave to "evidence" sections, and a couple of small polish items.

## What's Working

- Section-level hierarchy now does real work — Projects/Experience visually outrank Skills/Credentials/TypingGame, exactly the fix the P0 called for.
- The verified-green accent is disciplined: it appears only on Projects, Experience, and the hero's status badge — never decoratively.
- Content-level specificity: Experience bullets and Skills categories already speak QA/audit/reconciliation language, so the visual metaphor isn't fighting the copy.

## Priority Issues

**[P2] Contact — the actual conversion target — gets the same muted, low-hierarchy header as Skills/Credentials/TypingGame.** The redesign built a clear "primary work evidence" tier (bold + checkmark) vs. everything else, but Contact fell into "everything else" too. A recruiter scrolling past REC-01 PROJECTS (bold, checkmarked) to REC-06 LET'S WORK TOGETHER (small, gray, same weight as the typing game) gets a visual demotion right at the funnel's destination. Fix: give Contact its own distinguishing treatment. File: `src/components/Section.tsx:58-68`, `src/components/ContactForm.tsx:38`.

**[P3] TypingGame sits immediately before ContactForm in scroll order.** It's well-labeled as optional but still inserts a game between Certifications and the ask. Fix: move Contact directly after Credentials, TypingGame after Contact (or to the end) as a closing flourish. File: `src/app/page.tsx:15-18`.

**[P3] DESIGN.md's typography section doesn't match the implementation.** It states Display (Geist Pixel) is used for "the hero name only," but `Section.tsx` applies `font-display` to every section h2, and the nav wordmark uses it in three places. Fix: correct the Hierarchy table.

**[P3] PresenceIndicator risks showing "1 person viewing" to the only visitor on the page.** Low-number social proof reads worse than none — it signals low traffic rather than building confidence. Fix: suppress below a threshold (e.g. only render when count ≥ 2). File: `src/components/PresenceIndicator.tsx:38-46`.

## Persona Red Flags

**Riley (evidence-driven recruiter)**: Would notice Credentials is thin relative to the "verified ledger" framing — a Civil Service Exam pass and three seminar attendances, no QA/Data/AI-specific certification. The design correctly withholds the verified checkmark here, which is honest, but the section itself may read as the weakest evidence for the stated pivot.

**Alex (fast recruiter skimming <60s)**: Benefits most from the fixed hierarchy — first two scroll-stops land on exactly the right content. The one friction point: TypingGame appearing right before Contact, a context-switch at the moment of deciding whether to act.

## Minor Observations

- The mobile hamburger menu's exit-timing pattern avoids a jump-cut close.
- `prefers-reduced-motion` is correctly wired for the WASD mascot even in the "for fun" section — accessibility hygiene carried through.
- Neutral-500 muted text (`#7d7460` on `#f6f4ee`) is used extensively for body/meta copy — worth an explicit contrast check; not verified against WCAG AA in this pass since no rendering tool was available (math from the original identity round put the accent comfortably over AA; this specific gray/paper pair wasn't separately checked).
- Detector's `design-system-font-size` cluster suggests DESIGN.md's documented type scale could use a couple more explicit steps (10-14px label sizes) to reduce future noise, since these are legitimate repeated values, not one-offs.

## Questions to Consider

1. If Contact is the page's terminal action, why does its header carry less visual weight than Projects — is "primary emphasis = has evidence" the right rule, or should "primary emphasis = where I want your next click" override it for exactly one section?
2. Was keeping the typing test in the main scroll (vs. a separate route reachable only from the command palette) reconsidered, given it still occupies real estate in the direct path to Contact?
