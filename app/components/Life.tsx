"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { LifePhoto } from "../lib/lifePhotos";
import { prefersReducedMotion } from "../lib/motion";
import SectionHead from "./SectionHead";

const pad = (n: number) => String(n).padStart(2, "0");

/** "Life beyond the code": a film-strip carousel. Native scroll-snap does the swiping; the buttons and
 *  the counter just drive and read the strip's scroll position. */
export default function Life({ photos }: { photos: LifePhoto[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(photos.length <= 1);

  // Distance from one frame to the next (frame width + gap).
  const step = () => {
    const items = trackRef.current?.children;
    if (!items || items.length < 2) return trackRef.current?.clientWidth ?? 0;
    return (items[1] as HTMLElement).offsetLeft - (items[0] as HTMLElement).offsetLeft;
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const read = () => {
      frame = 0;
      const max = track.scrollWidth - track.clientWidth;
      const s = step();
      // Counts the first frame in view; at the end of the strip that is the last photo.
      const end = track.scrollLeft >= max - 2;
      setCurrent(end ? photos.length - 1 : s ? Math.min(photos.length - 1, Math.round(track.scrollLeft / s)) : 0);
      setProgress(max > 0 ? track.scrollLeft / max : 1);
      setAtStart(track.scrollLeft <= 2);
      setAtEnd(track.scrollLeft >= max - 2);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [photos.length]);

  // Each press moves by the frames fully in view, so a page at a time.
  const go = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const s = step();
    const perView = Math.max(1, Math.floor(track.clientWidth / s));
    track.scrollBy({ left: dir * perView * s, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  const onKey = (e: React.KeyboardEvent<HTMLUListElement>) => {
    const track = e.currentTarget;
    const behavior: ScrollBehavior = prefersReducedMotion() ? "auto" : "smooth";
    const moves: Record<string, () => void> = {
      ArrowRight: () => track.scrollBy({ left: step(), behavior }),
      ArrowLeft: () => track.scrollBy({ left: -step(), behavior }),
      Home: () => track.scrollTo({ left: 0, behavior }),
      End: () => track.scrollTo({ left: track.scrollWidth, behavior }),
    };
    if (!moves[e.key]) return;
    e.preventDefault();
    moves[e.key]();
  };

  const controls = photos.length > 1 && (
    <div className="life-controls">
      <span className="life-count" aria-hidden="true">
        <b>{pad(current + 1)}</b> / {pad(photos.length)}
      </span>
      <button type="button" className="life-btn" onClick={() => go(-1)} disabled={atStart} aria-label="Previous photos">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </button>
      <button type="button" className="life-btn" onClick={() => go(1)} disabled={atEnd} aria-label="Next photos">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  );

  return (
    <section id="life" className="life sec" aria-labelledby="life-title">
      <div className="container">
        <SectionHead
          id="life-title"
          index="03 — Life"
          prompt="ls ~/life"
          title="Life beyond the code"
          sub="Photos from outside software engineering."
          aside={controls}
        />
      </div>
      {photos.length ? (
        <>
          <ul
            ref={trackRef}
            className="life-track"
            tabIndex={0}
            onKeyDown={onKey}
            aria-label="Photos. Scroll sideways or use the arrow keys."
          >
            {photos.map((p, i) => (
              <li key={p.src} className="life-frame" aria-label={`Photo ${i + 1} of ${photos.length}`}>
                <figure>
                  <div className="life-photo">
                    <Image
                      src={p.src}
                      alt={p.alt || p.caption || "Brexcel outside software engineering"}
                      fill
                      unoptimized={p.unoptimized}
                      sizes="(max-width: 640px) 78vw, 320px"
                    />
                    <span className="life-num" aria-hidden="true">
                      {pad(i + 1)}
                    </span>
                  </div>
                  {p.caption && <figcaption>{p.caption}</figcaption>}
                </figure>
              </li>
            ))}
          </ul>
          <div className="container">
            <span className="life-progress" aria-hidden="true">
              <span style={{ transform: `scaleX(${Math.max(progress, 1 / photos.length)})` }} />
            </span>
          </div>
        </>
      ) : (
        <div className="container">
          <p className="life-empty">Photos coming soon.</p>
        </div>
      )}
    </section>
  );
}
