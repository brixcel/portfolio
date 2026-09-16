import type { Ref } from "react";
import Barcode from "../Barcode";

type Props = {
  profileFrameRef: Ref<HTMLDivElement>;
  profileImgRef: Ref<HTMLImageElement>;
  profileGlareRef: Ref<HTMLDivElement>;
};

/** The visible front of the ID card: department header, eye-tracking profile photo, name, and the authenticity strip. Static (no own ref) — only the profile photo/glare inside animate. */
export default function BadgeCardFront({ profileFrameRef, profileImgRef, profileGlareRef }: Props) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        padding: "12px 14px 14px",
        borderRadius: 16,
        background: "linear-gradient(175deg, #ffffff 0%, #f7f5f0 55%, #eae6dc 100%)",
        border: "1px solid rgba(0, 0, 0, 0.12)",
        boxShadow:
          "0 22px 45px -10px rgba(28, 27, 24, 0.32), 0 8px 20px -4px rgba(28, 27, 24, 0.16), inset 0 1px 0 rgba(255,255,255,0.95), inset 0 0 0 1px rgba(255,255,255,0.45)",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        overflow: "hidden",
        zIndex: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Specular Sheen Stripe */}
      <div
        style={{
          position: "absolute",
          top: -60,
          left: -40,
          width: 140,
          height: 480,
          background:
            "linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.32) 45%, rgba(255,255,255,0.1) 55%, transparent 65%)",
          transform: "rotate(25deg)",
          pointerEvents: "none",
          zIndex: 10,
        }}
      />

      {/* Punched Card Slot for Lanyard Hook */}
      <div
        style={{
          width: 44,
          height: 8,
          margin: "0 auto 10px",
          borderRadius: 999,
          background: "#1c1b18",
          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.85), 0 1px 0 rgba(255,255,255,0.85), 0 0 0 1px rgba(0,0,0,0.1)",
        }}
      />

      {/* Department Header Band */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "4px 8px",
          marginBottom: 10,
          borderRadius: 6,
          background: "linear-gradient(90deg, #3d472b 0%, #56633f 100%)",
          color: "#f7f5f0",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: ".16em",
            textTransform: "uppercase",
          }}
        >
          COMPUTER ENGINEERING
        </span>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 8.5,
            fontWeight: 700,
            letterSpacing: ".08em",
            opacity: 0.85,
          }}
        >
          ENG-2026
        </span>
      </div>

      {/* Interactive Eye-Tracking Profile Photo Frame */}
      <div
        ref={profileFrameRef}
        style={{
          position: "relative",
          borderRadius: 12,
          overflow: "hidden",
          background: "#dcd8ce",
          border: "1.5px solid rgba(0,0,0,0.08)",
          boxShadow: "inset 0 1px 3px rgba(0,0,0,0.15), 0 2px 6px rgba(0,0,0,0.06)",
          width: "100%",
          height: 195,
          perspective: 600,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Dynamic Lens / Pupil Glare */}
        <div
          ref={profileGlareRef}
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 4,
            opacity: 0,
            mixBlendMode: "soft-light",
            transition: "opacity 0.25s ease-out",
          }}
        />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={profileImgRef}
          src="/assets/profile.jpg"
          alt="Brexcel Joe M. Orias"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            willChange: "transform",
            transformStyle: "preserve-3d",
          }}
          draggable={false}
        />
      </div>

      {/* Badge Identity Info */}
      <div style={{ padding: "10px 4px 4px" }}>
        <p
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 20,
            lineHeight: 1.15,
            margin: "0 0 3px",
            color: "#1c1b18",
            letterSpacing: "-.01em",
          }}
        >
          Brexcel Joe M. Orias
        </p>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 11.5,
            fontWeight: 700,
            letterSpacing: ".12em",
            textTransform: "uppercase",
            color: "#56633f",
            margin: 0,
          }}
        >
          Software Developer
        </p>
      </div>

      {/* Bottom Security / Authenticity Strip */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 4px 0",
          marginTop: "auto",
          borderTop: "1px dashed rgba(28, 27, 24, 0.18)",
        }}
      >
        {/* Simulated Microchip Gold Contact */}
        <div
          style={{
            width: 22,
            height: 16,
            borderRadius: 3,
            background: "linear-gradient(135deg, #dfba60 0%, #c99c37 50%, #fae28b 100%)",
            border: "1px solid #b38520",
            boxShadow: "inset 0 1px 1px rgba(255,255,255,0.6)",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr 1fr",
            gap: 1,
            padding: 1,
          }}
        >
          <div style={{ border: "0.5px solid rgba(130,90,10,0.5)", borderRadius: 1 }} />
          <div style={{ border: "0.5px solid rgba(130,90,10,0.5)", borderRadius: 1 }} />
          <div style={{ border: "0.5px solid rgba(130,90,10,0.5)", borderRadius: 1 }} />
          <div style={{ border: "0.5px solid rgba(130,90,10,0.5)", borderRadius: 1 }} />
        </div>

        <Barcode color="#1c1b18" opacity={0.65} height={14} />

        <span
          style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: ".1em",
            textTransform: "uppercase",
            color: "rgba(28, 27, 24, 0.55)",
            fontFamily: "monospace",
          }}
        >
          ID: 2026-DEV
        </span>
      </div>
    </div>
  );
}
