import { site } from "@/content/data/site";

/**
 * The role line under the name in the link-preview image (src/app/opengraph-image.tsx).
 * 30px, not 32: at 32px the line needs ~845px and the paper has 816px, so the bold part was squeezed
 * and "AI" ran into the "—" (ticket #24). The bold part also never shrinks.
 */
export function RoleLine() {
  return (
    <div style={{ display: "flex", fontSize: 30, marginTop: 18, fontFamily: "sans-serif" }}>
      <b style={{ marginRight: 12, flexShrink: 0 }}>{site.focus}</b>
      <span>— {site.title}</span>
    </div>
  );
}
