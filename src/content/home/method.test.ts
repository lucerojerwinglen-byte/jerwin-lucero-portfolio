import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { projects } from "@/content/data/projects";
import { method, numberSections, sections } from "./home";

// Ticket #16 (ADR 0007): the Method section, "Ask. Prove. Ship."

test("three steps, in order: Ask, Prove, Ship, in the words agreed in the grilling session", () => {
  assert.deepEqual(
    method.map((s) => [s.title, s.text]),
    [
      ["Ask", "Ask why until the decision is clear, then write it down."],
      ["Prove", "Write the check that proves it before the code."],
      ["Ship", "Ship one small piece and watch it work."],
    ],
  );
});

test("every step cites evidence that is really in a project, and links to that project", () => {
  for (const s of method) {
    const p = projects.find((x) => x.slug === s.evidence.slug);
    assert.ok(p, `${s.title} cites unknown project ${s.evidence.slug}`);
    assert.ok(`${p.description} ${p.details ?? ""}`.includes(s.evidence.text), `"${s.evidence.text}" is not in ${p.slug}`);
    assert.ok(s.href === `/projects#${p.slug}` || s.href === p.liveUrl, `${s.title} links to ${s.href}`);
  }
});

test("the section sits right after projects as 03 — how I work", () => {
  const numbered = numberSections(sections);
  const i = numbered.findIndex((s) => s.id === "method");
  assert.equal(numbered[i - 1]?.id, "projects");
  assert.equal(numbered[i].n, "03");
  assert.equal(numbered[i].title, "how I work");
});

test("the homepage renders the Method body", () => {
  assert.match(readFileSync(join(process.cwd(), "src/app/page.tsx"), "utf8"), /method: Method,/);
});
