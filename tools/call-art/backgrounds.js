/* Scenario backgrounds — 10 families (brief Layer B).
   Soft contextual backdrops: wall gradient + 2-4 large low-contrast objects,
   readable at a glance, quiet enough to sit behind a character. Each builder
   returns inner SVG for a 0 0 512 256 viewBox; `standalone()` wraps it. */
"use strict";
const { P, linGrad, svg } = require("./lib");

/* shared furniture, all drawn in the muted low-contrast register */
const soft = (c, o = 1) => `fill="${c}"${o !== 1 ? ` opacity="${o}"` : ""}`;

function wall(gid, top, bottom, floorC) {
  return {
    defs: linGrad(gid, top, bottom),
    body: `<rect width="512" height="256" fill="url(#${gid})"/>` +
      `<rect y="196" width="512" height="60" ${soft(floorC)}/>` +
      `<rect y="192" width="512" height="6" ${soft(P.shadowBeige)}/>`,
  };
}
function windowFrame(x, y, w, h, sky = "#dcebd2") {
  return `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" ${soft("#ffffff", .75)}/>
    <rect x="${x + 7}" y="${y + 7}" width="${w - 14}" height="${h - 14}" rx="6" ${soft(sky)}/>
    <path d="M${x + 16} ${y + h - 24} q14 -18 30 -6 q16 -16 34 -2 l0 14 l-64 0 Z" ${soft("#b9d3a4", .8)}/>
    <circle cx="${x + w - 26}" cy="${y + 22}" r="10" ${soft("#f2e9c9", .9)}/></g>`;
}
function plant(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M0 0 q-16 -34 4 -52 q2 26 6 34 q4 -34 22 -42 q-4 30 -10 44 q14 -18 26 -16 q-10 22 -24 32 Z" ${soft(P.accentSoft, .85)}/>
    <path d="M-12 0 h48 l-7 34 q-1 5 -6 5 h-22 q-5 0 -6 -5 Z" ${soft("#d8c9a8")}/></g>`;
}
function frame(x, y, w, h, inner) {
  return `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" ${soft("#ffffff", .8)}/>${inner}</g>`;
}
function counter(y = 170) {
  return `<rect y="${y}" width="512" height="${256 - y}" ${soft("#e3d5b8")}/>
    <rect y="${y}" width="512" height="10" rx="5" ${soft("#d3c2a0")}/>`;
}
function shelf(x, y, w, jars) {
  let items = "";
  for (let i = 0; i < jars; i++) {
    const jx = x + 12 + i * ((w - 24) / jars);
    const hue = ["#cfe0bd", "#e9dcc0", "#d9e4d4", "#e3cfc0"][i % 4];
    items += `<rect x="${jx}" y="${y - 26}" width="${(w - 24) / jars - 10}" height="26" rx="5" ${soft(hue)}/>`;
  }
  return `<rect x="${x}" y="${y}" width="${w}" height="8" rx="4" ${soft("#d3c2a0")}/>${items}`;
}

