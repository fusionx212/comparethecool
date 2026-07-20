import type { StockStatus } from "@/lib/types";
import { STATUS_LABEL } from "@/lib/format";

const VAR: Record<StockStatus, string> = {
  in_stock: "var(--instock)",
  low_stock: "var(--low)",
  out_of_stock: "var(--sold)",
  preorder: "var(--drop)",
};

export function StatusLed({
  status,
  live = false,
  showLabel = true,
}: {
  status: StockStatus;
  live?: boolean;
  showLabel?: boolean;
}) {
  const blink = live && status !== "out_of_stock";
  return (
    <span className="inline-flex items-center gap-2 align-middle">
      <span
        className={`led${blink ? " led-live" : ""}`}
        style={{ backgroundColor: VAR[status] }}
        aria-hidden
      />
      {showLabel && (
        <span className="eyebrow" style={{ color: VAR[status] }}>
          {STATUS_LABEL[status]}
        </span>
      )}
    </span>
  );
}
