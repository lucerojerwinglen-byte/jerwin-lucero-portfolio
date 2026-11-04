import { ImageResponse } from "next/og";
import { site } from "@/content/data/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name} — Résumé`;

// A sheet of paper on a grey desk, like the site itself.
export default async function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#e6e6e4", padding: "56px 120px 0" }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            background: "#ffffff",
            padding: "64px 72px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
            color: "#1b1b1a",
            fontFamily: "serif",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, color: "#71716d", fontFamily: "monospace" }}>
            <span>{site.resumePdfName}</span>
            <span>Page 1 / 2</span>
          </div>
          <div style={{ fontSize: 76, fontWeight: 700, marginTop: 56, letterSpacing: -1 }}>{site.name}</div>
          <div style={{ display: "flex", fontSize: 32, marginTop: 18, fontFamily: "sans-serif" }}>
            <b style={{ marginRight: 12 }}>{site.focus}</b>— {site.title}
          </div>
          <div style={{ height: 3, background: "#1b1b1a", marginTop: 36 }} />
          <div style={{ fontSize: 26, color: "#1f3a8a", marginTop: 28, fontFamily: "monospace" }}>{site.domain}</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
