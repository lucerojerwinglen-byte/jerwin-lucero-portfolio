// Project sheet case studies (ADR 0007). Homepage-only: kept out of src/content/data/ so the
// résumé PDF fingerprint doesn't change. Never fabricate: every sentence restates a fact already
// in that project's entry in src/content/data/projects.ts (description, details, tags, note).

export interface CaseStudy {
  problem: string;
  built: string;
  proved: string;
}

export const caseStudies: Record<string, CaseStudy> = {
  lovewin: {
    problem:
      "Digital gifts for long-distance couples, where the server only ever stores ciphertext, so nobody else, me included, can read them.",
    built:
      "A free, end-to-end-encrypted gift app: bouquet builder, letters with a sketch pad, photos (EXIF stripped in the browser), voice memos and songs, an optional code lock and unlock time. The key lives after the # in the link.",
    proved:
      "Every lock and unlock time is checked by the server, not just the page. Tested on phone and desktop with Vitest and Playwright. Listed on App Builders PH.",
  },
  barato: {
    problem: "Find the most filling fast-food order for a budget across six Philippine chains.",
    built:
      "A hand-written dynamic-programming solver in TypeScript and React, shipped as an offline PWA that runs at $0/month.",
    proved:
      "A weekly GitHub Actions pipeline fetches, checksums, parses and validates prices (30% price-jump and item-count checks) before anything is published. A failed check opens an issue instead of shipping bad data.",
  },
  "team-ops-suite": {
    problem:
      "Case tracking, attendance, scoring, quality audits and forecasting for a two-region operations team, in one place.",
    built:
      "Eight connected apps on one login and one database, in production, built with React, Hono and Cloudflare D1.",
    proved:
      "58 recorded architecture decisions, and Playwright tests. No code or screenshots here: it's my employer's, so I explain how it works instead.",
  },
};
