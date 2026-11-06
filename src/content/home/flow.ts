// CPT Tools flow diagram (ADR 0007). Public facts only: every word comes from CPT Tools' entry in
// src/content/data/projects.ts (description and tags). No internal app names, teams, fields or
// volumes; the three apps the description doesn't name stay unnamed. Checked by flow.test.ts.
export const cptFlow = {
  hub: "One login",
  /** The app kinds the public description names, in its order. */
  apps: ["Case tracking", "Attendance", "Scoring", "Quality audits", "Forecasting"],
  /** "Eight connected apps": the rest, unnamed. */
  moreApps: 3,
  store: "One database",
  tech: ["React", "Hono", "Cloudflare D1"],
};
