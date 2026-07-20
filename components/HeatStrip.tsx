export function HeatStrip({ updated }: { updated: string }) {
  return (
    <div className="bg-heat text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-1.5">
        <span className="eyebrow text-white">Home Climate — live stock tracker</span>
        <span className="tnum whitespace-nowrap text-xs text-white/85">Stock checked {updated}</span>
      </div>
    </div>
  );
}
