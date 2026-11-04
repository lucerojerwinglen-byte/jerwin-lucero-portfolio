import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Reads the palette straight out of globals.css, so the check runs against the
// colours that actually ship, in both themes.

const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

function block(selector: string): Record<string, string> {
  const re = new RegExp(`(^|\\n)${selector.replace(".", "\\.")}\\s*\\{([^}]*)\\}`, "g");
  for (const m of css.matchAll(re)) {
    if (!m[2].includes("--bg:")) continue;
    const tokens: Record<string, string> = {};
    for (const t of m[2].matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) tokens[t[1]] = t[2];
    return tokens;
  }
  throw new Error(`no palette block for ${selector}`);
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// [text token, background token]
const PAIRS: [string, string][] = [
  ["ink", "bg"],
  ["g500", "bg"],
  ["g500", "rail"],
  ["ink", "surface"],
  ["g500", "surface"],
  ["verified", "bg"],
  ["verified", "ok-soft"],
  ["partial", "partial-soft"],
  ["cta-ink", "cta"],
  ["verified", "surface"],
  ["mark-ink", "mark"],
];

// Dark mode draws the highlighter as yellow text instead of a band behind ink.
const DARK_ONLY: [string, string][] = [["mark", "bg"]];

test("the palette stays small: no per-tile colours", () => {
  const p = block(":root");
  const tileTokens = Object.keys(p).filter((k) => k.startsWith("tile-"));
  assert.deepEqual(tileTokens, []);
});

for (const [theme, selector, extra] of [
  ["light (Paper)", ":root", []],
  ["dark (Graphite)", ".dark", DARK_ONLY],
] as const) {
  test(`${theme}: every text/background pair meets WCAG AA (4.5:1)`, () => {
    const p = block(selector);
    const failures: string[] = [];
    for (const [fg, bg] of [...PAIRS, ...extra]) {
      assert.ok(p[fg], `${theme} is missing --${fg}`);
      assert.ok(p[bg], `${theme} is missing --${bg}`);
      const ratio = contrast(p[fg], p[bg]);
      if (ratio < 4.5) failures.push(`--${fg} on --${bg}: ${ratio.toFixed(2)}:1`);
    }
    assert.deepEqual(failures, []);
  });
}

test("contrast maths matches known values", () => {
  assert.equal(contrast("#000000", "#ffffff").toFixed(1), "21.0");
  assert.equal(contrast("#777777", "#ffffff").toFixed(2), "4.48");
});
