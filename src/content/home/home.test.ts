import { test } from "node:test";
import assert from "node:assert/strict";
import { projects } from "@/content/data/projects";
import { education } from "@/content/data/education";
import { credentials } from "@/content/data/credentials";
import { affiliations, badges, numberSections, recommendations, stats } from "./home";

// ADR 0005 + PRODUCT.md: every claim on the homepage is checkable, nothing is invented.

test("sections are numbered 01, 02, … in order, skipping hidden ones", () => {
  const shown = numberSections([
    { id: "a", title: "a" },
    { id: "b", title: "b", hidden: true },
    { id: "c", title: "c" },
  ]);
  assert.deepEqual(
    shown.map((s) => [s.n, s.id]),
    [
      ["01", "a"],
      ["02", "c"],
    ],
  );
});

test("every stat is backed by text in the project it cites", () => {
  assert.ok(stats.length >= 3);
  for (const s of stats) {
    const p = projects.find((x) => x.slug === s.evidence.slug);
    assert.ok(p, `stat "${s.label}" cites unknown project ${s.evidence.slug}`);
    assert.ok(p.description.includes(s.evidence.text), `"${s.evidence.text}" is not in ${p.slug}'s description`);
  }
});

test("the live-apps stat counts projects with a live link", () => {
  const live = stats.find((s) => s.label === "live apps");
  assert.ok(live);
  assert.equal(live.value, String(projects.filter((p) => p.liveUrl).length));
});

test("every badge points at a real entry in the content layer", () => {
  const corpus = JSON.stringify({ projects, education, credentials });
  for (const b of badges) assert.ok(corpus.includes(b.evidence), `badge "${b.title}" has no evidence: ${b.evidence}`);
});

test("recommendations are real (name, role, source) or clearly labelled placeholders", () => {
  assert.ok(recommendations.length > 0);
  for (const r of recommendations) {
    if (r.kind === "placeholder") {
      assert.match(r.quote, /placeholder|slot|on request/i);
      assert.equal("name" in r, false, "a placeholder must not carry a person's name");
    } else {
      assert.ok(r.name && r.role && r.source.startsWith("https://"), `recommendation by ${r.name} lacks a source`);
    }
  }
});

test("affiliations, if any, each have a source link", () => {
  for (const a of affiliations) assert.ok(a.source.startsWith("https://"), `${a.name} has no source`);
});
