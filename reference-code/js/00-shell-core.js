const PM2_TAB_HASH=Object.freeze({home:'#home',practice:'#practice',talk:'#talk',store:'#store',profile:'#profile'});
const PM2_TAB_ALIAS=Object.freeze({learn:'home'});
const PM2_TAB_OF=Object.freeze({learn:'home',progress:'home',test:'home',practice:'practice',prep:'practice',dialog:'practice',vocab:'practice',drill:'practice',mistakes:'practice',setup:'talk',call:'talk',done:'talk',store:'store',profile:'profile'});
function pm2NormalizeTab(raw){const key=String(raw||'').replace(/^#/,'').trim().toLowerCase();return PM2_TAB_ALIAS[key]||(Object.hasOwn(PM2_TAB_HASH,key)?key:null)}
function pm2SyncSelectedTab(tab){document.querySelectorAll('#bottomnav [data-tab]').forEach(btn=>{const on=btn.dataset.tab===tab;if(on)btn.setAttribute('aria-current','page');else btn.removeAttribute('aria-current')})}
function pm2SetShellVisible(visible){const top=document.getElementById('topbar'),bottom=document.getElementById('bottomnav');if(top)top.hidden=!visible;if(bottom)bottom.hidden=!visible}
function pm2AfterShow(screenId){const owner=PM2_TAB_OF[screenId];if(owner)pm2SyncSelectedTab(owner);const immersive=screenId==='call'||screenId==='onboard';document.body.classList.toggle('pm2',!immersive);pm2SetShellVisible(!immersive)}
function pm2WireBottomNav(showTabFn){const nav=document.getElementById('bottomnav');if(!nav)throw new Error('premium nav: #bottomnav missing');nav.querySelectorAll('[data-tab]').forEach(btn=>btn.onclick=()=>showTabFn(btn.dataset.tab))}
window.MARZI_PM2=Object.freeze({TAB_HASH:PM2_TAB_HASH,TAB_ALIAS:PM2_TAB_ALIAS,TAB_OF:PM2_TAB_OF,normalizeTab:pm2NormalizeTab,syncSelectedTab:pm2SyncSelectedTab,setShellVisible:pm2SetShellVisible,afterShow:pm2AfterShow,wireBottomNav:pm2WireBottomNav});
