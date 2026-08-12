import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Abdula Daner — Full-Stack Developer & Tech Builder";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#0d0d0d",
          backgroundImage:
            "radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.08) 0%, transparent 40%), radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.04) 0%, transparent 40%)",
          padding: "80px",
          fontFamily: "sans-serif",
          color: "#ffffff",
        }}
      >
        {/* Top Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              backgroundColor: "#22c55e",
              boxShadow: "0 0 12px #22c55e",
            }}
          />
          <span
            style={{
              fontSize: "20px",
              fontWeight: 500,
              letterSpacing: "0.05em",
              color: "#a1a1aa",
              textTransform: "uppercase",
            }}
          >
            Disponibil pentru proiecte
          </span>
        </div>

        {/* Center Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <h1
            style={{
              fontSize: "64px",
              fontWeight: 800,
              lineHeight: 1.1,
              margin: 0,
              letterSpacing: "-0.02em",
              background: "linear-gradient(to right, #ffffff, #a1a1aa)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Abdula Daner
          </h1>
          <p
            style={{
              fontSize: "32px",
              fontWeight: 400,
              margin: 0,
              color: "#d4d4d8",
              maxWidth: "900px",
              lineHeight: 1.3,
            }}
          >
            Full-Stack Developer & Tech Builder — Aplicații Web, Automatizări AI & Software Hotelier.
          </p>
        </div>

        {/* Bottom Tags */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          {["Next.js", "React", "Python", "FastAPI", "AI Agents", "WhatsApp Bots"].map(
            (tech) => (
              <div
                key={tech}
                style={{
                  padding: "10px 20px",
                  borderRadius: "9999px",
                  backgroundColor: "rgba(255, 255, 255, 0.06)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  fontSize: "18px",
                  fontWeight: 500,
                  color: "#e4e4e7",
                }}
              >
                {tech}
              </div>
            )
          )}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
