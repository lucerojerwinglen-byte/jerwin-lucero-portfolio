import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { resumeFingerprint, readLock, pdfPageCount, hashText, PDF_PATH } from "./fingerprint";

// The PDF is generated on Jerwin's PC (`npm run pdf`) and committed. This test fails the
// moment anything that shapes the printed page changes without regenerating it.

test("the committed résumé PDF matches the current document (run `npm run pdf` if not)", () => {
  const lock = readLock();
  assert.ok(lock, "src/content/resume-lock.json is missing: run `npm run pdf`");
  assert.equal(
    lock.fingerprint,
    resumeFingerprint(),
    "The résumé changed since the PDF was generated: run `npm run pdf` and commit the result",
  );
});

test("the committed PDF exists and is exactly two A4 pages", () => {
  const file = join(process.cwd(), PDF_PATH);
  assert.ok(existsSync(file), `${PDF_PATH} is missing: run \`npm run pdf\``);
  assert.equal(pdfPageCount(readFileSync(file)), 2);
});

test("the fingerprint ignores Windows vs Unix line endings", () => {
  // Same text, different newline style, must hash the same, or a git checkout on
  // another machine would report a stale PDF that isn't.
  assert.equal(hashText("a\r\nb\r\n"), hashText("a\nb\n"));
});
