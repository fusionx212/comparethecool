// BTU / room-size calculator — original tool value (keeps Google Ads happy,
// genuinely useful to buyers sizing a portable AC). UK rules-of-thumb.

export type SunLevel = "shaded" | "average" | "sunny";

const BASE_BTU_PER_M2 = 340; // sensible UK baseline for a standard-ceiling room

const SUN_ADJUST: Record<SunLevel, number> = {
  shaded: -0.1, // north-facing / shaded
  average: 0,
  sunny: 0.1, // south-facing / lots of glass
};

export interface BtuInput {
  roomM2: number;
  sun?: SunLevel;
  occupants?: number; // each adult adds ~600 BTU
  ceilingHigh?: boolean; // tall ceilings add load
}

export interface BtuResult {
  recommendedBtu: number;
  bandLow: number;
  bandHigh: number;
  approxKilowatts: number; // cooling kW (1 kW ≈ 3412 BTU)
  note: string;
}

const round100 = (n: number) => Math.round(n / 100) * 100;

export function recommendBtu({
  roomM2,
  sun = "average",
  occupants = 1,
  ceilingHigh = false,
}: BtuInput): BtuResult {
  const safeArea = Math.max(2, roomM2);
  let btu = safeArea * BASE_BTU_PER_M2;
  btu *= 1 + SUN_ADJUST[sun];
  btu += Math.max(0, occupants - 1) * 600;
  if (ceilingHigh) btu *= 1.1;

  const recommendedBtu = round100(btu);
  return {
    recommendedBtu,
    bandLow: round100(btu * 0.9),
    bandHigh: round100(btu * 1.15),
    approxKilowatts: Math.round((recommendedBtu / 3412) * 10) / 10,
    note:
      "A rule-of-thumb estimate. Undersized units run flat-out and struggle on the hottest days — aim for the top of the band if in doubt.",
  };
}

// Reverse: given a unit's BTU, the room size it comfortably covers.
export function coverageM2ForBtu(btu: number): number {
  return Math.round(btu / BASE_BTU_PER_M2);
}
