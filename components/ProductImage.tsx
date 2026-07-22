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
    <div className={`relative flex items-center justify-center overflow-hidden bg-surface-cool p-3 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={name}
        className="max-h-full max-w-full object-contain"
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
