// `npm run test:browser` (ADR 0007): the checks node:test can't do, in a real browser.
// Builds the site, starts it, drives headless Edge (playwright-core, already used by `npm run pdf`).
// Exit code 1 if any check fails. Slower than `npm test` (~1 min), so it is its own command.
import { spawn, spawnSync, type ChildProcess } from "node:child_process";
import { join } from "node:path";
import { chromium, type Page } from "playwright-core";

const NEXT_BIN = join(process.cwd(), "node_modules/next/dist/bin/next");
const skipBuild = process.argv.includes("--no-build");
const failures: string[] = [];

function check(name: string, ok: boolean, detail = "") {
  console.log(`${ok ? "✔" : "✖"} ${name}${detail ? ` (${detail})` : ""}`);
  if (!ok) failures.push(name);
}

async function waitForServer(url: string, server: ChildProcess) {
  const until = Date.now() + 60_000;
  while (Date.now() < until) {
    if (server.exitCode !== null) throw new Error(`next start exited early (code ${server.exitCode})`);
    try {
      if ((await fetch(url)).ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Server at ${url} did not answer within 60s`);
}

/** Skip the first-visit tour so it doesn't sit over the page. */
async function freshPage(browser: Awaited<ReturnType<typeof chromium.launch>>, width = 1280): Promise<Page> {
  const ctx = await browser.newContext({ viewport: { width, height: 900 } });
  await ctx.addInitScript(() => {
    try {
      localStorage.setItem("home-tour-seen", "1");
    } catch {}
  });
  return ctx.newPage();
}

async function projectSheets(base: string, browser: Awaited<ReturnType<typeof chromium.launch>>) {
  // Click-open: a sheet over the page; the address changes; Esc closes it and focus returns.
  const page = await freshPage(browser);
  await page.goto(`${base}/projects`, { waitUntil: "load" });
  const link = page.locator('#barato a[href="/projects/barato"]');
  await link.click();
  const sheet = page.getByRole("dialog", { name: "Barato" });
  await sheet.waitFor({ timeout: 10_000 });
  check("click opens a sheet over the page", await sheet.isVisible());
  check("the address becomes /projects/barato", new URL(page.url()).pathname === "/projects/barato");
  check("the list is still underneath", await page.locator("#lovewin").count() === 1);
  check("focus moves into the sheet", await page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]')));
  await page.keyboard.press("Escape");
  await sheet.waitFor({ state: "detached", timeout: 10_000 });
  check("Esc closes it and goes back to /projects", new URL(page.url()).pathname === "/projects");
  await page.waitForTimeout(300);
  check("focus returns to the card's link", await page.evaluate(() => document.activeElement?.getAttribute("href") === "/projects/barato"));

  // Cold-open: a full page, no dialog, with a way home and its own title.
  const cold = await freshPage(browser);
  const res = await cold.goto(`${base}/projects/barato`, { waitUntil: "load" });
  check("cold link answers 200", res?.status() === 200);
  check("cold link is a full page, not a sheet", (await cold.getByRole("dialog").count()) === 0 && (await cold.locator("h1", { hasText: "Barato" }).count()) === 1);
  check("full page links home", (await cold.locator('a[href="/"]').count()) > 0);
  check("full page has its own title", (await cold.title()).startsWith("Barato"));

  const missing = await cold.goto(`${base}/projects/not-a-project`, { waitUntil: "load" });
  check("unknown project is a 404", missing?.status() === 404);
}

/** Did any JavaScript the page loaded contain GSAP? (Its chunk name is hashed, so look inside.) */
async function loadsGsap(page: Page, url: string): Promise<boolean> {
  let found = false;
  page.on("response", async (res) => {
    if (!res.url().endsWith(".js")) return;
    try {
      // GSAP keeps its state on elements as `_gsap`; the name survives minifying.
      if (/GreenSock|_gsap/.test(await res.text())) found = true;
    } catch {}
  });
  await page.goto(url, { waitUntil: "load" });
  await page.waitForTimeout(2500);
  return found;
}

async function flowDiagram(base: string, browser: Awaited<ReturnType<typeof chromium.launch>>) {
  check("the homepage never downloads GSAP", !(await loadsGsap(await freshPage(browser), base + "/")));
  const cpt = await freshPage(browser);
  check("the CPT Tools case study downloads GSAP", await loadsGsap(cpt, `${base}/projects/team-ops-suite`));
  check("the diagram has its text alternative", (await cpt.locator(".flow figcaption").textContent())?.includes("eight connected apps") === true);
  const ends = await cpt.$$eval(".flow-link", (ps) => ps.map((p) => getComputedStyle(p).strokeDashoffset));
  check("every line finished drawing", ends.length === 12 && ends.every((o) => parseFloat(o) === 0), ends.slice(0, 3).join(","));

  const calm = await freshPage(browser);
  await calm.emulateMedia({ reducedMotion: "reduce" });
  check("with reduced motion, GSAP is never downloaded", !(await loadsGsap(calm, `${base}/projects/team-ops-suite`)));
}

async function main() {
  let server: ChildProcess | undefined;
  try {
    if (!skipBuild) {
      const build = spawnSync(process.execPath, [NEXT_BIN, "build"], { stdio: "inherit" });
      if (build.status !== 0) throw new Error("next build failed");
    }
    const port = 4900 + Math.floor(Math.random() * 400);
    server = spawn(process.execPath, [NEXT_BIN, "start", "-p", String(port)], { stdio: "ignore" });
    const base = `http://localhost:${port}`;
    await waitForServer(base, server);
    const browser = await chromium.launch({ channel: "msedge" });
    try {
      await projectSheets(base, browser);
      await flowDiagram(base, browser);
    } finally {
      await browser.close();
    }
  } finally {
    server?.kill();
  }
  if (failures.length) {
    console.error(`\n${failures.length} browser check(s) failed.`);
    process.exit(1);
  }
  console.log("\nAll browser checks passed.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
