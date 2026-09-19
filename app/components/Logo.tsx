"use client";

import type { CSSProperties } from "react";

export type LogoProps = {
  size?: number;
  showText?: boolean;
  className?: string;
  style?: CSSProperties;
};

/**
 * Bespoke Portfolio Logo for Brexcel Joe
 * Combines the portfolio's iconic Desk Lamp motif casting a beam of illumination
 * with a sculpted, bold 'b' monogram and signature glowing amber period.
 */
export default function Logo({
  size = 32,
  showText = false,
  className = "",
  style,
}: LogoProps) {
  return (
    <div
      className={`bjo-logo ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        textDecoration: "none",
        ...style,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, overflow: "visible" }}
      >
        <defs>
          <linearGradient id="lampGlow" x1="28" y1="8" x2="38" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="var(--color-accent, #ea580c)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--color-accent, #ea580c)" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="dotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-accent, #ea580c)" />
            <stop offset="100%" stopColor="var(--color-accent-700, #9a3412)" />
          </linearGradient>
          <filter id="accentGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="1" stdDeviation="2.5" floodColor="var(--color-accent, #ea580c)" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* Dynamic Light Beam emitted from the lamp head */}
        <polygon
          points="27,14 42,34 22,34"
          fill="url(#lampGlow)"
          opacity="0.9"
        />

        {/* Sculpted Bold 'b' Body & Desk Lamp Stem */}
        {/* Lamp Base / Foot */}
        <rect
          x="6"
          y="34"
          width="11"
          height="3.2"
          rx="1.6"
          fill="currentColor"
        />

        {/* Main Vertical Stem (Ascender of the 'b') */}
        <path
          d="M 9.5 34 L 9.5 12 C 9.5 9.5 11.5 7.5 14 7.5 L 20 7.5"
          stroke="currentColor"
          strokeWidth="3.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Articulated Lamp Arm Joint */}
        <circle
          cx="20"
          cy="7.5"
          r="2.2"
          fill="var(--color-accent, #ea580c)"
        />

        {/* Angled Lamp Head / Shade */}
        <path
          d="M 19 6 L 27.5 12.5 L 25 15.8 L 16.5 9.5 Z"
          fill="currentColor"
        />
        {/* Lamp Bulb Rim */}
        <line
          x1="27.5"
          y1="12.5"
          x2="25"
          y2="15.8"
          stroke="var(--color-accent, #ea580c)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* The Bowl of the 'b' (Harmonizing with Caprasimo's plump typography) */}
        <path
          d="M 11.2 21 C 13.5 18 18 16.8 22.5 18.5 C 27.5 20.5 30 25.5 28 30.5 C 26 35 21 36.8 16 35.5 C 13 34.6 11.2 32.8 11.2 32.8"
          stroke="currentColor"
          strokeWidth="3.8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Signature Accent Ember Dot (The illuminated focus) */}
        <circle
          cx="36"
          cy="34"
          r="3.5"
          fill="url(#dotGrad)"
          filter="url(#accentGlow)"
        />
      </svg>

      {showText && (
        <span
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: size * 0.62,
            letterSpacing: "-.02em",
            color: "var(--color-text)",
            lineHeight: 1,
            display: "inline-block",
          }}
        >
          brexcel<span style={{ color: "var(--color-accent)" }}>.</span>
        </span>
      )}
    </div>
  );
}
