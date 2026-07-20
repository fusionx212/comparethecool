import { CoolingGlyph } from "./CoolingGlyph";

// Renders the retailer-supplied product photo (from the Awin feed's
// merchant_image_url) when present; otherwise a bespoke monoline glyph.
// Native lazy <img> is deliberate — affiliate feeds reference arbitrary
// retailer CDNs, so we don't gate them behind next/image remotePatterns.
export function ProductImage({
  src,
  alt,
  category,
  className = "",
  glyphClassName = "h-1/2 w-1/2",
}: {
  src?: string | null;
  alt: string;
  category: string;
  className?: string;
  glyphClassName?: string;
}) {
  return (
    <div className={`relative flex items-center justify-center overflow-hidden border border-line bg-surface ${className}`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} loading="lazy" decoding="async" className="h-full w-full object-contain p-2" />
      ) : (
        <span className="ouac-grid absolute inset-0 flex items-center justify-center text-brand/70">
          <CoolingGlyph category={category} className={glyphClassName} />
        </span>
      )}
    </div>
  );
}
