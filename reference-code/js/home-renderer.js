/* MARZI HOME V1 — RENDERER REFERENCE
   Requires shared PM2 primitives from the approved technical shell. */

function pmHomeRender(model){
  const root=document.getElementById("learn");
  if(!root) throw new Error("Home renderer: #learn root missing");
  root.replaceChildren();
  root.classList.add("pm2-screen","pm-home");

  const labels=model.labels||{};
  const hero=document.createElement("section");
  hero.className="pm2-card pm2-card--hero pm-home-hero";
  const copy=document.createElement("div");
  copy.className="pm-home-hero-copy";
  const h1=document.createElement("h1");
  h1.className="pm2-page-title";
  h1.textContent=model.greeting;
  copy.append(h1);
  if(model.greetingSub){
    const p=document.createElement("p");
    p.className="pm2-page-sub";
    p.textContent=model.greetingSub;
    copy.append(p);
  }
  const art=document.createElement("div");
  art.className="pm-home-marzi";
  if(model.marziArtUrl){
    const im=new Image();
    im.src=model.marziArtUrl;
    im.alt="";
    im.decoding="async";
    art.append(im);
  }
  hero.append(copy,art);
  root.append(hero);

  const recSec=pm2Section(labels.recommended || "Recommended for you");
  const rec=document.createElement("article");
  rec.className="pm2-card pm-home-rec";
  const recCopy=document.createElement("div");
  recCopy.className="pm-home-rec-copy";
  const recTitle=document.createElement("div");
  recTitle.className="pm2-card-title";
  recTitle.textContent=model.recommendation.title;
  recCopy.append(recTitle);
  if(model.recommendation.subtitle){
    const meta=document.createElement("div");
    meta.className="pm2-card-meta";
    meta.textContent=model.recommendation.subtitle;
    recCopy.append(meta);
  }
  if(model.recommendation.reason){
    const reason=document.createElement("div");
    reason.className="pm-home-rec-reason";
    reason.textContent=model.recommendation.reason;
    recCopy.append(reason);
  }
  const cta=pm2Button(labels.continue || "Continue",model.__actions.recommendation,"primary");
  recCopy.append(cta);
  rec.append(recCopy);
  if(model.recommendation.artUrl){
    const im=new Image();
    im.className="pm-home-rec-art";
    im.src=model.recommendation.artUrl;
    im.alt="";
    im.decoding="async";
    rec.append(im);
  }
  recSec.append(rec);
  root.append(recSec);

  const journeySec=pm2Section(labels.journey || "Your journey");
  const journey=document.createElement("article");
  journey.className="pm2-card pm2-card-pad pm-home-journey";
  const top=document.createElement("div");
  top.className="pm-home-journey-top";
  const jl=document.createElement("div");
  jl.className="pm2-card-title";
  jl.textContent=model.journey.label;
  const xp=document.createElement("div");
  xp.className="pm2-card-meta";
  xp.textContent=`${model.journey.xpCurrent} / ${model.journey.xpNext} XP`;
  top.append(jl,xp);
  journey.append(top,pm2Progress(model.journey.xpCurrent,model.journey.xpNext));
  if(typeof model.__actions.journey==="function"){
    journey.role="button";
    journey.tabIndex=0;
    journey.onclick=model.__actions.journey;
    journey.onkeydown=e=>{
      if(e.key==="Enter"||e.key===" "){e.preventDefault();model.__actions.journey();}
    };
  }
  journeySec.append(journey);
  root.append(journeySec);

  const focusSec=pm2Section(labels.focus || "Today's focus");
  const focusClick=typeof model.__actions.focus==="function"?model.__actions.focus:()=>{};
  focusSec.append(pm2Row({
    icon:"◎",
    title:model.focus.title,
    meta:model.focus.subtitle||"",
    end:typeof model.__actions.focus==="function"?"›":"",
    onClick:focusClick
  }));
  root.append(focusSec);
}

window.MARZI_HOME_V1_RENDER = Object.freeze({render:pmHomeRender});
