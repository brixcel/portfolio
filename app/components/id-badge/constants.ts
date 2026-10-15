// All tuning numbers for the ID badge's physical simulation live here so the
// swing/drop/gaze feel can be retuned without touching useBadgePhysics.ts.
// Distances are in the rig's local (unscaled) pixels; times in seconds.

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
  topOffsetMobile: 1000,
  topOffsetDesktop: 920,
  // Desktop: viewport height minus what the hero needs besides the badge
  // (header, grid padding, hint line, hero foot) — the rig scales to fit the rest.
  viewportHeightReserve: 270,
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

// Entrance: the rig free-falls into frame with the card showing its back, then
// the simulation takes over at the moment the strap catches it — so the bounce,
// swing and the final flip to the front are all real physics, not keyframes.
export const ENTRANCE = {
  delay: 0.1,
  fall: { duration: 0.84, ease: "power2.in" },
  // Card turns from its back (180°) toward the front while falling…
  fallFlipTo: 64,
  fallTilt: 4.2,
  // …and at the catch these velocities seed the simulation.
  catchVelocity: { strap: 620, swing: -52, flip: -240 },
} as const;

export const PHYSICS = {
  // Pivot → card distance used to turn horizontal drags into a swing angle
  pendulumLength: 1250,
  // Whole lanyard swinging from the ceiling (~1.5s period, settles in ~4s)
  swing: { stiffness: 17.5, damping: 1.5, maxAngle: 26, maxVelocity: 240 },
  // Card hanging off the hook: lags the swing and partially counter-rotates
  hang: { stiffness: 46, damping: 4.2, counterRotate: 0.42, lag: 0.55 },
  // Strap: rigid in tension (stiff spring when stretched), slack when lifted
  strap: { stiffness: 1500, damping: 20, gravity: 3200, maxLift: 380, maxStretch: 38, maxThrow: 1100 },
  // Turning the card over (tap / Enter / Space)
  flip: { stiffness: 52, damping: 7.2 },
  // Pointer-proximity tilt and air-resistance tilt while moving
  tilt: {
    stiffness: 140,
    damping: 15,
    hoverY: 12,
    hoverX: 9,
    // Hover influence fades out beyond this many card half-widths
    hoverRange: 2.4,
    velocityFactor: 0.016,
    max: 24,
  },
  // Scrolling moves the ceiling; the card's inertia gives a small vertical bob
  scrollJostle: 0.22,
  // A press that moves less than this (screen px) and is short is a tap
  tapSlop: 7,
  tapMaxDuration: 0.35,
  // Keyboard nudge (deg/s added to the swing)
  keyNudge: 70,
  // Simulation sleeps once everything is this close to rest
  restEpsilon: 0.04,
  maxStep: 1 / 240,
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
  returnDuration: 0.85,
} as const;
