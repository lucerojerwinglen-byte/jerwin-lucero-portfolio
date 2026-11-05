import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

// The playful hover system (2026-11-05): every interactive component answers the cursor.
const path = "src/styles/hover.css";
const css = existsSync(path) ? readFileSync(path, "utf8") : "";
const globals = readFileSync("src/app/globals.css", "utf8");

test("hover.css exists and loads after home.css (so it wins ties)", () => {
  assert.ok(css, `${path} is missing`);
  assert.ok(globals.indexOf("home.css") < globals.indexOf("hover.css"), "hover.css must be imported after home.css");
});

test("movement only runs for a real mouse and only when motion is allowed", () => {
  assert.match(css, /@media \(hover: hover\) and \(pointer: fine\) and \(prefers-reduced-motion: no-preference\)/);
  // the hover block is one media query: every `:hover` rule sits inside it
  const outside = css.split(/@media \(hover: hover\)[^{]*\{/)[0];
  assert.doesNotMatch(outside, /:hover/, "a :hover rule sits outside the gated media query");
});

test("effects use individual transform properties, so the fan's own `transform` is never overwritten", () => {
  const hoverBlock = css.slice(css.indexOf("@media (hover: hover)"));
  assert.doesNotMatch(hoverBlock, /[;{]\s*transform\s*:/, "use translate / rotate / scale, not transform, inside the hover block");
  for (const prop of ["translate", "rotate", "scale"]) assert.match(hoverBlock, new RegExp(`${prop}:`));
});

test("no `transition: all` (it would animate layout and fight the fan)", () => {
  assert.doesNotMatch(css, /transition:\s*all/);
});

test("the playful spring curve is defined once and used", () => {
  assert.match(css, /--spring:\s*cubic-bezier\(0\.34,\s*1\.56,\s*0\.64,\s*1\)/);
  assert.ok((css.match(/var\(--spring\)/g) ?? []).length >= 10);
});

test("each kind of component has a hover rule", () => {
  for (const sel of [
    ".side nav a:hover", ".pill:hover", ".portrait:hover", ".facts a.stat:hover", ".post:hover", ".job:hover",
    ".pcard[data-pos=\"0\"]:hover", ".pcard-hit:hover + .pcard", ".htag:hover", ".card:hover", ".hbtn:hover",
    ".gh-grid i:hover", ".panel .results a:hover", ".stackx-filters button:hover", ".prow:hover", ".page .back:hover",
  ]) {
    assert.ok(css.includes(sel), `no hover rule for ${sel}`);
  }
});

test("hover.css never reuses a custom property the site already defines (--hit is the find-highlight colour)", () => {
  const document = readFileSync("src/styles/document.css", "utf8");
  const mine = [...css.matchAll(/(--[a-z-]+)\s*:/g)].map((m) => m[1]);
  for (const name of new Set(mine)) {
    const clash = new RegExp(`${name}\\s*:`).test(document) || new RegExp(`${name}\\s*:`).test(readFileSync("src/styles/home.css", "utf8"));
    assert.ok(!clash, `${name} is already defined in document.css/home.css; pick another name`);
  }
});

test("links get an underline that draws in (not the instant one)", () => {
  assert.match(css, /background-size:\s*0 1\.5px/);
  assert.match(css, /background-size:\s*100% 1\.5px/);
});

test("lifted elements keep a hidden hover strip under them (no flicker when the mouse enters from below)", () => {
  assert.match(css, /\.card::before[^{]*\{[^}]*top: 100%/);
  assert.match(css, /\.pcard\[data-pos="0"\]::before/);
  assert.match(css, /\.card \.card-links a \{ padding-block: 10px; margin-block: -10px; \}/);
});

test("the tools strip has room so lifted tags are not clipped", () => {
  assert.match(css, /\.tools-viewport \{[^}]*padding:/);
});

test("no new colours: only tokens and black/white shadows (palette.test.ts guards home.css only)", () => {
  assert.doesNotMatch(css, /#[0-9a-fA-F]{3,8}\b/, "hex colour in hover.css");
  assert.doesNotMatch(css, /rgb\((?!0 0 0)/, "a non-black rgb() in hover.css");
});
