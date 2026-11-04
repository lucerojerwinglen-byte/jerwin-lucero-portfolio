import { test } from "node:test";
import assert from "node:assert/strict";
import { projects } from "@/content/data/projects";
import { experience } from "@/content/data/experience";
import { skills } from "@/content/data/skills";
import { pages, footnoteFor, linkLabel, formatRevDate, alsoBuiltLine } from "./document";

test("footnotes number every linked project in reading order, across both pages", () => {
  const numbered = [...pages.one.footnotes, ...pages.two.footnotes].map((f) => [f.n, f.slug]);
  assert.deepEqual(numbered, [
    [1, "lovewin"],
    [2, "barato"],
    [3, "cpt-excel-to-dashboard"],
    [4, "pet-flap"],
  ]);
});

test("an internal project never gets a footnote or a link", () => {
  assert.equal(footnoteFor("team-ops-suite"), undefined);
});

test("footnote labels drop the protocol, and shorten GitHub when a live link comes first", () => {
  assert.deepEqual(
    footnoteFor("barato")?.links.map((l) => l.label),
    ["barato.pages.dev", "github.com/…/tipid-hacks"],
  );
  assert.equal(
    linkLabel("https://github.com/lucerojerwinglen-byte/pet-flap"),
    "github.com/lucerojerwinglen-byte/pet-flap",
  );
});

test("page one carries the selected work, page two the rest", () => {
  assert.deepEqual(pages.one.selected.map((p) => p.slug), ["lovewin", "barato", "team-ops-suite"]);
  assert.deepEqual(pages.two.more.map((p) => p.slug), ["cpt-excel-to-dashboard", "pet-flap"]);
  assert.equal(pages.two.research.length, 3);
});

test("the 'Also built' line reads as one sentence with years", () => {
  assert.equal(
    alsoBuiltLine(),
    "Also built: a normalized SQL library-inventory database (2022) and Revelio, a C program that hides text inside bitmap images (2021).",
  );
});

test("every skill's evidence points at an entry that exists on the page", () => {
  const ids = new Set([...projects.map((p) => p.slug), ...experience.map((e) => e.id)]);
  const dangling = skills
    .flatMap((g) => g.items)
    .flatMap((s) => (s.usedIn ?? []).filter((id) => !ids.has(id)).map((id) => `${s.name} → ${id}`));
  assert.deepEqual(dangling, []);
});

test("revision dates print as '4 Nov 2026', with no timezone drift", () => {
  assert.equal(formatRevDate("2026-11-04"), "4 Nov 2026");
  assert.equal(formatRevDate("2027-01-31"), "31 Jan 2027");
});
