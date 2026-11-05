import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Review fixes for #5. These read the source because the behaviour lives in CSS and in
// browser-only components that node:test can't render. Each guards one bug the review found.
const read = (p: string) => readFileSync(join(process.cwd(), p), "utf8");

test("focus rings survive `all: unset`: home.css has an !important focus-visible rule for the homepage and overlays", () => {
  assert.match(read("src/styles/home.css"), /\.home :focus-visible[^{]*\{[^}]*outline:[^;]*!important/);
});

test("coming-soon pages render the overlays, so the sidebar's Ask / Typing buttons work there", () => {
  assert.match(read("src/app/[soon]/page.tsx"), /<Overlays\b/);
});

test("no component touches the global localStorage directly (it throws when storage is blocked)", () => {
  for (const f of ["src/components/home/Overlays.tsx", "src/components/home/Buttons.tsx"]) {
    assert.doesNotMatch(read(f), /\(localStorage\)|localStorage\./, `${f} reads localStorage directly`);
  }
});

test("the tour doesn't steal focus, and Ask scrolling respects reduced motion", () => {
  const src = read("src/components/home/Overlays.tsx");
  assert.doesNotMatch(src, /autoFocus onClick/, "tour button still autofocuses");
  assert.doesNotMatch(src, /behavior: "smooth"/, "smooth scroll ignores prefers-reduced-motion");
});
