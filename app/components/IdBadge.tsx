"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function IdBadge() {
  const stageRef = useRef<HTMLDivElement>(null);
  const rigRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const strapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const rig = rigRef.current;
    const card = cardRef.current;
    const strap = strapRef.current;
    if (!stage || !rig || !card || !strap) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let resizeTimer: ReturnType<typeof setTimeout>;
    let tlGuard: ReturnType<typeof setTimeout>;
    let idle: gsap.core.Tween | null = null;
    let tl: gsap.core.Timeline | null = null;

    const fitRig = () => {
      const top = 172;
      const natural = 320 + 46 + 432;
      const avail = Math.max(300, window.innerHeight - 74 - 104);
      const byHeight = Math.min(1, (avail + top) / natural);
      const byWidth = window.innerWidth < 620 ? 0.62 : window.innerWidth < 900 ? 0.78 : 1;
      const s = Math.max(0.48, Math.min(byHeight, byWidth));
      gsap.set(rig, { scale: s, transformOrigin: "50% 0%" });
      stage.style.height = Math.max(230, natural * s - top) + "px";
    };
    fitRig();

    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(fitRig, 120);
    };
    window.addEventListener("resize", onResize);

    const startIdle = () => {
      if (reduced) return;
      gsap.set(rig, { xPercent: -50, x: 0, y: 0 });
      idle = gsap.to(rig, {
        rotation: 0.7,
        duration: 3.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        transformOrigin: "50% 0%",
      });
    };

    const already = sessionStorage.getItem("bjo-id-dropped") === "1";

    if (reduced || already) {
      startIdle();
    } else {
      sessionStorage.setItem("bjo-id-dropped", "1");

      gsap.set(rig, { xPercent: -50, x: 0, rotation: 0, y: -(window.innerHeight + 420) });
      gsap.set(card, { rotation: 0, transformOrigin: "50% -80px" });
      gsap.set(strap, { scaleY: 1, transformOrigin: "50% 0%" });

      tl = gsap.timeline({ defaults: { transformOrigin: "50% 0%" }, onComplete: startIdle });

      tl.to(rig, { y: -34, duration: 0.16, ease: "power1.in" })
        .to(rig, { y: 0, duration: 0.58, ease: "power2.in" })
        .to(strap, { scaleY: 1.055, duration: 0.09, ease: "power3.out" }, "-=0.02")
        .to(strap, { scaleY: 1, duration: 0.7, ease: "elastic.out(1.1, 0.28)" })
        .to(card, { y: 9, duration: 0.1, ease: "power3.out" }, "-=0.78")
        .to(card, { y: 0, duration: 0.75, ease: "elastic.out(1, 0.3)" }, "-=0.68")
        .to(rig, { rotation: -5.2, duration: 0.1, ease: "power2.out" }, "-=0.78")
        .to(rig, { rotation: 4.1, duration: 0.13, ease: "sine.inOut" })
        .to(rig, { rotation: -2.6, duration: 0.12, ease: "sine.inOut" })
        .to(rig, { rotation: 1.2, duration: 0.11, ease: "sine.inOut" })
        .to(rig, { rotation: -9.4, duration: 0.46, ease: "sine.inOut" })
        .to(rig, { rotation: 8.1, duration: 0.62, ease: "sine.inOut" })
        .to(rig, { rotation: -6.2, duration: 0.62, ease: "sine.inOut" })
        .to(rig, { rotation: 4.7, duration: 0.64, ease: "sine.inOut" })
        .to(rig, { rotation: -3.1, duration: 0.64, ease: "sine.inOut" })
        .to(rig, { rotation: 2, duration: 0.66, ease: "sine.inOut" })
        .to(rig, { rotation: -1.1, duration: 0.66, ease: "sine.inOut" })
        .to(rig, { rotation: 0.4, duration: 0.7, ease: "sine.inOut" })
        .to(rig, { rotation: 0, duration: 0.9, ease: "sine.out" });

      tlGuard = setTimeout(() => {
        if (tl && tl.progress() < 1) tl.progress(1);
      }, 13000);

      tl.to(card, { rotation: -2.4, duration: 0.5, ease: "sine.inOut" }, 0.9)
        .to(card, { rotation: 1.8, duration: 0.62, ease: "sine.inOut" })
        .to(card, { rotation: -1.2, duration: 0.66, ease: "sine.inOut" })
        .to(card, { rotation: 0.6, duration: 0.7, ease: "sine.inOut" })
        .to(card, { rotation: 0, duration: 0.9, ease: "sine.out" });
    }

    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
      clearTimeout(tlGuard);
      tl?.kill();
      idle?.kill();
    };
  }, []);

  return (
    <div ref={stageRef} style={{ position: "relative", height: 520 }}>
      <div
        ref={rigRef}
        style={{
          position: "absolute",
          left: "50%",
          top: -172,
          transform: "translateX(-50%)",
          transformOrigin: "50% 0",
          width: 268,
          willChange: "transform",
        }}
      >
        <div
          ref={strapRef}
          style={{
            position: "relative",
            width: 42,
            height: 320,
            margin: "0 auto",
            borderRadius: 4,
            background:
              "linear-gradient(90deg, var(--color-accent-800) 0%, var(--color-accent-600) 38%, var(--color-accent-500) 62%, var(--color-accent-800) 100%)",
            boxShadow: "var(--shadow-sm)",
            transformOrigin: "50% 0",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: ".34em",
              color: "color-mix(in srgb, #fff3e2 92%, transparent)",
              whiteSpace: "nowrap",
              lineHeight: "46px",
            }}
          >
            COMPUTER ENGINEERING · COMPUTER ENGINEERING · COMPUTER ENGINEERING · COMPUTER
            ENGINEERING
          </span>
        </div>
        <div
          style={{
            position: "relative",
            width: 34,
            height: 30,
            margin: "-2px auto 0",
            borderRadius: 6,
            background: "linear-gradient(180deg, var(--color-neutral-300), var(--color-neutral-500))",
            boxShadow: "var(--shadow-sm)",
          }}
        />
        <div
          style={{
            width: 16,
            height: 22,
            margin: "-6px auto 0",
            borderRadius: 999,
            border: "4px solid var(--color-neutral-400)",
            background: "transparent",
          }}
        />
        <div
          ref={cardRef}
          style={{
            width: 268,
            margin: "-6px auto 0",
            padding: 14,
            borderRadius: "var(--radius-lg)",
            background: "var(--color-surface)",
            border: "1px solid var(--color-divider)",
            boxShadow: "var(--shadow-lg)",
            willChange: "transform",
          }}
        >
          <div
            style={{
              width: 46,
              height: 9,
              margin: "0 auto 14px",
              borderRadius: 999,
              background: "var(--color-bg)",
              boxShadow: "inset 0 1px 2px rgba(0,0,0,.25)",
            }}
          />
          <div
            style={{
              borderRadius: 20,
              overflow: "hidden",
              background: "var(--color-neutral-200)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/profile.jpg"
              alt="Brexcel Joe M. Orias"
              style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block" }}
              draggable={false}
            />
          </div>
          <div style={{ padding: "16px 4px 4px" }}>
            <p style={{ fontFamily: "var(--font-heading)", fontSize: 23, lineHeight: 1.1, margin: "0 0 6px" }}>
              Brexcel Joe M. Orias
            </p>
            <p
              style={{
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: ".1em",
                textTransform: "uppercase",
                color: "var(--color-accent-700)",
                margin: 0,
              }}
            >
              Full Stack Developer
            </p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "14px 4px 0",
              marginTop: 12,
              borderTop: "1px solid var(--color-divider)",
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: 999, background: "var(--color-accent)" }} />
            <span style={{ width: 8, height: 8, borderRadius: 999, background: "var(--color-accent-2)" }} />
            <span style={{ flex: 1 }} />
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: ".14em",
                textTransform: "uppercase",
                color: "color-mix(in srgb, var(--color-text) 50%, transparent)",
              }}
            >
              Portfolio 2026
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
