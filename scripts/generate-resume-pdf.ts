// `npm run pdf`: prints the real page to public/jerwin-lucero-resume.pdf with headless
// Edge, so the download is exactly the web document. Run on your PC, commit the result;
// src/lib/document/resume-pdf.test.ts fails whenever the PDF is out of date.
//
//   npm run pdf            regenerate if anything on paper changed
//   npm run pdf -- --force regenerate anyway (same revision number if nothing changed)
import { spawn, spawnSync, type ChildProcess } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright-core";
import { LOCK_PATH, PDF_PATH, pdfPageCount, readLock, resumeFingerprint, type ResumeLock } from "../src/lib/document/fingerprint";

const ROOT = process.cwd();
const NEXT_BIN = join(ROOT, "node_modules/next/dist/bin/next");
const force = process.argv.includes("--force");

function today(): string {
  // en-CA formats as YYYY-MM-DD; the résumé is dated in Philippine time.
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Manila" }).format(new Date());
}

async function waitForServer(url: string, server: ChildProcess, timeoutMs = 60_000) {
  const until = Date.now() + timeoutMs;
  while (Date.now() < until) {
    if (server.exitCode !== null) throw new Error(`next start exited early (code ${server.exitCode})`);
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Server at ${url} did not answer within ${timeoutMs / 1000}s`);
}

async function main() {
  const fingerprint = resumeFingerprint();
  const previous = readLock();
  const previousText = existsSync(join(ROOT, LOCK_PATH)) ? readFileSync(join(ROOT, LOCK_PATH), "utf8") : null;
  const changed = previous?.fingerprint !== fingerprint;

  if (!changed && !force && existsSync(join(ROOT, PDF_PATH))) {
    console.log(`Résumé PDF is up to date (Rev. ${previous!.rev}, fingerprint ${fingerprint}).`);
    return;
  }

  // The page reads its "Rev. N" stamp from the lock, so write it before building.
  const lock: ResumeLock = changed
    ? { rev: (previous?.rev ?? 0) + 1, date: today(), fingerprint }
    : previous!;
  writeFileSync(join(ROOT, LOCK_PATH), JSON.stringify(lock, null, 2) + "\n");

  let server: ChildProcess | undefined;
  try {
    console.log(`Building the site for Rev. ${lock.rev}…`);
    const build = spawnSync(process.execPath, [NEXT_BIN, "build"], { stdio: "inherit" });
    if (build.status !== 0) throw new Error("next build failed");

    const port = 4100 + Math.floor(Math.random() * 800); // fresh port: a killed server can hold the old one
    server = spawn(process.execPath, [NEXT_BIN, "start", "-p", String(port)], { stdio: "ignore" });
    const url = `http://localhost:${port}/resume`;
    await waitForServer(url, server);

    const browser = await chromium.launch({ channel: "msedge" });
    try {
      // 794px = A4 width at 96 dpi: the width the PDF is laid out at.
      const page = await browser.newPage({ viewport: { width: 794, height: 1123 } });
      await page.goto(url, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      await page.emulateMedia({ media: "print" });

      // In print each sheet is clipped to A4, so any overflow is text a recruiter never sees.
      const clipped = await page.$$eval(".sheet[data-page='1'], .sheet[data-page='2']", (sheets) =>
        sheets.map((s) => s.scrollHeight - s.clientHeight),
      );
      if (clipped.length !== 2 || clipped.some((px) => px > 0)) {
        throw new Error(`Content does not fit on A4: overflow per page (px) = ${JSON.stringify(clipped)}`);
      }

      const pdf = await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true });
      const pages = pdfPageCount(pdf);
      if (pages !== 2) throw new Error(`Expected a 2-page PDF, got ${pages}`);
      writeFileSync(join(ROOT, PDF_PATH), pdf);
      console.log(`Wrote ${PDF_PATH}: 2 pages, Rev. ${lock.rev} (${lock.date}), fingerprint ${fingerprint}.`);
    } finally {
      await browser.close();
    }
  } catch (err) {
    // Leave the repo as it was: the old revision still describes the old PDF.
    if (previousText !== null) writeFileSync(join(ROOT, LOCK_PATH), previousText);
    throw err;
  } finally {
    server?.kill();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
