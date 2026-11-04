import { capabilities, type Capability } from "./capabilities";
import { site } from "@/content/data/site";

/** The contact form's message limit (see contactFormSchema). */
export const REPORT_MAX_CHARS = 2000;

/** Window event the fit check fires to hand its report to the contact form. */
export const FIT_REPORT_EVENT = "fitcheck:report";

/** Window event the overview's preset chips fire to run a preset in the fit check. */
export const FIT_PRESET_EVENT = "fitcheck:preset";

/**
 * A pasted job post usually opens with its title ("Senior QA Engineer").
 * Use that as the role name when it is short enough to be one.
 */
export function guessRole(jobDescription: string): string | undefined {
  const first = jobDescription.split("\n").map((l) => l.trim()).find(Boolean);
  if (!first || first.length > 60 || /[.:!?]$/.test(first)) return undefined;
  return `${first} role`;
}

export interface FitRow {
  capability: Capability;
  /** The job description's own wording, as written. */
  matched: string;
  /** Where it first appears in the job description; rows are sorted by it. */
  index: number;
}

export interface FitResult {
  rows: FitRow[];
  counts: { verified: number; partial: number; gap: number };
  /** 0–100. A partial counts as half a verified requirement. */
  score: number;
}

// A term matches as a whole word: "excel" must not fire on "excellent", nor
// "java" on "javascript". "+" and "#" count as word characters so "c" never
// fires inside "c++". Spaces and hyphens in a term match any run of
// whitespace, hyphens or slashes, so "end to end" finds "end-to-end".
const WORD = "a-z0-9+#";

function termPattern(term: string): RegExp {
  const body = term
    .split(/[\s-]+/)
    .map((part) => part.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&"))
    .join("[\\s\\-/]+");
  return new RegExp(`(?<![${WORD}])${body}(?![${WORD}])`, "g");
}

const compiled = capabilities.map((capability) => ({
  capability,
  patterns: capability.terms.map(termPattern),
}));

export function reconcile(jobDescription: string): FitResult {
  // toLowerCase keeps string length for the text we expect, so indices found
  // in `haystack` slice the original wording out of `jobDescription`.
  const haystack = jobDescription.toLowerCase().replace(/[’‘]/g, "'");
  const rows: FitRow[] = [];

  for (const { capability, patterns } of compiled) {
    let best: { index: number; length: number } | null = null;
    for (const pattern of patterns) {
      pattern.lastIndex = 0;
      const m = pattern.exec(haystack);
      if (m && (!best || m.index < best.index)) best = { index: m.index, length: m[0].length };
    }
    if (best) {
      rows.push({
        capability,
        matched: jobDescription.slice(best.index, best.index + best.length),
        index: best.index,
      });
    }
  }

  rows.sort((a, b) => a.index - b.index);

  const counts = { verified: 0, partial: 0, gap: 0 };
  for (const row of rows) counts[row.capability.status]++;
  const score =
    rows.length === 0 ? 0 : Math.round(((counts.verified + counts.partial / 2) / rows.length) * 100);

  return { rows, counts, score };
}

/** The message a recruiter can send from the contact form. */
export function formatReport(result: FitResult, role?: string): string {
  const { rows, counts, score } = result;
  const labels = (status: Capability["status"]) =>
    rows.filter((r) => r.capability.status === status).map((r) => r.capability.label);

  const lines = [
    `Hi Jerwin, I ran your fit check against our ${role?.trim() || "open role"}.`,
    "",
    `Reconciled: ${counts.verified}/${rows.length} verified, ${counts.partial} partial, ${counts.gap} not yet (${score}%).`,
  ];
  if (counts.verified) lines.push("", `Verified: ${labels("verified").join(", ")}`);
  if (counts.partial) lines.push("", `Partial: ${labels("partial").join(", ")}`);
  if (counts.gap) lines.push("", `Not yet: ${labels("gap").join(", ")}`);
  lines.push("", `(Sent from the fit check on ${site.url.replace(/^https:\/\//, "")})`);

  const report = lines.join("\n");
  return report.length <= REPORT_MAX_CHARS ? report : `${report.slice(0, REPORT_MAX_CHARS - 1)}…`;
}
