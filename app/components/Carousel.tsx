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
          <div key={slide.src} className="project-img-frame" style={{ flex: "0 0 100%", width: "100%" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.src}
              alt={slide.alt}
              draggable={false}
              style={{ width: "100%", display: "block" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CarouselControls({
  slides,
  state,
  accentColor,
  thumbWidth = 60,
  showThumbs = true,
}: {
  slides: Slide[];
  state: CarouselState;
  accentColor: string;
  thumbWidth?: number;
  showThumbs?: boolean;
}) {
  const { index, go } = state;
  const n = slides.length;
  const pad = (x: number) => String(x).padStart(2, "0");

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: showThumbs ? "space-between" : "flex-start",
        gap: 12,
        marginTop: 16,
        width: "100%",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <button
          type="button"
          className="btn btn-secondary"
          aria-label="Previous screenshot"
          onClick={() => go(index - 1)}
          style={{ width: 38, height: 38, padding: 0, borderRadius: 999 }}
        >
          ‹
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          aria-label="Next screenshot"
          onClick={() => go(index + 1)}
          style={{ width: 38, height: 38, padding: 0, borderRadius: 999 }}
        >
          ›
        </button>
        <span
          style={{
            fontSize: 12.5,
            fontWeight: 700,
            letterSpacing: ".08em",
            color: "color-mix(in srgb, var(--color-text) 60%, transparent)",
            whiteSpace: "nowrap",
          }}
        >
          {pad(index + 1)} / {pad(n)}
        </span>
      </div>

      {showThumbs && (
        <div className="carousel-thumbs">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => go(i)}
              style={{
                width: thumbWidth,
                minWidth: thumbWidth,
                padding: 0,
                border: `2px solid ${i === index ? accentColor : "transparent"}`,
                borderRadius: 7,
                overflow: "hidden",
                background: "none",
                cursor: "pointer",
                opacity: i === index ? 1 : 0.55,
                transition: "opacity 0.2s ease, border-color 0.2s ease",
                flexShrink: 0,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={slide.src} alt="" style={{ width: "100%", display: "block" }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
