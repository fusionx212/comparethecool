#!/usr/bin/env python3
"""Verify all 10 DE portable AC products are properly enriched in Supabase."""
import json, os
from urllib.request import Request, urlopen

env_path = '/root/comparethecool/.env'
SUPABASE_URL = None
SERVICE_KEY = None
with open(env_path) as f:
    for line in f:
        line = line.strip()
        if 'SUPABASE_URL=' in line or 'NEXT_PUBLIC_SUPABASE_URL=' in line:
            SUPABASE_URL = line.split('=', 1)[1]
        if 'SUPABASE_SERVICE_ROLE_KEY=' in line:
            SERVICE_KEY = line.split('=', 1)[1]

url = f"{SUPABASE_URL}/rest/v1/ctc_products?country_code=eq.de&select=id,data"
req = Request(url, headers={"apikey": SERVICE_KEY, "Authorization": f"Bearer {SERVICE_KEY}"})
resp = urlopen(req)
data = json.loads(resp.read().decode())

for p in data:
    d = p["data"] or {}
    img = "YES" if str(d.get("image","")).startswith("http") else "NO"
    nm = d.get("name","?")
    bt = d.get("btu","?")
    ns = d.get("noise_db","?")
    en = d.get("energy_rating","?")
    di = d.get("dimensions_cm","?")
    wk = d.get("weight_kg","?")
    rm = d.get("room_size_m2","?")
    fc = len(d.get("features",[]) or [])
    pr = len(d.get("pros",[]) or [])
    co = len(d.get("cons",[]) or [])
    vd = "YES" if d.get("verdict","") else "NO"
    print(f"{p['id']:30s} | {nm:40s} | BTU={bt} | noise={ns}dB | {en} | {di} | {wk}kg | {rm}m2 | feat={fc} | pros={pr} cons={co} | v={vd} | img={img}")
