function buildStoreModelFromCurrentApp(ctx){
  return {
    marziArtUrl:ctx.marziArtUrl||"",
    coins:Number(ctx.coins||0),
    featured:ctx.featured||null,
    categories:ctx.categories||[],
    items:ctx.items||[],
    labels:ctx.labels||{},
    __actions:ctx.actions||{}
  };
}
window.MARZI_STORE_V1=Object.freeze({buildModel:buildStoreModelFromCurrentApp});
