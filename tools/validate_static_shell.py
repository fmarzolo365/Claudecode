#!/usr/bin/env python3
from pathlib import Path
import sys
p=Path(sys.argv[1] if len(sys.argv)>1 else 'public/index.html')
s=p.read_text(encoding='utf-8')
errors=[]
for banned in ['id="menuBtn"',"id='menuBtn'",'id="tbGear"',"id='tbGear'"]:
    if banned in s: errors.append('global navigation duplicate present: '+banned)
for tab in ['home','practice','talk','store','profile']:
    if f'data-tab="{tab}"' not in s and f"data-tab='{tab}'" not in s: errors.append('missing tab '+tab)
compact=s.replace(' ','').replace('\n','')
if 'learn:"home"' not in compact and "learn:'home'" not in compact: errors.append('missing learn->home alias')
if errors:
    print('PM2 CONTRACT FAIL');[print('-',e) for e in errors];raise SystemExit(1)
print('PM2 STATIC CONTRACT OK')
