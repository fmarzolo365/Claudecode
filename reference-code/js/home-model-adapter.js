/* MARZI HOME V1 — MODEL ADAPTER REFERENCE
   Must be adapted to current repo symbols. Do not duplicate business logic. */

function pmHomeGoldArt(contactId){
  if(!contactId) return "";
  if(window.MARZI_PM2_ART?.contact) return window.MARZI_PM2_ART.contact(contactId,"idle");
  const art=window.CALL_ART?.[contactId];
  if(art?.dir){
    const state=art.states?.idle || art.states?.ready || "idle";
    return `${art.dir}${state}${art.ext||".webp"}`;
  }
  return `/api/avatar/${encodeURIComponent(contactId)}?v=3`;
}

function pmHomeBuildModel(ctx){
  /*
   ctx is assembled by a thin integration function that reads the existing app.
   This function does NOT read localStorage directly and does NOT select scenarios.

   Required ctx shape:
   {
     greeting, greetingSub, marziArtUrl,
     recommendation: {
       type, owner, characterId, scenarioId, title, subtitle, reason, open
     },
     journey: {label,stageLabel,xpCurrent,xpNext,streak,open},
     focus: {title,subtitle,open},
     recent?,
     labels
   }
  */
  if(!ctx?.recommendation?.title) throw new Error("Home adapter: recommendation missing");
  if(!(ctx?.journey?.xpNext > 0)) throw new Error("Home adapter: invalid journey target");

  const cid=ctx.recommendation.characterId || null;
  return {
    greeting: String(ctx.greeting || ""),
    greetingSub: ctx.greetingSub || "",
    marziArtUrl: ctx.marziArtUrl || "",
    recommendation:{
      type:ctx.recommendation.type,
      owner:ctx.recommendation.owner,
      characterId:cid,
      scenarioId:ctx.recommendation.scenarioId || null,
      title:String(ctx.recommendation.title),
      subtitle:ctx.recommendation.subtitle || "",
      reason:ctx.recommendation.reason || "",
      artUrl:cid ? pmHomeGoldArt(cid) : (ctx.recommendation.artUrl || ""),
      actionId:"recommendation"
    },
    journey:{...ctx.journey},
    focus:{...ctx.focus, actionId:ctx.focus?.open ? "focus" : null},
    recent:ctx.recent || null,
    labels:ctx.labels || {},
    __actions:{
      recommendation:ctx.recommendation.open,
      journey:ctx.journey.open,
      focus:ctx.focus?.open || null,
      recent:ctx.recent?.open || null
    }
  };
}

window.MARZI_HOME_V1 = Object.freeze({buildModel:pmHomeBuildModel,goldArt:pmHomeGoldArt});
