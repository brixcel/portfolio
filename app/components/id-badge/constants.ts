// All tuning numbers for the ID badge's physical simulation live here so the
// swing/drop/gaze feel can be retuned without hunting through the timeline
// construction logic in useBadgePhysics.ts.

export const DIMENSIONS = {
  strapHeight: 1200,
  cardNaturalHeight: 410,
  hardwareHeight: 44,
} as const;

export const TOTAL_RIG_HEIGHT =
  DIMENSIONS.strapHeight + DIMENSIONS.hardwareHeight + DIMENSIONS.cardNaturalHeight; // 1654px

// Shared transform-origin pivots (the rig hangs from the ceiling; the card hangs from the hook)
export const PIVOTS = {
  rig: "50% 0%",
  card: "50% 8px",
} as const;

// How far above the viewport the rig starts before its entrance fall
export const OFFSCREEN_START = {
  minY: 1600,
  viewportPad: 800,
} as const;

// Responsive scaling/positioning for the whole rig (see fitRig in useBadgePhysics.ts)
export const FIT = {
  mobileMaxWidth: 900,
  topOffsetMobile: 840,
  topOffsetDesktop: 920,
  // Vertical breathing room subtracted from viewport height when sizing the stage
  viewportHeightReserve: 74 + 80,
  minAvailableHeight: 300,
  // NOTE: these two pads are deliberately different values, tuned separately
  availableHeightBonus: 200,
  cardHeightPad: 240,
  // First matching breakpoint (ascending) wins; falls back to fullScale
  widthBreakpoints: [
    { maxWidth: 360, scale: 0.72 },
    { maxWidth: 480, scale: 0.78 },
    { maxWidth: 680, scale: 0.85 },
    { maxWidth: 960, scale: 0.92 },
  ],
  fullScale: 1,
  mobileMinScale: 0.68,
  mobileMaxScale: 0.95,
  desktopMinScale: 0.72,
  minStageHeight: 340,
  stageHeightPad: 10,
} as const;

// Phase 1: free fall under gravity (rig drops from off-screen to rest)
export const FALL = {
  rig: { duration: 0.84, ease: "power2.in" },
  cardTilt: { rotation: 4.2, duration: 0.65, ease: "power1.in" },
} as const;

// Phase 2: in-flight rotational flip, back-facing to front-facing
export const FLIP = {
  overshoot: { rotateY: -16, duration: 0.62, ease: "power2.out", at: 0.42 },
  reboundA: { rotateY: 8, duration: 0.32, ease: "sine.inOut", at: 1.04 },
  reboundB: { rotateY: -3, duration: 0.28, ease: "sine.inOut", at: 1.36 },
  settle: { rotateY: 0, duration: 0.32, ease: "sine.out", at: 1.64 },
} as const;

// Phase 3: impact catch — the lanyard strap stretches, then the card kicks and settles
export const IMPACT = {
  catchTime: 0.84,
  strapStretch: [
    { scaleY: 1.048, duration: 0.08, ease: "power2.out" },
    { scaleY: 0.982, duration: 0.12, ease: "sine.inOut" },
    { scaleY: 1.008, duration: 0.14, ease: "sine.inOut" },
    { scaleY: 1.0, duration: 0.18, ease: "sine.out" },
  ],
  cardKick: {
    down: { y: 9.5, duration: 0.09, ease: "power2.out" },
    up: { y: 0, duration: 0.55, ease: "elastic.out(1.2, 0.4)" },
  },
} as const;

// Phase 4: compound double-pendulum oscillation after the catch — the long
// lanyard (rig) and the short hook lag (card) swing at different rates.
export const MASTER_SWING = {
  rig: [
    { rotation: -11.8, duration: 0.72, ease: "sine.inOut" },
    { rotation: 8.8, duration: 0.78, ease: "sine.inOut" },
    { rotation: -6.0, duration: 0.82, ease: "sine.inOut" },
    { rotation: 3.8, duration: 0.84, ease: "sine.inOut" },
    { rotation: -2.2, duration: 0.86, ease: "sine.inOut" },
    { rotation: 1.1, duration: 0.88, ease: "sine.inOut" },
    { rotation: 0, duration: 0.92, ease: "sine.out" },
  ],
  card: [
    { rotation: 10.8, duration: 0.44, ease: "power2.out" },
    { rotation: -7.8, duration: 0.65, ease: "sine.inOut" },
    { rotation: 5.4, duration: 0.72, ease: "sine.inOut" },
    { rotation: -3.4, duration: 0.76, ease: "sine.inOut" },
    { rotation: 1.8, duration: 0.8, ease: "sine.inOut" },
    { rotation: 0, duration: 0.86, ease: "sine.out" },
  ],
} as const;

