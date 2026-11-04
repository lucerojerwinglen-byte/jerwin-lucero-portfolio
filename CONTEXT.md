# Jerwin Lucero Portfolio

Personal portfolio site for Jerwin Glen A. Lucero (Workday Transactions Analyst at Sagility,
with a Computer Science background). Next.js (App Router) + TypeScript + Tailwind CSS,
deployed on Vercel with auto-deploy on push to `main`. Visual direction lives in
[DESIGN.md](DESIGN.md); animation work plans are in `plans/`.

## Language

**Content layer**:
The typed data files in `src/content/data/` (site, projects, experience, education, skills,
credentials). The single source for both the website and the resume PDF.

**Resume PDF**:
Generated at build time from the content layer (`npm run generate:resume`, `@react-pdf/renderer`).

**Presence indicator**:
The live "people viewing" counter, via Supabase Realtime. Degrades gracefully if unconfigured.

**Contact form**:
Form backed by Resend. Degrades gracefully if its keys are missing.

**Command palette**:
The ⌘K / Ctrl+J `cmdk` menu.

**Overview**:
The homepage's first screen (`Overview.tsx`, section id `about`): headline, CTA, the
tool marquee (`ToolStrip.tsx`) and the bento tiles linking to the full sections. See ADR 0002.

**Profile rail**:
The desktop left sidebar (`Nav.tsx`): ID card, colour-dot section links, the reconciliation
ledger, presence and theme toggle.

**Fit check**:
The `AUDIT` section under the hero (`FitCheck.tsx`, logic in `src/lib/fit/`). A recruiter
pastes a job post; each recognised requirement becomes a ledger row stamped Verified /
Partial / Not yet with evidence links, and the report can prefill the contact form.
See ADR 0001.

**Capability**:
One row the fit check can recognise (`capabilities.ts`): the phrases a posting uses, a
status, an honest note for Partial / Not yet, and evidence looked up from the content layer.

**Typing game**:
The self-contained typing speed test (`TypingGame.tsx`, snippets in `typing-snippets.ts`).

**Scrollcraft**:
The scroll-driven animation layer (`public/scrollcraft.js`, mounted by `ScrollcraftMount.tsx`; source/builds in `scrollcraft/`).

**Plans**:
Self-contained animation improvement tickets in `plans/` (numbered 001…), written for other agents to execute.
