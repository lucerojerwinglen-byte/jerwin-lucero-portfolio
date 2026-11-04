# 0004 — The site is the résumé: one document for screen and paper

**Status:** active · **Date:** 2026-11-04 · supersedes 0002 and 0003 (visuals) · retires 0001 (fit check)

## Context

The bento/ledger redesign (0002, 0003) was rejected as busy. The ask: minimal, simple, and
distinctive: "my portfolio will just look like a PDF, but better". Recruiters skim in under a
minute and often forward a PDF, so the web page and the PDF should be the same thing.

## Decision

- The homepage is a typeset 2-page A4 résumé (`src/components/doc/`), framed like a PDF viewer
  on desktop and full-bleed on phones. Page breaks are fixed by design, not computed.
- One stylesheet (`src/styles/document.css`) for screen and print. Neutrals plus one accent,
  fountain-pen blue; green ("live") and red (form errors) are status only. Dark mode is the
  "reading lamp". Source Serif 4 headings, Geist body, Geist Mono for data.
- The downloadable PDF is printed from the real page by headless Edge (`npm run pdf`,
  playwright-core), committed, and guarded: `resume-pdf.test.ts` fails when the fingerprint of
  everything on paper differs from `src/content/resume-lock.json`. The script refuses to write
  a PDF with clipped text or a page count other than 2. `@react-pdf/renderer` is removed.
- "Rev. N · date" comes from that lock file, so the page and the PDF always show the same revision.
- Web-only layer (never printed, `src/components/web/`): viewer bar, find-in-document
  (CSS Custom Highlight API: no DOM rewriting), contents sidebar, margin notes, skill-evidence
  trace, copy actions, reader count, a web-only sheet with Writing, Reply form and Appendix A
  typing test.
- Removed: fit check (recoverable from `ddeeb4c`), bento overview, profile rail, command
  palette, scrollcraft motion, primary and junior-high education entries.

## Consequences

- Any change to content, `src/components/doc/` or `document.css` needs `npm run pdf` before
  committing, or `npm test` fails. This is intended: the PDF can't silently drift.
- Content must fit two A4 pages; adding an entry means cutting or tightening another.
- `npm run pdf` needs Microsoft Edge installed (Windows default); Vercel never runs it.
