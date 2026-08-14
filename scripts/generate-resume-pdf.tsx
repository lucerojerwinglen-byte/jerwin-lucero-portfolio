import { mkdirSync } from "node:fs";
import { renderToFile } from "@react-pdf/renderer";
import { ResumeDocument } from "../src/lib/resume-pdf/ResumeDocument";

const OUT_DIR = "public";
const OUT = `${OUT_DIR}/jerwin-lucero-resume.pdf`;

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  await renderToFile(<ResumeDocument />, OUT);
  console.log(`Wrote ${OUT}`);
}

main();
