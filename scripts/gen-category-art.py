from pathlib import Path

out = Path("public/img/categories")
out.mkdir(parents=True, exist_ok=True)

scenes = {
    "portable-air-conditioners": (
        "#0B6E8A",
        "Portable AC",
        """
  <rect x="90" y="70" width="140" height="200" rx="16" fill="#F4FAFC" stroke="#0B6E8A" stroke-width="4"/>
  <rect x="110" y="95" width="100" height="70" rx="8" fill="#D7EEF5"/>
  <g stroke="#0B6E8A" stroke-width="3">
    <line x1="120" y1="110" x2="200" y2="110"/><line x1="120" y1="125" x2="200" y2="125"/><line x1="120" y1="140" x2="200" y2="140"/>
  </g>
  <circle cx="160" cy="210" r="18" fill="#0B6E8A"/>
  <rect x="145" y="235" width="30" height="20" rx="4" fill="#7BC4D8"/>
""",
    ),
    "dehumidifiers": (
        "#0B6E8A",
        "Dehumidifier",
        """
  <rect x="105" y="60" width="110" height="220" rx="18" fill="#F4FAFC" stroke="#0B6E8A" stroke-width="4"/>
  <ellipse cx="160" cy="130" rx="28" ry="40" fill="#D7EEF5" stroke="#0B6E8A" stroke-width="3"/>
  <rect x="125" y="200" width="70" height="50" rx="8" fill="#7BC4D8"/>
""",
    ),
    "air-purifiers": (
        "#0B6E8A",
        "Air purifier",
        """
  <rect x="120" y="55" width="80" height="230" rx="40" fill="#F4FAFC" stroke="#0B6E8A" stroke-width="4"/>
  <rect x="135" y="90" width="50" height="120" rx="8" fill="#D7EEF5"/>
  <circle cx="160" cy="245" r="10" fill="#0B6E8A"/>
""",
    ),
    "tower-fans": (
        "#0B6E8A",
        "Tower fan",
        """
  <rect x="140" y="50" width="40" height="200" rx="20" fill="#F4FAFC" stroke="#0B6E8A" stroke-width="4"/>
  <ellipse cx="160" cy="270" rx="45" ry="12" fill="#D7EEF5" stroke="#0B6E8A" stroke-width="3"/>
  <g stroke="#0B6E8A" stroke-width="2" opacity="0.5">
    <line x1="100" y1="80" x2="140" y2="100"/><line x1="95" y1="110" x2="140" y2="120"/><line x1="100" y1="140" x2="140" y2="145"/>
  </g>
""",
    ),
    "evaporative-coolers": (
        "#0B6E8A",
        "Evaporative cooler",
        """
  <rect x="85" y="80" width="150" height="170" rx="12" fill="#F4FAFC" stroke="#0B6E8A" stroke-width="4"/>
  <rect x="105" y="105" width="110" height="90" rx="6" fill="#D7EEF5"/>
  <path d="M120 130 Q160 110 200 130 Q160 150 120 130" fill="#7BC4D8"/>
""",
    ),
    "oil-radiators": (
        "#C45C26",
        "Oil radiator",
        """
  <g fill="#FFF7F2" stroke="#C45C26" stroke-width="4">
    <rect x="70" y="90" width="28" height="150" rx="10"/><rect x="105" y="80" width="28" height="160" rx="10"/>
    <rect x="140" y="70" width="28" height="170" rx="10"/><rect x="175" y="80" width="28" height="160" rx="10"/>
    <rect x="210" y="90" width="28" height="150" rx="10"/>
  </g>
  <rect x="95" y="245" width="130" height="18" rx="6" fill="#E8A87C"/>
""",
    ),
    "electric-blankets": (
        "#C45C26",
        "Electric blanket",
        """
  <rect x="60" y="90" width="200" height="150" rx="16" fill="#FFF7F2" stroke="#C45C26" stroke-width="4"/>
  <path d="M80 120 H240 M80 150 H240 M80 180 H240 M80 210 H240" stroke="#E8A87C" stroke-width="3"/>
  <circle cx="250" cy="200" r="10" fill="#C45C26"/>
""",
    ),
    "heated-airers": (
        "#C45C26",
        "Heated airer",
        """
  <g stroke="#C45C26" stroke-width="5" fill="none">
    <path d="M80 240 L120 80 H200 L240 240"/>
    <line x1="110" y1="130" x2="210" y2="130"/><line x1="100" y1="170" x2="220" y2="170"/><line x1="90" y1="210" x2="230" y2="210"/>
  </g>
""",
    ),
    "fridges-freezers": (
        "#0B6E8A",
        "Fridge freezer",
        """
  <rect x="100" y="50" width="120" height="230" rx="12" fill="#F4FAFC" stroke="#0B6E8A" stroke-width="4"/>
  <line x1="100" y1="150" x2="220" y2="150" stroke="#0B6E8A" stroke-width="4"/>
  <rect x="205" y="80" width="8" height="40" rx="2" fill="#0B6E8A"/>
  <rect x="205" y="180" width="8" height="50" rx="2" fill="#0B6E8A"/>
""",
    ),
    "patio-heaters": (
        "#C45C26",
        "Patio heater",
        """
  <ellipse cx="160" cy="70" rx="55" ry="18" fill="#FFF7F2" stroke="#C45C26" stroke-width="4"/>
  <rect x="150" y="85" width="20" height="150" fill="#E8A87C"/>
  <ellipse cx="160" cy="250" rx="40" ry="12" fill="#FFF7F2" stroke="#C45C26" stroke-width="3"/>
""",
    ),
    "towel-radiators": (
        "#C45C26",
        "Towel radiator",
        """
  <rect x="110" y="55" width="100" height="220" rx="8" fill="#FFF7F2" stroke="#C45C26" stroke-width="4"/>
  <g stroke="#C45C26" stroke-width="8">
    <line x1="125" y1="90" x2="195" y2="90"/><line x1="125" y1="130" x2="195" y2="130"/>
    <line x1="125" y1="170" x2="195" y2="170"/><line x1="125" y1="210" x2="195" y2="210"/>
  </g>
""",
    ),
    "ice-makers": (
        "#0B6E8A",
        "Ice maker",
        """
  <rect x="95" y="90" width="130" height="150" rx="12" fill="#F4FAFC" stroke="#0B6E8A" stroke-width="4"/>
  <rect x="115" y="115" width="90" height="50" rx="6" fill="#D7EEF5"/>
  <g fill="#7BC4D8"><circle cx="130" cy="200" r="8"/><circle cx="155" cy="195" r="8"/><circle cx="180" cy="200" r="8"/></g>
""",
    ),
    "ceiling-fans": (
        "#0B6E8A",
        "Ceiling fan",
        """
  <circle cx="160" cy="160" r="18" fill="#0B6E8A"/>
  <g fill="#D7EEF5" stroke="#0B6E8A" stroke-width="3">
    <ellipse cx="160" cy="95" rx="18" ry="55"/><ellipse cx="160" cy="225" rx="18" ry="55"/>
    <ellipse cx="95" cy="160" rx="55" ry="18"/><ellipse cx="225" cy="160" rx="55" ry="18"/>
  </g>
""",
    ),
    "mini-fridges": (
        "#0B6E8A",
        "Mini fridge",
        """
  <rect x="110" y="80" width="100" height="170" rx="10" fill="#F4FAFC" stroke="#0B6E8A" stroke-width="4"/>
  <rect x="195" y="120" width="8" height="45" rx="2" fill="#0B6E8A"/>
""",
    ),
    "wine-coolers": (
        "#0B6E8A",
        "Wine cooler",
        """
  <rect x="115" y="60" width="90" height="210" rx="10" fill="#F4FAFC" stroke="#0B6E8A" stroke-width="4"/>
  <g fill="#7BC4D8" opacity="0.8">
    <rect x="130" y="85" width="60" height="12" rx="2"/><rect x="130" y="115" width="60" height="12" rx="2"/>
    <rect x="130" y="145" width="60" height="12" rx="2"/><rect x="130" y="175" width="60" height="12" rx="2"/>
  </g>
""",
    ),
    "chest-freezers": (
        "#0B6E8A",
        "Chest freezer",
        """
  <rect x="60" y="120" width="200" height="110" rx="12" fill="#F4FAFC" stroke="#0B6E8A" stroke-width="4"/>
  <rect x="60" y="120" width="200" height="28" rx="12" fill="#D7EEF5" stroke="#0B6E8A" stroke-width="4"/>
""",
    ),
    "tumble-dryers": (
        "#C45C26",
        "Tumble dryer",
        """
  <rect x="85" y="60" width="150" height="210" rx="14" fill="#FFF7F2" stroke="#C45C26" stroke-width="4"/>
  <circle cx="160" cy="165" r="55" fill="#F4FAFC" stroke="#C45C26" stroke-width="4"/>
  <circle cx="160" cy="165" r="30" fill="#E8A87C"/>
""",
    ),
    "smart-thermostats": (
        "#C45C26",
        "Smart thermostat",
        """
  <rect x="110" y="90" width="100" height="140" rx="24" fill="#FFF7F2" stroke="#C45C26" stroke-width="4"/>
  <circle cx="160" cy="155" r="32" fill="#F4FAFC" stroke="#C45C26" stroke-width="3"/>
  <text x="160" y="162" text-anchor="middle" font-family="Georgia, serif" font-size="22" fill="#C45C26">21°</text>
""",
    ),
    "air-quality-monitors": (
        "#0B6E8A",
        "Air quality",
        """
  <rect x="120" y="90" width="80" height="140" rx="16" fill="#F4FAFC" stroke="#0B6E8A" stroke-width="4"/>
  <circle cx="160" cy="140" r="16" fill="#7BC4D8"/>
  <rect x="140" y="175" width="40" height="8" rx="2" fill="#0B6E8A"/>
""",
    ),
    "default": (
        "#0B6E8A",
        "Product",
        """
  <rect x="90" y="80" width="140" height="160" rx="16" fill="#F4FAFC" stroke="#0B6E8A" stroke-width="4"/>
  <circle cx="160" cy="160" r="28" fill="#D7EEF5" stroke="#0B6E8A" stroke-width="3"/>
""",
    ),
}

for slug, (accent, label, body) in scenes.items():
    svg = f"""<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 320 320">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#F7F3EC"/>
      <stop offset="100%" stop-color="#E7EEF1"/>
    </linearGradient>
  </defs>
  <rect width="320" height="320" fill="url(#bg)"/>
  <circle cx="260" cy="50" r="70" fill="{accent}" opacity="0.08"/>
  <circle cx="40" cy="280" r="90" fill="{accent}" opacity="0.06"/>
  {body}
  <text x="160" y="305" text-anchor="middle" font-family="Georgia, serif" font-size="14" fill="{accent}" opacity="0.85">{label}</text>
</svg>
"""
    (out / f"{slug}.svg").write_text(svg, encoding="utf-8")

# Remove flaky remote JPGs so we don't ship wrong stock
for jpg in out.glob("*.jpg"):
    jpg.unlink()

print(f"wrote {len(scenes)} svgs, removed jpgs")
