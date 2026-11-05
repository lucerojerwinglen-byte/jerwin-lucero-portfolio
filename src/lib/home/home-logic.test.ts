import { test } from "node:test";
import assert from "node:assert/strict";
import { dotLevels } from "./dots";
import { search, type SearchItem } from "./search";
import { hasSeenTour, markTourSeen, resetTour } from "./tour";
import { fanOffset } from "./fan";
import { sectionLabel } from "@/content/home/home";

// ── GitHub dots: contribution counts → dot levels 0–4, relative to the busiest day ──

test("dot levels: zero stays empty, the busiest day is level 4", () => {
  assert.deepEqual(dotLevels([0, 1, 5, 10, 20]), [0, 1, 1, 2, 4]);
});

test("dot levels: any contribution shows at least level 1", () => {
  assert.deepEqual(dotLevels([0, 1, 100]), [0, 1, 4]);
});

test("dot levels: an empty year is all zeros, not NaN", () => {
  assert.deepEqual(dotLevels([0, 0, 0]), [0, 0, 0]);
});

// ── Alt+K search ──

const items: SearchItem[] = [
  { title: "Lovewin", kind: "project", href: "#projects", keywords: "encrypted gifts SvelteKit" },
  { title: "Barato", kind: "project", href: "#projects", keywords: "budget meals optimizer" },
  { title: "Résumé", kind: "page", href: "/resume", keywords: "cv pdf" },
  { title: "Blog", kind: "page", href: "/blog" },
];

test("search: empty query lists everything in order", () => {
  assert.deepEqual(search(items, "  ").map((i) => i.title), ["Lovewin", "Barato", "Résumé", "Blog"]);
});

test("search: matches title or keywords, ignoring case", () => {
  assert.deepEqual(search(items, "PDF").map((i) => i.title), ["Résumé"]);
  assert.deepEqual(search(items, "svelte").map((i) => i.title), ["Lovewin"]);
});

test("search: every word must match", () => {
  assert.deepEqual(search(items, "budget lovewin"), []);
});

test("search: title matches rank above keyword matches", () => {
  const list: SearchItem[] = [
    { title: "Projects", kind: "section", href: "#projects", keywords: "blog posts too" },
    { title: "Blog", kind: "page", href: "/blog" },
  ];
  assert.deepEqual(search(list, "blog").map((i) => i.title), ["Blog", "Projects"]);
});

test("search: accents don't matter (resume finds Résumé)", () => {
  assert.deepEqual(search(items, "resume").map((i) => i.title), ["Résumé"]);
});

// ── First-visit tour ──

function memory(): Storage {
  const m = new Map<string, string>();
  return {
    getItem: (k) => m.get(k) ?? null,
    setItem: (k, v) => void m.set(k, v),
    removeItem: (k) => void m.delete(k),
    clear: () => m.clear(),
    key: () => null,
    get length() {
      return m.size;
    },
  };
}

test("tour: a new visitor hasn't seen it; after marking, they have; reset shows it again", () => {
  const s = memory();
  assert.equal(hasSeenTour(s), false);
  markTourSeen(s);
  assert.equal(hasSeenTour(s), true);
  resetTour(s);
  assert.equal(hasSeenTour(s), false);
});

test("tour: blocked storage counts as seen, so the tour never nags on every visit", () => {
  const blocked = {
    getItem() {
      throw new Error("blocked");
    },
    setItem() {
      throw new Error("blocked");
    },
    removeItem() {
      throw new Error("blocked");
    },
  } as unknown as Storage;
  assert.equal(hasSeenTour(blocked), true);
  assert.doesNotThrow(() => markTourSeen(blocked));
});

// ── Review fixes (#5) ──

test("tour: no storage at all (blocked before we could even ask) counts as seen and never throws", () => {
  assert.equal(hasSeenTour(null), true);
  assert.doesNotThrow(() => markTourSeen(null));
  assert.doesNotThrow(() => resetTour(null));
});

test("fan: front card is 0, its neighbours -1 and 1, the rest hidden — for any number of cards", () => {
  assert.deepEqual([0, 1, 2].map((i) => fanOffset(i, 0, 3)), [0, 1, -1]);
  assert.deepEqual([0, 1, 2, 3, 4].map((i) => fanOffset(i, 2, 5)), [null, -1, 0, 1, null]);
  assert.deepEqual([0].map((i) => fanOffset(i, 0, 1)), [0]);
  assert.deepEqual([0, 1].map((i) => fanOffset(i, 1, 2)), [1, 0]);
});

test("section labels are capitalised once, in one place", () => {
  assert.equal(sectionLabel({ title: "certifications" }), "Certifications");
});
