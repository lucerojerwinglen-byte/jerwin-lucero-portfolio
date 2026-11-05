// One-off script: the browser-tab icon is Jerwin's drawing (head and shoulders, no cap) on a
// soft round paper background. Writes src/app/icon.png, apple-icon.png and favicon.ico
// (Next serves them as <link rel="icon">). Re-run if public/images/jerwin-nocap.webp changes.
import sharp from "sharp";
import { writeFileSync } from "node:fs";

const SRC = "public/images/jerwin-nocap.webp"; // 880x880, transparent background, face-aligned
const PAPER = "#f4f2ec";
const HEAD = { left: 150, top: 0, width: 580, height: 580 }; // hair to collar

async function render(size, { round = true } = {}) {
  const face = await sharp(SRC).extract(HEAD).resize(size, size).toBuffer();
  // Two separate steps: a second .composite() on the same pipeline replaces the first.
  const flat = await sharp({ create: { width: size, height: size, channels: 4, background: PAPER } })
    .composite([{ input: face }])
    .png()
    .toBuffer();
  if (!round) return flat;
  const mask = Buffer.from(`<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}"/></svg>`);
  return sharp(flat).composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
}

writeFileSync("src/app/icon.png", await render(256));
writeFileSync("src/app/apple-icon.png", await render(180, { round: false })); // iOS rounds the corners itself

// favicon.ico: a container holding PNG images (16, 32, 48), which every current browser reads.
const sizes = [16, 32, 48];
const pngs = await Promise.all(sizes.map((s) => render(s)));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((s, i) => {
  const e = 6 + 16 * i;
  header[e] = s; header[e + 1] = s; header[e + 2] = 0; header[e + 3] = 0;
  header.writeUInt16LE(1, e + 4); header.writeUInt16LE(32, e + 6);
  header.writeUInt32LE(pngs[i].length, e + 8); header.writeUInt32LE(offset, e + 12);
  offset += pngs[i].length;
});
writeFileSync("src/app/favicon.ico", Buffer.concat([header, ...pngs]));
console.log("Wrote src/app/icon.png, apple-icon.png, favicon.ico");
