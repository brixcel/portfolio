"use client";

import { useRef } from "react";
import LanyardStrap from "./LanyardStrap";
import LanyardHardware from "./LanyardHardware";
import BadgeCardFront from "./BadgeCardFront";
import BadgeCardBack from "./BadgeCardBack";
import { useBadgePhysics } from "./useBadgePhysics";

export default function IdBadge() {
  const stageRef = useRef<HTMLDivElement>(null);
  const rigRef = useRef<HTMLDivElement>(null);
  const strapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const profileFrameRef = useRef<HTMLDivElement>(null);
  const profileImgRef = useRef<HTMLImageElement>(null);
  const profileGlareRef = useRef<HTMLDivElement>(null);

  useBadgePhysics({
    stageRef,
    rigRef,
    strapRef,
    cardRef,
    glareRef,
    profileFrameRef,
    profileImgRef,
    profileGlareRef,
  });

  return (
    <div
      ref={stageRef}
      className="badge-stage"
      style={{
        position: "relative",
        height: 520,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        overflow: "visible", // Allows the long lanyard to extend seamlessly beyond the viewport ceiling
        perspective: 1200,
      }}
    >
      {/* Physics Rig (Pivot anchored at the ceiling: 50% 0%) */}
      <div
        ref={rigRef}
        style={{
          position: "absolute",
          left: "50%",
          top: -920,
          transform: "translateX(-50%)",
          transformOrigin: "50% 0%",
          width: 276,
          willChange: "transform",
          userSelect: "none",
          transformStyle: "preserve-3d",
        }}
      >
        <LanyardStrap ref={strapRef} />
        <LanyardHardware />

        {/* ==================== DOUBLE-SIDED 3D PVC ID BADGE ==================== */}
        <div
          ref={cardRef}
          style={{
            position: "relative",
            width: 276,
            height: 410,
            margin: "-8px auto 0",
            willChange: "transform",
            transformOrigin: "50% 8px",
            transformStyle: "preserve-3d",
            cursor: "grab",
            touchAction: "none",
          }}
        >
          {/* Dynamic Cursor-Following Specular Glare */}
          <div
            ref={glareRef}
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              zIndex: 30,
              opacity: 0,
              borderRadius: 16,
              mixBlendMode: "overlay",
              transition: "opacity 0.25s ease-out",
            }}
          />

          <BadgeCardFront
            profileFrameRef={profileFrameRef}
            profileImgRef={profileImgRef}
            profileGlareRef={profileGlareRef}
          />
          <BadgeCardBack />
        </div>
      </div>
    </div>
  );
}
