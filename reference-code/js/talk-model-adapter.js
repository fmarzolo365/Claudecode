/* Build from existing selected scenario/contact and existing scenario lists.
   Do not write S.scenario here. */
function buildTalkRootModel(ctx){
  return {
    title:ctx.labels.title,
    subtitle:ctx.labels.subtitle||"",
    continueItem:ctx.continueItem ? {
      ...ctx.continueItem,
      artUrl:talkRootArt(ctx.continueItem.characterId)
    }:null,
    people:(ctx.people||[]).map(p=>({...p,artUrl:talkRootArt(p.id)})),
    recommended:ctx.recommended||[],
    allSituationsActionId:"allSituations",
    labels:ctx.labels
  };
}
window.MARZI_TALK_ROOT_V1=Object.freeze({buildModel:buildTalkRootModel});
