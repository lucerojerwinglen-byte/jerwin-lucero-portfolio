import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import icons from "@iconify-json/logos/icons.json";
import { projects } from "@/content/data/projects";
import { skills } from "@/content/data/skills";
import { hero } from "@/content/home/home";
import { parseHero } from "@/lib/home/hero";
import { LOGOS, logoFor } from "./logos";

// ADR 0006: tech shows as logo + name everywhere. Every name the site shows must resolve to a
// real logo or a deliberately chosen generic icon, never silently to nothing.

const heroPills = [...hero.paragraphs, hero.caption]
  .flatMap(parseHero)
  .flatMap((t) => (t.kind === "logo" ? [t.name] : t.kind === "stack" ? t.names : []));
const shown = new Set([...projects.flatMap((p) => p.tags), ...skills.flatMap((g) => g.items.map((i) => i.name)), ...heroPills, "GitHub"]);

test("every tech, skill and hero pill name resolves to a logo or a declared generic icon", () => {
  const missing = [...shown].filter((n) => !logoFor(n));
  assert.deepEqual(missing, []);
});

test("every Iconify id exists in the installed logo set", () => {
  const ids = new Set([...Object.keys(icons.icons), ...Object.keys(icons.aliases ?? {})]);
  const bad = Object.entries(LOGOS).filter(([, s]) => "iconify" in s && !ids.has(s.iconify)).map(([k]) => k);
  assert.deepEqual(bad, []);
});

test("every logo file exists in public/", () => {
  const bad = Object.entries(LOGOS).filter(([, s]) => "file" in s && !existsSync(join(process.cwd(), "public", s.file))).map(([k]) => k);
  assert.deepEqual(bad, []);
});

test("no employer mark ships: nothing named after Sagility in public/logos", () => {
  const walk = (d: string): string[] => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [e.name]));
  assert.deepEqual(walk(join(process.cwd(), "public/logos")).filter((f) => /sagility/i.test(f)), []);
});

test("every downloaded logo file has its source recorded", () => {
  const sources = readFileSync(join(process.cwd(), "public/logos/SOURCES.md"), "utf8");
  const walk = (d: string, base = ""): string[] =>
    readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name), `${base}${e.name}/`) : [`${base}${e.name}`]));
  const unlisted = walk(join(process.cwd(), "public/logos")).filter((f) => f !== "SOURCES.md" && !sources.includes(f));
  assert.deepEqual(unlisted, []);
});

// ── Review fixes ──
import { readdirSync as ls, statSync } from "node:fs";
import { displayName, prefixSvgIds, requireLogo } from "./logos";

test("SVG ids are made unique per instance, including url(#…) and href=\"#…\" references", () => {
  const body = '<defs><linearGradient id="g1"/></defs><path fill="url(#g1)"/><use href="#g1" xlink:href="#g1"/>';
  assert.equal(
    prefixSvgIds(body, "x7"),
    '<defs><linearGradient id="x7-g1"/></defs><path fill="url(#x7-g1)"/><use href="#x7-g1" xlink:href="#x7-g1"/>',
  );
});

test("names resolve exactly, without a (qualifier), and regardless of case", () => {
  assert.ok(logoFor("Playwright (end-to-end)"));
  assert.ok(logoFor("Workday (HRIS)"));
  assert.ok(logoFor("Prompt engineering") && logoFor("prompt engineering"));
  assert.equal(displayName("Workday (HRIS)"), "Workday");
});

test("an unknown name fails loudly instead of silently showing plain text", () => {
  assert.throws(() => requireLogo("Definitely Not A Tool"), /No logo for "Definitely Not A Tool"/);
});

test("no client component imports the logo set (it is 8 MB of JSON)", () => {
  const walk = (d: string): string[] => ls(d).flatMap((n) => (statSync(join(d, n)).isDirectory() ? walk(join(d, n)) : [join(d, n)]));
  const offenders = walk(join(process.cwd(), "src"))
    .filter((f) => /\.tsx?$/.test(f))
    .filter((f) => {
      const src = readFileSync(f, "utf8");
      return /^["']use client["']/m.test(src) && /from ["'](@\/lib\/logos|@\/components\/home\/Logo|\.\/Logo)["']/.test(src);
    });
  assert.deepEqual(offenders, []);
});
