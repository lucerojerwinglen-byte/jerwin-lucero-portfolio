import { test } from "node:test";
import assert from "node:assert/strict";
import { llmsText, personJsonLd } from "./profile";
import { projects } from "@/content/data/projects";
import { site } from "@/content/data/site";

// Ticket #13 (ADR 0007): what search engines and AI tools read about Jerwin.

test("Person data: software engineer, working at Sagility as a Workday Transactions Analyst", () => {
  const p = personJsonLd();
  assert.equal(p["@context"], "https://schema.org");
  assert.equal(p["@type"], "Person");
  assert.equal(p.name, site.name);
  assert.equal(p.url, site.url);
  assert.equal(p.jobTitle, "Software Engineer");
  assert.deepEqual(p.worksFor, { "@type": "Organization", name: "Sagility" });
  assert.deepEqual(p.hasOccupation, { "@type": "Occupation", name: "Workday Transactions Analyst" });
  assert.deepEqual(p.sameAs, [site.social.github]);
});

test("Person data: exactly the six credentials (degree, Civil Service, four Anthropic certificates), no events", () => {
  const names = personJsonLd().hasCredential.map((c) => c.name);
  assert.deepEqual(names, [
    "BS Computer Science, Cum Laude",
    "Civil Service Exam, Professional Level",
    "Claude Code in Action",
    "Introduction to agent skills",
    "Introduction to subagents",
    "Claude Code 101",
  ]);
  for (const bad of ["NurTURe", "AI.Deas", "Git & GitHub"]) {
    assert.ok(!names.some((n) => n.includes(bad)), `${bad} is an event, not a credential`);
  }
});

test("Person data: every Anthropic certificate carries its verify link", () => {
  const anthropic = personJsonLd().hasCredential.filter((c) => c.recognizedBy?.name === "Anthropic");
  assert.equal(anthropic.length, 4);
  for (const c of anthropic) assert.match(c.url ?? "", /^https:\/\/verify\.skilljar\.com\/c\//);
});

test("llms.txt lists every project, every portfolio page and the contact email", () => {
  const txt = llmsText([{ slug: "a-post", title: "A Post" }]);
  assert.match(txt, /^# Jerwin Glen A\. Lucero\n/);
  // Each project points at its Project sheet (#18), which is a real page for crawlers.
  for (const p of projects) assert.ok(txt.includes(`[${p.title}](${site.url}/projects/${p.slug})`), `missing ${p.title}`);
  for (const page of ["/projects", "/experience", "/certifications", "/resume", "/blog"]) {
    assert.ok(txt.includes(`(${site.url}${page})`), `missing ${page}`);
  }
  assert.ok(txt.includes(`[A Post](${site.url}/blog/a-post)`));
  assert.ok(txt.includes(site.email));
  assert.ok(txt.includes("Software Engineer"));
});
