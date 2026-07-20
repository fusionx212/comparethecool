import Link from "next/link";

/**
 * ToolStrip — slim utility bar for product pages.
 * Links to free tools + all digital products.
 * Non-intrusive, shown below the breadcrumb on every product page.
 */
export function ToolStrip() {
  return (
    <div className="border-b rule-strong bg-surface-cool">
      <div className="mx-auto max-w-6xl px-5 py-2.5">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs">
          <span className="font-semibold text-foreground/50 uppercase tracking-wider">Free tools:</span>
          <Link href="/tools/btu-calculator" className="text-brand hover:underline font-medium">
            📐 BTU Calculator
          </Link>
          <Link href="/tools/stock-selector" className="text-brand hover:underline font-medium">
            🎯 Stock Selector
          </Link>
          <Link href="/tools/running-cost-calculator" className="text-brand hover:underline font-medium">
            ⚡ Running Cost Calculator
          </Link>
          <span className="font-semibold text-foreground/50 uppercase tracking-wider ml-2">Guides:</span>
          <Link href="/products/home-cooling-handbook" className="text-brand hover:underline font-medium">
            📘 Cooling Handbook £4.99
          </Link>
          <Link href="/products/heatwave-emergency-checklist" className="text-brand hover:underline font-medium">
            🔥 Heatwave Checklist £2.99
          </Link>
          <Link href="/products/energy-bill-guide" className="text-brand hover:underline font-medium">
            💷 Energy Bill Guide £4.99
          </Link>
          <Link href="/products/home-maintenance-logbook" className="text-brand hover:underline font-medium">
            🏠 Maintenance Logbook £7.99
          </Link>
        </div>
      </div>
    </div>
  );
}
