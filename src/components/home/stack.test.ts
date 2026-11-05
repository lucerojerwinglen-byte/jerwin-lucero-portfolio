import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { skills } from "@/content/data/skills";
import { toolsIUse } from "@/content/home/home";
import { requireLogo } from "@/lib/logos";
import { stackGroups, usedInLink } from "@/lib/home/used-in";

// The homepage stack: filters, "used in" cards, and the tools strip (2026-11-05).
const explorer = readFileSync("src/components/home/StackExplorer.tsx", "utf8");
const sections = readFileSync("src/components/home/Sections.tsx", "utf8");
const pages = readFileSync("src/components/home/PortfolioPages.tsx", "utf8");
const css = readFileSync("src/styles/home.css", "utf8");

test("every skill's usedIn id links to a real project or job on the portfolio", () => {
  for (const s of skills.flatMap((g) => g.items)) for (const id of s.usedIn ?? []) assert.doesNotThrow(() => usedInLink(id), `${s.name} → ${id}`);
  assert.deepEqual(usedInLink("lovewin"), { label: "Lovewin", href: "/projects#lovewin" });
  assert.deepEqual(usedInLink("sagility").href, "/experience#sagility");
  assert.throws(() => usedInLink("nope"), /matches no project or job/);
});

test("job rows on /experience carry the id the 'used in' links point at", () => {
  assert.match(pages, /<li key=\{e\.id\} id=\{e\.id\} className="xrow">/);
});

test("stack filters: Languages, Testing, Web, Data & cloud; Cloudflare, Supabase and Vercel shown", () => {
  assert.deepEqual(stackGroups.map((g) => g.label), ["Languages", "Testing", "Web", "Data & cloud"]);
  const names = stackGroups.flatMap((g) => g.items.map((s) => s.name)).join(" | ");
  for (const n of ["Cloudflare", "Supabase", "Vercel"]) assert.match(names, new RegExp(n));
  assert.doesNotMatch(names, /unit & integration testing|manual QA/);
});

test("tools I use: the vault's tools, each with a logo", () => {
  for (const t of ["Claude Code", "VS Code", "ChatGPT", "Gemini", "Obsidian", "Vite", "Node.js", "Git Bash", "Remotion", "HyperFrames", "ElevenLabs"]) {
    assert.ok((toolsIUse as readonly string[]).includes(t), `${t} missing`);
  }
  for (const t of toolsIUse) assert.doesNotThrow(() => requireLogo(t), t);
});

test("tools stay off the résumé: skills.ts (which feeds the PDF) is unchanged", () => {
  const all = skills.flatMap((g) => g.items.map((s) => s.name));
  for (const t of ["Claude Code", "VS Code", "Obsidian"]) assert.ok(!all.includes(t));
});

test("filters are toggle buttons; 'used in' is a disclosure that Escape closes", () => {
  assert.match(explorer, /aria-pressed=\{i === active\}/);
  assert.match(explorer, /aria-expanded=\{isOpen\}/);
  assert.match(explorer, /aria-controls=\{id\}/);
  assert.match(explorer, /e\.key === "Escape"/);
});

test("an open 'used in' card sits above the next rows of tags (found in the browser check)", () => {
  assert.match(css, /\.stackx-wrap:has\(> \[aria-expanded="true"\]\) \{ z-index: 30; \}/);
  assert.match(css, /animation: tag-in [^;]* backwards;/);
});

test("the endless tools track cannot widen the page on phones (found in the browser check)", () => {
  assert.match(css, /\.tools-viewport \{[^}]*contain: inline-size/);
});

test("tools strip: the second copy is hidden from screen readers and dropped with reduced motion", () => {
  assert.match(sections, /aria-hidden=\{copy \|\| undefined\}/);
  assert.match(css, /prefers-reduced-motion: reduce\)[^@]*\.tools-row\[aria-hidden="true"\] \{ display: none; \}/);
  assert.match(css, /\.tools-viewport:hover \.tools-track, \.tools-viewport:focus-within \.tools-track \{ animation-play-state: paused; \}/);
});
