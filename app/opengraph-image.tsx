import { ImageResponse } from "next/og";

export const alt = "MedMatch Ghana — Find your medical specialty";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Kente-inspired strip colors (forest / gold / clay / cream).
const kente = ["#12291f", "#e0a417", "#b5462a", "#f6f0e2"];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#f7f2e7",
          fontFamily: "sans-serif"
        }}
      >
        <div style={{ display: "flex", height: 18 }}>
          {Array.from({ length: 48 }).map((_, index) => (
            <div key={index} style={{ display: "flex", flex: 1, background: kente[index % kente.length] }} />
          ))}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            padding: "0 80px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 92,
                height: 92,
                borderRadius: 22,
                background: "#12291f"
              }}
            >
              <svg width="52" height="52" viewBox="0 0 24 24" fill="#f2b81c">
                <path d="M12 21s-7-4.35-9.5-8.5C1 9 3 5.5 6.5 5.5c2 0 3.2 1.2 5.5 3.5 2.3-2.3 3.5-3.5 5.5-3.5C21 5.5 23 9 21.5 12.5 19 16.65 12 21 12 21z" />
              </svg>
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 30,
                fontWeight: 700,
                letterSpacing: 6,
                textTransform: "uppercase",
                color: "#12291f"
              }}
            >
              MedMatch Ghana
            </div>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 72,
              fontWeight: 800,
              color: "#12291f",
              marginTop: 40,
              lineHeight: 1.05
            }}
          >
            Find the medical specialty that fits you.
          </div>

          <div style={{ display: "flex", fontSize: 30, color: "#6b5a45", marginTop: 28 }}>
            Ghana-aware specialty guidance for future clinicians.
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
