function pmStoreRender(model){
  const root=document.getElementById("store"); if(!root) throw new Error("Store root missing");
  root.replaceChildren();root.classList.add("pm2-screen","pm-store");

  const h=document.createElement("h1");h.className="pm2-page-title";h.textContent=model.labels.title||"Store";root.append(h);

  const hero=document.createElement("section");hero.className="pm2-card pm2-card--hero pm-store-hero";
  const copy=document.createElement("div");
  const t=document.createElement("div");t.className="pm2-card-title";t.textContent=model.labels.marziToday||"Marzi today";copy.append(t);
  const coins=document.createElement("div");coins.className="pm2-card-meta";coins.textContent=`${model.coins}`;copy.append(coins);
  hero.append(copy);
  if(model.marziArtUrl){const im=new Image();im.src=model.marziArtUrl;im.alt="";im.decoding="async";hero.append(im);}
  root.append(hero);

  if(model.featured){
    const s=pm2Section(model.labels.featured||"Featured");
    const c=document.createElement("article");c.className="pm2-card pm2-card-pad pm-store-featured";
    const ct=document.createElement("div");ct.className="pm2-card-title";ct.textContent=model.featured.title;c.append(ct);
    if(model.featured.subtitle){const m=document.createElement("div");m.className="pm2-card-meta";m.textContent=model.featured.subtitle;c.append(m);}
    if(model.featured.artUrl){const im=new Image();im.src=model.featured.artUrl;im.alt="";im.loading="lazy";c.append(im);}
    if(typeof model.__actions[model.featured.actionId]==="function") c.append(pm2Button(model.labels.view||"View",model.__actions[model.featured.actionId],"secondary"));
    s.append(c);root.append(s);
  }

  const cats=pm2Section(model.labels.categories||"Browse");
  const rail=document.createElement("div");rail.className="pm-store-categories";
  for(const c of model.categories){
    const act=model.__actions[c.actionId];if(typeof act!=="function")continue;
    const b=document.createElement("button");b.type="button";b.className="pm-store-category";
    b.textContent=c.label;b.onclick=act;rail.append(b);
  }
  cats.append(rail);root.append(cats);
}
window.MARZI_STORE_V1_RENDER=Object.freeze({render:pmStoreRender});
