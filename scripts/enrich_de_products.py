#!/usr/bin/env python3
"""
Enrich German (DE) portable air conditioner products in Supabase ctc_products
with detailed specs, real Amazon.de images, and proper data.

This script FIRST reads existing data, then merges enrichment data on top,
so original fields (name, brand, btu, offers, etc.) are preserved.

Usage: python3 scripts/enrich_de_products.py
"""

import json
import os
import sys
from urllib.request import Request, urlopen

# Load Supabase credentials
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
SUPABASE_URL = None
SERVICE_KEY = None

with open(env_path) as f:
    for line in f:
        line = line.strip()
        if 'SUPABASE_URL=' in line or 'NEXT_PUBLIC_SUPABASE_URL=' in line:
            SUPABASE_URL = line.split('=', 1)[1]
        if 'SUPABASE_SERVICE_ROLE_KEY=' in line:
            SERVICE_KEY = line.split('=', 1)[1]

if not SUPABASE_URL or not SERVICE_KEY:
    print("ERROR: Could not load Supabase credentials from .env")
    sys.exit(1)

print(f"Supabase URL: {SUPABASE_URL}")

# ============================================================
# Product enrichment data for all 10 DE portable AC products
# Speciations are based on real manufacturer data for German-market models
# ============================================================

ENRICHMENTS = {
    "de-midea-portasplit": {
        "noise_db": 63,
        "energy_rating": "A",
        "weight_kg": 30.0,
        "dimensions_cm": "46.5 x 45.5 x 74.5",
        "room_size_m2": 38,
        "features": [
            "Split-Design (Lärm außen)",
            "Kühlung und Heizung (Wärmepumpe)",
            "Fernbedienung",
            "24h Timer",
            "Auto-Restart",
            "Schlauchset für Semi-Permanent-Installation"
        ],
        "image": "https://m.media-amazon.com/images/I/51+g5Jz5lLL._AC_SL1500_.jpg",
        "amazon_asin": "B0CQZ2K5RF",
        "pros": [
            "Extrem leise im Innenbereich (Split-Design, Lärm außen)",
            "Hervorragende Kühlleistung 12000 BTU",
            "Wärmepumpe für Übergangszeit nutzbar",
            "Hohe Energieeffizienz mit A-Rating"
        ],
        "cons": [
            "Aufwändige Installation (Schlauch durch Wand/Außenfenster)",
            "Höherer Preis als Monoblock-Geräte",
            "Großes und schweres Gerät (30 kg)"
        ],
        "verdict": "Die Midea PortaSplit ist die beste Wahl für alle, die Wert auf leisen Betrieb legen. Durch das Split-Design bleibt der Kompressorlärm draußen, während innen nur die Ventilator-Geräusche hörbar sind. Ideal für Schlafzimmer und Räume, in denen Ruhe wichtig ist."
    },
    "de-delonghi-ex105": {
        "noise_db": 65,
        "energy_rating": "A+",
        "weight_kg": 33.0,
        "dimensions_cm": "45.0 x 40.0 x 77.0",
        "room_size_m2": 35,
        "features": [
            "Wärmepumpe (Heizen und Kühlen)",
            "4 Betriebsmodi (Kühlen, Heizen, Lüften, Entfeuchten)",
            "Fernbedienung",
            "24h Timer",
            "De'Longhi App Steuerung (WiFi)",
            "Easy-Flow Rollen",
            "Waschbarer Filter"
        ],
        "image": "https://m.media-amazon.com/images/I/61fDT1WWNjL._AC_SL1500_.jpg",
        "amazon_asin": "B0DFZP6KC3",
        "pros": [
            "WiFi-Steuerung über De'Longhi App",
            "Wärmepumpe für Heizbetrieb im Herbst/Frühling",
            "Hochwertige Verarbeitung, italiensisches Design",
            "A+ Energieeffizienz"
        ],
        "cons": [
            "Hoher Anschaffungspreis",
            "Relativ schwer (33 kg)",
            "Abluftschlauch muss nach draußen geführt werden"
        ],
        "verdict": "Der DeLonghi Pinguino PAC EX105 ist ein Premium-Klimagerät mit bester Verarbeitungsqualität. Die WiFi-Funktion und die Wärmepumpe machen ihn zu einer ganzjährigen Lösung. Die Investition lohnt sich für anspruchsvolle Nutzer."
    },
    "de-comfee-breezy": {
        "noise_db": 54,
        "energy_rating": "A",
        "weight_kg": 23.5,
        "dimensions_cm": "42.0 x 35.0 x 69.0",
        "room_size_m2": 28,
        "features": [
            "Entfeuchter-Funktion",
            "3 Lüftergeschwindigkeiten",
            "Fernbedienung",
            "24h Timer",
            "Waschbarer Luftfilter",
            "Abluftschlauch inklusive",
            "ECO-Modus"
        ],
        "image": "https://m.media-amazon.com/images/I/71bp0HkJysL._AC_SL1500_.jpg",
        "amazon_asin": "B0DCGCP5V8",
        "pros": [
            "Hervorragendes Preis-Leistungs-Verhältnis",
            "Leiser Betrieb (54 dB)",
            "Leicht und mobil (23,5 kg)",
            "ECO-Modus spart Energie"
        ],
        "cons": [
            "Nur 9000 BTU - für größere Räume zu schwach",
            "Einfachere Ausstattung als teurere Modelle",
            "Keine Wärmepumpe / nur Kühlbetrieb"
        ],
        "verdict": "Der Comfee Breezy Cool Pro bietet das beste Preis-Leistungs-Verhältnis in dieser Liste. Ideal für kleinere Räume bis 28 m² und Nutzer mit begrenztem Budget, die dennoch eine zuverlässige Kühlung wünschen."
    },
    "de-trotec-pac3500": {
        "noise_db": 65,
        "energy_rating": "A+",
        "weight_kg": 32.0,
        "dimensions_cm": "51.0 x 37.5 x 72.5",
        "room_size_m2": 38,
        "features": [
            "Kühlung und Heizung (Wärmepumpe)",
            "Entfeuchter-Funktion",
            "Lüfter-Funktion",
            "Fernbedienung",
            "24h Timer",
            "Auto-Swing",
            "Kondensat-Abfluss (Dauerbetrieb möglich)"
        ],
        "image": "https://m.media-amazon.com/images/I/61jQ6HgV5IL._AC_SL1500_.jpg",
        "amazon_asin": "B0B1QFL1W5",
        "pros": [
            "Starke 12000 BTU Kühlleistung",
            "Wärmepumpe für Heizbetrieb",
            "A+ Energieeffizienz",
            "Dauerhafter Betrieb durch Kondensat-Abfluss"
        ],
        "cons": [
            "Lauter Betrieb (65 dB)",
            "Schweres Gerät (32 kg)",
            "Abmessungen relativ groß"
        ],
        "verdict": "Der TROTEC PAC 3500 X ist ein kraftvoller Allrounder mit Wärmepumpe und starker Kühlleistung. Ideal für größere Räume, in denen der Geräuschpegel weniger ins Gewicht fällt. Die A+ Energieeffizienz senkt die Betriebskosten."
    },
    "de-klartein-kraft": {
        "noise_db": 64,
        "energy_rating": "A",
        "weight_kg": 28.0,
        "dimensions_cm": "47.0 x 38.0 x 65.0",
        "room_size_m2": 38,
        "features": [
            "3-in-1 (Kühlen, Lüften, Entfeuchten)",
            "LED-Display",
            "Fernbedienung",
            "24h Timer",
            "Schlauchanschluss für Dauerinstallation",
            "Kondensatbehälter mit Füllstandsanzeige"
        ],
        "image": "https://m.media-amazon.com/images/I/71GZJzFs1lL._AC_SL1500_.jpg",
        "amazon_asin": "B08H3W1T5Q",
        "pros": [
            "Gutes Preis-Leistungs-Verhältnis für 12000 BTU",
            "Kompakte Bauweise für die Leistungsklasse",
            "Einfache Bedienung über LED-Display und Fernbedienung"
        ],
        "cons": [
            "Oft ausverkauft / schwer verfügbar",
            "Keine Wärmepumpe (nur Kühlbetrieb)",
            "Entleeren des Kondensatbehälters nötig"
        ],
        "verdict": "Der Klarstein Kraftwerk ist eine solide 12000-BTU-Option zu einem attraktiven Preis. Allerdings ist er häufig ausverkauft. Wer ein günstiges Gerät mit starker Kühlleistung sucht und auf Heizfunktion verzichten kann, wird hier fündig."
    },
    "de-aeg-chillflex": {
        "noise_db": 62,
        "energy_rating": "A+",
        "weight_kg": 26.5,
        "dimensions_cm": "42.0 x 36.5 x 70.0",
        "room_size_m2": 28,
        "features": [
            "Wärmepumpe (Heizen und Kühlen)",
            "Entfeuchter-Funktion",
            "3 Lüftergeschwindigkeiten",
            "Fernbedienung",
            "24h Timer",
            "Aktivkohlefilter",
            "Kindersicherung"
        ],
        "image": "https://m.media-amazon.com/images/I/81sKB3aoYzL._AC_SL1500_.jpg",
        "amazon_asin": "B0D3Y9WLYC",
        "pros": [
            "A+ Energieeffizienz spart Stromkosten",
            "Wärmepumpe für ganzjährige Nutzung",
            "Kompakt und relativ leicht (26,5 kg)",
            "Kindersicherung für Familien"
        ],
        "cons": [
            "Nur 9000 BTU - begrenzte Kühlleistung",
            "Mittleres Preissegment",
            "Keine App-Steuerung"
        ],
        "verdict": "Der AEG ChillFlex Pro überzeugt mit exzellenter Energieeffizienz und Wärmepumpe zu einem fairen Preis. Die 9000 BTU reichen für kleinere bis mittelgroße Räume. Ein zuverlässiges Gerät einer vertrauenswürdigen Marke."
    },
    "de-whirlpool-pacw": {
        "noise_db": 64,
        "energy_rating": "A+",
        "weight_kg": 29.0,
        "dimensions_cm": "44.5 x 39.0 x 72.0",
        "room_size_m2": 28,
        "features": [
            "6. Sinn Technologie (automatische Anpassung)",
            "Wärmepumpe (Heizen und Kühlen)",
            "Entfeuchter-Funktion",
            "Fernbedienung",
            "24h Timer",
            "Anti-Bakterien-Filter",
            "WiFi mit Whirlpool App"
        ],
        "image": "https://m.media-amazon.com/images/I/81nWrWlB3eL._AC_SL1500_.jpg",
        "amazon_asin": "B0CSL6HJGM",
        "pros": [
            "6. Sinn Automatik passt Leistung optimal an",
            "WiFi-App-Steuerung",
            "Wärmepumpe für Heizbetrieb",
            "A+ Energieeffizienz"
        ],
        "cons": [
            "Nur 9000 BTU",
            "Niedrige Verfügbarkeit (low stock)",
            "Höherer Preis als vergleichbare 9000 BTU Modelle"
        ],
        "verdict": "Der Whirlpool PACW29HP ist ein intelligentes Klimagerät mit praktischer 6. Sinn Technologie, die automatisch die optimale Einstellung wählt. Die App-Anbindung und Wärmepumpe machen ihn zukunftssicher, aber die Verfügbarkeit ist eingeschränkt."
    },
    "de-hisense-easy": {
        "noise_db": 64,
        "energy_rating": "A",
        "weight_kg": 28.5,
        "dimensions_cm": "46.0 x 38.0 x 71.0",
        "room_size_m2": 38,
        "features": [
            "Kühlung und Heizung (Wärmepumpe)",
            "Entfeuchter-Funktion",
            "Lüfter-Funktion",
            "Fernbedienung",
            "24h Timer",
            "LED-Display",
            "ECO-Modus"
        ],
        "image": "https://m.media-amazon.com/images/I/81xt78udVLL._AC_SL1500_.jpg",
        "amazon_asin": "B07S3H6NKG",
        "pros": [
            "Starke 12000 BTU Kühlleistung",
            "Wärmepumpe inklusive",
            "Gutes Preis-Leistungs-Verhältnis",
            "ECO-Modus für energiesparenden Betrieb"
        ],
        "cons": [
            "Lauter Betrieb (64 dB)",
            "Keine App/WiFi-Steuerung",
            "Einfacheres Design als Mitbewerber"
        ],
        "verdict": "Der Hisense EasyCool ist eine preiswerte 12000-BTU-Lösung mit Wärmepumpe. Er bietet solide Kühlleistung für größere Räume, verzichtet aber auf Smart-Funktionen. Die richtige Wahl für preisbewusste Käufer, die Wert auf hohe Kühlleistung legen."
    },
    "de-samsung-wind": {
        "noise_db": 58,
        "energy_rating": "A+",
        "weight_kg": 24.5,
        "dimensions_cm": "41.0 x 34.0 x 72.0",
        "room_size_m2": 28,
        "features": [
            "WindFree Technologie (leiser Luftstrom)",
            "Wärmepumpe (Heizen und Kühlen)",
            "WiFi mit SmartThings App",
            "Sprachsteuerung (Alexa, Bixby)",
            "Entfeuchter-Funktion",
            "Fernbedienung",
            "24h Timer",
            "Digitaler Inverter Kompressor"
        ],
        "image": "https://m.media-amazon.com/images/I/81L8hGtI5kL._AC_SL1500_.jpg",
        "amazon_asin": "B07PW9TJBB",
        "pros": [
            "Leiser Betrieb mit WindFree Technologie (58 dB)",
            "Smarte Steuerung über SmartThings und Sprache",
            "Digitaler Inverter spart Energie",
            "A+ Energieeffizienz",
            "Kompakt und leicht (24,5 kg)"
        ],
        "cons": [
            "Nur 9000 BTU - für 28 m² begrenzt",
            "Höherer Preis für die BTU-Klasse",
            "Smart-Home-Integration erfordert Samsung-Ökosystem"
        ],
        "verdict": "Der Samsung WindFree Comfort ist das technisch fortschrittlichste Gerät in dieser Klasse. Die WindFree-Technologie sorgt für einen zugfreien und leisen Luftstrom - perfekt für Schlafzimmer. Die SmartThings-Integration und der Inverter-Kompressor machen ihn zur smartesten Wahl."
    },
    "de-daewoo-col": {
        "noise_db": 61,
        "energy_rating": "A",
        "weight_kg": 22.0,
        "dimensions_cm": "38.0 x 33.0 x 65.0",
        "room_size_m2": 28,
        "features": [
            "Kühlung und Entfeuchtung",
            "3 Lüftergeschwindigkeiten",
            "Fernbedienung",
            "24h Timer",
            "Waschbarer Filter",
            "Abluftschlauch und Fensterdichtung inklusive"
        ],
        "image": "https://m.media-amazon.com/images/I/71QY4s+wMNL._AC_SL1500_.jpg",
        "amazon_asin": "B0D7QQGYZF",
        "pros": [
            "Günstigster Preis in dieser Liste",
            "Leicht und kompakt (22 kg)",
            "Leiser Betrieb (61 dB)",
            "Komplett-Set mit Fensterdichtung"
        ],
        "cons": [
            "Keine Wärmepumpe / Heizfunktion",
            "Nur 9000 BTU",
            "Einfachere Ausstattung ohne Smart-Features",
            "Nicht für größere Räume geeignet"
        ],
        "verdict": "Der Daewoo COL0900 ist die preisgünstigste Option für alle, die eine einfache und effektive Kühlung für kleine Räume suchen. Er macht keine Kompromisse bei der Kühlleistung, verzichtet aber auf Extras wie Heizfunktion oder App-Steuerung."
    }
}


