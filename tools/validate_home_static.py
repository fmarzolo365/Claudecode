#!/usr/bin/env python3
from pathlib import Path
import sys,re

p=Path(sys.argv[1] if len(sys.argv)>1 else "public/index.html")
s=p.read_text(encoding="utf-8")
errors=[]

required=[
  "pm-home",
  "pm-home-rec",
  "pm-home-journey",
]
for x in required:
    if x not in s: errors.append("missing Home V1 marker: "+x)

# Gold root art should come from CALL_ART resolver somewhere in implementation.
if "CALL_ART" not in s:
    errors.append("CALL_ART not referenced; cannot prove Gold root art integration")

# Detect obvious emoji doctor/mechanic literals in premium Home-specific renderer block only if named.
m=re.search(r"MARZI HOME V1.*?(?=MARZI HOME V1|\Z)",s,re.S)
if m and re.search(r"[👩👨🧑]‍?[⚕🔧]",m.group(0)):
    errors.append("emoji profession art detected in Home V1 block")

if errors:
    print("HOME V1 STATIC CONTRACT FAIL")
    for e in errors: print("-",e)
    raise SystemExit(1)
print("HOME V1 STATIC CONTRACT OK")
