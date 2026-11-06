import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { faq, numberSections, recommendations, sections } from "./home";

// Ticket #20 (ADR 0007, amends 0005): no empty recommendation cards on the live site.

test("recommendations are hidden while every card is a placeholder, and the numbers close up", () => {
  const rec = sections.find((s) => s.id === "recommendations");
  assert.equal(rec?.hidden, true);
  const n = numberSections(sections).map((s) => Number(s.n));
  assert.deepEqual(n, n.map((_, i) => i + 1), "no gap in section numbers");
  assert.ok(!numberSections(sections).some((s) => s.id === "recommendations"));
});

test("one real quote is enough to bring the section back (hidden follows the data)", () => {
  assert.ok(recommendations.every((r) => r.kind === "placeholder"), "update this test when a real quote lands");
  assert.match(readFileSync(join(process.cwd(), "src/content/home/home.ts"), "utf8"), /hidden: !recommendations\.some\(\(r\) => r\.kind === "real"\)/);
});

test("references are offered in the FAQ (sixth question) and in say hello", () => {
  assert.equal(faq.length, 6);
  assert.deepEqual([faq[5].q, faq[5].a], ["Can I talk to your references?", "Yes, on request."]);
  const sections = readFileSync(join(process.cwd(), "src/components/home/Sections.tsx"), "utf8");
  assert.match(sections, /I usually reply within a day \(UTC\+8\)\. References available on request\./);
});
