import { test } from "node:test";
import assert from "node:assert/strict";
import { projects } from "@/content/data/projects";
import { education } from "@/content/data/education";
import { credentials } from "@/content/data/credentials";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { affiliations, badges, featured, issuerLogo, issuerLogos, numberSections, recommendations, stats } from "./home";

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

// ── ADR 0006 ──

test("homepage cards are Lovewin, CPT Tools and a next-app placeholder; Barato is not a card", () => {
  assert.deepEqual(
    featured.map((c) => (c.kind === "project" ? c.slug : c.kind)),
    ["lovewin", "team-ops-suite", "placeholder"],
  );
  assert.ok(projects.some((p) => p.slug === "barato"), "Barato must stay in the content layer (résumé, /projects)");
});

test("CPT Tools is named and never carries an employer logo", () => {
  const cpt = projects.find((p) => p.slug === "team-ops-suite");
  assert.equal(cpt?.title, "CPT Tools");
  const card = featured.find((c) => c.kind === "project" && c.slug === "team-ops-suite");
  assert.ok(card && card.kind === "project" && "generic" in card.icon, "CPT Tools must use a generic icon");
});

test("every credential issuer has a logo file, or uses initials on purpose (null)", () => {
  for (const c of credentials) {
    assert.ok(c.issuer in issuerLogos, `${c.issuer} has no entry in issuerLogos`);
    const file = issuerLogos[c.issuer];
    if (file) assert.ok(existsSync(join(process.cwd(), "public", file)), `${file} is missing`);
  }
});

test("an issuer missing from issuerLogos fails loudly", () => {
  assert.throws(() => issuerLogo("Unknown Issuer"), /issuerLogos has no entry for "Unknown Issuer"/);
  assert.equal(issuerLogo("UNC"), null);
});
