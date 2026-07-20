// Bespoke monoline cooling glyphs — sharp, technical line-art (square caps,
// mitre joins) used as the on-brand image placeholder before real retailer
// photos arrive from the affiliate feed. NOT generic AI imagery.

type Variant = "ac" | "wall" | "cooler" | "tower" | "fan" | "handheld";

const VARIANT_BY_CATEGORY: Record<string, Variant> = {
  "portable-air-conditioners": "ac",
  "air-con-units": "wall",
  "evaporative-coolers": "cooler",
  "tower-fans": "tower",
  "pedestal-fans": "fan",
  "desk-usb-fans": "fan",
  "portable-fans": "handheld",
};

export function CoolingGlyph({
  category,
  className,
}: {
  category: string;
  className?: string;
}) {
  const v = VARIANT_BY_CATEGORY[category] ?? "fan";
  const s = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "square" as const,
    strokeLinejoin: "miter" as const,
  };
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden role="img">
      {v === "ac" && (
        <>
          <rect x="9" y="14" width="26" height="25" {...s} />
          <path d="M13 20 H31 M13 24 H31 M13 28 H31" {...s} />
          <rect x="26" y="32" width="6" height="4" {...s} />
          <path d="M35 18 H42 V10" {...s} />
          <path d="M38 43 q3 -3 0 -6 M44 43 q3 -3 0 -6" {...s} />
        </>
      )}
      {v === "wall" && (
        <>
          <rect x="7" y="13" width="34" height="11" {...s} />
          <path d="M10 20 H38" {...s} />
          <path d="M13 30 q3 -3 6 0 t6 0 t6 0 M13 36 q3 -3 6 0 t6 0 t6 0" {...s} />
        </>
      )}
      {v === "cooler" && (
        <>
          <rect x="13" y="11" width="22" height="28" {...s} />
          <path d="M17 16 H31 M17 20 H31" {...s} />
          <path d="M24 25 C 20 30, 20 34, 24 34 C 28 34, 28 30, 24 25 Z" {...s} />
        </>
      )}
      {v === "tower" && (
        <>
          <rect x="19" y="7" width="10" height="29" {...s} />
          <path d="M24 10 V33" {...s} />
          <path d="M21 13 H27 M21 18 H27 M21 23 H27 M21 28 H27" {...s} />
          <rect x="15" y="38" width="18" height="3" {...s} />
        </>
      )}
      {v === "fan" && (
        <>
          <circle cx="24" cy="18" r="12" {...s} />
          <circle cx="24" cy="18" r="2.4" {...s} />
          <path d="M24 18 C 20 10, 18 12, 24 18 M24 18 C 32 16, 30 10, 24 18 M24 18 C 26 28, 32 24, 24 18" {...s} />
          <path d="M24 30 V40 M17 41 H31" {...s} />
        </>
      )}
      {v === "handheld" && (
        <>
          <circle cx="24" cy="16" r="11" {...s} />
          <circle cx="24" cy="16" r="2.2" {...s} />
          <path d="M24 16 L18 9 M24 16 L31 11 M24 16 L27 25" {...s} />
          <path d="M22 27 H26 V41 H22 Z" {...s} />
        </>
      )}
    </svg>
  );
}
