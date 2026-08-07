function talkRootArt(contactId){
  const art=window.CALL_ART?.[contactId];
  if(art?.dir){
    const st=art.states?.idle || art.states?.ready || "idle";
    return `${art.dir}${st}${art.ext||".webp"}`;
  }
  return `/api/avatar/${encodeURIComponent(contactId)}?v=3`;
}
function talkRootGold(id){return ["arzt","apotheke","werkstatt"].includes(id)}
window.MARZI_TALK_ROOT_ART=Object.freeze({url:talkRootArt,isGold:talkRootGold});
