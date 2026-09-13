"use client";

import type { CSSProperties, ReactNode } from "react";
import Reveal from "./Reveal";
import { CarouselTrack, CarouselControls, useCarousel } from "./Carousel";
import { TechChip } from "./TechChip";
import type { Tech } from "../data";

type Slide = { src: string; alt: string };

export type ProjectShowcaseProps = {
  id?: string;
  sectionClassName?: string;
  sectionStyle?: CSSProperties;
  containerClassName?: string;
  containerStyle?: CSSProperties;
  number: string;
  numberColor: string;
  title: string;
  subtitle: string;
  description: string;
  liveHref: string;
  liveLabel?: string;
  liveButtonStyle?: CSSProperties;
  githubHref: string;
  githubLabel?: string;
  extraNote?: ReactNode;
  stack: Tech[];
  slides: Slide[];
  collageSlides: Slide[];
  accentColor: string;
};

export default function ProjectShowcase({
  id,
  sectionClassName,
  sectionStyle,
  containerClassName = "section-pad",
  containerStyle,
  number,
  numberColor,
  title,
  subtitle,
  description,
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
        <Reveal style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 36 }}>
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(56px, 9vw, 104px)",
              lineHeight: 0.85,
              color: numberColor,
            }}
          >
            {number}
          </span>
          <div>
            <div className="text-mask-reveal">
              <h2 style={{ fontSize: "clamp(34px, 4.4vw, 54px)", margin: "0 0 6px", letterSpacing: "-.02em" }}>
                {title}
              </h2>
            </div>
            <p
              className="stagger-1"
              style={{
                margin: 0,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: ".14em",
                textTransform: "uppercase",
                color: "color-mix(in srgb, var(--color-text) 55%, transparent)",
              }}
            >
              {subtitle}
            </p>
          </div>
        </Reveal>

        <Reveal
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
                margin: "0 0 26px",
                textWrap: "pretty",
              }}
            >
              {description}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: extraNote ? 14 : 30 }}>
              <a
                href={liveHref}
                target="_blank"
                rel="noopener"
                className="btn btn-primary"
                style={{ textDecoration: "none", ...liveButtonStyle }}
              >
                {liveLabel}
              </a>
              <a
                href={githubHref}
                target="_blank"
                rel="noopener"
                className="btn btn-secondary"
                style={{ textDecoration: "none" }}
              >
                {githubLabel}
              </a>
            </div>
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
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: ".16em",
                textTransform: "uppercase",
                color: "color-mix(in srgb, var(--color-text) 55%, transparent)",
                margin: "0 0 14px",
              }}
            >
              Built with
            </p>
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
        </Reveal>

        <Reveal
          className="uh-collage"
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginTop: 56 }}
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
        </Reveal>
      </div>
    </section>
  );
}
