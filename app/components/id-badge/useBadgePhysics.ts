import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { onPortfolioReady } from "../../lib/motion";
import { DIMENSIONS, ENTRANCE, FIT, GAZE, OFFSCREEN_START, PHYSICS, PIVOTS, TOTAL_RIG_HEIGHT } from "./constants";

export type BadgeRefs = {
  stageRef: RefObject<HTMLDivElement | null>;
  rigRef: RefObject<HTMLDivElement | null>;
  strapRef: RefObject<HTMLDivElement | null>;
  hardwareRef: RefObject<HTMLDivElement | null>;
  cardRef: RefObject<HTMLDivElement | null>;
  glareRef?: RefObject<HTMLDivElement | null>;
  profileFrameRef?: RefObject<HTMLDivElement | null>;
  profileImgRef?: RefObject<HTMLImageElement | null>;
  profileGlareRef?: RefObject<HTMLDivElement | null>;
};

const DEG = 180 / Math.PI;
const clamp = (min: number, max: number, v: number) => Math.min(max, Math.max(min, v));
/** Approaches ±limit asymptotically — rubber-band resistance for drags. */
const soft = (v: number, limit: number) => limit * Math.tanh(v / limit);

const FRONT_LABEL = "ID card, front. Drag to swing it, or press to turn it over.";
const BACK_LABEL = "ID card, back. Press to turn it to the front.";

/**
 * The lanyard badge as a small physical simulation:
 *  - swing: the whole lanyard is a damped pendulum hanging from the ceiling
 *  - hang: the card lags behind on its hook and partially counter-rotates
 *  - lift: the strap is a stiff spring in tension but goes slack when the card
 *    is lifted, so a card thrown upward falls under gravity and is caught
 *  - flip / tilt: springs for turning the card over and leaning toward the pointer
 * The scripted part is only the entrance fall; at the catch the simulation
 * takes over, and it sleeps whenever the badge comes to rest.
 */
