# 0006 — Software-engineer hero, brand-coloured logos, portfolio pages

**Status:** active · **Date:** 2026-11-05 · amends 0005 and PRODUCT.md · decided in a grilling session (issue #7)

## Context

ADR 0005 gave the homepage a portfolio layout but kept the QA/data/AI framing, a black-and-white
look with Lovewin's icon as the only possible colour, an anonymised "Team Operations Suite",
and "see more" links that land on the résumé document. Jerwin wants the homepage to present
him as a curious software engineer who builds web and mobile apps with generative AI, to show
real logos everywhere, and to keep visitors inside the portfolio.

## Decision

- **Role line.** The homepage says "software engineer" and names the day job as a caption:
  "By day: Workday Transactions Analyst at Sagility." Backed by a CS degree and shipped, tested
  apps; the honest condition is that Jerwin can explain his own code. The résumé's role line is
  unchanged.
- **Hero copy** is Jerwin's own (no wording from bryllim.com): curiosity first, then "software
  engineer who never stopped asking why", the AI tools he uses (Claude, ChatGPT, Gemini), and
  "I like living a little in the future… Most of my ideas start with 'what if?' and end with an app."
- **Logos keep their brand colours, everywhere.** Tech, AI tools, project icons and
  certification issuers show as logo + name (never a bare icon: recruiters skim, phones have no
  hover, screen readers need the name). A **wordmark** (e.g. Workday) spells the name, so it
  counts as logo + name and stands alone; a qualifier like "(HRIS)" moves to its tooltip, and in
  dark mode it sits on a light plate so its brand-coloured text stays readable. The page itself (background, text, rules, cards)
  stays neutral; colour comes only from real logos. Supersedes 0005's "neutrals only" for logos.
- **Logo sources:** `@iconify-json/logos` (CC0 drawings, brand trademarks) for most tech;
  official logos for Workday, SheetJS, Microsoft Office (its current brand, Microsoft 365) and
  pytest (missing from Iconify) stored in `public/logos/` with their source noted; a generic database icon for SQL (not a brand). Certification issuers (CSC seal,
  UNC, PROXY by The Oriental, Bicol University) use their official logos, the CSC government
  seal included, chosen knowingly.
- **Projects.** Homepage cards: Lovewin (real app icon), CPT Tools (neutral icon; never the
  Sagility mark, which is a registered trademark), and a "Next app" placeholder. Barato leaves
  the cards but stays on the résumé and on /projects.
- **CPT Tools may be named** (Jerwin confirmed his employer allows it). Still no employer logo,
  links or screenshots. The résumé renames "Team Operations Suite" to "CPT Tools"; the PDF is
  regenerated.
- **Stay on the portfolio.** New /projects, /experience and /certifications pages in the
  homepage style. "See more" links, stats and stack links go there. Only links labelled
  "résumé" or "pdf" lead to /resume or the PDF. The reply form is added to the homepage's
  "say hello" section and also stays on /resume, for recruiters who only ever see the résumé.

- **Portrait (added 2026-11-05).** The homepage hero shows Jerwin's own drawing in its colours
  (no greyscale halftone: that treatment suited a photo, not a drawing), background cut out and
  bottom faded so there is no frame. A cursor-follow tilt was tried and removed: the drawing
  stays still. Visitors can put a cap on
  and take it off (chip or click on the drawing); the cap drawing wipes in from the top. The two
  drawings are face-aligned by `scripts/hero-cap-images.mjs`. The résumé keeps its photo.

- **Interactive stack (added 2026-11-05).** The homepage stack has filters (All, Languages,
  Testing, Web, Data & cloud) with a sliding highlight; a tag with `usedIn` opens a "used in"
  card (hover, focus or tap) linking to the project or job rows. Cloudflare, Supabase and Vercel
  are shown. Below it, "Tools I use" (from the vault: Claude Code, VS Code, ChatGPT, Gemini,
  Obsidian, GitHub, Vite, Node.js, Git Bash, PowerShell, Remotion, HyperFrames, ElevenLabs) runs
  as a slow endless strip that pauses on hover, static with reduced motion. The tools live in
  `src/content/home/home.ts`, not `skills.ts`, so the résumé and PDF are unchanged; they are also
  listed on /experience.

- **Anthropic certificates (added 2026-11-05).** Four Anthropic Education certificates (Claude Code
  in Action, Introduction to agent skills, Introduction to subagents, Claude Code 101) are on the
  homepage (with the CSC and Git & GitHub cards) and on /certifications under "AI learning". Each
  card links to its Skilljar verify page and to a PDF copy in `public/certificates/`. Website only:
  the résumé's credentials and PDF are unchanged. The Anthropic logo comes from the Iconify set,
  white in dark mode. Facts come from the verify pages; no hours or skills are claimed.

- **Playful hover on every component (added 2026-11-05).** `src/styles/hover.css`: elements lift,
  tilt and overshoot (`--spring`), text links draw their underline, cards and tags pop, the fan's
  side cards come forward, dots swell, overlay rows slide. Jerwin chose "playful" over "subtle".
  Only for a real mouse (`hover: hover` and `pointer: fine`) and only when motion is allowed;
  touch and reduced-motion visitors keep the plain colour changes. The résumé page and PDF are not
  touched. Hover effects use `translate`/`rotate`/`scale` so they never replace the fan's `transform`.
  The portrait does not follow the cursor (removed earlier); it only turns slightly on hover.

## Consequences

- One new dependency (`@iconify-json/logos`, ~2,300 logos). Logo data is read on the server and
  only the SVGs actually used reach the browser.
- PRODUCT.md's positioning, role line and "anonymised" rule change accordingly.
- The palette test still guards the page's own tokens (neutral + status colours); logos are
  outside it by design.
- Trademark note: logos are used nominatively (to say "I use / attended this"). Not legal advice.
