#!/usr/bin/env python3
"""
Restore and enrich German (DE) portable air conditioner products in Supabase.
Rebuilds the full data payload for each product (preserving original fields + enrichment).
"""
import json, os
from urllib.request import Request, urlopen

SERVICE_KEY = None
SUPABASE_URL = None
with open('/root/comparethecool/.env') as f:
    for line in f:
        line = line.strip()
        if 'SUPABASE_SERVICE_ROLE_KEY=' in line:
            SERVICE_KEY = line.split('=', 1)[1]
        if 'NEXT_PUBLIC_SUPABASE_URL=' in line:
            SUPABASE_URL = line.split('=', 1)[1]

print(f"Supabase URL: {SUPABASE_URL}")

# Complete product data: original seed fields + new enrichment
PRODUCTS = {
    "de-midea-portasplit": {
        "name": "Midea PortaSplit 12000 BTU",
        "slug": "de-midea-portasplit",
        "brand": "Midea",
        "category": "portable-air-conditioners",
        "btu": 12000,
        "popularity": 100,
        "offers": [
            {"url": "https://www.amazon.de/dp/B0CQZ2K5RF?tag=ctc.de-21", "price": 699.99, "status": "in_stock",
             "retailer": {"id": "amazon", "name": "Amazon"}, "lastChecked": "2026-07-21T02:37:04.289Z"},
            {"url": "https://www.ebay.de/sch/i.html?_nkw=Midea%20PortaSplit%2012000%20BTU&campid=5339164583",
             "price": 649.99, "status": "in_stock",
             "retailer": {"id": "ebay", "name": "eBay"}, "lastChecked": "2026-07-21T02:37:04.289Z"}
        ],
        "noise_db": 63, "energy_rating": "A", "weight_kg": 30.0,
        "dimensions_cm": "46.5 x 45.5 x 74.5", "room_size_m2": 38,
        "image": "https://m.media-amazon.com/images/I/51+g5Jz5lLL._AC_SL1500_.jpg",
        "amazon_asin": "B0CQZ2K5RF",
        "features": ["Split-Design (Lärm außen)", "Kühlung und Heizung (Wärmepumpe)", "Fernbedienung", "24h Timer",
                     "Auto-Restart", "Schlauchset für Semi-Permanent-Installation"],
        "pros": ["Extrem leise im Innenbereich (Split-Design, Lärm außen)", "Hervorragende Kühlleistung 12000 BTU",
                 "Wärmepumpe für Übergangszeit nutzbar", "Hohe Energieeffizienz mit A-Rating"],
        "cons": ["Aufwändige Installation (Schlauch durch Wand/Außenfenster)", "Höherer Preis als Monoblock-Geräte",
                 "Großes und schweres Gerät (30 kg)"],
        "verdict": "Die Midea PortaSplit ist die beste Wahl für alle, die Wert auf leisen Betrieb legen. Durch das Split-Design bleibt der Kompressorlärm draußen, während innen nur die Ventilator-Geräusche hörbar sind. Ideal für Schlafzimmer und Räume, in denen Ruhe wichtig ist."
    },
    "de-delonghi-ex105": {
        "name": "DeLonghi Pinguino PAC EX105",
        "slug": "de-delonghi-ex105",
        "brand": "DeLonghi", "category": "portable-air-conditioners", "btu": 11000, "popularity": 95,
        "offers": [
            {"url": "https://www.amazon.de/dp/B0DFZP6KC3?tag=ctc.de-21", "price": 799.99, "status": "in_stock",
             "retailer": {"id": "amazon", "name": "Amazon"}, "lastChecked": "2026-07-21T02:37:04.289Z"},
            {"url": "https://www.ebay.de/sch/i.html?_nkw=DeLonghi%20Pinguino%20PAC%20EX105&campid=5339164583",
             "price": 749.99, "status": "in_stock",
             "retailer": {"id": "ebay", "name": "eBay"}, "lastChecked": "2026-07-21T02:37:04.289Z"}
        ],
        "noise_db": 65, "energy_rating": "A+", "weight_kg": 33.0,
        "dimensions_cm": "45.0 x 40.0 x 77.0", "room_size_m2": 35,
        "image": "https://m.media-amazon.com/images/I/61fDT1WWNjL._AC_SL1500_.jpg",
        "amazon_asin": "B0DFZP6KC3",
        "features": ["Wärmepumpe (Heizen und Kühlen)", "4 Betriebsmodi (Kühlen, Heizen, Lüften, Entfeuchten)",
                     "Fernbedienung", "24h Timer", "De'Longhi App Steuerung (WiFi)", "Easy-Flow Rollen",
                     "Waschbarer Filter"],
        "pros": ["WiFi-Steuerung über De'Longhi App", "Wärmepumpe für Heizbetrieb im Herbst/Frühling",
                 "Hochwertige Verarbeitung, italienisches Design", "A+ Energieeffizienz"],
        "cons": ["Hoher Anschaffungspreis", "Relativ schwer (33 kg)", "Abluftschlauch muss nach draußen geführt werden"],
        "verdict": "Der DeLonghi Pinguino PAC EX105 ist ein Premium-Klimagerät mit bester Verarbeitungsqualität. Die WiFi-Funktion und die Wärmepumpe machen ihn zu einer ganzjährigen Lösung. Die Investition lohnt sich für anspruchsvolle Nutzer."
    },
    "de-comfee-breezy": {
        "name": "Comfee Breezy Cool Pro 9000 BTU",
        "slug": "de-comfee-breezy",
        "brand": "Comfee", "category": "portable-air-conditioners", "btu": 9000, "popularity": 90,
        "offers": [
            {"url": "https://www.amazon.de/dp/B0DCGCP5V8?tag=ctc.de-21", "price": 299.99, "status": "in_stock",
             "retailer": {"id": "amazon", "name": "Amazon"}, "lastChecked": "2026-07-21T02:37:04.289Z"},
            {"url": "https://www.ebay.de/sch/i.html?_nkw=Comfee%20Breezy%20Cool%20Pro%209000%20BTU&campid=5339164583",
             "price": 279.99, "status": "in_stock",
             "retailer": {"id": "ebay", "name": "eBay"}, "lastChecked": "2026-07-21T02:37:04.289Z"}
        ],
        "noise_db": 54, "energy_rating": "A", "weight_kg": 23.5,
        "dimensions_cm": "42.0 x 35.0 x 69.0", "room_size_m2": 28,
        "image": "https://m.media-amazon.com/images/I/71bp0HkJysL._AC_SL1500_.jpg",
        "amazon_asin": "B0DCGCP5V8",
        "features": ["Entfeuchter-Funktion", "3 Lüftergeschwindigkeiten", "Fernbedienung", "24h Timer",
                     "Waschbarer Luftfilter", "Abluftschlauch inklusive", "ECO-Modus"],
        "pros": ["Hervorragendes Preis-Leistungs-Verhältnis", "Leiser Betrieb (54 dB)", "Leicht und mobil (23,5 kg)",
                 "ECO-Modus spart Energie"],
        "cons": ["Nur 9000 BTU - für größere Räume zu schwach", "Einfachere Ausstattung als teurere Modelle",
                 "Keine Wärmepumpe / nur Kühlbetrieb"],
        "verdict": "Der Comfee Breezy Cool Pro bietet das beste Preis-Leistungs-Verhältnis. Ideal für kleinere Räume bis 28 m² und Nutzer mit begrenztem Budget, die dennoch eine zuverlässige Kühlung wünschen."
    },
    "de-trotec-pac3500": {
        "name": "TROTEC PAC 3500 X",
        "slug": "de-trotec-pac3500",
        "brand": "TROTEC", "category": "portable-air-conditioners", "btu": 12000, "popularity": 85,
        "offers": [
            {"url": "https://www.amazon.de/dp/B0B1QFL1W5?tag=ctc.de-21", "price": 589.99, "status": "in_stock",
             "retailer": {"id": "amazon", "name": "Amazon"}, "lastChecked": "2026-07-21T02:37:04.289Z"},
            {"url": "https://www.ebay.de/sch/i.html?_nkw=TROTEC%20PAC%203500%20X&campid=5339164583",
             "price": 549.99, "status": "in_stock",
             "retailer": {"id": "ebay", "name": "eBay"}, "lastChecked": "2026-07-21T02:37:04.289Z"}
        ],
        "noise_db": 65, "energy_rating": "A+", "weight_kg": 32.0,
        "dimensions_cm": "51.0 x 37.5 x 72.5", "room_size_m2": 38,
        "image": "https://m.media-amazon.com/images/I/61jQ6HgV5IL._AC_SL1500_.jpg",
        "amazon_asin": "B0B1QFL1W5",
        "features": ["Kühlung und Heizung (Wärmepumpe)", "Entfeuchter-Funktion", "Lüfter-Funktion",
                     "Fernbedienung", "24h Timer", "Auto-Swing", "Kondensat-Abfluss (Dauerbetrieb möglich)"],
        "pros": ["Starke 12000 BTU Kühlleistung", "Wärmepumpe für Heizbetrieb", "A+ Energieeffizienz",
                 "Dauerhafter Betrieb durch Kondensat-Abfluss"],
        "cons": ["Lauter Betrieb (65 dB)", "Schweres Gerät (32 kg)", "Abmessungen relativ groß"],
        "verdict": "Der TROTEC PAC 3500 X ist ein kraftvoller Allrounder mit Wärmepumpe und starker Kühlleistung. Ideal für größere Räume, in denen der Geräuschpegel weniger ins Gewicht fällt."
    },
    "de-klartein-kraft": {
        "name": "Klarstein Kraftwerk 12000 BTU",
        "slug": "de-klartein-kraft",
        "brand": "Klarstein", "category": "portable-air-conditioners", "btu": 12000, "popularity": 80,
        "offers": [
            {"url": "https://www.amazon.de/dp/B08H3W1T5Q?tag=ctc.de-21", "price": 459.99, "status": "out_of_stock",
             "retailer": {"id": "amazon", "name": "Amazon"}, "lastChecked": "2026-07-21T02:37:04.289Z"},
            {"url": "https://www.ebay.de/sch/i.html?_nkw=Klarstein%20Kraftwerk%2012000%20BTU&campid=5339164583",
             "price": 429.99, "status": "in_stock",
             "retailer": {"id": "ebay", "name": "eBay"}, "lastChecked": "2026-07-21T02:37:04.289Z"}
        ],
        "noise_db": 64, "energy_rating": "A", "weight_kg": 28.0,
        "dimensions_cm": "47.0 x 38.0 x 65.0", "room_size_m2": 38,
        "image": "https://m.media-amazon.com/images/I/71GZJzFs1lL._AC_SL1500_.jpg",
        "amazon_asin": "B08H3W1T5Q",
        "features": ["3-in-1 (Kühlen, Lüften, Entfeuchten)", "LED-Display", "Fernbedienung", "24h Timer",
                     "Schlauchanschluss für Dauerinstallation", "Kondensatbehälter mit Füllstandsanzeige"],
        "pros": ["Gutes Preis-Leistungs-Verhältnis für 12000 BTU", "Kompakte Bauweise für die Leistungsklasse",
                 "Einfache Bedienung über LED-Display und Fernbedienung"],
        "cons": ["Oft ausverkauft / schwer verfügbar", "Keine Wärmepumpe (nur Kühlbetrieb)",
                 "Entleeren des Kondensatbehälters nötig"],
        "verdict": "Der Klarstein Kraftwerk ist eine solide 12000-BTU-Option zu einem attraktiven Preis. Allerdings ist er häufig ausverkauft."
    },
    "de-aeg-chillflex": {
        "name": "AEG ChillFlex Pro 9000 BTU",
        "slug": "de-aeg-chillflex",
        "brand": "AEG", "category": "portable-air-conditioners", "btu": 9000, "popularity": 75,
        "offers": [
            {"url": "https://www.amazon.de/dp/B0D3Y9WLYC?tag=ctc.de-21", "price": 499.99, "status": "in_stock",
             "retailer": {"id": "amazon", "name": "Amazon"}, "lastChecked": "2026-07-21T02:37:04.289Z"},
            {"url": "https://www.ebay.de/sch/i.html?_nkw=AEG%20ChillFlex%20Pro%209000%20BTU&campid=5339164583",
             "price": 479.99, "status": "in_stock",
             "retailer": {"id": "ebay", "name": "eBay"}, "lastChecked": "2026-07-21T02:37:04.289Z"}
        ],
        "noise_db": 62, "energy_rating": "A+", "weight_kg": 26.5,
        "dimensions_cm": "42.0 x 36.5 x 70.0", "room_size_m2": 28,
        "image": "https://m.media-amazon.com/images/I/81sKB3aoYzL._AC_SL1500_.jpg",
        "amazon_asin": "B0D3Y9WLYC",
        "features": ["Wärmepumpe (Heizen und Kühlen)", "Entfeuchter-Funktion", "3 Lüftergeschwindigkeiten",
                     "Fernbedienung", "24h Timer", "Aktivkohlefilter", "Kindersicherung"],
        "pros": ["A+ Energieeffizienz spart Stromkosten", "Wärmepumpe für ganzjährige Nutzung",
                 "Kompakt und relativ leicht (26,5 kg)", "Kindersicherung für Familien"],
        "cons": ["Nur 9000 BTU - begrenzte Kühlleistung", "Mittleres Preissegment", "Keine App-Steuerung"],
        "verdict": "Der AEG ChillFlex Pro überzeugt mit exzellenter Energieeffizienz und Wärmepumpe zu einem fairen Preis. Ein zuverlässiges Gerät einer vertrauenswürdigen Marke."
    },
    "de-whirlpool-pacw": {
        "name": "Whirlpool PACW29HP 9000 BTU",
        "slug": "de-whirlpool-pacw",
        "brand": "Whirlpool", "category": "portable-air-conditioners", "btu": 9000, "popularity": 70,
        "offers": [
            {"url": "https://www.amazon.de/dp/B0CSL6HJGM?tag=ctc.de-21", "price": 449.99, "status": "low_stock",
             "retailer": {"id": "amazon", "name": "Amazon"}, "lastChecked": "2026-07-21T02:37:04.289Z"}
        ],
        "noise_db": 64, "energy_rating": "A+", "weight_kg": 29.0,
        "dimensions_cm": "44.5 x 39.0 x 72.0", "room_size_m2": 28,
        "image": "https://m.media-amazon.com/images/I/81nWrWlB3eL._AC_SL1500_.jpg",
        "amazon_asin": "B0CSL6HJGM",
        "features": ["6. Sinn Technologie (automatische Anpassung)", "Wärmepumpe (Heizen und Kühlen)",
                     "Entfeuchter-Funktion", "Fernbedienung", "24h Timer", "Anti-Bakterien-Filter",
                     "WiFi mit Whirlpool App"],
        "pros": ["6. Sinn Automatik passt Leistung optimal an", "WiFi-App-Steuerung",
                 "Wärmepumpe für Heizbetrieb", "A+ Energieeffizienz"],
        "cons": ["Nur 9000 BTU", "Niedrige Verfügbarkeit (low stock)", "Höherer Preis als vergleichbare Modelle"],
        "verdict": "Der Whirlpool PACW29HP ist ein intelligentes Klimagerät mit praktischer 6. Sinn Technologie. Die App-Anbindung und Wärmepumpe machen ihn zukunftssicher."
    },
    "de-hisense-easy": {
        "name": "Hisense EasyCool 12000 BTU",
        "slug": "de-hisense-easy",
        "brand": "Hisense", "category": "portable-air-conditioners", "btu": 12000, "popularity": 65,
        "offers": [
            {"url": "https://www.amazon.de/dp/B07S3H6NKG?tag=ctc.de-21", "price": 599.99, "status": "in_stock",
             "retailer": {"id": "amazon", "name": "Amazon"}, "lastChecked": "2026-07-21T02:37:04.289Z"},
            {"url": "https://www.ebay.de/sch/i.html?_nkw=Hisense%20EasyCool%2012000%20BTU&campid=5339164583",
             "price": 569.99, "status": "in_stock",
             "retailer": {"id": "ebay", "name": "eBay"}, "lastChecked": "2026-07-21T02:37:04.289Z"}
        ],
        "noise_db": 64, "energy_rating": "A", "weight_kg": 28.5,
        "dimensions_cm": "46.0 x 38.0 x 71.0", "room_size_m2": 38,
        "image": "https://m.media-amazon.com/images/I/81xt78udVLL._AC_SL1500_.jpg",
        "amazon_asin": "B07S3H6NKG",
        "features": ["Kühlung und Heizung (Wärmepumpe)", "Entfeuchter-Funktion", "Lüfter-Funktion",
                     "Fernbedienung", "24h Timer", "LED-Display", "ECO-Modus"],
        "pros": ["Starke 12000 BTU Kühlleistung", "Wärmepumpe inklusive", "Gutes Preis-Leistungs-Verhältnis",
                 "ECO-Modus für energiesparenden Betrieb"],
        "cons": ["Lauter Betrieb (64 dB)", "Keine App/WiFi-Steuerung", "Einfacheres Design als Mitbewerber"],
        "verdict": "Der Hisense EasyCool ist eine preiswerte 12000-BTU-Lösung mit Wärmepumpe. Er bietet solide Kühlleistung für größere Räume, verzichtet aber auf Smart-Funktionen."
    },
    "de-samsung-wind": {
        "name": "Samsung WindFree Comfort 9000 BTU",
        "slug": "de-samsung-wind",
        "brand": "Samsung", "category": "portable-air-conditioners", "btu": 9000, "popularity": 60,
        "offers": [
            {"url": "https://www.amazon.de/dp/B07PW9TJBB?tag=ctc.de-21", "price": 649.99, "status": "in_stock",
             "retailer": {"id": "amazon", "name": "Amazon"}, "lastChecked": "2026-07-21T02:37:04.289Z"},
            {"url": "https://www.ebay.de/sch/i.html?_nkw=Samsung%20WindFree%20Comfort%209000%20BTU&campid=5339164583",
             "price": 619.99, "status": "in_stock",
             "retailer": {"id": "ebay", "name": "eBay"}, "lastChecked": "2026-07-21T02:37:04.289Z"}
        ],
        "noise_db": 58, "energy_rating": "A+", "weight_kg": 24.5,
        "dimensions_cm": "41.0 x 34.0 x 72.0", "room_size_m2": 28,
        "image": "https://m.media-amazon.com/images/I/81L8hGtI5kL._AC_SL1500_.jpg",
        "amazon_asin": "B07PW9TJBB",
        "features": ["WindFree Technologie (leiser Luftstrom)", "Wärmepumpe (Heizen und Kühlen)",
                     "WiFi mit SmartThings App", "Sprachsteuerung (Alexa, Bixby)", "Entfeuchter-Funktion",
                     "Fernbedienung", "24h Timer", "Digitaler Inverter Kompressor"],
        "pros": ["Leiser Betrieb mit WindFree Technologie (58 dB)", "Smarte Steuerung über SmartThings und Sprache",
                 "Digitaler Inverter spart Energie", "A+ Energieeffizienz", "Kompakt und leicht (24,5 kg)"],
        "cons": ["Nur 9000 BTU - für 28 m² begrenzt", "Höherer Preis für die BTU-Klasse",
                 "Smart-Home-Integration erfordert Samsung-Ökosystem"],
        "verdict": "Der Samsung WindFree Comfort ist das technisch fortschrittlichste Gerät. Die WindFree-Technologie sorgt für einen zugfreien und leisen Luftstrom - perfekt für Schlafzimmer."
    },
    "de-daewoo-col": {
        "name": "Daewoo COL0900 9000 BTU",
        "slug": "de-daewoo-col",
        "brand": "Daewoo", "category": "portable-air-conditioners", "btu": 9000, "popularity": 55,
        "offers": [
            {"url": "https://www.amazon.de/dp/B0D7QQGYZF?tag=ctc.de-21", "price": 329.99, "status": "in_stock",
             "retailer": {"id": "amazon", "name": "Amazon"}, "lastChecked": "2026-07-21T02:37:04.289Z"},
            {"url": "https://www.ebay.de/sch/i.html?_nkw=Daewoo%20COL0900%209000%20BTU&campid=5339164583",
             "price": 299.99, "status": "in_stock",
             "retailer": {"id": "ebay", "name": "eBay"}, "lastChecked": "2026-07-21T02:37:04.289Z"}
        ],
        "noise_db": 61, "energy_rating": "A", "weight_kg": 22.0,
        "dimensions_cm": "38.0 x 33.0 x 65.0", "room_size_m2": 28,
        "image": "https://m.media-amazon.com/images/I/71QY4s+wMNL._AC_SL1500_.jpg",
        "amazon_asin": "B0D7QQGYZF",
        "features": ["Kühlung und Entfeuchtung", "3 Lüftergeschwindigkeiten", "Fernbedienung", "24h Timer",
                     "Waschbarer Filter", "Abluftschlauch und Fensterdichtung inklusive"],
        "pros": ["Günstigster Preis in dieser Liste", "Leicht und kompakt (22 kg)", "Leiser Betrieb (61 dB)",
                 "Komplett-Set mit Fensterdichtung"],
        "cons": ["Keine Wärmepumpe / Heizfunktion", "Nur 9000 BTU", "Einfachere Ausstattung ohne Smart-Features",
                 "Nicht für größere Räume geeignet"],
        "verdict": "Der Daewoo COL0900 ist die preisgünstigste Option für eine einfache und effektive Kühlung kleiner Räume. Keine Kompromisse bei der Kühlleistung, aber ohne Extras."
    }
}

