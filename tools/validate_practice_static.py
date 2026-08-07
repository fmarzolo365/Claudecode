#!/usr/bin/env python3
from pathlib import Path
import sys
s=Path(sys.argv[1] if len(sys.argv)>1 else "public/index.html").read_text(encoding="utf-8")
errs=[]
for marker in ["pm-practice","MARZI_PRACTICE_V1","MARZI_PRACTICE_V1_ACTIONS"]:
    if marker not in s: errs.append("missing "+marker)
if errs:
    print("PRACTICE V1 FAIL");[print("-",x) for x in errs];raise SystemExit(1)
print("PRACTICE V1 STATIC CONTRACT OK")
