function pmTalkRootRender(model,actions){
  const root=document.getElementById("setup");
  if(!root) throw new Error("Talk root #setup missing");
  root.replaceChildren();root.classList.add("pm2-screen","pm-talk-root");
  const h=document.createElement("h1");h.className="pm2-page-title";h.textContent=model.title;root.append(h);
  if(model.subtitle){const p=document.createElement("p");p.className="pm2-page-sub";p.textContent=model.subtitle;root.append(p);}

  if(model.continueItem && typeof actions[model.continueItem.actionId]==="function"){
    const s=pm2Section(model.labels.continue||"Continue conversation");
    const row=document.createElement("article");row.className="pm2-card pm2-card-pad pm-talk-continue";
    const im=new Image();im.className="pm2-portrait";im.src=model.continueItem.artUrl;im.alt="";
    const copy=document.createElement("div");
    const t=document.createElement("div");t.className="pm2-card-title";t.textContent=model.continueItem.title;copy.append(t);
    if(model.continueItem.subtitle){const m=document.createElement("div");m.className="pm2-card-meta";m.textContent=model.continueItem.subtitle;copy.append(m);}
    row.append(im,copy,pm2Button(model.labels.continueCta||"Continue",actions[model.continueItem.actionId],"primary"));
    s.append(row);root.append(s);
  }

  if(model.people?.length){
    const s=pm2Section(model.labels.people||"People & places");
    const rail=document.createElement("div");rail.className="pm2-people";
    for(const p of model.people){
      const a=document.createElement("button");a.className="pm2-person";a.type="button";
      const im=new Image();im.src=p.artUrl;im.alt="";im.loading="lazy";
      const label=document.createElement("span");label.textContent=p.label;
      a.append(im,label);a.onclick=actions[p.actionId];rail.append(a);
    }
    s.append(rail);root.append(s);
  }

  if(model.recommended?.length){
    const s=pm2Section(model.labels.recommended||"Recommended situations");
    for(const r of model.recommended){
      const act=actions[r.actionId]; if(typeof act!=="function") continue;
      s.append(pm2Row({icon:"☎",title:r.title,meta:r.subtitle||"",end:r.level||"›",onClick:act}));
    }
    root.append(s);
  }

  if(typeof actions[model.allSituationsActionId]==="function"){
    const s=document.createElement("div");s.className="pm2-section";
    const b=pm2Button(model.labels.allSituations||"All situations",actions[model.allSituationsActionId],"primary");
    b.style.inlineSize="100%";s.append(b);root.append(s);
  }
}
window.MARZI_TALK_ROOT_V1_RENDER=Object.freeze({render:pmTalkRootRender});
