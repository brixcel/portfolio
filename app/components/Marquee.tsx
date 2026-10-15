"use client";

import { useEffect, useRef } from "react";
import { techStack } from "../data";
import { MarqueeItem } from "./TechChip";

/**
 * Seamless logo band: two identical groups translate -50% on a CSS loop.
 * JS only steers the loop's playbackRate — it surges with scroll velocity and
 * eases to a stop under the pointer instead of halting abruptly.
 */
export default function Marquee() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const anim = track.getAnimations?.()[0];
    if (!anim) return;

    let rate = 1;
    let boost = 0;
    let hovering = false;
    let visible = false;
    let raf = 0;
    let lastY = window.scrollY;

    const tick = () => {
      boost *= 0.92;
      const target = hovering ? 0 : 1 + boost;
      rate += (target - rate) * 0.08;
      anim.playbackRate = Math.abs(rate) < 0.002 ? 0 : rate;
      if (visible && (Math.abs(target - rate) > 0.002 || boost > 0.01)) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };
    const kick = () => {
      if (!raf && visible) raf = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      const dy = Math.abs(window.scrollY - lastY);
      lastY = window.scrollY;
      boost = Math.min(3, boost + dy / 120);
      kick();
    };
    const enter = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      hovering = true;
      kick();
    };
    const leave = () => {
      hovering = false;
      kick();
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      kick();
    });

    io.observe(wrap);
    window.addEventListener("scroll", onScroll, { passive: true });
    wrap.addEventListener("pointerenter", enter);
    wrap.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      wrap.removeEventListener("pointerenter", enter);
      wrap.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <section className="marquee" aria-label="Technologies I use">
      <ul className="sr-only">
        {techStack.map((tech) => (
          <li key={tech.slug}>{tech.name}</li>
        ))}
      </ul>
      <div ref={wrapRef} className="marq-wrap" aria-hidden="true">
        <div ref={trackRef} className="marq-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="marq-group">
              {techStack.map((tech) => (
                <MarqueeItem key={tech.slug} tech={tech} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
