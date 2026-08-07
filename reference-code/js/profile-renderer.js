function pmProfileRender(model){
  const root=document.getElementById("profile");if(!root)throw new Error("Profile root missing");
  root.replaceChildren();root.classList.add("pm2-screen","pm-profile");
  const h=document.createElement("h1");h.className="pm2-page-title";h.textContent=model.labels.title||"Profile";root.append(h);

  const summary=document.createElement("article");summary.className="pm2-card pm2-card-pad pm-profile-summary";
  const t=document.createElement("div");t.className="pm2-card-title";t.textContent=model.displayName;summary.append(t);
  if(model.level){const m=document.createElement("div");m.className="pm2-card-meta";m.textContent=model.level;summary.append(m);}
  if(model.xpCurrent!=null && model.xpNext>0) summary.append(pm2Progress(model.xpCurrent,model.xpNext));
  root.append(summary);

  for(const g of model.groups||[]){
    if(!g.items?.length)continue;
    const s=pm2Section(g.label);
    const box=document.createElement("div");box.className="pm2-settings-group";
    for(const item of g.items){
      const act=model.__actions[item.actionId];if(typeof act!=="function")continue;
      box.append(pm2Row({icon:item.icon||"•",title:item.title,meta:item.value||"",onClick:act}));
    }
    s.append(box);root.append(s);
  }
}
window.MARZI_PROFILE_V1_RENDER=Object.freeze({render:pmProfileRender});
