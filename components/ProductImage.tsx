"use client";

import { useState } from "react";
import { resolveProductImage } from "@/lib/product-image";

const LOCAL_FALLBACK = "/img/categories/default.svg";

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
    <div className={`relative flex items-center justify-center overflow-hidden bg-surface-cool ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={name}
        className="h-full w-full object-cover"
        loading="lazy"
        onError={() => {
          if (src === LOCAL_FALLBACK) return;
          const categoryArt = resolveProductImage({ category, image: null, amazonAsin: null });
          setSrc(categoryArt !== src ? categoryArt : LOCAL_FALLBACK);
        }}
      />
    </div>
  );
}
