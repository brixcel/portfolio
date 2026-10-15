"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { Slide } from "../data";
import { getGsap, prefersReducedMotion } from "../lib/motion";

const pad = (n: number) => String(n).padStart(2, "0");
const isSvg = (src: string) => src.endsWith(".svg");

/**
 * Screenshot viewer for one project. Slides wipe in from the side you're
 * heading toward; the frame itself is revealed once, on first scroll into view.
 * Only the current slide, its neighbours and slides already seen are mounted.
 */
export default function ProjectGallery({
  title,
  slides,
  aspect,
  sizes,
}: {
  title: string;
  slides: Slide[];
  aspect: string;
  sizes: string;
}) {
  const n = slides.length;
  const [index, setIndex] = useState(0);
  const [seen, setSeen] = useState<Set<number>>(() => new Set([0, 1 % n, (n - 1) % n]));
  const direction = useRef<1 | -1>(1);
  const previous = useRef(0);
  const frameRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const press = useRef<{ x: number; y: number } | null>(null);

  const go = (next: number, dir?: 1 | -1) => {
    const target = ((next % n) + n) % n;
    if (target === index) return;
    direction.current = dir ?? (target > index ? 1 : -1);
    previous.current = index;
    setIndex(target);
    setSeen((prev) => {
      const s = new Set(prev);
      s.add(target);
      s.add((target + 1) % n);
      s.add((target - 1 + n) % n);
      return s;
    });
  };

  // Directional wipe between slides (layout effect: no frame of the unclipped slide)
  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame || previous.current === index) return;
    const { gsap } = getGsap();
    const incoming = frame.querySelector<HTMLElement>(`[data-slide="${index}"]`);
    const outgoing = frame.querySelector<HTMLElement>(`[data-slide="${previous.current}"]`);
    if (!incoming) return;

    frame.querySelectorAll<HTMLElement>("[data-slide]").forEach((el) => {
      el.style.zIndex = el === incoming ? "2" : el === outgoing ? "1" : "0";
      el.style.visibility = el === incoming || el === outgoing ? "visible" : "hidden";
    });

    if (prefersReducedMotion()) {
      if (outgoing) outgoing.style.visibility = "hidden";
      return;
    }

    const from = direction.current === 1 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)";
    const tl = gsap.timeline({
      onComplete: () => {
        if (outgoing) outgoing.style.visibility = "hidden";
      },
    });
    tl.fromTo(incoming, { clipPath: from }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.85, ease: "expo.inOut" })
      .fromTo(incoming.firstElementChild, { scale: 1.08, xPercent: 4 * direction.current }, { scale: 1, xPercent: 0, duration: 1.1, ease: "expo.out" }, 0.15);
    if (outgoing?.firstElementChild) {
      tl.to(outgoing.firstElementChild, { xPercent: -10 * direction.current, duration: 0.85, ease: "expo.inOut" }, 0).set(
        outgoing.firstElementChild,
        { xPercent: 0 }
      );
    }
    return () => {
      tl.progress(1).kill();
    };
  }, [index]);

  // Keep the active thumbnail in view without scrolling the page (not on mount)
  useEffect(() => {
    const strip = thumbsRef.current;
    const thumb = strip?.querySelector<HTMLElement>(`[data-thumb="${index}"]`);
    if (!strip || !thumb || previous.current === index) return;
    const offset = thumb.getBoundingClientRect().left - strip.getBoundingClientRect().left + strip.scrollLeft;
    const left = offset - strip.clientWidth / 2 + thumb.clientWidth / 2;
    strip.scrollTo({ left, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }, [index]);

  // One-time art-directed reveal: the frame opens upward, the image settles in
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || prefersReducedMotion()) return;
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      const inner = frame.querySelector('[data-slide="0"] > *');
      const tl = gsap.timeline({ scrollTrigger: { trigger: frame, start: "top 82%", once: true } });
      tl.fromTo(
        frame,
        { clipPath: "inset(100% 0% 0% 0% round 14px)" },
        { clipPath: "inset(0% 0% 0% 0% round 14px)", duration: 1.25, ease: "expo.inOut" }
      );
      if (inner) tl.fromTo(inner, { scale: 1.22 }, { scale: 1, duration: 1.6, ease: "expo.out" }, 0.2);
    }, frame);
    return () => ctx.revert();
  }, []);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(index + 1, 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(index - 1, -1);
    }
  };

  const onPointerDown = (e: PointerEvent) => {
    press.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: PointerEvent) => {
    if (!press.current) return;
    const dx = e.clientX - press.current.x;
    const dy = e.clientY - press.current.y;
    press.current = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(index + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    else if (Math.abs(dx) < 6 && Math.abs(dy) < 6 && e.pointerType === "mouse") go(index + 1, 1);
  };

  return (
    <div className="gallery">
      <div
        ref={frameRef}
        className="gallery-frame"
        style={{ aspectRatio: aspect }}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label={`${title} screenshots. Use the arrow keys to browse.`}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (press.current = null)}
      >
        {slides.map((slide, i) =>
          seen.has(i) ? (
            <div
              key={slide.src}
              data-slide={i}
              className="gallery-slide"
              style={{ zIndex: i === index ? 2 : 0, visibility: i === index ? "visible" : "hidden" }}
              aria-hidden={i !== index}
            >
              <div className="gallery-slide-inner">
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  sizes={sizes}
                  draggable={false}
                  unoptimized={isSvg(slide.src)}
                />
              </div>
            </div>
          ) : null
        )}
      </div>

      <div className="gallery-bar">
        <p className="gallery-caption" aria-live="polite">
          <span className="gallery-count">
            {pad(index + 1)}
            <span aria-hidden="true">/</span>
            <span className="sr-only"> of </span>
            {pad(n)}
          </span>
          <span className="gallery-alt">{slides[index].alt}</span>
        </p>
        <div className="gallery-arrows">
          <button type="button" className="icon-btn" aria-label="Previous screenshot" onClick={() => go(index - 1, -1)}>
            <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
              <path d="M12.5 4.5 7 10l5.5 5.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" className="icon-btn" aria-label="Next screenshot" onClick={() => go(index + 1, 1)}>
            <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
              <path d="M7.5 4.5 13 10l-5.5 5.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div ref={thumbsRef} className="gallery-thumbs">
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            data-thumb={i}
            className={`gallery-thumb${i === index ? " is-active" : ""}`}
            aria-label={`Show screenshot ${i + 1}: ${slide.alt}`}
            aria-current={i === index ? "true" : undefined}
            onClick={() => go(i)}
            style={{ aspectRatio: aspect }}
          >
            <Image src={slide.src} alt="" fill sizes="96px" unoptimized={isSvg(slide.src)} />
          </button>
        ))}
      </div>
    </div>
  );
}
