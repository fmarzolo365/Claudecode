function pmPracticeRender(model, actions){
  const root=document.getElementById("practice");
  if(!root) throw new Error("Practice root missing");
  root.replaceChildren();
  root.classList.add("pm2-screen","pm-practice");

  const h=document.createElement("h1");h.className="pm2-page-title";h.textContent=model.title;root.append(h);
  if(model.subtitle){const p=document.createElement("p");p.className="pm2-page-sub";p.textContent=model.subtitle;root.append(p);}

  if(model.continueItem && typeof actions[model.continueItem.actionId]==="function"){
    const s=pm2Section(model.labels.continue||"Continue");
    const c=document.createElement("article");c.className="pm2-card pm2-card-pad pm-practice-continue";
    const t=document.createElement("div");t.className="pm2-card-title";t.textContent=model.continueItem.title;c.append(t);
    if(model.continueItem.subtitle){const m=document.createElement("div");m.className="pm2-card-meta";m.textContent=model.continueItem.subtitle;c.append(m);}
    c.append(pm2Button(model.labels.continueCta||"Continue",actions[model.continueItem.actionId],"primary"));
    s.append(c);root.append(s);
  }

  for(const group of model.groups||[]){
    const s=pm2Section(group.label);
    for(const item of group.items||[]){
      const act=actions[item.actionId];
      if(typeof act!=="function") continue;
      s.append(pm2Row({
        icon:item.icon||"•",
        title:item.title,
        meta:item.subtitle||"",
        end:item.count!=null?String(item.count):"›",
        onClick:act
      }));
    }
    root.append(s);
  }
}
window.MARZI_PRACTICE_V1_RENDER=Object.freeze({render:pmPracticeRender});
