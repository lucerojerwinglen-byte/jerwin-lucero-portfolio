// Node-only: hashes every file that shapes the printed résumé, so a test can tell when
// the committed PDF no longer matches the page. Never import this from the app.
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

export const PDF_PATH = "public/jerwin-lucero-resume.pdf";
export const LOCK_PATH = "src/content/resume-lock.json";

/** Files and folders whose content ends up on paper. */
export const FINGERPRINT_INPUTS = [
  "src/content/data",
  "src/components/doc",
  "src/lib/document/document.ts",
  "src/styles/document.css",
  "public/images/jerwin-hero.png",
  "public/qr.svg",
];

export interface ResumeLock {
  /** Résumé revision, printed as "Rev. N". Goes up by one each time the PDF is regenerated with changes. */
  rev: number;
  /** ISO date of that revision (Asia/Manila). */
  date: string;
  fingerprint: string;
}

const BINARY = /\.(png|jpe?g|webp|pdf)$/i;

export function hashText(text: string): string {
  return createHash("sha256").update(text.replace(/\r\n/g, "\n")).digest("hex");
}

function walk(abs: string): string[] {
  if (!existsSync(abs)) return [];
  if (statSync(abs).isFile()) return [abs];
  return readdirSync(abs).flatMap((name) => walk(join(abs, name)));
}

export function resumeFingerprint(root = process.cwd()): string {
  const files = FINGERPRINT_INPUTS.flatMap((p) => walk(join(root, p)))
    .filter((f) => !/\.test\.tsx?$/.test(f))
    .map((f) => ({ abs: f, rel: relative(root, f).split(sep).join("/") }))
    .sort((a, b) => (a.rel < b.rel ? -1 : 1));
  const h = createHash("sha256");
  for (const { abs, rel } of files) {
    h.update(rel + "\0");
    h.update(BINARY.test(rel) ? createHash("sha256").update(readFileSync(abs)).digest("hex") : hashText(readFileSync(abs, "utf8")));
    h.update("\0");
  }
  return h.digest("hex").slice(0, 16);
}

export function readLock(root = process.cwd()): ResumeLock | null {
  const file = join(root, LOCK_PATH);
  return existsSync(file) ? (JSON.parse(readFileSync(file, "utf8")) as ResumeLock) : null;
}

/** Chrome compresses page objects, but the page tree's /Count stays readable. */
export function pdfPageCount(pdf: Buffer): number {
  const counts = [...pdf.toString("latin1").matchAll(/\/Count (\d+)/g)].map((m) => Number(m[1]));
  return counts.length ? Math.max(...counts) : 0;
}
