"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function IdBadge() {
  const stageRef = useRef<HTMLDivElement>(null);
  const rigRef = useRef<HTMLDivElement>(null);
  const strapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const rig = rigRef.current;
    const strap = strapRef.current;
    const card = cardRef.current;
    if (!stage || !rig || !strap || !card) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let resizeTimer: ReturnType<typeof setTimeout>;
    let mainTl: gsap.core.Timeline | null = null;

    // Responsive scaling and positioning
    const fitRig = () => {
      const isMobile = window.innerWidth <= 900;
      const topOffset = isMobile ? 110 : 180;
      const naturalHeight = 600 + 52 + 410; // strap + clip + card
      const availableHeight = Math.max(300, window.innerHeight - 74 - 80);
      const scaleByHeight = Math.min(1, (availableHeight + topOffset) / naturalHeight);
      const scaleByWidth =
        window.innerWidth < 360
          ? 0.7
          : window.innerWidth < 480
          ? 0.76
          : window.innerWidth < 680
          ? 0.84
          : window.innerWidth < 960
          ? 0.9
          : 1;
      const scale = isMobile
        ? Math.max(0.65, Math.min(scaleByWidth, 0.95))
        : Math.max(0.65, Math.min(scaleByHeight, scaleByWidth));

      gsap.set(rig, { scale, top: -topOffset, transformOrigin: "50% 0%" });
      stage.style.height = `${Math.max(280, naturalHeight * scale - topOffset + 24)}px`;
    };

    fitRig();

    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(fitRig, 80);
    };
    window.addEventListener("resize", onResize);

    if (reduced) {
      gsap.set(rig, { xPercent: -50, x: 0, y: 0, rotation: 0 });
      gsap.set(card, { rotation: 0, y: 0 });
      gsap.set(strap, { scaleY: 1 });
      return;
    }

    // =========================================================================
    // PHYSICAL DOUBLE-PENDULUM GSAP ARCHITECTURE
    // Anchor: Top of Rig (50% 0%)
    // Lanyard: Vertical Strap + Printed text + Hardware Clasp
    // Pivot: Lobster Hook Connector at Card Top Slot (50% 8px)
    // ID Card: Hanging PVC Badge
    // =========================================================================

    // Initial offscreen state: Suspended far above viewport
    const startY = -Math.max(800, window.innerHeight + 350);
    gsap.set(rig, {
      xPercent: -50,
      x: 0,
      y: startY,
      rotation: 0,
      transformOrigin: "50% 0%",
    });
    gsap.set(strap, {
      scaleY: 1,
      transformOrigin: "50% 0%",
    });
    gsap.set(card, {
      rotation: 0,
      y: 0,
      transformOrigin: "50% 8px", // Pivots right at the punched hook slot
    });

    const runMasterAnimation = () => {
      mainTl?.kill();
      mainTl = gsap.timeline({ delay: 0.1 });

      // -------------------------------------------------------------------------
      // PHASE 1 — FREE FALL (Gravity acceleration downwards)
      // -------------------------------------------------------------------------
      mainTl.to(rig, {
        y: 0,
        duration: 0.72,
        ease: "power2.in", // accelerating downward velocity under gravity
      });

      // During fall: Card tilts slightly due to air resistance / trailing motion
      mainTl.to(
        card,
        {
          rotation: 4.5,
          duration: 0.65,
          ease: "power1.in",
          transformOrigin: "50% 8px",
        },
        0
      );

      // -------------------------------------------------------------------------
      // PHASE 2 — IMPACT & TENSION CATCH (Lanyard catches suddenly)
      // -------------------------------------------------------------------------
      const catchTime = 0.72;

      // Lanyard fabric stretches momentarily under kinetic jerk and snaps taut
      mainTl.to(
        strap,
        {
          scaleY: 1.06,
          duration: 0.07,
          ease: "power2.out",
        },
        catchTime
      );
      mainTl.to(
        strap,
        {
          scaleY: 0.975,
          duration: 0.11,
          ease: "sine.inOut",
        },
        catchTime + 0.07
      );
      mainTl.to(
        strap,
        {
          scaleY: 1.01,
          duration: 0.12,
          ease: "sine.inOut",
        },
        catchTime + 0.18
      );
      mainTl.to(
        strap,
        {
          scaleY: 1.0,
          duration: 0.15,
          ease: "sine.out",
        },
        catchTime + 0.3
      );

      // Card absorbs vertical shock at attachment point
      mainTl.to(
        card,
        {
          y: 8,
          duration: 0.08,
          ease: "power2.out",
        },
        catchTime
      );
      mainTl.to(
        card,
        {
          y: 0,
          duration: 0.45,
          ease: "elastic.out(1.2, 0.4)",
        },
        catchTime + 0.08
      );

      // -------------------------------------------------------------------------
      // PHASE 3 — COMPOUND PENDULUM OSCILLATION (Connected Physics)
      // Lanyard swings from fixed top anchor; Card swings from lobster hook pivot
      // -------------------------------------------------------------------------
      const swingStart = catchTime + 0.02;

      // Primary Pendulum (Rig & Lanyard around top anchor 50% 0%)
      mainTl.to(
        rig,
        {
          rotation: -14.5,
          duration: 0.62,
          ease: "sine.inOut",
          transformOrigin: "50% 0%",
        },
        swingStart
      );
      mainTl.to(rig, { rotation: 11.2, duration: 0.68, ease: "sine.inOut" });
      mainTl.to(rig, { rotation: -8.4, duration: 0.72, ease: "sine.inOut" });
      mainTl.to(rig, { rotation: 5.8, duration: 0.74, ease: "sine.inOut" });
      mainTl.to(rig, { rotation: -3.6, duration: 0.76, ease: "sine.inOut" });
      mainTl.to(rig, { rotation: 2.1, duration: 0.78, ease: "sine.inOut" });
      mainTl.to(rig, { rotation: -1.1, duration: 0.8, ease: "sine.inOut" });
      mainTl.to(rig, { rotation: 0.45, duration: 0.8, ease: "sine.inOut" });

      // Secondary Pendulum (Card around Attachment Hook Slot with Harmonic Phase Lag)
      mainTl.to(
        card,
        {
          rotation: 12.0,
          duration: 0.38,
          ease: "power2.out",
          transformOrigin: "50% 8px",
        },
        swingStart
      );
      mainTl.to(
        card,
        {
          rotation: -9.5,
          duration: 0.58,
          ease: "sine.inOut",
        },
        swingStart + 0.38
      );
      mainTl.to(card, { rotation: 7.2, duration: 0.64, ease: "sine.inOut" });
      mainTl.to(card, { rotation: -4.8, duration: 0.68, ease: "sine.inOut" });
      mainTl.to(card, { rotation: 3.0, duration: 0.72, ease: "sine.inOut" });
      mainTl.to(card, { rotation: -1.6, duration: 0.76, ease: "sine.inOut" });
      mainTl.to(card, { rotation: 0.7, duration: 0.78, ease: "sine.inOut" });

      // -------------------------------------------------------------------------
      // PHASE 4 — NATURAL SETTLE TO REST (Complete Stop at 0°)
      // -------------------------------------------------------------------------
      mainTl.to(
        rig,
        {
          rotation: 0,
          duration: 0.85,
          ease: "sine.out",
        }
      );
      mainTl.to(
        card,
        {
          rotation: 0,
          duration: 0.85,
          ease: "sine.out",
        },
        "-=0.75"
      );
    };

    let onReadyHandler: (() => void) | null = null;
    let failsafeTimer: ReturnType<typeof setTimeout> | null = null;

    if ((window as unknown as { __portfolioReady?: boolean }).__portfolioReady) {
      runMasterAnimation();
    } else {
      onReadyHandler = () => {
        if (failsafeTimer) clearTimeout(failsafeTimer);
        runMasterAnimation();
      };
      window.addEventListener("portfolio:ready", onReadyHandler, { once: true });
      failsafeTimer = setTimeout(() => {
        runMasterAnimation();
      }, 2500);
    }

    return () => {
      if (onReadyHandler) window.removeEventListener("portfolio:ready", onReadyHandler);
      if (failsafeTimer) clearTimeout(failsafeTimer);
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
      mainTl?.kill();
    };
  }, []);

  return (
    <div
      ref={stageRef}
      style={{
        position: "relative",
        height: 520,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Physics Rig (Pivot anchored at the top: 50% 0%) */}
      <div
        ref={rigRef}
        style={{
          position: "absolute",
          left: "50%",
          top: -180,
          transform: "translateX(-50%)",
          transformOrigin: "50% 0%",
          width: 276,
          willChange: "transform",
          userSelect: "none",
        }}
      >
        {/* ==================== LANYARD STRAP ==================== */}
        <div
          ref={strapRef}
          style={{
            position: "relative",
            width: 44,
            height: 600,
            margin: "0 auto",
            borderRadius: 3,
            background:
              "repeating-linear-gradient(0deg, #323b23, #323b23 2px, #3c482a 2px, #3c482a 4px)",
            boxShadow:
              "0 4px 14px rgba(0,0,0,0.22), inset 2px 0 3px rgba(255,255,255,0.08), inset -2px 0 3px rgba(0,0,0,0.35)",
            transformOrigin: "50% 0%",
            overflow: "hidden",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            borderLeft: "1.5px solid #232918",
            borderRight: "1.5px solid #232918",
          }}
        >
          {/* Edge Stitching Details */}
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 3,
              width: 1,
              borderLeft: "1px dashed rgba(255, 245, 230, 0.28)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              right: 3,
              width: 1,
              borderLeft: "1px dashed rgba(255, 245, 230, 0.28)",
            }}
          />

          {/* Printed Text: Part of the physical woven strap */}
          <span
            style={{
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              fontFamily: "var(--font-body)",
              fontSize: 11.5,
              fontWeight: 900,
              letterSpacing: ".28em",
              color: "#f3eedd",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              lineHeight: "44px",
              opacity: 0.94,
              textShadow: "0 1px 2px rgba(0,0,0,0.55)",
            }}
          >
            COMPUTER ENGINEERING &nbsp;✦&nbsp; COMPUTER ENGINEERING &nbsp;✦&nbsp; COMPUTER ENGINEERING
          </span>
        </div>

        {/* ==================== HARDWARE CONNECTOR / METAL CLIP ==================== */}
        {/* Metal Crimp Clasp (joins the bottom of lanyard fabric) */}
        <div
          style={{
            position: "relative",
            width: 38,
            height: 18,
            margin: "-1px auto 0",
            borderRadius: 3,
            background: "linear-gradient(180deg, #dcd9d0 0%, #8e8a80 50%, #b8b5ab 100%)",
            boxShadow:
              "0 2px 4px rgba(0,0,0,0.25), inset 0 1px 1px rgba(255,255,255,0.7), inset 0 -1px 1px rgba(0,0,0,0.4)",
            border: "1px solid #757268",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            zIndex: 3,
          }}
        >
          {/* Crimp Indent Marks */}
          <div style={{ width: 4, height: 8, background: "#5a574e", borderRadius: 1 }} />
          <div style={{ width: 4, height: 8, background: "#5a574e", borderRadius: 1 }} />
        </div>

        {/* Swivel Ring */}
        <div
          style={{
            width: 14,
            height: 14,
            margin: "-3px auto 0",
            borderRadius: "50%",
            border: "3.5px solid #a4a095",
            background: "transparent",
            boxShadow: "0 2px 3px rgba(0,0,0,0.2)",
            zIndex: 2,
          }}
        />

        {/* Lobster / Swivel Hook Claw going through the ID slot */}
        <div
          style={{
            position: "relative",
            width: 12,
            height: 22,
            margin: "-4px auto 0",
            borderRadius: "4px 4px 6px 6px",
            background: "linear-gradient(90deg, #b0aca0 0%, #efede6 50%, #8c887d 100%)",
            boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
            zIndex: 4,
          }}
        >
          {/* Hook lever latch detail */}
          <div
            style={{
              position: "absolute",
              top: 5,
              right: -3,
              width: 5,
              height: 8,
              borderRadius: 2,
              background: "#9a968a",
              border: "0.5px solid #6b685e",
            }}
          />
        </div>

        {/* ==================== PHYSICAL PVC ID BADGE ==================== */}
        <div
          ref={cardRef}
          style={{
            position: "relative",
            width: 276,
            margin: "-8px auto 0",
            padding: "12px 14px 14px",
            borderRadius: 16,
            background: "linear-gradient(175deg, #ffffff 0%, #f7f5f0 55%, #eae6dc 100%)",
            border: "1px solid rgba(0, 0, 0, 0.12)",
            boxShadow:
              "0 20px 40px -10px rgba(28, 27, 24, 0.28), 0 6px 16px -4px rgba(28, 27, 24, 0.15), inset 0 1px 0 rgba(255,255,255,0.9), inset 0 0 0 1px rgba(255,255,255,0.4)",
            willChange: "transform",
            transformOrigin: "50% 0%",
            overflow: "hidden",
          }}
        >
          {/* Subtle PVC Specular Sheen Stripe */}
          <div
            style={{
              position: "absolute",
              top: -60,
              left: -40,
              width: 140,
              height: 480,
              background:
                "linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.35) 45%, rgba(255,255,255,0.12) 55%, transparent 65%)",
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
              boxShadow:
                "inset 0 2px 4px rgba(0,0,0,0.8), 0 1px 0 rgba(255,255,255,0.8), 0 0 0 1px rgba(0,0,0,0.1)",
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

          {/* Profile Photo with Physical Frame */}
          <div
            style={{
              position: "relative",
              borderRadius: 12,
              overflow: "hidden",
              background: "#dcd8ce",
              border: "1.5px solid rgba(0,0,0,0.08)",
              boxShadow: "inset 0 1px 3px rgba(0,0,0,0.15), 0 2px 6px rgba(0,0,0,0.06)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/profile.jpg"
              alt="Brexcel Joe M. Orias"
              style={{
                width: "100%",
                aspectRatio: "1 / 1",
                objectFit: "cover",
                display: "block",
              }}
              draggable={false}
            />
          </div>

          {/* Badge Identity Info */}
          <div style={{ padding: "12px 4px 4px" }}>
            <p
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 21,
                lineHeight: 1.15,
                margin: "0 0 4px",
                color: "#1c1b18",
                letterSpacing: "-.01em",
              }}
            >
              Brexcel Joe M. Orias
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 12,
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
              padding: "10px 4px 0",
              marginTop: 10,
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

            {/* Subtle Badge Authenticity Barcode */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                height: 14,
                opacity: 0.65,
              }}
            >
              {[2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 2, 1, 2].map((w, i) => (
                <div
                  key={i}
                  style={{
                    width: w,
                    height: "100%",
                    background: "#1c1b18",
                  }}
                />
              ))}
            </div>

            <span
              style={{
                fontSize: 9.5,
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
      </div>
    </div>
  );
}
