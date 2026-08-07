function talkExisting(name){return typeof window[name]==="function"?window[name]:null}
function talkRootActions(ctx){
  const a={};
  if(talkExisting("openDrawer")) a.allSituations=()=>window.openDrawer();
  for(const p of ctx.people||[]){
    if(typeof p.open==="function") a[p.actionId]=p.open;
  }
  for(const r of ctx.recommended||[]){
    if(typeof r.open==="function") a[r.actionId]=r.open;
  }
  if(ctx.continueItem && typeof ctx.continueItem.open==="function"){
    a[ctx.continueItem.actionId]=ctx.continueItem.open;
  }
  return a;
}
window.MARZI_TALK_ROOT_ACTIONS=Object.freeze({build:talkRootActions});