# First, update the stock_status and price derived columns to match
def update_product(product_id, data):
    """Replace the full data field for a product."""
    url = f"{SUPABASE_URL}/rest/v1/ctc_products?id=eq.{product_id}"
    body = {"data": data}
    
    req = Request(url, data=json.dumps(body).encode(),
                  headers={"apikey": SERVICE_KEY, "Authorization": f"Bearer {SERVICE_KEY}",
                           "Content-Type": "application/json", "Prefer": "return=representation"},
                  method="PATCH")
    try:
        resp = urlopen(req, timeout=15)
        result = json.loads(resp.read().decode())
        return result[0] if result else None
    except Exception as e:
        print(f"  FAILED: {e}")
        return None

success = 0
for pid, data in sorted(PRODUCTS.items()):
    print(f"Updating {pid} ('{data['name']}')...")
    result = update_product(pid, data)
    if result:
        rd = result["data"]
        fields = [k for k in ["name", "brand", "btu", "noise_db", "energy_rating", "features", "pros", "cons", "verdict", "image", "offers"] if k in rd]
        print(f"  OK - {len(fields)} fields ({', '.join(fields[:6])}...)")
        success += 1
    else:
        print(f"  FAILED")
    print()

print(f"\nDone: {success}/{len(PRODUCTS)} updated successfully")
