#!/usr/bin/env python3
"""
Final fix: populate root-level `category` and `name` columns in ctc_products
for DE products, so the client-side Supabase query can filter by category.
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

# For each DE product, set root-level category and name
products_to_fix = [
    "de-midea-portasplit", "de-delonghi-ex105", "de-comfee-breezy",
    "de-trotec-pac3500", "de-klartein-kraft", "de-aeg-chillflex",
    "de-whirlpool-pacw", "de-hisense-easy", "de-samsung-wind",
    "de-daewoo-col"
]

updates = {
    "de-midea-portasplit": {"name": "Midea PortaSplit 12000 BTU", "category": "portable-air-conditioners"},
    "de-delonghi-ex105": {"name": "DeLonghi Pinguino PAC EX105", "category": "portable-air-conditioners"},
    "de-comfee-breezy": {"name": "Comfee Breezy Cool Pro 9000 BTU", "category": "portable-air-conditioners"},
    "de-trotec-pac3500": {"name": "TROTEC PAC 3500 X", "category": "portable-air-conditioners"},
    "de-klartein-kraft": {"name": "Klarstein Kraftwerk 12000 BTU", "category": "portable-air-conditioners"},
    "de-aeg-chillflex": {"name": "AEG ChillFlex Pro 9000 BTU", "category": "portable-air-conditioners"},
    "de-whirlpool-pacw": {"name": "Whirlpool PACW29HP 9000 BTU", "category": "portable-air-conditioners"},
    "de-hisense-easy": {"name": "Hisense EasyCool 12000 BTU", "category": "portable-air-conditioners"},
    "de-samsung-wind": {"name": "Samsung WindFree Comfort 9000 BTU", "category": "portable-air-conditioners"},
    "de-daewoo-col": {"name": "Daewoo COL0900 9000 BTU", "category": "portable-air-conditioners"},
}

success = 0
for pid in products_to_fix:
    url = f"{SUPABASE_URL}/rest/v1/ctc_products?id=eq.{pid}"
    body = updates[pid]
    req = Request(url, data=json.dumps(body).encode(),
                  headers={"apikey": SERVICE_KEY, "Authorization": f"Bearer {SERVICE_KEY}",
                           "Content-Type": "application/json"},
                  method="PATCH")
    try:
        resp = urlopen(req, timeout=15)
        print(f"  ✓ {pid} -> name='{body['name']}', category='{body['category']}'")
        success += 1
    except Exception as e:
        print(f"  ✗ {pid}: {e}")

print(f"\nDone: {success}/{len(products_to_fix)} root columns updated")
