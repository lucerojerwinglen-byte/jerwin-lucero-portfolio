import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { anthropicCerts } from "./home";
import { credentials } from "@/content/data/credentials";
import { logoFor } from "@/lib/logos";

// Anthropic Education certificates (Skilljar), added 2026-11-05. Website only: the résumé's
// credentials list (src/content/data) and its PDF are unchanged.
const EXPECTED = [
  ["Claude Code in Action", "May 2026", "xzr59ivru6vt"],
  ["Introduction to agent skills", "May 2026", "qou948znnok3"],
  ["Introduction to subagents", "May 2026", "usrq3bdvoc36"],
  ["Claude Code 101", "May 2026", "ksn8tc85for4"],
] as const;

test("the four Anthropic certificates, newest first, each with its verify link", () => {
  assert.deepEqual(anthropicCerts.map((c) => [c.title, c.date, c.verifyUrl?.split("/c/")[1]]), EXPECTED.map((e) => [...e]));
  for (const c of anthropicCerts) {
    assert.equal(c.issuer, "Anthropic");
    assert.equal(c.kind, "certification");
    assert.match(c.verifyUrl ?? "", /^https:\/\/verify\.skilljar\.com\/c\/[a-z0-9]{12}$/);
  }
});

test("each certificate's PDF copy exists in public/certificates and carries the same code", () => {
  for (const c of anthropicCerts) {
    assert.ok(c.pdfPath, `${c.title} has no pdfPath`);
    assert.ok(existsSync(`public${c.pdfPath}`), `${c.pdfPath} is missing`);
    assert.ok(c.pdfPath!.includes(c.verifyUrl!.split("/c/")[1]), `${c.title}: PDF and verify link are different certificates`);
  }
});

test("Anthropic shows its logo (not initials)", () => {
  assert.ok(logoFor("Anthropic"), "Anthropic needs an entry in LOGOS (src/lib/logos.ts)");
});

test("certificates stay off the résumé: its credentials list is unchanged", () => {
  assert.equal(credentials.length, 4);
  assert.ok(!credentials.some((c) => c.issuer === "Anthropic"));
});

test("/certifications groups them as 'AI learning'; the homepage shows them with links that say verify and pdf", () => {
  const pages = readFileSync("src/components/home/PortfolioPages.tsx", "utf8");
  const sections = readFileSync("src/components/home/Sections.tsx", "utf8");
  assert.match(pages, /AI learning/);
  assert.match(sections, /verify ↗/);
  assert.match(sections, /pdf ↗/);
});
