# 0007 — Eight features borrowed from the BrewedOps portfolio

**Status:** active · **Date:** 2026-11-05 · amends 0005 (recommendations placeholders) · decided in a grilling session

## Context

On 2026-11-05 Jerwin studied portfolio.brewedops.cloud (Kenneth Villar) from its public files and
live screenshots, then compared it with this site. Most of its features already exist here. The
gaps worth filling: no machine-readable profile, the Ask palette hard to find, no display
options, nothing saying how Jerwin works, no answers to recruiters' usual questions, projects
that only link to a list, no picture of CPT Tools, and three empty recommendation cards on the
live site.

Like ADR 0005, we borrow the *feature*, not the look or the code: everything is written here
from scratch in this site's neutral style. (BrewedOps publishes its code as templates under
PolyForm Noncommercial with a "your own portfolio" permission; we copy none of it.)

## Decision

Eight tickets, built in this order:

1. **Profile for machines.** Person JSON-LD on the homepage: job title "Software Engineer",
   `worksFor` Sagility as Workday Transactions Analyst (matches ADR 0006). Credentials: BS
   Computer Science Cum Laude (Bicol University), Civil Service Professional Level, and the four
   Anthropic certificates with their verify links. Seminars, workshops and summits are left out:
   attending is not a credential. `llms.txt` is generated from the content files at build time
   (like `robots.ts` and `sitemap.ts`), never hand-written, so it cannot go stale.
2. **Ask pill.** A floating pill, bottom-right on phone and desktop, with a search icon and the
   word "Ask" (plus the `Alt+K` hint on desktop). It opens the existing Ask palette. Not a face
   and not a chat: the palette is search, not AI. Hidden while the menu, the tour or an overlay
   is open.
3. **Accessibility panel.** An `Aa` button next to the theme switch (inside the menu on phones)
   with three switches: Larger text, Reduce motion, Readable font. High contrast is left out
   because the palette test already enforces AA contrast. Larger text multiplies every homepage
   font size by a `--text-scale` variable (1 → 1.15) instead of zooming the page, so the layout
   and the résumé page do not change; a test fails on any homepage `font-size` that skips the
   variable. Reduce motion turns off the same things the OS setting does. Choices are remembered
   through the existing safe-storage helper.
4. **Method: "Ask. Prove. Ship."** A new section right after projects ("03 — how I work").
   Ask why until the decision is clear and write it down; write the check that proves it before
   the code; ship one small piece and watch it work. Each step links to evidence, like the stats.
5. **FAQ.** An accordion above the reply form in "say hello", searchable from the Ask palette.
   The answers are Jerwin's own (given in the grilling session): roles (software engineering, QA,
   data and AI), hybrid in Metro Manila or remote overlapping UTC+8, 30 days after an offer,
   code (Barato public, Lovewin private with a walkthrough on request, CPT Tools explained but no
   code, screenshots or links), and freelance (yes).
6. **Project sheets.** Clicking a project opens a sheet over the current page, and the address
   becomes `/projects/<slug>`. Opening that address cold shows the same case study as a full
   page (Next.js intercepting routes; one shared component, so the two cannot differ). Every
   project gets a sheet built from its existing fields; optional case-study fields (problem,
   what I built, how I proved it, screenshots) are filled for Lovewin, Barato and CPT Tools first.
7. **CPT Tools flow diagram.** Inside the CPT Tools sheet, it draws itself when the sheet
   opens. It shows only what is already public: generic app kinds (e.g. "Case tracker"), one
   login, one database, and the tech. No internal names, team names, data fields or volumes.
   Animated with **GSAP** (new dependency, approved by Jerwin over a CSS-only version); static
   when motion is reduced (OS setting or the panel's switch).
8. **Recommendations hidden.** The section uses the existing `hidden` flag, so the numbers close
   up. "References available on request" moves to the "say hello" text and becomes a sixth FAQ
   ("Can I talk to your references?" → yes, on request). The section returns when one real
   quote exists.

## Consequences

- Amends ADR 0005: the three recommendation placeholders no longer show. The placeholder rule
  itself (never invent people or numbers) still holds.
- One new dependency, GSAP (free "no charge" license, not MIT), used only by the flow diagram.
- The homepage gains a numbered section; numbering is automatic.
- The résumé at `/resume` and its PDF do not change in any ticket.
- Ticket 7 needs ticket 6; ticket 8 adds to ticket 5's FAQ.
