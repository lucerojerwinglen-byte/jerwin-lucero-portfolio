// One-off script: crops the source graduation portrait down to a tight
// face/shoulders frame so the university sash and corner watermarks fall
// outside the visible area. Re-run if assets-source/jerwin-img.jpg changes.
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const SRC = "assets-source/jerwin-img.jpg";
const OUT_DIR = "public/images";
const OUT = `${OUT_DIR}/jerwin-hero.jpg`;

mkdirSync(OUT_DIR, { recursive: true });

await sharp(SRC)
  .extract({ left: 179, top: 0, width: 1280, height: 1600 })
  .resize(800, 1000)
  .jpeg({ quality: 85 })
  .toFile(OUT);

console.log(`Wrote ${OUT}`);
