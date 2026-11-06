import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { projects } from "@/content/data/projects";
import { caseStudies } from "@/content/home/case-studies";
import { projectSheet, projectSheetSlugs } from "./sheets";
import { searchItems } from "./search-items";

// Ticket #18 (ADR 0007): Project sheets at /projects/<slug>.
const read = (p: string) => readFileSync(join(process.cwd(), p), "utf8");

test("every project has a sheet, and unknown slugs have none", () => {
  assert.deepEqual(projectSheetSlugs(), projects.map((p) => p.slug));
  for (const p of projects) assert.equal(projectSheet(p.slug)?.project.slug, p.slug);
  assert.equal(projectSheet("nope"), null);
});

test("full case studies for Lovewin, Barato and CPT Tools; only real projects", () => {
  assert.deepEqual(Object.keys(caseStudies).sort(), ["barato", "lovewin", "team-ops-suite"]);
  for (const [slug, c] of Object.entries(caseStudies)) {
    assert.ok(projects.some((p) => p.slug === slug), slug);
    for (const part of [c.problem, c.built, c.proved]) assert.ok(part.length > 20, `${slug} has an empty part`);
  }
});

test("CPT Tools' case study shows no links or images (employer's, ADR 0006)", () => {
  const c = caseStudies["team-ops-suite"];
  assert.doesNotMatch(JSON.stringify(c), /https?:|\.png|\.webp|\.jpg|sagility/i);
});

test("unknown slugs 404, and the sheet is wired as an intercepting route", () => {
  assert.match(read("src/app/projects/[slug]/page.tsx"), /export const dynamicParams = false/);
  assert.ok(existsSync(join(process.cwd(), "src/app/@sheet/(.)projects/[slug]/page.tsx")), "intercepting route");
  assert.ok(existsSync(join(process.cwd(), "src/app/@sheet/default.tsx")), "slot default");
  assert.ok(existsSync(join(process.cwd(), "src/app/@sheet/[...catchAll]/page.tsx")), "slot clears on other routes");
  assert.match(read("src/app/layout.tsx"), /\{sheet\}/);
});

test("the Ask palette sends project results to their sheets", () => {
  for (const p of projects) {
    assert.ok(searchItems().some((i) => i.kind === "project" && i.href === `/projects/${p.slug}`), p.slug);
  }
});

test("every project card and list row links to its case study", () => {
  assert.match(read("src/components/home/Sections.tsx"), /href=\{`\/projects\/\$\{p\.slug\}`\}[^>]*>\s*case study/);
});
