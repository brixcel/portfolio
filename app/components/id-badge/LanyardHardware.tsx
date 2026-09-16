/** Metal crimp clasp, swivel ring, and lobster hook connecting the strap to the card. Purely decorative — moves with the rig as a whole, no individual ref needed. */
export default function LanyardHardware() {
  return (
    <>
      {/* Metal Crimp Clasp */}
      <div
        style={{
          position: "relative",
          width: 40,
          height: 19,
          margin: "-1px auto 0",
          borderRadius: 3,
          background: "linear-gradient(180deg, #e2dfd7 0%, #8e8a80 50%, #b8b5ab 100%)",
          boxShadow:
            "0 2px 4px rgba(0,0,0,0.28), inset 0 1px 1px rgba(255,255,255,0.75), inset 0 -1px 1px rgba(0,0,0,0.45)",
          border: "1px solid #757268",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
          zIndex: 3,
        }}
      >
        <div style={{ width: 4.5, height: 9, background: "#5a574e", borderRadius: 1 }} />
        <div style={{ width: 4.5, height: 9, background: "#5a574e", borderRadius: 1 }} />
      </div>

      {/* Swivel Ring */}
      <div
        style={{
          width: 15,
          height: 15,
          margin: "-3px auto 0",
          borderRadius: "50%",
          border: "3.5px solid #a4a095",
          background: "transparent",
          boxShadow: "0 2px 3px rgba(0,0,0,0.22)",
          zIndex: 2,
        }}
      />

      {/* Lobster Hook Claw */}
      <div
        style={{
          position: "relative",
          width: 13,
          height: 23,
          margin: "-4px auto 0",
          borderRadius: "4px 4px 6px 6px",
          background: "linear-gradient(90deg, #b0aca0 0%, #efede6 50%, #8c887d 100%)",
          boxShadow: "0 2px 6px rgba(0,0,0,0.35)",
          zIndex: 4,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 5,
            right: -3.5,
            width: 5.5,
            height: 8.5,
            borderRadius: 2,
            background: "#9a968a",
            border: "0.5px solid #6b685e",
          }}
        />
      </div>
    </>
  );
}
