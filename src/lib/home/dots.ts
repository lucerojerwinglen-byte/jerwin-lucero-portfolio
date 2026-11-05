/** Contribution counts → dot levels 0–4, relative to the busiest day. 0 means no contributions. */
export function dotLevels(counts: number[]): number[] {
  const max = Math.max(0, ...counts);
  if (max === 0) return counts.map(() => 0);
  return counts.map((c) => (c <= 0 ? 0 : Math.min(4, Math.max(1, Math.ceil((c / max) * 4)))));
}

/** Dot diameter (as a share of its cell) for each level. */
export const DOT_SIZE = ["28%", "38%", "55%", "72%", "92%"] as const;
