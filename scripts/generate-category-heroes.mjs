import fs from "fs";
import path from "path";

const out = path.join("public", "img", "categories", "heroes");
fs.mkdirSync(out, { recursive: true });

const cats = [
  ["portable-air-conditioners", "cool", "#0792b4", "AC"],
  ["tower-fans", "cool", "#0aa2c4", "FAN"],
  ["evaporative-coolers", "cool", "#1ab8a0", "EVAP"],
  ["ice-makers", "cool", "#5ec8e8", "ICE"],
  ["ceiling-fans", "cool", "#3a9fc4", "CEIL"],
  ["dehumidifiers", "neutral", "#4a7c8c", "DEHU"],
  ["air-purifiers", "neutral", "#5a8a9a", "PURE"],
  ["air-quality-monitors", "neutral", "#6a90a0", "AQM"],
  ["fridges-freezers", "neutral", "#3d6a7a", "FRIDGE"],
  ["chest-freezers", "neutral", "#355f6e", "CHEST"],
  ["wine-coolers", "neutral", "#5a4060", "WINE"],
  ["mini-fridges", "neutral", "#4a7080", "MINI"],
  ["tumble-dryers", "neutral", "#6a7a8a", "DRY"],
  ["smart-thermostats", "neutral", "#5080a0", "THERM"],
  ["oil-radiators", "heat", "#e85d1c", "OIL"],
  ["electric-blankets", "heat", "#d45a2a", "BLANK"],
  ["heated-airers", "heat", "#c85a30", "AIRER"],
  ["patio-heaters", "heat", "#e07020", "PATIO"],
  ["towel-radiators", "heat", "#d06828", "TOWEL"],
];

