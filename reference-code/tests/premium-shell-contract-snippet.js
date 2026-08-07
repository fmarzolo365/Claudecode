assert(pm2NormalizeTab('#learn')==='home');
assert(pm2NormalizeTab('learn')==='home');
assert(document.querySelectorAll('#bottomnav [data-tab]').length===5);
assert([...document.querySelectorAll('#bottomnav [data-tab]')].map(x=>x.dataset.tab).join(',')==='home,practice,talk,store,profile');
assert(!document.getElementById('menuBtn'));
assert(!document.getElementById('tbGear'));
for(const id of ['arzt','apotheke','werkstatt']){const u=pm2ContactArt(id,'idle');assert(u.includes('/assets/call/characters/'));}
