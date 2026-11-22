import type { CSSProperties } from "react";
import type { Tech } from "../data";
import { logoFilters } from "../lib/logoTone";

const iconUrl = (slug: string) => `/icons/${slug}.svg`;
// Per-logo filters as CSS variables; globals.css picks --logo-light or --logo-dark by context.
const toneVars = (tech: Tech) => {
  const { light, dark } = logoFilters(tech.slug);
  return { "--logo-light": light, "--logo-dark": dark } as CSSProperties;
};

export function TechChip({ tech, size = 18 }: { tech: Tech; size?: number }) {
  return (
    <li className="chip">
      {!tech.noIcon && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={iconUrl(tech.slug)}
          alt=""
          width={size}
          height={size}
          loading="lazy"
          className="logo"
          style={toneVars(tech)}
        />
      )}
      {tech.name}
    </li>
  );
}

export function MarqueeItem({ tech }: { tech: Tech }) {
  return (
    <span className="marq-item">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={iconUrl(tech.slug)}
        alt=""
        width={30}
        height={30}
        loading="lazy"
        decoding="async"
        className="logo"
        style={toneVars(tech)}
      />
      <span>{tech.name}</span>
    </span>
  );
}