function productShape(id, accent) {
  const shapes = {
    AC: `<rect x="280" y="220" width="240" height="320" rx="28" fill="#f4f8fa" stroke="${accent}" stroke-width="3"/><rect x="310" y="260" width="180" height="40" rx="8" fill="${accent}" opacity="0.25"/><circle cx="400" cy="380" r="70" fill="none" stroke="${accent}" stroke-width="8" opacity="0.5"/><circle cx="400" cy="380" r="40" fill="${accent}" opacity="0.15"/>`,
    FAN: `<rect x="360" y="180" width="80" height="380" rx="40" fill="#f4f8fa" stroke="${accent}" stroke-width="3"/><ellipse cx="400" cy="280" rx="110" ry="160" fill="none" stroke="${accent}" stroke-width="10" opacity="0.45"/><ellipse cx="400" cy="280" rx="50" ry="80" fill="${accent}" opacity="0.2"/>`,
    EVAP: `<rect x="300" y="200" width="200" height="340" rx="20" fill="#f4f8fa" stroke="${accent}" stroke-width="3"/><path d="M340 280 Q400 220 460 280 Q400 340 340 280" fill="${accent}" opacity="0.3"/>`,
    ICE: `<rect x="290" y="240" width="220" height="280" rx="16" fill="#f4f8fa" stroke="${accent}" stroke-width="3"/><rect x="330" y="280" width="60" height="50" rx="6" fill="${accent}" opacity="0.35"/><rect x="410" y="280" width="60" height="50" rx="6" fill="${accent}" opacity="0.35"/>`,
    CEIL: `<circle cx="400" cy="300" r="28" fill="${accent}"/><path d="M400 300 L220 220 L240 200 Z" fill="${accent}" opacity="0.35"/><path d="M400 300 L580 220 L560 200 Z" fill="${accent}" opacity="0.35"/><path d="M400 300 L320 460 L360 470 Z" fill="${accent}" opacity="0.25"/>`,
    DEHU: `<rect x="310" y="210" width="180" height="340" rx="24" fill="#f4f8fa" stroke="${accent}" stroke-width="3"/><rect x="340" y="250" width="120" height="80" rx="10" fill="${accent}" opacity="0.2"/><ellipse cx="400" cy="480" rx="50" ry="20" fill="${accent}" opacity="0.3"/>`,
    PURE: `<rect x="330" y="180" width="140" height="400" rx="70" fill="#f4f8fa" stroke="${accent}" stroke-width="3"/><circle cx="400" cy="280" r="36" fill="${accent}" opacity="0.25"/>`,
    AQM: `<rect x="320" y="260" width="160" height="220" rx="20" fill="#f4f8fa" stroke="${accent}" stroke-width="3"/><circle cx="400" cy="340" r="40" fill="${accent}" opacity="0.3"/><rect x="360" y="400" width="80" height="12" rx="4" fill="${accent}" opacity="0.4"/>`,
    FRIDGE: `<rect x="300" y="160" width="200" height="420" rx="12" fill="#f4f8fa" stroke="${accent}" stroke-width="3"/><line x1="300" y1="360" x2="500" y2="360" stroke="${accent}" stroke-width="2" opacity="0.4"/><circle cx="470" cy="280" r="8" fill="${accent}"/>`,
    CHEST: `<rect x="240" y="300" width="320" height="200" rx="12" fill="#f4f8fa" stroke="${accent}" stroke-width="3"/><rect x="260" y="280" width="280" height="30" rx="6" fill="${accent}" opacity="0.25"/>`,
    WINE: `<rect x="320" y="170" width="160" height="400" rx="10" fill="#f4f8fa" stroke="${accent}" stroke-width="3"/><g fill="${accent}" opacity="0.25">${[0, 1, 2, 3, 4].map((i) => `<ellipse cx="400" cy="${230 + i * 60}" rx="45" ry="14"/>`).join("")}</g>`,
    MINI: `<rect x="320" y="240" width="160" height="280" rx="10" fill="#f4f8fa" stroke="${accent}" stroke-width="3"/><rect x="340" y="270" width="120" height="90" rx="6" fill="${accent}" opacity="0.15"/>`,
    DRY: `<rect x="280" y="180" width="240" height="380" rx="16" fill="#f4f8fa" stroke="${accent}" stroke-width="3"/><circle cx="400" cy="360" r="90" fill="none" stroke="${accent}" stroke-width="10" opacity="0.4"/><circle cx="400" cy="360" r="40" fill="${accent}" opacity="0.2"/>`,
    THERM: `<rect x="340" y="220" width="120" height="280" rx="24" fill="#f4f8fa" stroke="${accent}" stroke-width="3"/><circle cx="400" cy="320" r="36" fill="${accent}" opacity="0.3"/>`,
    OIL: `<g stroke="${accent}" stroke-width="14" fill="none" stroke-linecap="round">${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M${300 + i * 36} 480 Q${300 + i * 36} 220 ${318 + i * 36} 200"/>`).join("")}</g><rect x="290" y="470" width="220" height="30" rx="8" fill="#f4f8fa" stroke="${accent}" stroke-width="3"/>`,
    BLANK: `<rect x="220" y="260" width="360" height="220" rx="16" fill="#f4f8fa" stroke="${accent}" stroke-width="3"/><path d="M260 300 Q400 360 540 300" fill="none" stroke="${accent}" stroke-width="6" opacity="0.35"/>`,
    AIRER: `<line x1="280" y1="480" x2="280" y2="200" stroke="${accent}" stroke-width="8"/><line x1="520" y1="480" x2="520" y2="200" stroke="${accent}" stroke-width="8"/><g stroke="${accent}" stroke-width="4" opacity="0.5">${[0, 1, 2, 3, 4].map((i) => `<line x1="280" y1="${240 + i * 40}" x2="520" y2="${240 + i * 40}"/>`).join("")}</g>`,
    PATIO: `<line x1="400" y1="500" x2="400" y2="280" stroke="${accent}" stroke-width="10"/><path d="M280 280 Q400 160 520 280 Z" fill="${accent}" opacity="0.35"/><circle cx="400" cy="500" r="40" fill="#f4f8fa" stroke="${accent}" stroke-width="3"/>`,
    TOWEL: `<rect x="340" y="180" width="120" height="360" rx="8" fill="#f4f8fa" stroke="${accent}" stroke-width="3"/><g fill="${accent}" opacity="0.25">${[0, 1, 2, 3].map((i) => `<rect x="355" y="${220 + i * 70}" width="90" height="40" rx="4"/>`).join("")}</g>`,
  };
  return shapes[id] || shapes.AC;
}

for (const [slug, mood, accent, shape] of cats) {
  const bg1 = mood === "cool" ? "#e8f6fb" : mood === "heat" ? "#fdf0e8" : "#eef3f5";
  const bg2 = mood === "cool" ? "#b8e0ef" : mood === "heat" ? "#f5c9a8" : "#d0dde3";
  const floor = mood === "cool" ? "#0792b4" : mood === "heat" ? "#e85d1c" : "#5a7a88";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" role="img">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${bg1}"/>
      <stop offset="100%" stop-color="${bg2}"/>
    </linearGradient>
    <radialGradient id="spot" cx="50%" cy="35%" r="45%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <filter id="soft"><feGaussianBlur stdDeviation="8"/></filter>
  </defs>
  <rect width="800" height="600" fill="url(#bg)"/>
  <ellipse cx="400" cy="520" rx="260" ry="36" fill="${floor}" opacity="0.18" filter="url(#soft)"/>
  <ellipse cx="400" cy="515" rx="200" ry="18" fill="${floor}" opacity="0.25"/>
  <rect width="800" height="600" fill="url(#spot)"/>
  <g transform="translate(0,-20)">
    ${productShape(shape, accent)}
  </g>
  <circle cx="120" cy="100" r="40" fill="${accent}" opacity="0.12"/>
  <circle cx="680" cy="140" r="60" fill="${accent}" opacity="0.08"/>
</svg>`;
  fs.writeFileSync(path.join(out, `${slug}.svg`), svg);
}

console.log(`wrote ${cats.length} heroes to ${out}`);
