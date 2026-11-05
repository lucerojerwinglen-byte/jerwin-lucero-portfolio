import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { PORTRAITS } from "./Portrait";
// The hero drawing can wear a cap: two face-aligned drawings, a toggle, a wipe animation.
const src = readFileSync("src/components/home/Portrait.tsx", "utf8");
const css = readFileSync("src/styles/home.css", "utf8");

test("both hero drawings exist and are web-sized (not the 1.6 MB sources)", () => {
  for (const p of Object.values(PORTRAITS)) {
    const file = `public${p}`;
    assert.ok(existsSync(file), `${file} is missing; run node scripts/hero-cap-images.mjs`);
    assert.ok(statSync(file).size < 150_000, `${file} is too heavy for the hero`);
  }
});

test("the homepage hero uses the cap portrait", () => {
  assert.match(readFileSync("src/components/home/Sections.tsx", "utf8"), /<Portrait name=/);
});

test("the cap toggle is a real button that says whether the cap is on", () => {
  assert.match(src, /<button[\s\S]*?type="button"[\s\S]*?aria-pressed=\{cap\}/);
  assert.match(src, /aria-label="Wear the cap"/);
});

test("the drawing does not follow the cursor (removed by Jerwin's decision)", () => {
  assert.doesNotMatch(src, /pointermove|mousemove/);
  assert.doesNotMatch(css, /--tx|--ty/);
});

test("the drawing has no hard frame: transparent background, bottom edge fades out", async () => {
  const sharp = (await import("sharp")).default;
  for (const p of Object.values(PORTRAITS)) {
    const img = sharp(`public${p}`);
    const { width, height, hasAlpha } = await img.metadata();
    assert.ok(hasAlpha, `${p} has no transparency; run node scripts/hero-cap-images.mjs`);
    const { data } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const alphaAt = (x: number, y: number) => data[(y * width! + x) * 4 + 3];
    assert.equal(alphaAt(5, 5), 0, `${p}: top-left corner should be transparent`);
    assert.equal(alphaAt(width! - 5, 5), 0, `${p}: top-right corner should be transparent`);
    assert.equal(alphaAt(width! / 2, Math.round(height! * 0.45)), 255, `${p}: the face should be solid`);
  }
  assert.match(css, /\.portrait-art \{[^}]*mask-image: linear-gradient\(to bottom/);
});

test("with the cap on, the no-cap drawing is hidden (its hair must not poke out around the cap)", () => {
  assert.match(css, /\.portrait\[data-cap="true"\] \.plain-layer \{ mask-position: 0 0; \}/);
  assert.match(css, /\.plain-layer \{[^}]*mask-image: linear-gradient\(to bottom, transparent 45%, #000 55%\)/);
});

test("the cap animates in with a mask wipe and is static under reduced motion", () => {
  assert.match(css, /\.portrait\[data-cap="true"\] \.cap-layer \{ mask-position: 0 0; \}/);
  assert.match(css, /\.cap-layer \{[^}]*transition: mask-position/);
  assert.match(css, /prefers-reduced-motion: reduce\)[\s\S]*?\.home \*[^{]*\{[^}]*transition: none !important/);
});
