/* Practice V1 model adapter. Read current app state once; renderer receives normalized model. */
function buildPracticeModelFromCurrentApp(ctx, actions){
  const items=[];
  const put=(group,id,title,subtitle,count)=>{
    if(typeof actions[id]!=="function") return;
    items.push({group,id,title,subtitle:subtitle||"",count:count??null,actionId:id});
  };

  put("prepare","prep",ctx.labels.prep,ctx.labels.prepSub);
  put("prepare","dialog",ctx.labels.dialog,ctx.labels.dialogSub);
  put("prepare","vocab",ctx.labels.vocab,ctx.labels.vocabSub);
  if(ctx.real.pronunciation) put("improve","pronunciation",ctx.labels.pronunciation,ctx.labels.pronunciationSub);
  put("review","drill",ctx.labels.practiceMistakes,ctx.labels.practiceMistakesSub,ctx.counts?.drill);
  put("review","mistakes",ctx.labels.mistakes,ctx.labels.mistakesSub,ctx.counts?.mistakes);
  if(ctx.real.reviewQueue) put("review","reviewQueue",ctx.labels.reviewQueue,ctx.labels.reviewQueueSub,ctx.counts?.review);
  if(ctx.real.savedWords) put("library","savedWords",ctx.labels.savedWords,ctx.labels.savedWordsSub,ctx.counts?.saved);

  const groupOrder=["prepare","improve","review","library"];
  const groups=groupOrder.map(g=>({
    id:g,label:ctx.groupLabels[g],
    items:items.filter(x=>x.group===g)
  })).filter(g=>g.items.length);

  return {
    title:ctx.labels.title,
    subtitle:ctx.labels.subtitle||"",
    continueItem:ctx.continueItem||null,
    groups,
    labels:ctx.labels
  };
}
window.MARZI_PRACTICE_V1=Object.freeze({buildModel:buildPracticeModelFromCurrentApp});
