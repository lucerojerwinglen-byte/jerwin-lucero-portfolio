import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Ticket #15 (ADR 0007): the Accessibility panel's CSS. Source checks: node can't render CSS.
const read = (p: string) => readFileSync(join(process.cwd(), p), "utf8");
const home = read("src/styles/home.css");

test("Larger text: every homepage font size goes through --text-scale", () => {
  const decls = home.match(/(?:font-size|font):[^;}]*/g) ?? [];
  const sized = decls.filter((d) => /\d+(?:\.\d+)?px/.test(d.replace(/\/\s*\d+(?:\.\d+)?px/, "")));
  const bare = sized.filter((d) => !/calc\(\s*\d+(?:\.\d+)?px \* var\(--text-scale\)\)/.test(d));
  assert.ok(sized.length > 50, `expected the homepage's ~65 sized fonts, found ${sized.length}`);
  assert.deepEqual(bare, [], "font sizes that ignore Larger text");
});

test("Larger text is 1.15×, set on <html>, and 1× by default", () => {
  assert.match(home, /:root\s*\{\s*--text-scale: 1;\s*\}/);
  assert.match(home, /:root\[data-text="large"\]\s*\{\s*--text-scale: 1\.15;\s*\}/);
});

test("Reduce motion does what the OS setting does: no animations, transitions or hover moves", () => {
  assert.match(
    home,
    /:root\[data-motion="reduce"\] :is\(\.home \*, \.overlay, \.panel, \.tour, \.tour-ring\)\s*\{[^}]*animation: none !important;[^}]*transition: none !important;[^}]*translate: none !important;[^}]*rotate: none !important;[^}]*scale: none !important;/,
  );
  assert.match(home, /:root\[data-motion="reduce"\] \.tools-row\[aria-hidden="true"\]\s*\{\s*display: none;/);
});

test("JS motion (smooth scrolling) also honours the Reduce motion switch", () => {
  assert.match(read("src/lib/home/motion.ts"), /dataset\.motion === "reduce"/);
});

test("Readable font swaps the pixel face for plain Geist", () => {
  assert.match(home, /:root\[data-font="readable"\] \.home\s*\{\s*--pixel: var\(--body\);/);
});

test("the panel sits beside the theme switch and uses real switches", () => {
  const side = read("src/components/home/Sidebar.tsx");
  assert.match(side, /<div className="switch">[\s\S]*role="group" aria-label="Theme"[\s\S]*<DisplayPanel \/>/);
  const panel = read("src/components/home/DisplayPanel.tsx");
  assert.equal((panel.match(/role="switch"/g) ?? []).length, 1, "one switch template, mapped over three settings");
  assert.match(panel, /aria-checked=/);
  for (const label of ["Larger text", "Reduce motion", "Readable font"]) assert.ok(panel.includes(label), label);
  assert.doesNotMatch(panel, /localStorage\./, "goes through safeLocalStorage");
});