export function useBadgePhysics(refs: BadgeRefs) {
  useEffect(() => {
    const stage = refs.stageRef.current;
    const rig = refs.rigRef.current;
    const strap = refs.strapRef.current;
    const hardware = refs.hardwareRef.current;
    const card = refs.cardRef.current;
    if (!stage || !rig || !strap || !hardware || !card) return;
    const glare = refs.glareRef?.current ?? null;
    const profileImg = refs.profileImgRef?.current ?? null;
    const profileGlare = refs.profileGlareRef?.current ?? null;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const P = PHYSICS;

    // ---------------------------------------------------------------- fit
    let scale = 1;
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    const fitRig = () => {
      const width = window.innerWidth;
      const isMobile = width <= FIT.mobileMaxWidth;
      const topOffset = isMobile ? FIT.topOffsetMobile : FIT.topOffsetDesktop;
      const scaleByHeight = Math.min(
        FIT.fullScale,
        (window.innerHeight - FIT.viewportHeightReserve) / (TOTAL_RIG_HEIGHT - topOffset)
      );
      const breakpoint = FIT.widthBreakpoints.find((b) => width < b.maxWidth);
      const scaleByWidth = breakpoint ? breakpoint.scale : FIT.fullScale;
      scale = isMobile
        ? Math.max(FIT.mobileMinScale, Math.min(scaleByWidth, FIT.mobileMaxScale))
        : Math.max(FIT.desktopMinScale, Math.min(scaleByHeight, scaleByWidth));

      // The rig scales from its ceiling pivot, so the ceiling offset scales with it
      gsap.set(rig, { scale, top: -topOffset * scale, transformOrigin: PIVOTS.rig });
      gsap.set(stage, {
        height: Math.max(FIT.minStageHeight, (TOTAL_RIG_HEIGHT - topOffset) * scale + FIT.stageHeightPad),
      });
    };
    fitRig();
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(fitRig, 80);
    };
    window.addEventListener("resize", onResize);

    // -------------------------------------------------------------- state
    const s = {
      angle: 0, angleV: 0,
      hang: 0, hangV: 0,
      lift: 0, liftV: 0,
      flip: 180, flipV: 0, flipTarget: 0,
      tiltX: 0, tiltXV: 0,
      tiltY: 0, tiltYV: 0,
    };
    const hoverTarget = { x: 0, y: 0 };
    let live = false; // simulation owns the transforms (after the entrance catch)
    let inView = true;
    let raf = 0;
    let lastFrame = 0;

    gsap.set(rig, { xPercent: -50, x: 0, rotation: 0, transformOrigin: PIVOTS.rig });
    gsap.set(strap, { scaleY: 1, transformOrigin: PIVOTS.rig });
    gsap.set(card, { transformOrigin: PIVOTS.card });

    const setRigRotation = gsap.quickSetter(rig, "rotation", "deg") as (v: number) => void;
    const setStrapScale = gsap.quickSetter(strap, "scaleY") as (v: number) => void;
    const setHardwareY = gsap.quickSetter(hardware, "y", "px") as (v: number) => void;
    const setCardY = gsap.quickSetter(card, "y", "px") as (v: number) => void;
    const setCardRotation = gsap.quickSetter(card, "rotation", "deg") as (v: number) => void;
    const setCardRotX = gsap.quickSetter(card, "rotateX", "deg") as (v: number) => void;
    const setCardRotY = gsap.quickSetter(card, "rotateY", "deg") as (v: number) => void;

    const render = () => {
      setRigRotation(s.angle);
      setStrapScale(1 + s.lift / DIMENSIONS.strapHeight);
      setHardwareY(s.lift);
      setCardY(s.lift);
      setCardRotation(s.hang);
      setCardRotX(s.tiltX);
      setCardRotY(s.flip + s.tiltY);
      if (glare) {
        const strength = clamp(0, 0.9, (Math.abs(s.tiltX) + Math.abs(s.tiltY)) / 12);
        gsap.set(glare, { opacity: strength });
        if (strength > 0.01) {
          const gx = 50 + s.tiltY * 3;
          const gy = 50 - s.tiltX * 3;
          gsap.set(glare, {
            background: `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.07) 45%, transparent 72%)`,
          });
        }
      }
    };

    // ------------------------------------------------------------ physics
    const drag = {
      active: false,
      id: -1,
      startX: 0,
      startY: 0,
      startAngle: 0,
      startLift: 0,
      startTime: 0,
      lastTime: 0,
      moved: 0,
      samples: [] as { t: number; x: number; y: number }[],
    };

    let swingAccel = 0;
    const step = (dt: number) => {
      if (!drag.active) {
        swingAccel = -P.swing.stiffness * s.angle - P.swing.damping * s.angleV;
        s.angleV += swingAccel * dt;
        s.angle += s.angleV * dt;

        // Gravity always pulls; the strap only pushes back while taut. At rest
        // it is stretched just enough (slackPoint) to cancel gravity, so the
        // force is continuous and the card settles instead of chattering at 0.
        const slackPoint = -P.strap.gravity / P.strap.stiffness;
        const wasSlack = s.lift < slackPoint;
        let liftAccel = P.strap.gravity;
        if (!wasSlack) liftAccel -= P.strap.stiffness * (s.lift - slackPoint) + P.strap.damping * s.liftV;
        s.liftV += liftAccel * dt;
        s.lift += s.liftV * dt;
        if (wasSlack && s.lift >= slackPoint && s.liftV > 200) {
          // the strap snaps taut — the card rocks forward on the catch
          s.tiltXV -= s.liftV * 0.05;
        }
        if (s.lift > P.strap.maxStretch) {
          s.lift = P.strap.maxStretch;
          s.liftV = Math.min(0, s.liftV);
        }
      } else {
        swingAccel = 0;
      }

      const hangTarget = -P.hang.counterRotate * s.angle - (drag.active ? s.angleV * 0.05 : 0);
      s.hangV += (-P.hang.stiffness * (s.hang - hangTarget) - P.hang.damping * s.hangV - P.hang.lag * swingAccel) * dt;
      s.hang += s.hangV * dt;

      s.flipV += (-P.flip.stiffness * (s.flip - s.flipTarget) - P.flip.damping * s.flipV) * dt;
      s.flip += s.flipV * dt;

      // Air resistance: moving sideways turns the card, moving vertically rocks it
      const airY = s.angleV * 0.12;
      const airX = -s.liftV * P.tilt.velocityFactor;
      const ty = clamp(-P.tilt.max, P.tilt.max, hoverTarget.y + airY);
      const tx = clamp(-P.tilt.max, P.tilt.max, hoverTarget.x + airX);
      s.tiltYV += (P.tilt.stiffness * (ty - s.tiltY) - P.tilt.damping * s.tiltYV) * dt;
      s.tiltY += s.tiltYV * dt;
      s.tiltXV += (P.tilt.stiffness * (tx - s.tiltX) - P.tilt.damping * s.tiltXV) * dt;
      s.tiltX += s.tiltXV * dt;
    };

    const atRest = () => {
      if (drag.active) return false;
      const e = P.restEpsilon;
      return (
        Math.abs(s.angle) < e && Math.abs(s.angleV) < e * 10 &&
        Math.abs(s.lift) < e && Math.abs(s.liftV) < e * 10 &&
        Math.abs(s.hang) < e && Math.abs(s.hangV) < e * 10 &&
        Math.abs(s.flip - s.flipTarget) < e && Math.abs(s.flipV) < e * 10 &&
        Math.abs(s.tiltX - hoverTarget.x) < e && Math.abs(s.tiltXV) < e * 10 &&
        Math.abs(s.tiltY - hoverTarget.y) < e && Math.abs(s.tiltYV) < e * 10
      );
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - lastFrame) / 1000);
      lastFrame = now;
      const n = Math.max(1, Math.ceil(dt / P.maxStep));
      for (let i = 0; i < n; i++) step(dt / n);
      render();
      if (atRest()) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(loop);
    };

    const wake = () => {
      if (!live || reduced) return;
      if (!raf) {
        lastFrame = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };

    // ------------------------------------------------------------ entrance
    let entranceTl: gsap.core.Timeline | null = null;
    let cancelReady = () => {};

    const goLive = () => {
      live = true;
      card.setAttribute("aria-label", FRONT_LABEL);
    };

    if (reduced) {
      gsap.set(rig, { y: 0 });
      s.flip = 0;
      gsap.set(rig, { visibility: "visible" });
      goLive();
      render();
    } else {
      const startY = -Math.max(OFFSCREEN_START.minY, window.innerHeight + OFFSCREEN_START.viewportPad);
      gsap.set(rig, { y: startY });
      gsap.set(card, { rotation: 0, rotateX: 0, rotateY: 180, y: 0 });
      // CSS keeps the rig hidden until its off-screen start position is in place
      gsap.set(rig, { visibility: "visible" });

      cancelReady = onPortfolioReady(() => {
        entranceTl = gsap.timeline({ delay: ENTRANCE.delay });
        entranceTl.to(rig, { y: 0, duration: ENTRANCE.fall.duration, ease: ENTRANCE.fall.ease });
        entranceTl.to(
          card,
          {
            rotateY: ENTRANCE.fallFlipTo,
            rotation: ENTRANCE.fallTilt,
            duration: ENTRANCE.fall.duration,
            ease: "power1.in",
          },
          0
        );
        entranceTl.add(() => {
          // The strap catches the card: hand everything to the simulation.
          s.flip = ENTRANCE.fallFlipTo;
          s.flipV = ENTRANCE.catchVelocity.flip;
          s.hang = ENTRANCE.fallTilt;
          s.liftV = ENTRANCE.catchVelocity.strap;
          s.angleV = ENTRANCE.catchVelocity.swing;
          goLive();
          window.dispatchEvent(new CustomEvent("badge:impact"));
          wake();
        });
      });
    }

    // --------------------------------------------------------- flip / keys
    const flipCard = () => {
      s.flipTarget = s.flipTarget === 0 ? 180 : 0;
      card.setAttribute("aria-label", s.flipTarget === 0 ? FRONT_LABEL : BACK_LABEL);
      if (s.flipTarget !== 0) resetGaze();
      if (reduced) {
        s.flip = s.flipTarget;
        render();
      } else {
        wake();
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (!live) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        flipCard();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        if (reduced) return;
        e.preventDefault();
        // CSS rotation is clockwise-positive, which swings the hanging card left
        s.angleV += e.key === "ArrowLeft" ? P.keyNudge : -P.keyNudge;
        wake();
      }
    };

    // ---------------------------------------------------------------- drag
    const onPointerDown = (e: PointerEvent) => {
      if (!live) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      drag.active = true;
      drag.id = e.pointerId;
      drag.startX = e.clientX;
      drag.startY = e.clientY;
      drag.startAngle = s.angle;
      drag.startLift = s.lift;
      drag.startTime = drag.lastTime = e.timeStamp;
      drag.moved = 0;
      drag.samples = [{ t: e.timeStamp, x: e.clientX, y: e.clientY }];
      if (!reduced) {
        s.liftV = 0;
        s.angleV = 0;
      }
      try {
        card.setPointerCapture(e.pointerId);
      } catch {}
      stage.classList.add("is-grabbing");
      wake();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!drag.active || e.pointerId !== drag.id) return;
      const sdx = e.clientX - drag.startX;
      const sdy = e.clientY - drag.startY;
      drag.moved = Math.max(drag.moved, Math.hypot(sdx, sdy));
      if (reduced) return;

      const dx = sdx / scale;
      const dy = sdy / scale;
      const L = P.pendulumLength;
      // Card's horizontal offset is -L·sin(angle): positive CSS rotation swings it left
      const offset = -L * Math.sin(drag.startAngle / DEG) + dx;
      const rawAngle = -Math.asin(clamp(-0.95, 0.95, offset / L)) * DEG;
      const nextAngle = soft(rawAngle, P.swing.maxAngle);
      // Lifting is free (slack strap); pulling down fights a taut strap.
      const rawLift = drag.startLift + dy;
      const nextLift = rawLift < 0 ? -soft(-rawLift, P.strap.maxLift) : soft(rawLift * 0.18, P.strap.maxStretch);

      const dt = Math.max(1 / 240, (e.timeStamp - drag.lastTime) / 1000);
      drag.lastTime = e.timeStamp;
      s.angleV += ((nextAngle - s.angle) / dt - s.angleV) * 0.4;
      s.liftV += ((nextLift - s.lift) / dt - s.liftV) * 0.4;
      s.angle = nextAngle;
      s.lift = nextLift;

      drag.samples.push({ t: e.timeStamp, x: e.clientX, y: e.clientY });
      while (drag.samples.length > 2 && e.timeStamp - drag.samples[0].t > 100) drag.samples.shift();
      wake();
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!drag.active || e.pointerId !== drag.id) return;
      drag.active = false;
      stage.classList.remove("is-grabbing");
      try {
        card.releasePointerCapture(e.pointerId);
      } catch {}

      const isTap =
        e.type === "pointerup" &&
        drag.moved < P.tapSlop &&
        (e.timeStamp - drag.startTime) / 1000 < P.tapMaxDuration;
      if (isTap) {
        if (!reduced) {
          s.angleV = 0;
          s.liftV = 0;
        }
        flipCard();
        return;
      }
      if (reduced) return;

      if (e.type === "pointercancel") {
        // The browser took the gesture over for scrolling — just let go.
        s.angleV = 0;
        s.liftV = 0;
      } else {
        const first = drag.samples[0];
        const span = (e.timeStamp - first.t) / 1000;
        if (span > 0.008) {
          const vx = (e.clientX - first.x) / scale / span;
          const vy = (e.clientY - first.y) / scale / span;
          const cos = Math.max(0.3, Math.cos(s.angle / DEG));
          s.angleV = clamp(-P.swing.maxVelocity, P.swing.maxVelocity, (-vx / (P.pendulumLength * cos)) * DEG);
          s.liftV = s.lift < 0 ? clamp(-P.strap.maxThrow, P.strap.maxThrow, vy) : 0;
        } else {
          s.angleV = 0;
          s.liftV = 0;
        }
      }
      wake();
    };

    card.addEventListener("pointerdown", onPointerDown);
    card.addEventListener("pointermove", onPointerMove);
    card.addEventListener("pointerup", onPointerUp);
    card.addEventListener("pointercancel", onPointerUp);
    card.addEventListener("keydown", onKeyDown);

    // ----------------------------------------------------- hover + gaze
    if (profileImg) gsap.set(profileImg, { transformOrigin: "50% 40%" });

    function resetGaze() {
      if (profileImg) {
        gsap.to(profileImg, {
          x: 0,
          y: 0,
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          duration: GAZE.returnDuration,
          ease: "power3.out",
          overwrite: true,
        });
      }
      if (profileGlare) gsap.to(profileGlare, { opacity: 0, duration: 0.6, overwrite: true });
    }

    const onWindowPointerMove = (e: PointerEvent) => {
      if (!finePointer || reduced || !live || drag.active || !inView || e.pointerType !== "mouse") return;
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const nx = (e.clientX - cx) / (rect.width / 2);
      const ny = (e.clientY - cy) / (rect.height / 2);
      const dist = Math.hypot(nx, ny * 0.7);
      const falloff = dist <= 1 ? 1 : clamp(0, 1, 1 - (dist - 1) / (P.tilt.hoverRange - 1));
      hoverTarget.y = clamp(-1.25, 1.25, nx) * P.tilt.hoverY * falloff;
      hoverTarget.x = -clamp(-1.25, 1.25, ny) * P.tilt.hoverX * falloff;
      wake();

      // Profile photo "looks" toward the cursor anywhere on screen (front side only)
      if (profileImg && s.flipTarget === 0) {
        const dx = e.clientX - cx;
        const dy = e.clientY - (rect.top + rect.height * 0.38);
        const maxDist = Math.max(window.innerWidth, window.innerHeight) * GAZE.maxDistanceFactor;
        const intensity = Math.min(GAZE.maxIntensity, Math.hypot(dx, dy) / maxDist);
        const angle = Math.atan2(dy, dx);
        gsap.to(profileImg, {
          x: Math.cos(angle) * intensity * GAZE.shiftX,
          y: Math.sin(angle) * intensity * GAZE.shiftY,
          rotateY: Math.cos(angle) * intensity * GAZE.rotateY,
          rotateX: -Math.sin(angle) * intensity * GAZE.rotateX,
          scale: GAZE.hoverScale,
          duration: GAZE.duration,
          ease: "power2.out",
          overwrite: "auto",
        });
        if (profileGlare) {
          const lx = 50 + Math.cos(angle) * intensity * GAZE.glareSpread;
          const ly = 50 + Math.sin(angle) * intensity * GAZE.glareSpread;
          gsap.set(profileGlare, {
            background: `radial-gradient(circle at ${lx}% ${ly}%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 40%, transparent 75%)`,
            opacity: 0.85,
          });
        }
      }
    };

    const onDocumentLeave = () => {
      hoverTarget.x = 0;
      hoverTarget.y = 0;
      resetGaze();
      wake();
    };

    window.addEventListener("pointermove", onWindowPointerMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onDocumentLeave);

    // ------------------------------------------------- scroll + visibility
    let lastScrollY = window.scrollY;
    const onScroll = () => {
      const dy = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      if (!live || reduced || drag.active || !inView || Math.abs(dy) > 400) return;
      // The ceiling moves with the page; the card's inertia makes it bob slightly.
      s.liftV = clamp(-600, 600, s.liftV + dy * P.scrollJostle * 27);
      s.tiltXV += dy * 0.8;
      wake();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (!inView) {
          hoverTarget.x = 0;
          hoverTarget.y = 0;
        }
      },
      { threshold: 0 }
    );
    io.observe(stage);

    return () => {
      cancelReady();
      entranceTl?.kill();
      cancelAnimationFrame(raf);
      io.disconnect();
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onWindowPointerMove);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("mouseleave", onDocumentLeave);
      card.removeEventListener("pointerdown", onPointerDown);
      card.removeEventListener("pointermove", onPointerMove);
      card.removeEventListener("pointerup", onPointerUp);
      card.removeEventListener("pointercancel", onPointerUp);
      card.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
