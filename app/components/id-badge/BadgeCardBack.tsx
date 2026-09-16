import Barcode from "../Barcode";

/** The reverse of the ID card: magnetic stripe, org hologram, terms box, and signature. Purely decorative, no animation refs needed. */
export default function BadgeCardBack() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        padding: "12px 14px 14px",
        borderRadius: 16,
        background: "linear-gradient(175deg, #f7f5f0 0%, #ebe7dc 60%, #ded9cd 100%)",
        border: "1px solid rgba(0, 0, 0, 0.12)",
        boxShadow:
          "0 22px 45px -10px rgba(28, 27, 24, 0.32), 0 8px 20px -4px rgba(28, 27, 24, 0.16), inset 0 1px 0 rgba(255,255,255,0.95), inset 0 0 0 1px rgba(255,255,255,0.45)",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transform: "rotateY(180deg)",
        overflow: "hidden",
        zIndex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Punched Card Slot for Lanyard Hook */}
      <div
        style={{
          width: 44,
          height: 8,
          margin: "0 auto 8px",
          borderRadius: 999,
          background: "#1c1b18",
          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.85), 0 1px 0 rgba(255,255,255,0.85), 0 0 0 1px rgba(0,0,0,0.1)",
        }}
      />

      {/* High-Coercivity Magnetic Stripe */}
      <div
        style={{
          width: "calc(100% + 28px)",
          margin: "0 -14px 12px",
          height: 32,
          background: "linear-gradient(180deg, #151412 0%, #262420 50%, #11100e 100%)",
          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.6), 0 1px 2px rgba(0,0,0,0.2)",
        }}
      />

      {/* Security Hologram Foil & Organization Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 6,
            background: "linear-gradient(135deg, #a7f3d0 0%, #bae6fd 30%, #fbcfe8 70%, #fef08a 100%)",
            border: "1px solid rgba(0,0,0,0.2)",
            boxShadow: "inset 0 1px 2px rgba(255,255,255,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            flexShrink: 0,
          }}
        >
          🛡️
        </div>
        <div>
          <p
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 13,
              margin: 0,
              color: "#1c1b18",
              letterSpacing: "-.01em",
            }}
          >
            EGOIST LABS
          </p>
          <p
            style={{
              fontFamily: "monospace",
              fontSize: 8.5,
              margin: 0,
              color: "#56633f",
              fontWeight: 700,
            }}
          >
            ENGINEERING DEPT • 2026
          </p>
        </div>
      </div>

      {/* Terms & Return Information Box */}
      <div
        style={{
          background: "rgba(255,255,255,0.65)",
          border: "1px solid rgba(0,0,0,0.08)",
          borderRadius: 8,
          padding: "8px 10px",
          marginBottom: 10,
          fontSize: 8.5,
          lineHeight: 1.4,
          color: "rgba(28,27,24,0.75)",
        }}
      >
        <p style={{ margin: "0 0 4px", fontWeight: 700, color: "#1c1b18" }}>
          OFFICIAL DEVELOPER IDENTIFICATION
        </p>
        <p style={{ margin: 0 }}>
          This card certifies authorized access. If found, please notify Brexcel Joe M. Orias at{" "}
          <strong>brexcel14@gmail.com</strong>.
        </p>
      </div>

      {/* Authorized Signature Box */}
      <div style={{ marginBottom: 10 }}>
        <div
          style={{
            height: 28,
            background: "#ffffff",
            border: "1px solid rgba(0,0,0,0.12)",
            borderRadius: 4,
            padding: "2px 8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontFamily: "cursive",
              fontSize: 14,
              color: "#1e293b",
              letterSpacing: "0.05em",
            }}
          >
            Brexcel Orias
          </span>
          <span style={{ fontSize: 7.5, color: "#94a3b8", fontWeight: 700 }}>SIGNATURE</span>
        </div>
      </div>

      {/* Bottom Barcode & Security Matrix */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: 8,
          borderTop: "1px dashed rgba(28, 27, 24, 0.18)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Barcode
          pattern={[3, 1, 2, 4, 1, 3, 1, 2, 1, 4, 2, 1, 3, 2, 1, 3, 2]}
          color="#1c1b18"
          opacity={0.75}
          height={16}
        />
        <span
          style={{
            fontSize: 8.5,
            fontWeight: 700,
            fontFamily: "monospace",
            color: "rgba(28,27,24,0.6)",
          }}
        >
          REV: 2.4-STABLE
        </span>
      </div>
    </div>
  );
}
