function buildProfileModelFromCurrentApp(ctx){
  return {
    displayName:String(ctx.displayName||""),
    level:ctx.level||null,
    xpCurrent:ctx.xpCurrent??null,
    xpNext:ctx.xpNext??null,
    groups:(ctx.groups||[]).map(g=>({...g,items:(g.items||[]).filter(x=>typeof ctx.actions?.[x.actionId]==="function")})),
    labels:ctx.labels||{},
    __actions:ctx.actions||{}
  };
}
window.MARZI_PROFILE_V1=Object.freeze({buildModel:buildProfileModelFromCurrentApp});
