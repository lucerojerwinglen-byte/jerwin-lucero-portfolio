import { test } from "node:test";
import assert from "node:assert/strict";
import { capabilities } from "./capabilities";
import { reconcile, formatReport, guessRole, REPORT_MAX_CHARS } from "./match";
import { presets } from "./presets";

function find(result: ReturnType<typeof reconcile>, id: string) {
  return result.rows.find((r) => r.capability.id === id);
}

test("QA preset reconciles to at least 6 verified requirements, each with evidence", () => {
  const qa = presets.find((p) => p.id === "qa");
  assert.ok(qa, "QA preset exists");
  const result = reconcile(qa.text);
  assert.ok(result.counts.verified >= 6, `expected >= 6 verified, got ${result.counts.verified}`);
  for (const row of result.rows) {
    if (row.capability.status === "gap") continue;
    assert.ok(row.capability.evidence.length > 0, `${row.capability.id} has evidence`);
  }
});

test("every preset finds at least one honest gap or partial", () => {
  for (const preset of presets) {
    const result = reconcile(preset.text);
    assert.ok(
      result.counts.partial + result.counts.gap > 0,
      `${preset.id} should not be a suspicious 100%`
    );
  }
});

test("matches whole words only", () => {
  const result = reconcile("Excellent JavaScript skills. Knowledge of MySQL and GitHub.");
  assert.equal(find(result, "excel"), undefined, "Excellent is not Excel");
  assert.equal(find(result, "java"), undefined, "JavaScript is not Java");
  assert.ok(find(result, "typescript"), "JavaScript maps to TypeScript/JavaScript");
  assert.ok(find(result, "sql"), "MySQL maps to SQL");
  assert.ok(find(result, "git"), "GitHub maps to Git");
});

test("multi-word terms match across hyphens and line breaks", () => {
  const result = reconcile("Write end-to-end\ntests and do data\nvisualization.");
  assert.ok(find(result, "e2e"));
  assert.ok(find(result, "dataviz"));
});

test("known gaps are reported, not hidden", () => {
  const result = reconcile("Must know Docker and Selenium.");
  assert.equal(find(result, "containers")?.capability.status, "gap");
  assert.equal(find(result, "browser-automation-legacy")?.capability.status, "partial");
});

test("rows follow the order requirements appear in the job description", () => {
  const result = reconcile("SQL first, then Python, then pytest.");
  assert.deepEqual(
    result.rows.map((r) => r.capability.id),
    ["sql", "python", "pytest"]
  );
});

test("each row records the exact wording it matched", () => {
  const result = reconcile("Experience with Power BI dashboards");
  assert.equal(find(result, "bi-tools")?.matched, "Power BI");
});

test("a description with nothing recognisable scores 0, not NaN", () => {
  const result = reconcile("We are a fun team that loves ping pong.");
  assert.equal(result.rows.length, 0);
  assert.equal(result.score, 0);
});

test("score weights partial as half", () => {
  const result = reconcile("Python. Tableau. Docker.");
  // 1 verified, 1 partial, 1 gap -> (1 + 0.5) / 3 = 50%
  assert.equal(result.score, 50);
});

test("report fits the contact form limit even when everything matches", () => {
  const everything = capabilities.flatMap((c) => c.terms).join(", ");
  const result = reconcile(everything);
  assert.equal(result.rows.length, capabilities.length);
  const report = formatReport(result, "Everything Engineer");
  assert.ok(report.length <= REPORT_MAX_CHARS, `report is ${report.length} chars`);
  assert.match(report, /Everything Engineer/);
  assert.match(report, new RegExp(`${result.counts.verified}/${result.rows.length}`));
});

test("the role is read from a short first line, never from a sentence", () => {
  assert.equal(guessRole("\n  Senior QA Engineer\nWe are hiring..."), "Senior QA Engineer role");
  assert.equal(guessRole("We are a fast-growing BPO looking for great people."), undefined);
  assert.equal(guessRole("Responsibilities:\n- test things"), undefined);
  assert.equal(guessRole(""), undefined);
});

test("capability ids are unique and evidence links are in-page anchors or https", () => {
  const ids = new Set<string>();
  for (const c of capabilities) {
    assert.ok(!ids.has(c.id), `duplicate id ${c.id}`);
    ids.add(c.id);
    for (const e of c.evidence) {
      assert.match(e.href, /^(#[a-z-]+|https:\/\/)/, `${c.id} -> ${e.href}`);
    }
  }
});
