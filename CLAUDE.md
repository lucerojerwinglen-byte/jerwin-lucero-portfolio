@AGENTS.md

## Project brain

Read `CONTEXT.md` (glossary) and `docs/adr/README.md` (decision index) first, then only what
the task needs. Working agreement: `docs/agents/senior-loop.md`. Domain-doc rules:
`docs/agents/domain.md`. Issues live in GitHub Issues (`gh` CLI) — see
`docs/agents/issue-tracker.md`; labels in `docs/agents/triage-labels.md`.

## Commands

- `npm run dev` — dev server
- `npm run build` — `next build`
- `npm run pdf` — print the résumé PDF from the real page (needs Edge); run after any change to content, `src/components/doc/` or `src/styles/document.css`, then commit the PDF and `src/content/resume-lock.json`
- `npm run lint` — ESLint
- `npm test` — unit tests (`node:test` via `tsx --test`, files `src/**/*.test.ts`; no extra dependency)
