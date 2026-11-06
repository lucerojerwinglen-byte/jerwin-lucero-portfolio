import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { projects } from "@/content/data/projects";
import { cptFlow } from "./flow";

// Ticket #19 (ADR 0007): the CPT Tools flow diagram shows only what is already public.
const read = (p: string) => readFileSync(join(process.cwd(), p), "utf8");
const cpt = projects.find((p) => p.slug === "team-ops-suite")!;
const publicText = `${cpt.description} ${cpt.tags.join(" ")}`.toLowerCase();

test("every app box is a kind already named in the public description (no internal names)", () => {
  for (const app of cptFlow.apps) assert.ok(publicText.includes(app.toLowerCase()), `"${app}" is not public`);
});

test("the diagram never claims more apps than the description: five named + the rest unnamed = eight", () => {
  assert.match(cpt.description, /Eight connected apps/);
  assert.equal(cptFlow.apps.length + cptFlow.moreApps, 8);
});

test("the hub, store and tech labels are public facts too", () => {
  assert.ok(publicText.includes("one login") && publicText.includes("database"));
  for (const t of cptFlow.tech) assert.ok(cpt.tags.includes(t), `${t} is not a CPT Tools tag`);
});

test("GSAP loads only inside the diagram, only when motion is allowed", () => {
  const src = read("src/components/home/FlowDiagram.tsx");
  assert.match(src, /if \(prefersReducedMotion\(\)\) return;[\s\S]*await import\("gsap"\)/);
  for (const f of ["src/components/home/Sections.tsx", "src/components/home/Overlays.tsx", "src/app/page.tsx", "src/app/layout.tsx"]) {
    assert.doesNotMatch(read(f), /from "gsap"|import\("gsap"\)/, `${f} pulls GSAP into every page`);
  }
});

test("the diagram has a text alternative and appears only in the CPT Tools case study", () => {
  const src = read("src/components/home/FlowDiagram.tsx");
  assert.match(src, /<figure[\s\S]*<figcaption/);
  assert.match(src, /<svg[^>]*aria-hidden="true"/);
  assert.match(read("src/components/home/ProjectSheet.tsx"), /slug === "team-ops-suite" && <FlowDiagram \/>/);
});
