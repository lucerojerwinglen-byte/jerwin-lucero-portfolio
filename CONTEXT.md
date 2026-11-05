# Jerwin Lucero Portfolio

Personal portfolio site for Jerwin Glen A. Lucero (Workday Transactions Analyst at Sagility,
with a Computer Science background). Next.js (App Router) + TypeScript + Tailwind CSS,
deployed on Vercel with auto-deploy on push to `main`. Visual direction lives in
[DESIGN.md](DESIGN.md). The homepage is a portfolio page (ADR 0005); the résumé lives at `/resume` (ADR 0004). `plans/` holds animation tickets for components that ADR 0004 removed.

## Language

**Content layer**:
The typed data files in `src/content/data/` (site, projects, experience, education, skills,
credentials). The single source for the page and therefore the PDF.

**Document**:
The 2-page A4 résumé at `/resume` (`src/components/doc/`, `src/styles/document.css`).
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

**Homepage**:
The portfolio page at `/` (ADR 0005): sidebar plus one column of numbered sections, neutrals
only. Not printed. Styles in `src/styles/home.css`, components in `src/components/home/`.

**Home content**:
`src/content/home/home.ts`: section order, badges, stats, recommendations, affiliations,
coming-soon pages. Outside the content layer on purpose, so it never changes the PDF
fingerprint. Every badge and stat cites evidence; checked by `home.test.ts`.

**Placeholder**:
A clearly labelled empty slot (e.g. a recommendation card reading "Recommendation slot")
standing in for real content that doesn't exist yet. Never carries a person's name.

**Ask palette**:
The Alt+K (or Ctrl K) search box on the homepage. Searches sections, pages, projects and
posts by title and keywords (`src/lib/home/search.ts`). Not AI.

**Tour**:
The first-visit walkthrough on the homepage; remembered in localStorage, replayed from the
footer's "take the tour again".

**Coming-soon page**:
`/shop`, `/gear`, `/resources`, `/collabs`, `/consulting`: one route (`src/app/[soon]`),
listed in `soonPages`. Any other slug is a 404.

**Portfolio pages**:
`/projects`, `/experience`, `/certifications` (ADR 0006): the "see more" pages in the homepage
style, so visitors stay on the portfolio. Components in `src/components/home/PortfolioPages.tsx`.

**Logo**:
A brand mark shown in its own colours next to its name (`<Logo name>`), resolved by
`src/lib/logos.ts`. A **wordmark** (e.g. Workday) already spells the name and stands alone.
A **generic** logo is a lucide icon for things that aren't brands (SQL, NLP, AES-GCM).

**Featured cards**:
The three fanned cards in 02 projects (`featured` in `home.ts`): Lovewin, CPT Tools and a
"Next app" placeholder.

**Portrait / cap toggle**:
The hero drawing (`Portrait.tsx`). Two face-aligned drawings (`jerwin-nocap.webp`,
`jerwin-cap.webp`, made by `scripts/hero-cap-images.mjs` from the originals in the git-ignored
`assets-source/`); the cap one wipes in, the plain one wipes out along the same line, so the
hair never shows around the cap.

**Stack explorer / "used in"**:
The homepage stack (`StackExplorer.tsx`): filter buttons plus tags that open a "used in" card
linking to the projects or jobs listed in a skill's `usedIn` (`src/lib/home/used-in.ts`).

**Tools I use** (`toolsIUse` in `home.ts`):
The daily tools (Claude Code, VS Code, Obsidian…) in the scrolling strip and on /experience.
Homepage-only: not in `skills.ts`, so the résumé and PDF don't change.

**Anthropic certificates** (`anthropicCerts` in `home.ts`):
Four Anthropic Education certificates (Skilljar), shown on the homepage and under "AI learning"
on /certifications, each with a verify link and a PDF copy in `public/certificates/`. Website
only: not in `credentials.ts`, so the résumé and PDF don't change.

**Hover system**:
`src/styles/hover.css`, the playful cursor effects on every component (DESIGN.md, Hover). Mouse
only, off for touch and reduced motion.

**CPT Tools**:
The 8-app internal suite (formerly "Team Operations Suite"). Named, but never shown with the
employer's logo, links or screenshots.
