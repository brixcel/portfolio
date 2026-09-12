"use client";

import { useCarousel } from "../hooks/useCarousel";

type Slide = { src: string; alt: string };
type CarouselState = ReturnType<typeof useCarousel>;

export { useCarousel };

export function CarouselTrack({
  slides,
  state,
  style,
}: {
  slides: Slide[];
  state: CarouselState;
  style?: React.CSSProperties;
}) {
  const { index, dragging, pointerHandlers } = state;
  return (
    <div
      style={{
        overflow: "hidden",
        touchAction: "pan-y",
        cursor: dragging ? "grabbing" : "grab",
        ...style,
      }}
      {...pointerHandlers}
    >
      <div
        style={{
          display: "flex",
          transform: `translateX(-${index * 100}%)`,
          transition: "transform .55s cubic-bezier(.22,.61,.36,1)",
        }}
      >
        {slides.map((slide) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            draggable={false}
            style={{ flex: "0 0 100%", width: "100%", display: "block" }}
          />
        ))}
      </div>
    </div>
  );
}

export function CarouselControls({
  slides,
  state,
  accentColor,
  thumbWidth = 62,
}: {
  slides: Slide[];
  state: CarouselState;
  accentColor: string;
  thumbWidth?: number;
}) {
  const { index, go } = state;
  const n = slides.length;
  const pad = (x: number) => String(x).padStart(2, "0");

  return (
    <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 14, marginTop: 18 }}>
      <button
        type="button"
        className="btn btn-secondary"
        aria-label="Previous screenshot"
        onClick={() => go(index - 1)}
        style={{ width: 42, height: 42, padding: 0, borderRadius: 999 }}
      >
        ‹
      </button>
      <button
        type="button"
        className="btn btn-secondary"
        aria-label="Next screenshot"
        onClick={() => go(index + 1)}
        style={{ width: 42, height: 42, padding: 0, borderRadius: 999 }}
      >
        ›
      </button>
      <span
        style={{
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: ".1em",
          color: "color-mix(in srgb, var(--color-text) 60%, transparent)",
        }}
      >
        {pad(index + 1)} / {pad(n)}
      </span>
      <div style={{ display: "flex", gap: 8, marginLeft: "auto", flexWrap: "wrap" }}>
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => go(i)}
            style={{
              width: thumbWidth,
              padding: 0,
              border: `2px solid ${i === index ? accentColor : "transparent"}`,
              borderRadius: 8,
              overflow: "hidden",
              background: "none",
              cursor: "pointer",
              opacity: i === index ? 1 : 0.6,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={slide.src} alt="" style={{ width: "100%", display: "block" }} />
          </button>
        ))}
      </div>
    </div>
  );
}
