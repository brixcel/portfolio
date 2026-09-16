import type { CSSProperties } from "react";

const DEFAULT_PATTERN = [2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 2, 1, 2];

/** Decorative barcode bars — the physical-document motif shared by the ID badge and project cards. */
export default function Barcode({
  pattern = DEFAULT_PATTERN,
  height = 14,
  color = "currentColor",
  opacity = 0.65,
  style,
}: {
  pattern?: number[];
  height?: number;
  color?: string;
  opacity?: number;
  style?: CSSProperties;
}) {
  return (
    <div
      aria-hidden="true"
      style={{ display: "flex", alignItems: "center", gap: 1.5, height, opacity, ...style }}
    >
      {pattern.map((width, i) => (
        <div key={i} style={{ width, height: "100%", background: color }} />
      ))}
    </div>
  );
}