const FAMILIES = {
  clinic(g) {
    const { defs, body } = wall(g, "#eef3e6", "#e2ead6", "#ddd2ba");
    return { defs, body: body +
      windowFrame(34, 34, 130, 120) +
      frame(356, 40, 92, 116, `<path d="M402 58 q16 20 0 40 q-16 -20 0 -40 M402 98 q-12 26 0 44 q12 -18 0 -44" ${soft("#c7d8ef")}/><circle cx="402" cy="66" r="9" ${soft("#c7d8ef")}/>`) +
      plant(210, 176, .9) +
      `<rect x="252" y="128" width="132" height="64" rx="8" ${soft("#e9e2cf", .9)}/>` +
      `<rect x="266" y="142" width="60" height="8" rx="4" ${soft(P.shadowBeige)}/>` +
      `<rect x="266" y="158" width="88" height="8" rx="4" ${soft(P.shadowBeige)}/>` };
  },
  workshop(g) {
    const { defs, body } = wall(g, "#ece7dc", "#ded7c6", "#c9beA6".toLowerCase());
    return { defs, body: body +
      `<rect x="30" y="40" width="150" height="96" rx="10" ${soft("#d8d0bd")}/>` +
      `<g ${soft("#a89c84")}><rect x="46" y="56" width="10" height="52" rx="5"/><rect x="70" y="56" width="10" height="52" rx="5" transform="rotate(14 75 82)"/><circle cx="118" cy="70" r="16"/><circle cx="118" cy="70" r="7" fill="#d8d0bd"/><rect x="140" y="54" width="12" height="58" rx="6"/></g>` +
      `<g><circle cx="392" cy="88" r="52" ${soft("#8f8674")}/><circle cx="392" cy="88" r="34" ${soft("#b3a992")}/><circle cx="392" cy="88" r="14" ${soft("#8f8674")}/></g>` +
      `<rect x="220" y="150" width="120" height="42" rx="8" ${soft("#c2452f", .75)}/><rect x="232" y="142" width="26" height="10" rx="4" ${soft("#a83a26", .8)}/>` };
  },
  pharmacy(g) {
    const { defs, body } = wall(g, "#eef2e9", "#e3e9dc", "#d9cfb6");
    return { defs, body: body +
      shelf(40, 96, 190, 4) + shelf(40, 150, 190, 4) +
      `<g><rect x="356" y="52" width="96" height="96" rx="14" ${soft("#dfe9d6")}/><path d="M404 76 v48 M380 100 h48" stroke="#8fae76" stroke-width="18" stroke-linecap="round" fill="none"/></g>` +
      counter(184) };
  },
  "public-office"(g) {
    const { defs, body } = wall(g, "#edeae2", "#e0dcd0", "#d5cbb4");
    return { defs, body: body +
      `<rect x="36" y="42" width="120" height="150" rx="8" ${soft("#d9d2c2")}/>` +
      `<g ${soft("#c4bba6")}><rect x="48" y="56" width="96" height="26" rx="5"/><rect x="48" y="90" width="96" height="26" rx="5"/><rect x="48" y="124" width="96" height="26" rx="5"/></g>` +
      frame(346, 44, 120, 82, `<rect x="360" y="60" width="92" height="10" rx="5" ${soft("#cdc4ae")}/><rect x="360" y="80" width="66" height="10" rx="5" ${soft("#cdc4ae")}/>`) +
      `<circle cx="406" cy="160" r="18" ${soft("#cdc4ae")}/><rect x="402" y="150" width="8" height="14" rx="4" ${soft("#edeae2")}/>` +
      counter(190) };
  },
  office(g) { // bank / service desk
    const { defs, body } = wall(g, "#ebedec", "#dee2df", "#cfc6ae");
    return { defs, body: body +
      windowFrame(44, 36, 120, 108, "#dfe8ee") +
      `<rect x="352" y="60" width="112" height="72" rx="10" ${soft("#d3d8d4")}/><path d="M368 112 l20 -26 l18 14 l24 -30 l16 18" fill="none" stroke="#93a98f" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>` +
      plant(238, 182, .8) + counter(190) };
  },
  school(g) { // kita
    const { defs, body } = wall(g, "#f2eddd", "#e9e0c9", "#dcCFB2".toLowerCase());
    return { defs, body: body +
      `<rect x="36" y="44" width="150" height="100" rx="10" ${soft("#7f9c6c", .85)}/><path d="M56 120 q22 -34 40 -6 M104 118 q16 -26 32 -4" stroke="#f2eddd" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="150" cy="70" r="12" fill="none" stroke="#f2eddd" stroke-width="7"/>` +
      `<g><circle cx="380" cy="76" r="22" ${soft("#e8b64c", .8)}/><circle cx="424" cy="96" r="16" ${soft("#c2745f", .7)}/><circle cx="396" cy="120" r="14" ${soft("#8fae76", .8)}/></g>` +
      `<rect x="330" y="150" width="140" height="42" rx="21" ${soft("#e3d5b8")}/>` };
  },
  restaurant(g) {
    const { defs, body } = wall(g, "#efe6d6", "#e4d7c0", "#caa87e");
    return { defs, body: body +
      `<circle cx="106" cy="82" r="40" ${soft("#e8dcc4")}/><circle cx="106" cy="82" r="30" fill="none" stroke="#d3bd97" stroke-width="5"/>` +
      `<g ${soft("#d3bd97")}><rect x="330" y="44" width="8" height="70" rx="4"/><rect x="352" y="44" width="8" height="70" rx="4"/><rect x="374" y="44" width="8" height="70" rx="4"/><rect x="318" y="36" width="76" height="10" rx="5"/></g>` +
      `<g><rect x="416" y="70" width="50" height="60" rx="8" ${soft("#8f5b3f", .55)}/><rect x="416" y="70" width="50" height="16" rx="8" ${soft("#8f5b3f", .7)}/></g>` +
      counter(178) + `<circle cx="250" cy="196" r="17" ${soft("#f4ead2")}/><circle cx="250" cy="196" r="11" ${soft("#e2cfa9")}/>` };
  },
  reception(g) { // salon
    const { defs, body } = wall(g, "#f1e9e2", "#e7dcd2", "#d8c6b4");
    return { defs, body: body +
      `<g><ellipse cx="120" cy="96" rx="58" ry="72" ${soft("#efe9e2")}/><ellipse cx="120" cy="96" rx="50" ry="64" ${soft("#dcecec", .8)}/><ellipse cx="120" cy="96" rx="58" ry="72" fill="none" stroke="#c9b6a2" stroke-width="6"/></g>` +
      shelf(330, 92, 140, 3) +
      `<g ${soft("#c9b6a2")}><rect x="352" y="120" width="9" height="44" rx="4" transform="rotate(18 356 142)"/><rect x="380" y="118" width="9" height="46" rx="4" transform="rotate(-12 384 141)"/></g>` +
      counter(186) };
  },
  utility(g) { // property management / caretaker
    const { defs, body } = wall(g, "#ece8dd", "#ded8c8", "#cfc0a2");
    return { defs, body: body +
      `<g><rect x="44" y="40" width="130" height="152" rx="10" ${soft("#d9d0ba")}/><rect x="60" y="58" width="42" height="52" rx="6" ${soft("#eef0e6")}/><rect x="116" y="58" width="42" height="52" rx="6" ${soft("#eef0e6")}/><rect x="60" y="122" width="98" height="54" rx="6" ${soft("#eef0e6")}/></g>` +
      `<g stroke="#a89c84" stroke-width="8" stroke-linecap="round" fill="none"><path d="M382 64 a20 20 0 1 0 -1 0"/><path d="M382 84 v58 M382 122 h20 M382 142 h14"/></g>` +
      plant(300, 186, .85) };
  },
  retail(g) { // parcel counter
    const { defs, body } = wall(g, "#efeadf", "#e3dccb", "#d6c8a9");
    const box = (x, y, w, h, c) => `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" ${soft(c)}/><rect x="${x + w / 2 - 5}" y="${y}" width="10" height="${h}" ${soft("#efe6d1", .85)}/></g>`;
    return { defs, body: body +
      box(46, 96, 92, 66, "#d5ab72") + box(150, 118, 70, 44, "#c99b5f") + box(84, 52, 66, 40, "#deb87f") +
      `<g><rect x="356" y="48" width="104" height="112" rx="10" ${soft("#d9d0ba")}/><path d="M372 84 h72 M372 112 h72 M372 140 h48" stroke="#b3a685" stroke-width="9" stroke-linecap="round"/></g>` +
      counter(186) };
  },
};

function background(family) {
  const b = FAMILIES[family];
  if (!b) throw new Error("unknown background family: " + family);
  const g = "bg_" + family.replace(/[^a-z]/g, "");
  const { defs, body } = b(g);
  return { defs, body };
}
function standalone(family, title) {
  const { defs, body } = background(family);
  return svg("0 0 512 256", defs, body, title);
}

module.exports = { background, standalone, FAMILY_NAMES: Object.keys(FAMILIES) };
