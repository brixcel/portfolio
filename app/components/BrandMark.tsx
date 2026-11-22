// The brexl chip mark (approved Nov 22, 2026). Same shapes as public/brand/brexl-mark.svg.
// It takes the current text colour, so it follows light and dark mode.
export default function BrandMark({ size = 26, className }: { size?: number; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 100 100" fill="currentColor" aria-hidden="true">
      <rect x="31.0" y="5" width="5" height="18" rx="2.5" /><rect x="31.0" y="77" width="5" height="18" rx="2.5" /><rect x="5" y="31.0" width="18" height="5" rx="2.5" /><rect x="77" y="31.0" width="18" height="5" rx="2.5" /><rect x="47.5" y="5" width="5" height="18" rx="2.5" /><rect x="47.5" y="77" width="5" height="18" rx="2.5" /><rect x="5" y="47.5" width="18" height="5" rx="2.5" /><rect x="77" y="47.5" width="18" height="5" rx="2.5" /><rect x="64.0" y="5" width="5" height="18" rx="2.5" /><rect x="64.0" y="77" width="5" height="18" rx="2.5" /><rect x="5" y="64.0" width="18" height="5" rx="2.5" /><rect x="77" y="64.0" width="18" height="5" rx="2.5" /><path fillRule="evenodd" d="M26,16H74A10,10 0 0 1 84,26V74A10,10 0 0 1 74,84H26A10,10 0 0 1 16,74V26A10,10 0 0 1 26,16ZM23.8,27a3.2,3.2 0 1,0 6.4,0a3.2,3.2 0 1,0 -6.4,0ZM30,72H41L54,28H43Z M47,72H58L71,28H60Z" />
    </svg>
  );
}
