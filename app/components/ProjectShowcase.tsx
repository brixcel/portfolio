"use client";

import type { CSSProperties, ReactNode } from "react";
import { CarouselTrack, CarouselControls, useCarousel } from "./Carousel";
import { TechChip } from "./TechChip";
import Barcode from "./Barcode";
import type { Tech } from "../data";

type Slide = { src: string; alt: string };

export type ProjectShowcaseProps = {
  id?: string;
  sectionClassName?: string;
  sectionStyle?: CSSProperties;
  containerClassName?: string;
  containerStyle?: CSSProperties;
  monogram?: string;
  accentTextColor: string;
  title: string;
  subtitle: string;
  role?: string;
  description: string;
  features?: string[];
  liveHref?: string;
  liveLabel?: string;
  liveButtonStyle?: CSSProperties;
  githubHref?: string;
  githubLabel?: string;
  extraNote?: ReactNode;
  stack: Tech[];
  slides: Slide[];
  collageSlides?: Slide[];
  accentColor: string;
};

export default function ProjectShowcase({
  id,
  sectionClassName,
  sectionStyle,
  containerClassName = "section-pad",
  containerStyle,
  monogram,
  accentTextColor,
  title,
  subtitle,
  role,
  description,
  features,
  liveHref,
  liveLabel = "Live project",
  liveButtonStyle,
  githubHref,
  githubLabel = "GitHub",
  extraNote,
  stack,
  slides,
  collageSlides,
  accentColor,
}: ProjectShowcaseProps) {
  const carousel = useCarousel(slides.length);

  return (
    <section id={id} className={sectionClassName} style={sectionStyle}>
      <div
        className={containerClassName}
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "96px 24px 110px",
          ...containerStyle,
        }}
      >
        <div style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: "clamp(34px, 4.4vw, 54px)", margin: "0 0 8px", letterSpacing: "-.02em" }}>
            {title}
          </h2>
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "8px 12px" }}>
              <p
                style={{
                  margin: 0,
                  fontSize: 15,
                  color: "color-mix(in srgb, var(--color-text) 55%, transparent)",
                }}
              >
                {subtitle}
              </p>
              {role && (
                <span
                  style={{
                    fontSize: 11.5,
                    fontWeight: 700,
                    letterSpacing: ".04em",
                    padding: "3px 9px",
                    borderRadius: "999px",
                    background: "color-mix(in srgb, var(--color-text) 8%, transparent)",
                    border: "1px solid var(--color-divider)",
                    color: accentTextColor,
                  }}
                >
                  Role: {role}
                </span>
              )}
            </div>
          </div>

        <div
          className="two-col"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr",
            gap: 44,
            alignItems: "start",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "clamp(19px, 2vw, 25px)",
                lineHeight: 1.45,
                margin: "0 0 20px",
                textWrap: "pretty",
              }}
            >
              {description}
            </p>

            {features && features.length > 0 && (
              <div
                style={{
                  margin: "0 0 24px",
                  padding: "16px 18px",
                  borderRadius: "var(--radius-md)",
                  background: "color-mix(in srgb, var(--color-surface) 60%, transparent)",
                  border: "1px solid var(--color-divider)",
                }}
              >
                <p
                  style={{
                    margin: "0 0 10px",
                    fontSize: 11.5,
                    fontWeight: 700,
                    letterSpacing: ".06em",
                    textTransform: "uppercase",
                    color: "color-mix(in srgb, var(--color-text) 60%, transparent)",
                  }}
                >
                  Key Features &amp; Highlights
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "8px 12px" }}>
                  {features.map((item, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 500 }}>
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: accentColor,
                          flexShrink: 0,
                        }}
                      />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(liveHref || githubHref) && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: extraNote ? 14 : 30 }}>
                {liveHref && (
                  <a
                    href={liveHref}
                    target="_blank"
                    rel="noopener"
                    className="btn btn-primary"
                    style={{ textDecoration: "none", ...liveButtonStyle }}
                  >
                    {liveLabel}
                  </a>
                )}
                {githubHref && (
                  <a
                    href={githubHref}
                    target="_blank"
                    rel="noopener"
                    className="btn btn-secondary"
                    style={{ textDecoration: "none" }}
                  >
                    {githubLabel}
                  </a>
                )}
              </div>
            )}

            {extraNote && (
              <p
                style={{
                  margin: "0 0 30px",
                  fontSize: 13,
                  color: "color-mix(in srgb, var(--color-text) 55%, transparent)",
                }}
              >
                {extraNote}
              </p>
            )}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                margin: "0 0 14px",
                paddingTop: 14,
                borderTop: "1px dashed var(--color-divider)",
              }}
            >
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "color-mix(in srgb, var(--color-text) 55%, transparent)",
                  margin: 0,
                }}
              >
                Built with
              </p>
              <Barcode height={12} opacity={0.35} />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {stack.map((tech) => (
                <TechChip key={tech.slug} tech={tech} />
              ))}
            </div>
          </div>

          <div>
            <CarouselTrack
              slides={slides}
              state={carousel}
              style={{
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--color-divider)",
                boxShadow: "var(--shadow-lg)",
                background: "var(--color-bg)",
              }}
            />
            <CarouselControls slides={slides} state={carousel} accentColor={accentColor} showThumbs={false} />
          </div>
        </div>

        {collageSlides && collageSlides.length > 0 && (
          <div
            className="uh-collage"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${Math.min(collageSlides.length, 3)}, 1fr)`,
              gap: 20,
              marginTop: 56,
            }}
          >
            {collageSlides.map((img) => (
              <figure
                key={img.src}
                className="project-img-frame"
                style={{
                  margin: 0,
                  borderRadius: "var(--radius-md)",
                  overflow: "hidden",
                  border: "1px solid var(--color-divider)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.src} alt={img.alt} style={{ width: "100%", display: "block" }} />
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
