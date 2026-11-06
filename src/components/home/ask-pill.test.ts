import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Ticket #14 (ADR 0007): the floating Ask pill. Source checks, because the behaviour lives in a
// client component and CSS that node:test can't render.
const read = (p: string) => readFileSync(join(process.cwd(), p), "utf8");

test("Overlays always renders the Ask pill, hidden while the tour or any overlay is open", () => {
  // Hidden, not unmounted: closing the palette returns focus to the pill, so it must still exist.
  const src = read("src/components/home/Overlays.tsx");
  assert.match(src, /<AskPill hidden=\{open !== null\} onAsk=\{\(\) => show\("ask"\)\} \/>/);
});

test("the Ask pill has a visible word and an accessible name, and shows the Alt+K hint", () => {
  const src = read("src/components/home/Overlays.tsx");
  const pill = src.slice(src.indexOf("function AskPill"));
  assert.match(pill, /className="ask-pill"/);
  assert.match(pill, /aria-label="Ask anything \(Alt\+K\)"/);
  assert.match(pill, />Ask</);
  assert.match(pill, /<kbd>Alt<\/kbd>/);
});

test("the Ask pill hides while the phone menu is open, and the Alt+K hint hides on phones", () => {
  const css = read("src/styles/home.css");
  assert.match(css, /\.side\[data-open="true"\] ~ \.ask-pill\s*\{\s*display: none;/);
  assert.match(css, /\.ask-pill kbd\s*\{\s*display: none;/);
});
