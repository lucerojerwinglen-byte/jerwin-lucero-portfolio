// One-off script: turns the two hero drawings (with and without cap) into a pair of
// web-sized images whose faces line up, so the homepage can swap them with only the cap
// and hair changing. The drawings differ in position AND size, so it searches both.
// Re-run if either source drawing changes.
import sharp from "sharp";

// Sources live in the git-ignored assets-source/ (1.6 MB each; only the outputs are published).
const SRC = { cap: "assets-source/win-portfolion-cap.png", nocap: "assets-source/win-portfolion.png" };
const OUT = { cap: "public/images/jerwin-cap.webp", nocap: "public/images/jerwin-nocap.webp" };
const WIDTH = 880; // 2x the largest size the portrait is shown at (440px on phones)
const S = 314; // compare at 1/4 size for speed
// Face in the no-cap drawing at compare size: glasses to chin, ear to ear.
const FACE = { x0: 100, x1: 215, y0: 95, y1: 185 };

const grey = async (file, size) => (await sharp(file).greyscale().resize(size, size).raw().toBuffer());

const ref = await grey(SRC.nocap, S);
const img = await grey(SRC.cap, S);
// Model: a face point (x, y) in the no-cap drawing sits at (x * scale + dx, y * scale + dy) in the cap one.
let best = { scale: 1, dx: 0, dy: 0, err: Infinity };
for (let scale = 0.85; scale <= 1.15001; scale += 0.005) {
  for (let dy = -40; dy <= 40; dy++) {
    for (let dx = -30; dx <= 30; dx++) {
      let err = 0;
      for (let y = FACE.y0; y < FACE.y1 && err < best.err; y++) {
        const yy = Math.round(y * scale + dy);
        if (yy < 0 || yy >= S) { err = Infinity; break; }
        for (let x = FACE.x0; x < FACE.x1; x++) {
          const xx = Math.round(x * scale + dx);
          err += xx < 0 || xx >= S ? 255 : Math.abs(ref[y * S + x] - img[yy * S + xx]);
        }
      }
      if (err < best.err) best = { scale, dx, dy, err };
    }
  }
}
const full = (await sharp(SRC.nocap).metadata()).width; // both drawings are square, same size
const k = full / S;
const offX = best.dx * k;
const offY = best.dy * k;
console.log(`cap face is ${best.scale.toFixed(3)}x the no-cap face, shifted dx=${Math.round(offX)}px dy=${Math.round(offY)}px`);

// Cut the same frame out of both: in the no-cap drawing a square inset by a margin, in the cap
// drawing the matching square (scaled and shifted), so the faces land in the same place.
let m = 0;
const fits = (mm) => {
  const left = mm * best.scale + offX, top = mm * best.scale + offY, side = (full - 2 * mm) * best.scale;
  return left >= 0 && top >= 0 && left + side <= full && top + side <= full;
};
while (!fits(m)) m++;
const box = { left: m, top: m, width: full - 2 * m, height: full - 2 * m };
const side = Math.floor(box.width * best.scale);
const capBox = { left: Math.round(m * best.scale + offX), top: Math.round(m * best.scale + offY), width: side, height: side };
console.log(`margin ${m}px, no-cap box ${box.width}px, cap box ${side}px`);
// Cut out the background: flood-fill from the image border through light, greyish pixels (the
// paper and its soft blue glow). The drawing's black outline stops the fill, so the white collar
// and the face stay. The cutout grows 2px into the outline's soft edge and is lightly blurred, so
// no pale halo shows on a dark page.
async function cutout(input) {
  const { data, info } = await sharp(input).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: c } = info;
  const isPaper = (i) => {
    const r = data[i * c], g = data[i * c + 1], b = data[i * c + 2];
    return Math.min(r, g, b) > 185 && Math.max(r, g, b) - Math.min(r, g, b) < 40;
  };
  const bg = new Uint8Array(w * h);
  const queue = [];
  for (let x = 0; x < w; x++) queue.push(x, (h - 1) * w + x);
  for (let y = 0; y < h; y++) queue.push(y * w, y * w + w - 1);
  while (queue.length) {
    const i = queue.pop();
    if (bg[i] || !isPaper(i)) continue;
    bg[i] = 1;
    const x = i % w, y = (i / w) | 0;
    if (x > 0) queue.push(i - 1);
    if (x < w - 1) queue.push(i + 1);
    if (y > 0) queue.push(i - w);
    if (y < h - 1) queue.push(i + w);
  }
  const alpha = Buffer.alloc(w * h, 255);
  const R = 2;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!bg[y * w + x]) continue;
      for (let dy = -R; dy <= R; dy++) {
        for (let dx = -R; dx <= R; dx++) {
          const xx = x + dx, yy = y + dy;
          if (xx >= 0 && yy >= 0 && xx < w && yy < h) alpha[yy * w + xx] = 0;
        }
      }
    }
  }
  const soft = await sharp(alpha, { raw: { width: w, height: h, channels: 1 } }).blur(1).extractChannel(0).raw().toBuffer();
  const rgba = Buffer.alloc(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    rgba[i * 4] = data[i * c];
    rgba[i * 4 + 1] = data[i * c + 1];
    rgba[i * 4 + 2] = data[i * c + 2];
    rgba[i * 4 + 3] = soft[i];
  }
  return sharp(rgba, { raw: { width: w, height: h, channels: 4 } });
}

const capCrop = await sharp(SRC.cap).extract(capBox).resize(WIDTH, WIDTH).png().toBuffer();
const nocapCrop = await sharp(SRC.nocap).extract(box).resize(WIDTH, WIDTH).png().toBuffer();
await (await cutout(capCrop)).webp({ quality: 82, alphaQuality: 90 }).toFile(OUT.cap);
await (await cutout(nocapCrop)).webp({ quality: 82, alphaQuality: 90 }).toFile(OUT.nocap);
console.log(`Wrote ${OUT.cap} and ${OUT.nocap} (${WIDTH}x${WIDTH})`);
