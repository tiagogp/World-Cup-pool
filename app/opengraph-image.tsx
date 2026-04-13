import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Bolão da Copa 2026 - simulador de chaves";
export const size = {
  width: 1200,
  height: 630
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#ffffff",
          color: "#0e0f0c",
          fontFamily: "Arial, Helvetica, sans-serif",
          padding: 64,
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -90,
            width: 360,
            height: 360,
            borderRadius: 180,
            background: "#9fe870"
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -160,
            left: -120,
            width: 420,
            height: 420,
            borderRadius: 210,
            background: "#e2f6d5"
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            zIndex: 1
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: -1
            }}
          >
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: 34,
                background: "#9fe870",
                color: "#163300",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative"
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  background: "#ffffff",
                  border: "8px solid #0e0f0c"
                }}
              />
            </div>
            Bolão da Copa 2026
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div
              style={{
                display: "flex",
                alignSelf: "flex-start",
                borderRadius: 999,
                background: "#e2f6d5",
                color: "#163300",
                padding: "12px 24px",
                fontSize: 28,
                fontWeight: 700
              }}
            >
              Simulador de chaves
            </div>
            <h1
              style={{
                margin: 0,
                maxWidth: 900,
                fontSize: 94,
                lineHeight: 0.88,
                letterSpacing: -4,
                fontWeight: 900
              }}
            >
              Monte sua previsão e compartilhe o campeão.
            </h1>
          </div>

          <div
            style={{
              display: "flex",
              gap: 14,
              fontSize: 26,
              fontWeight: 700,
              color: "#454745"
            }}
          >
            <span>12 grupos</span>
            <span>•</span>
            <span>32 classificados</span>
            <span>•</span>
            <span>1 campeão</span>
          </div>
        </div>
      </div>
    ),
    size
  );
}
