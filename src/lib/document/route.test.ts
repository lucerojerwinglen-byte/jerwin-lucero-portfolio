import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

// ADR 0005: the résumé lives at /resume and the PDF is printed from there.
// If the page and the script disagree, `npm run pdf` would print the homepage.

const read = (p: string) => readFileSync(join(process.cwd(), p), "utf8");

test("the résumé page is at /resume", () => {
  assert.ok(existsSync(join(process.cwd(), "src/app/resume/page.tsx")), "src/app/resume/page.tsx is missing");
  assert.match(read("src/app/resume/page.tsx"), /<Resume\s*\/>/);
});

test("the homepage no longer renders the résumé", () => {
  assert.doesNotMatch(read("src/app/page.tsx"), /<Resume\s*\/>/);
});

test("npm run pdf prints /resume, not the homepage", () => {
  assert.match(read("scripts/generate-resume-pdf.ts"), /localhost:\$\{port\}\/resume`/);
});
