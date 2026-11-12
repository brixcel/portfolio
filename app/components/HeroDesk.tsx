"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { onPortfolioReady, prefersReducedMotion } from "../lib/motion";
import { toggleTheme } from "../lib/theme";

// three.js only loads on the client, after the hero text is on screen.
const DeskScene = dynamic(() => import("./DeskScene"), { ssr: false });

const LINKS = [
  { label: "Synctask", href: "#synctask" },
  { label: "Egoist Labs CI/CD", href: "#egoist-cicd" },
  { label: "IoT RC car and other projects", href: "#projects" },
];

function canWebGL() {
  try {
    return !!document.createElement("canvas").getContext("webgl2");
  } catch {
    return false;
  }
}

// His desk in 3D. The Blender render of the same camera is the poster: it shows while the model
// loads, and stays as the whole hero for reduced motion or no WebGL.
export default function HeroDesk() {
  const [mount, setMount] = useState(false);
  const [live, setLive] = useState(false);
  const onReady = useCallback(() => setLive(true), []);

  useEffect(() => {
    if (prefersReducedMotion() || !canWebGL()) return;
    return onPortfolioReady(() => setMount(true));
  }, []);

  return (
    <div className={`desk3d${live ? " is-live" : ""}`}>
      <div
        className="desk3d-poster"
        role="img"
        aria-label="My desk: a laptop showing Synctask, a notebook with the Egoist Labs CI/CD diagram, my IoT RC car, a breadboard with a lit LED, a mug, the desk lamp, and a framed portrait of me"
      >
        {(["light", "dark"] as const).map((t) => (
          <Image
            key={t}
            className={`desk3d-poster-${t}`}
            src={`/models/desk-poster-${t}.webp`}
            alt=""
            width={1200}
            height={1104}
            sizes="(max-width: 900px) 92vw, 620px"
            priority={t === "light"}
          />
        ))}
      </div>
      {mount && <DeskScene onReady={onReady} />}
      {/* The desk lamp is the site's light/dark switch. A real button over the lamp, so it works on the
          poster, the live scene, and from the keyboard. Box measured from the Blender camera (polish pass). */}
      <button
        type="button"
        className="desk3d-lamp"
        onClick={(e) => toggleTheme(e.currentTarget)}
        aria-label="Desk lamp: switch between light and dark"
      >
        <span className="desk3d-lamp-tip" aria-hidden="true">
          <span className="desk3d-lamp-tip-light">Turn the lights off</span>
          <span className="desk3d-lamp-tip-dark">Turn the lights on</span>
        </span>
      </button>
      <ul className="desk3d-links" aria-label="On my desk">
        {LINKS.map((l) => (
          <li key={l.href}>
            <a href={l.href}>{l.label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
