import { test } from "node:test";
import assert from "node:assert/strict";
import { parseHero } from "@/lib/home/hero";
import { hero } from "./home";

// ADR 0006, hero shortened 2026-11-05 (replaces the curiosity-first long version by Jerwin's
// decision): his own words, "software engineer" typed and highlighted, more highlighted words,
// the AI tools as stacked logos, the day job visible.
const tokens = hero.paragraphs.flatMap(parseHero);
const all = [...hero.paragraphs, hero.caption].join(" ");

test("parser: text, {typed}, [logo], *word* and [A+B|label] stacks", () => {
  assert.deepEqual(parseHero("I’m a {software engineer} into [web], *ideas* and [Claude+Gemini|generative AI]."), [
    { kind: "text", text: "I’m a " },
    { kind: "typed", text: "software engineer" },
    { kind: "text", text: " into " },
    { kind: "logo", name: "web" },
    { kind: "text", text: ", " },
    { kind: "word", text: "ideas" },
    { kind: "text", text: " and " },
    { kind: "stack", names: ["Claude", "Gemini"], label: "generative AI" },
    { kind: "text", text: "." },
  ]);
});

test("hero types and highlights exactly one title: software engineer", () => {
  assert.deepEqual(tokens.filter((t) => t.kind === "typed"), [{ kind: "typed", text: "software engineer" }]);
});

test("hero shows Claude, ChatGPT and Gemini as stacked logos for generative AI", () => {
  assert.deepEqual(tokens.filter((t) => t.kind === "stack"), [{ kind: "stack", names: ["Claude", "ChatGPT", "Gemini"], label: "generative AI" }]);
});

test("hero highlights more words: ideas, web, mobile, curious, learning, believing", () => {
  const lit = tokens.flatMap((t) => (t.kind === "word" ? [t.text] : t.kind === "logo" ? [t.name] : []));
  for (const w of ["ideas", "web", "mobile", "curious", "learning", "believing"]) assert.ok(lit.includes(w), `${w} is not highlighted`);
});

test("hero keeps the Workday job as a caption", () => {
  assert.match(hero.caption, /^By day: .*Workday.* Transactions Analyst at Sagility\.$/);
});

test("hero uses none of bryllim.com's wording", () => {
  for (const phrase of [
    /cool new stuff/i,
    /rough ideas into things people actually use/i,
    /full-stack engineer/i,
    /I build modern web/i,
    /these days I'm focused on/i,
  ]) {
    assert.doesNotMatch(all, phrase);
  }
});
