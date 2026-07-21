"use client";

import { useState } from "react";
import { resolveProductImage } from "@/lib/product-image";

export function ProductImage({
  name,
  image,
  category,
  amazonAsin,
  className = "",
}: {
  name: string;
  image?: string | null;
  category?: string | null;
  amazonAsin?: string | null;
  className?: string;
}) {
  const primary = resolveProductImage({ image, category, amazonAsin });
  const [src, setSrc] = useState(primary);

  return (
    <div className={`flex items-center justify-center overflow-hidden bg-surface-cool ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={name}
        className="h-full w-full object-cover"
        loading="lazy"
        onError={() => {
          const fallback = resolveProductImage({ category, image: null, amazonAsin: null });
          if (src !== fallback) setSrc(fallback);
        }}
      />
    </div>
  );
}
