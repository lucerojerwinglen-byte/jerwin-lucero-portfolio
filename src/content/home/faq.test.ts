import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { faq } from "./home";
import { search } from "@/lib/home/search";
import { searchItems } from "@/lib/home/search-items";

// Ticket #17 (ADR 0007): the FAQ above the reply form. Answers are Jerwin's own words from the
// grilling session (2026-11-05); this test pins them so nothing gets drafted for him.

const agreed: [string, string][] = [
  ["What roles are you looking for?", "Software engineering, QA, data and AI roles. Anywhere I can build and test real apps."],
  ["On-site, hybrid or remote?", "Hybrid in Metro Manila, or remote with hours that overlap UTC+8."],
  ["When can you start?", "30 days after an offer."],
  [
    "Can I see your code?",
    "Barato's code is public on GitHub. Lovewin is private, and I'm happy to walk you through it on a call. CPT Tools runs inside my employer, so I can explain how it works but can't share code, screenshots or links.",
  ],
  ["Do you take freelance or side projects?", "Yes. Write to me below with what you need."],
];

test("the five agreed questions and answers, word for word, in order", () => {
  assert.deepEqual(faq.slice(0, 5).map((f) => [f.q, f.a]), agreed);
});

test("every FAQ has a unique anchor id", () => {
  const ids = faq.map((f) => f.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const id of ids) assert.match(id, /^faq-[a-z-]+$/);
});

test("the Ask palette finds the FAQ for 'remote' and 'notice'", () => {
  const items = searchItems();
  assert.equal(search(items, "remote")[0]?.href, "#faq-setup");
  assert.equal(search(items, "notice")[0]?.href, "#faq-start");
  assert.ok(search(items, "notice").every((r) => r.kind === "faq"));
});

test("the FAQ is an exclusive native accordion inside say hello, above the reply form", () => {
  const src = readFileSync(join(process.cwd(), "src/components/home/Sections.tsx"), "utf8");
  const contact = src.slice(src.indexOf("export function Contact"));
  assert.ok(contact.indexOf("<Faq />") > -1 && contact.indexOf("<Faq />") < contact.indexOf("<ReplyForm />"));
  const faqSrc = readFileSync(join(process.cwd(), "src/components/home/Faq.tsx"), "utf8");
  assert.match(faqSrc, /<details[^>]*name="faq"/);
  assert.match(faqSrc, /<summary>/);
});
