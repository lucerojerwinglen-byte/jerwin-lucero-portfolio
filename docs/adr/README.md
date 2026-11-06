# ADR index

Read this first, then open only the ADRs that touch the area you're working in. One line
per ADR: number, gist, status. Statuses: **active**; **amended by NNNN** (still holds,
read both); **RETIRED by NNNN** (the feature it decided is gone); **SUPERSEDED by NNNN**
(replaced — read the newer one instead). When you add an ADR, add its line here.

- [0001](0001-fit-check-runs-in-the-browser.md) — Fit check matches job posts with an in-browser keyword matcher, no AI model — **RETIRED by 0004**
- [0002](0002-bento-overview-and-highlighter-palette.md) — Bento overview, profile rail, Highlighter (light) / Night Audit (dark) palettes — **SUPERSEDED by 0004**
- [0003](0003-one-accent-paper-and-graphite.md) — One accent (yellow highlighter) on Paper (light) / Graphite (dark); no tinted tiles — **SUPERSEDED by 0004**
- [0004](0004-the-site-is-the-resume.md) — The site is the résumé: one A4 document for screen and print, PDF generated from the page and test-guarded — **amended by 0005** (homepage moves to /resume; PDF pipeline still holds)
- [0005](0005-portfolio-homepage-resume-moves-to-its-own-page.md) — Homepage follows a sidebar + numbered-sections portfolio layout, neutrals only; résumé and PDF move to /resume; placeholders never fabricate — **amended by 0006, 0007**
- [0006](0006-software-engineer-hero-brand-logos-portfolio-pages.md) — Homepage says software engineer (Workday as caption); logos keep brand colours everywhere; CPT Tools named; "see more" stays on new portfolio pages — **active** (amends 0005)
- [0007](0007-rea-features-from-brewedops.md) — Eight features from the BrewedOps study: Person data + llms.txt, Ask pill, Accessibility panel, Method, FAQ, project sheets, CPT Tools flow diagram (GSAP), recommendations hidden — **active** (amends 0005)
