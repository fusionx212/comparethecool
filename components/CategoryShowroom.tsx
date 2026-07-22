"use client";

import { useEffect, useRef, useState } from "react";

export type ShowroomSpec = { label: string; value: string };

/**
 * Product stage with a gentle fixed 3D tilt — no continuous spin.
 * Flat catalog photos look broken edge-on; keep rotation tiny.
 */
export function CategoryShowroom({
  title,
  subtitle,
  imageSrc,
  imageAlt,
  specs,
}: {
  title: string;
  subtitle?: string;
  imageSrc: string;
  imageAlt: string;
  specs: ShowroomSpec[];
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const productRef = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Soft pointer parallax within ±8° — never a full turntable
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || !productRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const rotY = Math.max(-8, Math.min(8, x * 16));
    const rotX = Math.max(-4, Math.min(4, -y * 8));
    productRef.current.style.transform = `rotateY(${rotY}deg) rotateX(${rotX + 4}deg)`;
  };

  const onPointerLeave = () => {
    if (!productRef.current) return;
    productRef.current.style.transform = reduced
      ? "none"
      : "rotateY(-6deg) rotateX(4deg)";
  };

  return (
    <section id="showroom" ref={stageRef} className="relative overflow-hidden border border-line bg-surface">
      <div className="relative z-10 flex flex-wrap items-end justify-between gap-3 border-b border-line px-5 py-4">
        <div>
          <p className="eyebrow text-brand">Showroom</p>
          <h2 className="text-xl font-bold md:text-2xl">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-foreground/60">{subtitle}</p>}
        </div>
        <p className="text-xs text-foreground/45">
          {reduced ? "Product preview" : "Move to tilt · specs beside"}
        </p>
      </div>

      <div className="relative grid gap-0 md:grid-cols-[1.2fr_0.8fr]">
        <div
          className="relative flex min-h-[320px] items-center justify-center md:min-h-[420px]"
          style={{
            perspective: "1200px",
            background:
              "radial-gradient(ellipse at 50% 70%, color-mix(in oklab, var(--brand) 12%, transparent), transparent 55%)",
          }}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
        >
          <div
            ref={productRef}
            className="relative w-[72%] max-w-md transition-transform duration-300 ease-out"
            style={{
              transformStyle: "preserve-3d",
              transform: reduced ? "none" : "rotateY(-6deg) rotateX(4deg)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt={imageAlt}
              className="aspect-[4/3] w-full object-cover shadow-[0_28px_60px_-24px_rgba(0,0,0,0.45)]"
              draggable={false}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-[8%] -bottom-3 h-6 rounded-[100%] bg-black/25 blur-md"
            />
          </div>
        </div>

        <div className="flex flex-col justify-center gap-3 border-t border-line p-5 md:border-l md:border-t-0 md:p-8">
          <p className="eyebrow text-foreground/50">Key specs</p>
          <ul className="space-y-3">
            {specs.slice(0, 3).map((s) => (
              <li key={s.label} className="border border-line bg-background/40 px-4 py-3">
                <p className="eyebrow text-foreground/45">{s.label}</p>
                <p className="tnum text-xl font-bold text-brand">{s.value}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
