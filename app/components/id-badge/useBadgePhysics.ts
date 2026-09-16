import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import {
  DIMENSIONS,
  DRAG,
  ELASTIC_SETTLE,
  FALL,
  FIT,
  FLIP,
  GAZE,
  IMPACT,
  MASTER_SWING,
  DROP_RETURN,
  OFFSCREEN_START,
  PIVOTS,
  TILT,
  TOTAL_RIG_HEIGHT,
} from "./constants";

export type BadgeRefs = {
  stageRef: RefObject<HTMLDivElement | null>;
  rigRef: RefObject<HTMLDivElement | null>;
  strapRef: RefObject<HTMLDivElement | null>;
  cardRef: RefObject<HTMLDivElement | null>;
  glareRef: RefObject<HTMLDivElement | null>;
  profileFrameRef: RefObject<HTMLDivElement | null>;
  profileImgRef: RefObject<HTMLImageElement | null>;
  profileGlareRef: RefObject<HTMLDivElement | null>;
};

const clamp = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value));

/**
 * Drives the ID badge's entire physical simulation: entrance drop, compound
 * pendulum settle, cursor tilt + gaze tracking, and drag-to-swing/drop.
 * All tunable numbers live in ./constants — this file is the sequencing logic only.
 */
export function useBadgePhysics(refs: BadgeRefs) {
  const isInteractiveRef = useRef(false);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const currentDisplacementRef = useRef({ x: 0, y: 0, rotZ: 0, rotY: 0, rotX: 0, rigRot: 0, rigX: 0 });

  useEffect(() => {
    const stage = refs.stageRef.current;
    const rig = refs.rigRef.current;
    const strap = refs.strapRef.current;
    const card = refs.cardRef.current;
    const glare = refs.glareRef.current;
    const profileImg = refs.profileImgRef.current;
    const profileFrame = refs.profileFrameRef.current;
    const profileGlare = refs.profileGlareRef.current;
    if (!stage || !rig || !strap || !card) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isPointerFine = window.matchMedia("(pointer: fine)").matches;

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
      isInteractiveRef.current = true;
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
        onComplete: () => {
          isInteractiveRef.current = true;
        },
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

    // =========================================================================
    // REUSABLE REST-STATE RETURN PHYSICS
    // =========================================================================
    const playDropFromElevation = (elevatedY: number, startX: number, startRigRot: number) => {
      mainTl?.kill();
      const dropDuration = DROP_RETURN.durationFromElevation(elevatedY);

      mainTl = gsap.timeline({
        onComplete: () => {
          isInteractiveRef.current = true;
        },
      });

      // Gravity acceleration downward
      mainTl.to(card, { y: 0, x: 0, duration: dropDuration, ease: "power2.in" });
      mainTl.to(rig, { x: 0, duration: dropDuration, ease: "power2.in" }, 0);

      // Impact catch
      const [strap1, strap2, strap3] = DROP_RETURN.strapStretch;
      mainTl.to(strap, strap1);
      mainTl.to(strap, strap2);
      mainTl.to(strap, strap3);

      const strapTotal = strap1.duration + strap2.duration + strap3.duration;
      mainTl.to(card, DROP_RETURN.cardKick.down, `-=${strapTotal}`);
      mainTl.to(card, DROP_RETURN.cardKick.up);

      // Harmonic compound swing after drop
      const swingMult = DROP_RETURN.swingMultiplier(startX, elevatedY);
      const initialRig = startRigRot || (startX > 0 ? 8 : -8) * swingMult;

      const [rig1, rig2, rig3, rig4] = DROP_RETURN.rigSwing;
      mainTl.to(
        rig,
        { rotation: initialRig * rig1.factor, duration: rig1.duration, ease: rig1.ease },
        `-=${DROP_RETURN.rigOverlapWithDrop}`
      );
      mainTl.to(rig, { rotation: initialRig * rig2.factor, duration: rig2.duration, ease: rig2.ease });
      mainTl.to(rig, { rotation: initialRig * rig3.factor, duration: rig3.duration, ease: rig3.ease });
      mainTl.to(rig, { rotation: initialRig * rig4.factor, duration: rig4.duration, ease: rig4.ease });

      const [card1, card2, card3, card4] = DROP_RETURN.cardSwing;
      mainTl.to(
        card,
        {
          rotation: initialRig * card1.factor,
          rotateX: 0,
          rotateY: 0,
          duration: card1.duration,
          ease: card1.ease,
        },
        `-=${rig1.duration + rig2.duration}`
      );
      mainTl.to(card, { rotation: initialRig * card2.factor, duration: card2.duration, ease: card2.ease });
      mainTl.to(card, { rotation: initialRig * card3.factor, duration: card3.duration, ease: card3.ease });
      mainTl.to(card, { rotation: initialRig * card4.factor, duration: card4.duration, ease: card4.ease });
    };

    const playElasticSettle = (startX: number, startY: number, currentRigRot: number, currentCardRot: number) => {
      mainTl?.kill();

      gsap.to(card, {
        x: 0,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        rotation: 0,
        duration: ELASTIC_SETTLE.card.duration,
        ease: ELASTIC_SETTLE.card.ease,
        overwrite: "auto",
      });

      gsap.to(rig, {
        x: 0,
        rotation: 0,
        duration: ELASTIC_SETTLE.rig.duration,
        ease: ELASTIC_SETTLE.rig.ease,
        overwrite: "auto",
      });

      if (glare) {
        gsap.to(glare, {
          opacity: 0,
          duration: ELASTIC_SETTLE.glareFadeDuration,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    };

    // =========================================================================
    // WINDOW-LEVEL INTERACTIVE GAZE / EYE-TRACKING ON PROFILE PHOTO
    // =========================================================================
    const handleWindowPointerMove = (e: PointerEvent) => {
      if (!isInteractiveRef.current || isDraggingRef.current || !isPointerFine || reduced) return;

      // 1. PROFILE PHOTO GAZE TRACKING (Eyes & Head track cursor location across the whole screen)
      if (profileFrame && profileImg) {
        const frameRect = profileFrame.getBoundingClientRect();
        const photoCenterX = frameRect.left + frameRect.width / 2;
        const photoCenterY = frameRect.top + frameRect.height / 2;

        const dx = e.clientX - photoCenterX;
        const dy = e.clientY - photoCenterY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = Math.max(window.innerWidth, window.innerHeight) * GAZE.maxDistanceFactor;
        const intensity = Math.min(GAZE.maxIntensity, dist / maxDist);
        const angle = Math.atan2(dy, dx);

        // Responsive gaze shift and 3D head rotation toward cursor
        const imgShiftX = Math.cos(angle) * intensity * GAZE.shiftX;
        const imgShiftY = Math.sin(angle) * intensity * GAZE.shiftY;
        const imgRotY = Math.cos(angle) * intensity * GAZE.rotateY;
        const imgRotX = -Math.sin(angle) * intensity * GAZE.rotateX;

        gsap.to(profileImg, {
          x: imgShiftX,
          y: imgShiftY,
          rotateY: imgRotY,
          rotateX: imgRotX,
          scale: GAZE.hoverScale,
          duration: GAZE.duration,
          ease: "power2.out",
          overwrite: "auto",
          transformOrigin: "50% 40%",
        });

        if (profileGlare) {
          const lensX = 50 + Math.cos(angle) * intensity * GAZE.glareSpread;
          const lensY = 50 + Math.sin(angle) * intensity * GAZE.glareSpread;
          profileGlare.style.background = `radial-gradient(circle at ${lensX}% ${lensY}%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 40%, transparent 75%)`;
          gsap.to(profileGlare, {
            opacity: 0.85,
            duration: GAZE.glareDuration,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      }

      // 2. BADGE 3D TILT & SWAY
      const cardRect = card.getBoundingClientRect();
      const cardCenterX = cardRect.left + cardRect.width / 2;
      const cardCenterY = cardRect.top + cardRect.height / 2;

      const nx = clamp(-TILT.clamp, TILT.clamp, (e.clientX - cardCenterX) / (cardRect.width / 2));
      const ny = clamp(-TILT.clamp, TILT.clamp, (e.clientY - cardCenterY) / (cardRect.height / 2));

      const rotateY = nx * TILT.rotateY;
      const rotateX = -ny * TILT.rotateX;
      const shiftX = nx * TILT.shiftX;
      const shiftY = ny * TILT.shiftY;
      const cardRollZ = nx * TILT.rollZ;

      const rigRotation = nx * TILT.rigRotation;
      const rigShiftX = nx * TILT.rigShiftX;

      gsap.to(card, {
        rotateX,
        rotateY,
        rotation: cardRollZ,
        x: shiftX,
        y: shiftY,
        duration: TILT.cardDuration,
        ease: "power2.out",
        overwrite: "auto",
        transformOrigin: PIVOTS.card,
      });

      gsap.to(rig, {
        rotation: rigRotation,
        x: rigShiftX,
        duration: TILT.rigDuration,
        ease: "power2.out",
        overwrite: "auto",
        transformOrigin: PIVOTS.rig,
      });

      if (glare) {
        const glareX = (nx * 0.5 + 0.5) * 100;
        const glareY = (ny * 0.5 + 0.5) * 100;
        glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.06) 45%, transparent 72%)`;
        gsap.to(glare, {
          opacity: 1,
          duration: TILT.glareDuration,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    };

    const handleWindowPointerLeave = () => {
      if (!isInteractiveRef.current || isDraggingRef.current || !isPointerFine || reduced) return;
      playElasticSettle(0, 0, 0, 0);

      // Return profile photo gaze to neutral center
      if (profileImg) {
        gsap.to(profileImg, {
          x: 0,
          y: 0,
          rotateX: 0,
          rotateY: 0,
          scale: 1.0,
          duration: GAZE.returnDuration,
          ease: "power3.out",
          overwrite: "auto",
        });
      }
      if (profileGlare) {
        gsap.to(profileGlare, {
          opacity: 0,
          duration: GAZE.leaveGlareFadeDuration,
          ease: "power3.out",
          overwrite: "auto",
        });
      }
    };

    // =========================================================================
    // MOBILE TOUCH / DRAG PULL & GRAVITY RELEASE INTERACTION
    // =========================================================================
    const handleCardPointerDown = (e: PointerEvent) => {
      if (!isInteractiveRef.current || reduced) return;

      isDraggingRef.current = true;
      dragStartRef.current = { x: e.clientX, y: e.clientY };
      mainTl?.kill();
      gsap.killTweensOf(card);
      gsap.killTweensOf(rig);

      try {
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      } catch {}
    };

    const handleCardPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current || reduced) return;

      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;

      // Elastic resistance as drag increases
      const cardX = dx * DRAG.resistance;
      const cardY = dy * DRAG.resistance;
      const cardRotZ = dx * DRAG.rollZFactor;
      const cardRotY = clamp(-DRAG.rotateYClamp, DRAG.rotateYClamp, dx * DRAG.rotateYFactor);
      const cardRotX = clamp(-DRAG.rotateXClamp, DRAG.rotateXClamp, -dy * DRAG.rotateXFactor);
      const rigRot = dx * DRAG.rigRotationFactor;
      const rigX = dx * DRAG.rigShiftFactor;

      currentDisplacementRef.current = {
        x: cardX,
        y: cardY,
        rotZ: cardRotZ,
        rotY: cardRotY,
        rotX: cardRotX,
        rigRot,
        rigX,
      };

      gsap.set(card, {
        x: cardX,
        y: cardY,
        rotation: cardRotZ,
        rotateY: cardRotY,
        rotateX: cardRotX,
        transformOrigin: PIVOTS.card,
      });

      gsap.set(rig, {
        rotation: rigRot,
        x: rigX,
        transformOrigin: PIVOTS.rig,
      });

      if (profileImg) {
        gsap.set(profileImg, {
          x: clamp(-DRAG.profileShiftClampX, DRAG.profileShiftClampX, dx * DRAG.profileShiftFactor),
          y: clamp(-DRAG.profileShiftClampY, DRAG.profileShiftClampY, dy * DRAG.profileShiftFactor),
          rotateY: clamp(-DRAG.profileRotateYClamp, DRAG.profileRotateYClamp, dx * DRAG.profileRotateYFactor),
          scale: DRAG.profileDragScale,
        });
      }

      if (glare) {
        glare.style.opacity = "0.8";
      }
    };

    const handleCardPointerUp = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;

      try {
        (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
      } catch {}

      const { x, y, rigRot, rotZ } = currentDisplacementRef.current;

      if (profileImg) {
        gsap.to(profileImg, {
          x: 0,
          y: 0,
          rotateX: 0,
          rotateY: 0,
          scale: 1.0,
          duration: DRAG.releaseSettleDuration,
          ease: "elastic.out(1, 0.42)",
        });
      }

      // If dragged upward significantly, drop it from above under gravity!
      if (y < DRAG.dropReleaseThresholdY) {
        playDropFromElevation(y, x, rigRot);
      } else {
        playElasticSettle(x, y, rigRot, rotZ);
      }
    };

    window.addEventListener("pointermove", handleWindowPointerMove);
    window.addEventListener("pointerleave", handleWindowPointerLeave);

    const cardEl = card;
    cardEl.addEventListener("pointerdown", handleCardPointerDown as EventListener);
    cardEl.addEventListener("pointermove", handleCardPointerMove as EventListener);
    cardEl.addEventListener("pointerup", handleCardPointerUp as EventListener);
    cardEl.addEventListener("pointercancel", handleCardPointerUp as EventListener);

    return () => {
      if (onReadyHandler) window.removeEventListener("portfolio:ready", onReadyHandler);
      if (failsafeTimer) clearTimeout(failsafeTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", handleWindowPointerMove);
      window.removeEventListener("pointerleave", handleWindowPointerLeave);
      cardEl.removeEventListener("pointerdown", handleCardPointerDown as EventListener);
      cardEl.removeEventListener("pointermove", handleCardPointerMove as EventListener);
      cardEl.removeEventListener("pointerup", handleCardPointerUp as EventListener);
      cardEl.removeEventListener("pointercancel", handleCardPointerUp as EventListener);
      clearTimeout(resizeTimer);
      mainTl?.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
