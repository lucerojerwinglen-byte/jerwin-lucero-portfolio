import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// ADR 0006: the portfolio keeps visitors on the portfolio. A link may lead to /resume or the
// PDF only when its own text says so ("résumé" / "pdf").
const FILES = [
  "src/components/home/Sections.tsx",
  "src/components/home/Sidebar.tsx",
  "src/components/home/PortfolioPages.tsx",
  "src/app/projects/page.tsx",
  "src/app/experience/page.tsx",
  "src/app/certifications/page.tsx",
];
const read = (p: string) => readFileSync(join(process.cwd(), p), "utf8");

test("home content (sections, stats) never points at /resume", () => {
  assert.doesNotMatch(read("src/content/home/home.ts"), /["'`]\/resume/);
});

for (const f of FILES) {
  test(`${f}: links to /resume or the PDF say so in their text`, () => {
    const src = read(f);
    const bad: string[] = [];
    for (const m of src.matchAll(/<(Link|a)\b([^>]*)>([\s\S]*?)<\/\1>/g)) {
      const [, , attrs, text] = m;
      if (/\/resume|resumePdfPath/.test(attrs) && !/résumé|pdf/i.test(text)) bad.push(`${attrs.trim()} → "${text.trim()}"`);
    }
    assert.deepEqual(bad, []);
  });
}

test("the reply form lives on the homepage", () => {
  assert.match(read("src/components/home/Sections.tsx"), /<ReplyForm\s*\/>/);
});
