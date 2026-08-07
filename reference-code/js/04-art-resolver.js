function pm2ContactArt(contactId,state='idle'){const art=window.CALL_ART&&window.CALL_ART[contactId];if(art&&art.dir){const mapped=art.states?.[state]||art.states?.ready||state;const ext=art.ext||'.webp';return `${art.dir}${mapped}${ext}`}return `/api/avatar/${encodeURIComponent(contactId)}?v=3`}
function pm2IsGoldContact(id){return ['arzt','apotheke','werkstatt'].includes(id)}
window.MARZI_PM2_ART=Object.freeze({contact:pm2ContactArt,isGold:pm2IsGoldContact});
