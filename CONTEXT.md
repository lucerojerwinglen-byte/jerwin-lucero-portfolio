# Jerwin Lucero Portfolio

Personal portfolio site for Jerwin Glen A. Lucero (Workday Transactions Analyst at Sagility,
with a Computer Science background). Next.js (App Router) + TypeScript + Tailwind CSS,
deployed on Vercel with auto-deploy on push to `main`. Visual direction lives in
[DESIGN.md](DESIGN.md); the résumé decision is ADR 0004. `plans/` holds animation tickets for components that ADR 0004 removed.

## Language

**Content layer**:
The typed data files in `src/content/data/` (site, projects, experience, education, skills,
credentials). The single source for the page and therefore the PDF.

**Document**:
The 2-page A4 résumé that is the homepage (`src/components/doc/`, `src/styles/document.css`).
Everything in it is printed. See ADR 0004.

**Sheet**:
One A4 page of the document (`.sheet[data-page]`); the web-only sheet is `data-page="A"`.

**Résumé PDF**:
`public/jerwin-lucero-resume.pdf`, printed from the page by `npm run pdf` (headless Edge) and
committed. Guarded by `src/lib/document/resume-pdf.test.ts`.

**Resume lock**:
`src/content/resume-lock.json`: revision number, date and fingerprint of the last generated PDF.
Source of the "Rev. N" stamp.

**Fingerprint**:
Hash of every file that shapes the printed page (`src/lib/document/fingerprint.ts`).

**Footnote**:
Numbered link reference on a linked project; prints as a real URL at the sheet's foot.

**Margin note**:
Pen-blue aside in the desk gutter on wide screens. Web only; toggled with N.

**Evidence trace**:
Clicking a skill highlights the entries that prove it (`Skill.usedIn` → `data-entry`).

**Viewer bar**:
The fixed top bar: file name, page counter, reader count, Find, Notes, reading lamp, Print, PDF.

**Find**:
Find-in-document (Ctrl K or /), painted with the CSS Custom Highlight API.

**Reading lamp**:
Dark mode.

**Presence indicator**:
The live "N reading" count in the viewer bar, via Supabase Realtime. Hidden if unconfigured.

**Contact form**:
The "Reply" form on the web-only sheet, backed by Resend. Degrades gracefully if keys are missing.

**Typing test**:
Appendix A on the web-only sheet (`TypingTest.tsx`, snippets in `typing-snippets.ts`).
