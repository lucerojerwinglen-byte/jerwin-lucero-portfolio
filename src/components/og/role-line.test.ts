import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { RoleLine } from "./RoleLine";

// Ticket #24: in the link-preview image the role line was wider than the paper (about 845px of text
// in 816px), so the layout squeezed the bold "QA · Data · AI" and "AI" ran into the "—".
// Render the line with room to spare, measure its natural width, and require it to fit the paper.
const TEXT_WIDTH = 1200 - 2 * 120 - 2 * 72; // image width minus the desk and paper padding = 816

async function naturalInkWidth(): Promise<number> {
  const img = new ImageResponse(
    createElement("div", { style: { width: "100%", height: "100%", display: "flex", background: "#fff" } }, createElement(RoleLine)),
    { width: 2000, height: 100 },
  );
  const { data, info } = await sharp(Buffer.from(await img.arrayBuffer())).greyscale().raw().toBuffer({ resolveWithObject: true });
  let left = info.width;
  let right = -1;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      if (data[y * info.width + x] < 128) {
        left = Math.min(left, x);
        right = Math.max(right, x);
      }
    }
  }
  return right < 0 ? 0 : right - left + 1;
}

test("the role line fits the paper's text width, so nothing is squeezed into overlap", async () => {
  const w = await naturalInkWidth();
  assert.ok(w > 300, `nothing drawn (${w}px)`);
  assert.ok(w <= TEXT_WIDTH - 8, `role line needs ${w}px but the paper has ${TEXT_WIDTH}px`);
});

test("the bold part never shrinks (a squeezed flex item is what made the overlap)", async () => {
  const { readFileSync } = await import("node:fs");
  assert.match(readFileSync("src/components/og/RoleLine.tsx", "utf8"), /<b style=\{\{[^}]*flexShrink: 0/);
});
