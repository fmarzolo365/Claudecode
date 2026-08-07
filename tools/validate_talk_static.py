#!/usr/bin/env python3
from pathlib import Path
import sys
s=Path(sys.argv[1] if len(sys.argv)>1 else "public/index.html").read_text(encoding="utf-8")
need=["pm-talk-root","MARZI_TALK_ROOT_ART","MARZI_TALK_ROOT_V1"]
bad=[x for x in need if x not in s]
if bad:
 print("TALK ROOT V1 FAIL");[print("-",x) for x in bad];raise SystemExit(1)
print("TALK ROOT V1 STATIC CONTRACT OK")