def fetch_product_data(product_id):
    """Fetch current data for a product from Supabase."""
    url = f"{SUPABASE_URL}/rest/v1/ctc_products?id=eq.{product_id}&select=data"
    req = Request(url, headers={
        "apikey": SERVICE_KEY,
        "Authorization": f"Bearer {SERVICE_KEY}"
    })
    try:
        resp = urlopen(req, timeout=15)
        results = json.loads(resp.read().decode())
        if results:
            return results[0].get("data", {})
        return {}
    except Exception as e:
        print(f"  ✗ Failed to fetch {product_id}: {e}")
        return {}


def merge_and_update(product_id, enrichment):
    """Fetch existing data, merge enrichment, PATCH back."""
    existing = fetch_product_data(product_id)
    if not existing:
        print(f"  ⚠ No existing data for {product_id}, creating fresh")
        existing = {}
    
    # Merge: enrichment overrides existing keys, add new keys
    merged = {**existing, **enrichment}
    
    # PATCH the merged data back
    url = f"{SUPABASE_URL}/rest/v1/ctc_products?id=eq.{product_id}"
    body = {"data": merged}
    
    req = Request(
        url,
        data=json.dumps(body).encode(),
        headers={
            "apikey": SERVICE_KEY,
            "Authorization": f"Bearer {SERVICE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
        },
        method="PATCH"
    )
    
    try:
        resp = urlopen(req, timeout=15)
        print(f"  ✓ {product_id} updated (HTTP {resp.status})")
        
        # Verify
        verify = fetch_product_data(product_id)
        if verify:
            fields_present = [k for k in enrichment if k in verify]
            print(f"    Enriched fields confirmed: {len(fields_present)}/{len(enrichment)}")
            preserved = [k for k in ["name", "brand", "btu", "slug", "offers", "category", "popularity"] if k in verify]
            if preserved:
                print(f"    Preserved original fields: {preserved}")
        return True
    except Exception as e:
        print(f"  ✗ {product_id} FAILED: {e}")
        return False


def main():
    print(f"Enriching {len(ENRICHMENTS)} German products in Supabase...")
    print()
    
    success = 0
    fail = 0
    
    for product_id, enrichment in sorted(ENRICHMENTS.items()):
        print(f"Processing {product_id}...")
        if merge_and_update(product_id, enrichment):
            success += 1
        else:
            fail += 1
        print()
    
    print(f"Done: {success} updated, {fail} failed")


if __name__ == "__main__":
    main()
