import { createHash, randomBytes } from "crypto";
import type { DigitalProduct } from "@/lib/digital-products";

/** Minimal single-page PDF (no deps) — branded report body. */
export function buildDigitalPdf(opts: {
  product: DigitalProduct;
  country: string;
  orderId: string;
  email?: string | null;
  category?: string | null;
  productSlug?: string | null;
}): Buffer {
  const lines = [
    "COMPARE THE COOL — DIGITAL COMPANION",
    "",
    opts.product.name.toUpperCase(),
    opts.product.tagline,
    "",
    `Market: ${opts.country.toUpperCase()}`,
    opts.category ? `Category: ${opts.category}` : "",
    opts.productSlug ? `Product: ${opts.productSlug}` : "",
    opts.email ? `Licensed to: ${opts.email}` : "",
    `Order: ${opts.orderId}`,
    "",
    "--- YOUR VERDICT ---",
    "",
    ...reportBody(opts.product.id),
    "",
    "This deliverable is different from our free calculators:",
    "it is a saved, branded PDF with a purchase-linked licence.",
    "",
    "Not medical or professional HVAC advice. Check local regs.",
    "comparethecool.com",
  ].filter((l) => l !== undefined);

  return textToPdf(lines);
}

function reportBody(sku: string): string[] {
  if (sku === "room-fit-report") {
    return [
      "1. Measure room length x width (m) for floor area.",
      "2. If ceiling > 2.5 m, multiply BTU need by 1.1.",
      "3. Sunny rooms / top floor: add ~10% capacity.",
      "4. Portable AC rule of thumb: ~350 BTU per m2.",
      "5. Oil radiator: ~100 W per m2 for UK winters.",
      "6. Verdict: buy the next size UP if you are between bands.",
      "7. Keep exhaust hose short and sealed — leaks kill efficiency.",
    ];
  }
  if (sku === "setup-pack") {
    return [
      "Day 0: Unbox, photograph serial, register warranty.",
      "Day 1: Placement — 50 cm clearance, level floor, away from curtains.",
      "Hose / vent: seal window kit; slope hose slightly down/out.",
      "Drainage: empty tank or set continuous drain before first night.",
      "Noise: night mode + door closed; avoid tile echo rooms.",
      "Safety: RCD socket, no daisy-chain extensions for heaters.",
      "Week 1: Clean filter once; note running cost vs expectation.",
    ];
  }
  return [
    "Find your device watts on the rating plate.",
    "Hours/day x watts / 1000 = kWh/day.",
    "kWh/day x your unit rate (p/kWh) = daily cost.",
    "UK typical: 24–34p/kWh (check your bill).",
    "Heaters at 2 kW x 4h ≈ 8 kWh — budget accordingly.",
    "Portable AC often 900–1200 W while compressor runs.",
    "Scorecard tip: compare Eco / night modes before returning.",
  ];
}

function escapePdfText(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function textToPdf(lines: string[]): Buffer {
  const contentLines: string[] = ["BT", "/F1 11 Tf", "50 780 Td", "14 TL"];
  lines.forEach((line, i) => {
    if (i === 0) {
      contentLines.push(`(${escapePdfText(line)}) Tj`);
    } else {
      contentLines.push("T*", `(${escapePdfText(line)}) Tj`);
    }
  });
  contentLines.push("ET");
  const stream = contentLines.join("\n");
  const objects: string[] = [];
  objects.push("1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj");
  objects.push("2 0 obj<< /Type /Pages /Kids [3 0 R] /Count 1 >>endobj");
  objects.push(
    "3 0 obj<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>endobj",
  );
  objects.push(
    `4 0 obj<< /Length ${Buffer.byteLength(stream, "utf8")} >>stream\n${stream}\nendstream endobj`,
  );
  objects.push("5 0 obj<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>endobj");

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [0];
  for (const obj of objects) {
    offsets.push(Buffer.byteLength(pdf, "utf8"));
    pdf += obj + "\n";
  }
  const xrefStart = Buffer.byteLength(pdf, "utf8");
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (let i = 1; i < offsets.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
  pdf += `startxref\n${xrefStart}\n%%EOF`;
  return Buffer.from(pdf, "utf8");
}

export function newCapabilityToken(): string {
  return randomBytes(24).toString("hex");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
