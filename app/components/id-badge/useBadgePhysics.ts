import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import {
  DIMENSIONS,
  FALL,
  FIT,
  FLIP,
  IMPACT,
  MASTER_SWING,
  OFFSCREEN_START,
  PIVOTS,
  TOTAL_RIG_HEIGHT,
} from "./constants";

export type BadgeRefs = {
  stageRef: RefObject<HTMLDivElement | null>;
  rigRef: RefObject<HTMLDivElement | null>;
  strapRef: RefObject<HTMLDivElement | null>;
  cardRef: RefObject<HTMLDivElement | null>;
  glareRef?: RefObject<HTMLDivElement | null>;
  profileFrameRef?: RefObject<HTMLDivElement | null>;
  profileImgRef?: RefObject<HTMLImageElement | null>;
  profileGlareRef?: RefObject<HTMLDivElement | null>;
};

/**
 * Drives the ID badge's physical entrance simulation: entrance drop, in-flight
 * flip, and compound pendulum settling into rest state.
 */
export function useBadgePhysics(refs: BadgeRefs) {
  useEffect(() => {
    const stage = refs.stageRef.current;
    const rig = refs.rigRef.current;
    const strap = refs.strapRef.current;
    const card = refs.cardRef.current;
    if (!stage || !rig || !strap || !card) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let resizeTimer: ReturnType<typeof setTimeout>;
    let mainTl: gsap.core.Timeline | null = null;

    // Responsive scaling and positioning
    const fitRig = () => {
      const width = window.innerWidth;
      const isMobile = width <= FIT.mobileMaxWidth;
      const topOffset = isMobile ? FIT.topOffsetMobile : FIT.topOffsetDesktop;
      const availableHeight = Math.max(FIT.minAvailableHeight, window.innerHeight - FIT.viewportHeightReserve);
      const scaleByHeight = Math.min(
        FIT.fullScale,
        (availableHeight + FIT.availableHeightBonus) / (DIMENSIONS.cardNaturalHeight + FIT.cardHeightPad)
      );
      const breakpoint = FIT.widthBreakpoints.find((b) => width < b.maxWidth);
      const scaleByWidth = breakpoint ? breakpoint.scale : FIT.fullScale;
      const scale = isMobile
        ? Math.max(FIT.mobileMinScale, Math.min(scaleByWidth, FIT.mobileMaxScale))
        : Math.max(FIT.desktopMinScale, Math.min(scaleByHeight, scaleByWidth));

      gsap.set(rig, { scale, top: -topOffset, transformOrigin: PIVOTS.rig });
      stage.style.height = `${Math.max(
        FIT.minStageHeight,
        (TOTAL_RIG_HEIGHT - topOffset) * scale + FIT.stageHeightPad
      )}px`;
    };

    fitRig();

    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(fitRig, 80);
    };
    window.addEventListener("resize", onResize);

    if (reduced) {
      gsap.set(rig, { xPercent: -50, x: 0, y: 0, rotation: 0 });
      gsap.set(card, { rotation: 0, rotateX: 0, rotateY: 0, y: 0, x: 0 });
      gsap.set(strap, { scaleY: 1 });
      return;
    }

    // =========================================================================
    // INITIAL OFFSCREEN STATE WITH BACK-FACING BADGE (rotateY: 180)
    // =========================================================================
    const startY = -Math.max(OFFSCREEN_START.minY, window.innerHeight + OFFSCREEN_START.viewportPad);
    gsap.set(rig, {
      xPercent: -50,
      x: 0,
      y: startY,
      rotation: 0,
      transformOrigin: PIVOTS.rig,
    });
    gsap.set(strap, {
      scaleY: 1,
      transformOrigin: PIVOTS.rig,
    });
    gsap.set(card, {
      rotation: 0,
      rotateX: 0,
      rotateY: 180, // Starts facing the BACK side
      y: 0,
      x: 0,
      transformOrigin: PIVOTS.card,
    });

    // =========================================================================
    // MASTER ENTRANCE ANIMATION (Fall -> Reveal Back -> Flip to Front -> Settle)
    // =========================================================================
    const runMasterAnimation = () => {
      mainTl?.kill();
      mainTl = gsap.timeline({
        delay: 0.1,
      });

      // 1. FREE FALL UNDER GRAVITY
      mainTl.to(rig, { y: 0, duration: FALL.rig.duration, ease: FALL.rig.ease });

      // During fall: Card tilts and begins rotating
      mainTl.to(card, { rotation: FALL.cardTilt.rotation, duration: FALL.cardTilt.duration, ease: FALL.cardTilt.ease }, 0);

      // 2. NATURAL IN-FLIGHT ROTATIONAL FLIP (Back -> Front)
      mainTl.to(
        card,
        { rotateY: FLIP.overshoot.rotateY, duration: FLIP.overshoot.duration, ease: FLIP.overshoot.ease },
        FLIP.overshoot.at
      );
      mainTl.to(
        card,
        { rotateY: FLIP.reboundA.rotateY, duration: FLIP.reboundA.duration, ease: FLIP.reboundA.ease },
        FLIP.reboundA.at
      );
      mainTl.to(
        card,
        { rotateY: FLIP.reboundB.rotateY, duration: FLIP.reboundB.duration, ease: FLIP.reboundB.ease },
        FLIP.reboundB.at
      );
      mainTl.to(
        card,
        { rotateY: FLIP.settle.rotateY, duration: FLIP.settle.duration, ease: FLIP.settle.ease },
        FLIP.settle.at
      );

      // 3. IMPACT & TENSION CATCH
      const catchTime = IMPACT.catchTime;
      mainTl.to(strap, IMPACT.strapStretch[0], catchTime);
      for (let i = 1; i < IMPACT.strapStretch.length; i++) {
        mainTl.to(strap, IMPACT.strapStretch[i]);
      }

      // Card kinetic vertical shock
      mainTl.to(card, IMPACT.cardKick.down, catchTime);
      mainTl.to(card, IMPACT.cardKick.up);

      // 4. COMPOUND DOUBLE-PENDULUM OSCILLATION
      const swingStart = catchTime + 0.02;

      // Rig / Long Lanyard Compound Swing
      mainTl.to(rig, { ...MASTER_SWING.rig[0], transformOrigin: PIVOTS.rig }, swingStart);
      for (let i = 1; i < MASTER_SWING.rig.length; i++) {
        mainTl.to(rig, MASTER_SWING.rig[i]);
      }

      // Card Hook Lag Secondary Pendulum
      mainTl.to(card, { ...MASTER_SWING.card[0], transformOrigin: PIVOTS.card }, swingStart);
      for (let i = 1; i < MASTER_SWING.card.length; i++) {
        mainTl.to(card, MASTER_SWING.card[i]);
      }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

