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
  const hardwareRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const profileFrameRef = useRef<HTMLDivElement>(null);
  const profileImgRef = useRef<HTMLImageElement>(null);
  const profileGlareRef = useRef<HTMLDivElement>(null);

  useBadgePhysics({
    stageRef,
    rigRef,
    strapRef,
    hardwareRef,
    cardRef,
    glareRef,
    profileFrameRef,
    profileImgRef,
    profileGlareRef,
  });

  return (
    <div className="badge-wrap">
      <div ref={stageRef} className="badge-stage">
        {/* Physics rig, pivoting at the ceiling (50% 0%) */}
        <div ref={rigRef} className="badge-rig">
          <LanyardStrap ref={strapRef} />
          <div ref={hardwareRef} style={{ position: "relative", zIndex: 3 }}>
            <LanyardHardware />
          </div>

          {/* Double-sided PVC ID card */}
          <div
            ref={cardRef}
            className="badge-card"
            role="button"
            tabIndex={0}
            aria-label="ID card, front. Drag to swing it, or press to turn it over."
          >
            <div ref={glareRef} className="badge-glare" aria-hidden="true" />
            <BadgeCardFront
              profileFrameRef={profileFrameRef}
              profileImgRef={profileImgRef}
              profileGlareRef={profileGlareRef}
            />
            <BadgeCardBack />
          </div>
        </div>
      </div>
      <p className="badge-hint" aria-hidden="true">
        <span className="badge-hint-fine">Drag to swing, click to flip</span>
        <span className="badge-hint-touch">Swipe sideways to swing, tap to flip</span>
      </p>
    </div>
  );
}
