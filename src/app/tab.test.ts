import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { site } from "@/content/data/site";

// The browser tab: Jerwin's drawing as the icon, and just his name as the title (2026-11-05).
const layout = readFileSync("src/app/layout.tsx", "utf8");

test("the tab title is just the name (no role line)", () => {
  assert.match(layout, /const title = site\.shortName;/);
  assert.doesNotMatch(layout, /site\.focus/);
  assert.equal(site.shortName, "Jerwin Lucero");
});

test("sub-pages read 'Projects — Jerwin Lucero' (name last)", () => {
  assert.match(layout, /template: `%s — \$\{site\.shortName\}`/);
});

test("the tab icons are the drawing, in every size browsers ask for", () => {
  for (const f of ["icon.png", "apple-icon.png", "favicon.ico"]) assert.ok(existsSync(`src/app/${f}`), `${f} missing: run node scripts/make-icons.mjs`);
});

test("favicon.ico holds 16, 32 and 48px images", () => {
  const ico = readFileSync("src/app/favicon.ico");
  assert.equal(ico.readUInt16LE(2), 1, "not an icon file");
  const n = ico.readUInt16LE(4);
  const sizes = Array.from({ length: n }, (_, i) => ico[6 + 16 * i]);
  assert.deepEqual(sizes, [16, 32, 48]);
});

test("icon.png is the drawing, not the old red pixel-bug icon: 256px, lots of skin tone, circular", async () => {
  const sharp = (await import("sharp")).default;
  const { data, info } = await sharp("src/app/icon.png").ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.ok(info.width >= 256);
  let skin = 0;
  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    if (r > 190 && g > 130 && b > 80 && r - b > 50 && r > g && g > b) skin++;
  }
  assert.ok(skin / (info.width * info.height) > 0.12, `only ${((100 * skin) / (info.width * info.height)).toFixed(1)}% skin tone`);
  assert.equal(data[3], 0, "the corner should be transparent (round icon)");
});