// Re-drop from an elevated drag release (thrown upward past the threshold)
export const DROP_RETURN = {
  durationFromElevation: (elevatedY: number) =>
    Math.min(0.65, Math.max(0.32, Math.sqrt(Math.abs(elevatedY) / 500) * 0.45)),
  strapStretch: [
    { scaleY: 1.04, duration: 0.07, ease: "power2.out" },
    { scaleY: 0.985, duration: 0.1, ease: "sine.inOut" },
    { scaleY: 1.0, duration: 0.15, ease: "sine.out" },
  ],
  cardKick: {
    down: { y: 8, duration: 0.08, ease: "power2.out" },
    up: { y: 0, duration: 0.45, ease: "elastic.out(1.2, 0.4)" },
  },
  swingMultiplier: (startX: number, elevatedY: number) =>
    Math.min(1.2, Math.max(0.4, Math.abs(startX) / 40 + Math.abs(elevatedY) / 100)),
  // How far back into the drop/catch tweens the rig swing overlaps
  rigOverlapWithDrop: 0.4,
  rigSwing: [
    { factor: -0.8, duration: 0.65, ease: "sine.inOut" },
    { factor: 0.5, duration: 0.72, ease: "sine.inOut" },
    { factor: -0.25, duration: 0.76, ease: "sine.inOut" },
    { factor: 0, duration: 0.8, ease: "sine.out" },
  ],
  cardSwing: [
    { factor: 0.9, duration: 0.55, ease: "power2.out" },
    { factor: -0.6, duration: 0.68, ease: "sine.inOut" },
    { factor: 0.3, duration: 0.74, ease: "sine.inOut" },
    { factor: 0, duration: 0.78, ease: "sine.out" },
  ],
} as const;

// Release without a big upward throw — elastic snap back to rest
export const ELASTIC_SETTLE = {
  card: { duration: 1.25, ease: "elastic.out(1, 0.42)" },
  rig: { duration: 1.35, ease: "elastic.out(1, 0.42)" },
  glareFadeDuration: 0.55,
} as const;

// Cursor-driven gaze tracking on the profile photo (independent of badge tilt)
export const GAZE = {
  maxDistanceFactor: 0.65,
  maxIntensity: 1.2,
  shiftX: 15,
  shiftY: 13,
  rotateY: 20,
  rotateX: 17,
  hoverScale: 1.15,
  duration: 0.28,
  glareSpread: 35,
  glareDuration: 0.25,
  returnDuration: 0.85,
  leaveGlareFadeDuration: 0.75,
} as const;

// Cursor-driven 3D tilt on the whole badge + subtler sympathetic rig lean
export const TILT = {
  clamp: 1.25,
  rotateY: 12.0,
  rotateX: 9.5,
  shiftX: 14,
  shiftY: 8,
  rollZ: 1.8,
  rigRotation: 2.8,
  rigShiftX: 5.0,
  cardDuration: 0.42,
  rigDuration: 0.58,
  glareDuration: 0.25,
} as const;

// Touch/mouse drag-and-release interaction
export const DRAG = {
  resistance: 0.72,
  rollZFactor: 0.08,
  rotateYFactor: 0.15,
  rotateYClamp: 28,
  rotateXFactor: 0.12,
  rotateXClamp: 22,
  rigRotationFactor: 0.038,
  rigShiftFactor: 0.28,
  profileShiftFactor: 0.08,
  profileShiftClampX: 10,
  profileShiftClampY: 8,
  profileRotateYFactor: 0.1,
  profileRotateYClamp: 12,
  profileDragScale: 1.08,
  dropReleaseThresholdY: -45,
  releaseSettleDuration: 0.9,
} as const;
