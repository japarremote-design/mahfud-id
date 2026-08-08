import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "Nama Tokoh";
  const subtitle = searchParams.get("subtitle") || "";
  const color = searchParams.get("color") || "#FE5000";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "70px",
          background: `linear-gradient(135deg, ${color} 0%, #1a1a1a 140%)`,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
          <div style={{ background: "white", color, fontWeight: 900, fontSize: 24, padding: "8px 16px", borderRadius: 10 }}>●</div>
        </div>
        <div style={{ display: "flex", color: "white", fontSize: 58, fontWeight: 800, lineHeight: 1.15, maxWidth: 950 }}>
          {title}
        </div>
        <div style={{ display: "flex", color: "rgba(255,255,255,0.9)", fontSize: 26, marginTop: 24, maxWidth: 950 }}>
          {subtitle}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
