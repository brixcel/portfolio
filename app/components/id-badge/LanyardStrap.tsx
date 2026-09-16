import { forwardRef } from "react";
import { DIMENSIONS } from "./constants";

/** The long fabric strap, including its ribbon text and edge stitching. Animated (scaleY "catch" stretch) by useBadgePhysics via the forwarded ref. */
const LanyardStrap = forwardRef<HTMLDivElement>(function LanyardStrap(_props, ref) {
  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        width: 46,
        height: DIMENSIONS.strapHeight,
        margin: "0 auto",
        borderRadius: 3,
        background: "repeating-linear-gradient(0deg, #323b23, #323b23 2px, #3c482a 2px, #3c482a 4px)",
        boxShadow:
          "0 6px 18px rgba(0,0,0,0.26), inset 2.5px 0 3px rgba(255,255,255,0.09), inset -2.5px 0 3px rgba(0,0,0,0.38)",
        transformOrigin: "50% 0%",
        overflow: "hidden",
        borderLeft: "1.5px solid #232918",
        borderRight: "1.5px solid #232918",
      }}
    >
      {/* Edge Stitching Lines */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 3.5,
          width: 1,
          borderLeft: "1px dashed rgba(255, 245, 230, 0.32)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          right: 3.5,
          width: 1,
          borderLeft: "1px dashed rgba(255, 245, 230, 0.32)",
          pointerEvents: "none",
        }}
      />

      {/* Continuous Vector Ribbon Text: Zero-clipping & perfect horizontal centering */}
      <svg
        viewBox={`0 0 46 ${DIMENSIONS.strapHeight}`}
        width="46"
        height={DIMENSIONS.strapHeight}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        <g
          fill="#f3eedd"
          fontFamily="var(--font-body), system-ui, sans-serif"
          fontSize="10.5"
          fontWeight="900"
          letterSpacing="0.26em"
          textAnchor="middle"
          opacity="0.94"
          style={{ filter: "drop-shadow(0px 1px 2px rgba(0,0,0,0.65))" }}
        >
          <text x="23" y="150" transform="rotate(90, 23, 150)">
            COMPUTER ENGINEERING ✦
          </text>
          <text x="23" y="440" transform="rotate(90, 23, 440)">
            COMPUTER ENGINEERING ✦
          </text>
          <text x="23" y="730" transform="rotate(90, 23, 730)">
            COMPUTER ENGINEERING ✦
          </text>
          <text x="23" y="1020" transform="rotate(90, 23, 1020)">
            COMPUTER ENGINEERING ✦
          </text>
        </g>
      </svg>
    </div>
  );
});

export default LanyardStrap;
