import { ImageResponse } from "next/og";
import { site } from "@/content/data/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0a0a0a",
          color: "#ededed",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 28, color: "#60a5fa", marginBottom: 16 }}>
          {site.title}
        </div>
        <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1 }}>
          {site.name}
        </div>
        <div style={{ fontSize: 28, color: "#9ca3af", marginTop: 24, maxWidth: 900 }}>
          {site.tagline}
        </div>
      </div>
    ),
    { ...size }
  );
}
