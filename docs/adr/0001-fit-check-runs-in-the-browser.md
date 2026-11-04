# 0001 — The fit check matches job posts in the browser, with no AI model

**Status:** active · **Date:** 2026-11-03

## Context

The homepage's main action is now the **fit check**: a recruiter pastes a job description
and every recognised requirement is stamped Verified / Partial / Not yet, with links to the
evidence. Something has to read the job post. Two options were weighed:

- **A. Keyword + synonym matcher** (`src/lib/fit/`): a hand-written list of capabilities,
  each with the phrases a posting might use, matched as whole words in the browser.
- **B. An LLM** (Claude API route) reading the posting.

## Decision

A. The matcher is pure TypeScript, runs client-side, and the job post never leaves the
browser unless the recruiter chooses to send the report.

## Consequences

- $0 running cost, no API key, instant, private, and unit-tested (`npm test`).
- Unusual wording is missed. The UI says so ("Only requirements I can recognise are
  listed"), and new phrases are added to `capabilities.ts` as they come up.
- Evidence is looked up from the content layer by slug/name and throws if missing, so a
  renamed project cannot leave a stale claim.
- Statuses are claims about Jerwin. Partial and Not yet are deliberate: an honest gap is
  part of the pitch. Any new "verified" needs real evidence on the page.
- Revisit B only if recruiters report the matcher missing obvious requirements, and only
  with a budget agreed first.
