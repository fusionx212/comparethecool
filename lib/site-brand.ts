export type SiteBrand = "cool" | "heat";

export function brandFromHost(host: string | null | undefined): SiteBrand {
  const h = (host || "").toLowerCase();
  return h.includes("comparetheheat") ? "heat" : "cool";
}

export function brandLabel(brand: SiteBrand): string {
  return brand === "heat" ? "Compare the Heat" : "Compare the Cool";
}
