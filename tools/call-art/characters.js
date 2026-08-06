/* Contact character portraits — 10 contacts × 5 states (brief Layer A).
   Each portrait is a full illustrated scene (scenario backdrop + bust) in a
   0 0 512 512 viewBox, drawn so the face sits inside the stage card's
   cover-crop band (object-position 50% 22%): face centre ≈ y 190.
   Layer order (brief §4): background → shadow → body → clothing → face →
   accessory → highlight. */
"use strict";
const { P, SKIN, HAIRC, linGrad, radGrad, svg } = require("./lib");
const { background } = require("./backgrounds");

const S = 4;               // master stroke width for 512 grid
const lnw = (w = S) => `stroke="${P.stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;

/* ---------- face building blocks (all relative to head centre 256,190) ---------- */

function eyes(state, iris) {
  const y = 186, dx = 46;
  const lookUp = state === "thinking";
  const px = lookUp ? -3 : 0, py = lookUp ? -5 : 1;
  if (state === "success") {
    // closed happy arcs
    return `<g ${lnw(S + 1)} fill="none">
      <path d="M${256 - dx - 15} ${y + 2} q15 -14 30 0"/>
      <path d="M${256 + dx - 15} ${y + 2} q15 -14 30 0"/></g>`;
  }
  const wide = state === "listening" ? 1.08 : 1;
  const eye = (cx) => `
    <ellipse cx="${cx}" cy="${y}" rx="${16 * wide}" ry="${18 * wide}" fill="#fff" ${lnw(S - 1)}/>
    <circle cx="${cx + px}" cy="${y + py}" r="10" fill="${iris}"/>
    <circle cx="${cx + px}" cy="${y + py}" r="5.2" fill="#241a12"/>
    <circle cx="${cx + px + 3}" cy="${y + py - 3.5}" r="2.6" fill="#fff"/>
    <circle cx="${cx + px - 3.4}" cy="${y + py + 3.4}" r="1.3" fill="#fff" opacity=".85"/>`;
  return `<g>${eye(256 - dx)}${eye(256 + dx)}</g>`;
}

function brows(state, hair) {
  const y = 158, dx = 46, c = hair.dark;
  const b = (cx, d, tilt = 0) =>
    `<path d="M${cx - 15} ${y + d} q15 ${tilt - 9} 30 ${tilt}" fill="none" stroke="${c}" stroke-width="${S + 2}" stroke-linecap="round"/>`;
  if (state === "listening") return b(256 - dx, -5) + b(256 + dx, -5);
  if (state === "thinking") return b(256 - dx, -7, -3) + b(256 + dx, 1, 2);
  if (state === "success") return b(256 - dx, -4) + b(256 + dx, -4);
  return b(256 - dx, 0) + b(256 + dx, 0);
}

function nose(skin) {
  return `<path d="M252 212 q6 6 10 1" fill="none" stroke="${skin.shade}" stroke-width="${S}" stroke-linecap="round"/>`;
}

function mouth(state) {
  const y = 240;
  switch (state) {
    case "speaking":
      return `<g><path d="M238 ${y - 2} q18 4 36 0 q-3 24 -18 24 q-15 0 -18 -24 Z" fill="#7c4136" ${lnw(S - 1)}/>
        <path d="M244 ${y + 14} q12 8 24 0 q-5 8 -12 8 q-7 0 -12 -8 Z" fill="#d98a7c"/></g>`;
    case "success":
      return `<g><path d="M232 ${y - 4} q24 6 48 0 q-4 26 -24 26 q-20 0 -24 -26 Z" fill="#7c4136" ${lnw(S - 1)}/>
        <path d="M240 ${y + 12} q16 10 32 0 q-6 10 -16 10 q-10 0 -16 -10 Z" fill="#d98a7c"/></g>`;
    case "thinking":
      return `<path d="M246 ${y + 4} q9 4 18 1" fill="none" ${lnw(S + 1)}/>`;
    default: // idle / listening: soft closed smile
      return `<path d="M238 ${y} q18 12 36 0" fill="none" ${lnw(S + 1)}/>`;
  }
}

function blush(skin, strong) {
  const o = strong ? .5 : .32;
  return `<ellipse cx="${256 - 62}" cy="222" rx="14" ry="8" fill="${skin.cheek}" opacity="${o}"/>
    <ellipse cx="${256 + 62}" cy="222" rx="14" ry="8" fill="${skin.cheek}" opacity="${o}"/>`;
}

/* ---------- hair styles: {back(h), front(h)} in head coordinates ----------
   Recipe: every style paints a full "helmet" that hugs the head silhouette
   (head spans x 166-346, top y 76) down to a fringe line across the forehead
   (~y 150-168), so no style can leave a bald crown. Long styles add side
   masses behind the shoulders. */

/* helmet outer edge, slightly proud of the scalp, ending at the temples */
const HELM = "M162 190 q-8 -122 94 -122 q102 0 94 122";
/* fringe hems are ABSOLUTE right-to-left polylines that always stay above
   the brow line (y 158), so no style can cover the eyes or leave a bald
   crown. `helmet` closes HELM -> hem -> back to the left temple. */
function hem(points) {
  let d = "";
  for (const seg of points) {
    d += seg.length === 2 ? ` L ${seg[0]} ${seg[1]}` : ` Q ${seg[0]} ${seg[1]} ${seg[2]} ${seg[3]}`;
  }
  return d;
}
function helmet(h, hemD) {
  return `<path d="${HELM}${hemD} L 162 190 Z" fill="${h.base}"/>`;
}
const FRINGE = {
  flat: hem([[344, 156], [320, 146, 296, 152], [272, 158, 248, 150], [224, 142, 200, 150], [180, 156, 168, 158]]),
  sweep: hem([[344, 140], [310, 124, 280, 130], [240, 138, 210, 150], [188, 158, 170, 164]]),
  part: hem([[344, 158], [312, 128, 268, 126], [248, 126, 248, 126], [212, 126, 168, 158]]),
};
const HAIR = {
  longWavy: {
    back: (h) => `<path d="M150 200 q-10 -56 22 -96 q34 -42 84 -42 q50 0 84 42 q32 40 22 96 q10 66 -10 118 q-10 26 -30 34 q-22 8 -20 -10 q22 -50 10 -122 l-112 0 q-12 72 10 122 q2 18 -20 10 q-20 -8 -30 -34 q-20 -52 -10 -118 Z" fill="${h.base}"/>
      <path d="M338 220 q12 62 -6 116 q-8 22 -20 24 q18 -66 8 -134 Z" fill="${h.light}" opacity=".45"/>`,
    front: (h) => helmet(h, FRINGE.sweep) +
      `<path d="M190 122 q30 -26 68 -22" fill="none" stroke="${h.light}" stroke-width="8" stroke-linecap="round" opacity=".65"/>`,
  },
  bob: {
    back: (h) => `<path d="M154 196 q-10 -116 102 -118 q112 2 102 118 q8 60 -18 88 q-16 16 -44 18 q14 -50 6 -96 l-92 0 q-8 46 6 96 q-28 -2 -44 -18 q-26 -28 -18 -88 Z" fill="${h.base}"/>
      <path d="M332 214 q8 48 -8 82" fill="none" stroke="${h.light}" stroke-width="9" stroke-linecap="round" opacity=".5"/>`,
    front: (h) => helmet(h, FRINGE.flat) +
      `<path d="M196 122 q26 -20 56 -18" fill="none" stroke="${h.light}" stroke-width="7" stroke-linecap="round" opacity=".65"/>`,
  },
  shortSide: {
    back: (h) => `<path d="M160 196 q-10 -114 96 -116 q106 2 96 116 l-14 10 q8 -50 -12 -74 l-140 0 q-20 24 -12 74 Z" fill="${h.base}"/>`,
    front: (h) => helmet(h, FRINGE.sweep) +
      `<path d="M206 118 q22 -14 48 -12" fill="none" stroke="${h.light}" stroke-width="6" stroke-linecap="round" opacity=".6"/>`,
  },
  bun: {
    back: (h) => `<circle cx="256" cy="84" r="36" fill="${h.base}"/>
      <path d="M228 92 q28 -20 56 0" fill="none" stroke="${h.light}" stroke-width="6" opacity=".55"/>
      <path d="M160 196 q-10 -110 96 -112 q106 2 96 112 l-12 12 q6 -48 -12 -72 l-144 0 q-18 24 -12 72 Z" fill="${h.base}"/>`,
    front: (h) => helmet(h, FRINGE.part),
  },
  ponytail: {
    back: (h) => `<path d="M336 158 q40 8 34 74 q-6 56 -34 76 q-18 12 -20 -8 q22 -48 6 -120 Z" fill="${h.base}"/>
      <path d="M356 200 q8 52 -14 92" fill="none" stroke="${h.light}" stroke-width="8" stroke-linecap="round" opacity=".5"/>
      <path d="M160 196 q-10 -112 96 -114 q106 2 96 114 l-12 10 q6 -46 -12 -70 l-144 0 q-18 24 -12 70 Z" fill="${h.base}"/>`,
    front: (h) => helmet(h, FRINGE.sweep) +
      `<path d="M200 122 q26 -18 56 -16" fill="none" stroke="${h.light}" stroke-width="7" stroke-linecap="round" opacity=".65"/>`,
  },
  greyShort: {
    back: (h) => `<path d="M164 192 q-8 -104 92 -106 q100 2 92 106 l-14 8 q6 -44 -10 -64 l-136 0 q-16 20 -10 64 Z" fill="${h.base}"/>`,
    front: (h) => helmet(h, FRINGE.part) +
      `<path d="M214 116 q20 -10 42 -9" fill="none" stroke="${h.light}" stroke-width="6" stroke-linecap="round" opacity=".6"/>`,
  },
  curlyShort: {
    back: (h) => `<path d="M164 192 q-10 -108 92 -110 q102 2 92 110 l-10 12 q2 -40 -12 -62 l-140 0 q-14 22 -12 62 Z" fill="${h.base}"/>`,
    front: (h) => `<g fill="${h.base}"><circle cx="188" cy="146" r="27"/><circle cx="216" cy="118" r="29"/><circle cx="256" cy="106" r="30"/><circle cx="296" cy="118" r="29"/><circle cx="324" cy="146" r="27"/><circle cx="172" cy="176" r="22"/><circle cx="340" cy="176" r="22"/></g>
      <circle cx="250" cy="112" r="9" fill="${h.light}" opacity=".5"/><circle cx="292" cy="126" r="7" fill="${h.light}" opacity=".45"/>`,
  },
};

/* ---------- clothing builders (torso layer, plus over-face props) ---------- */

function torsoBase(fill, gid, from, to) {
  return {
    defs: linGrad(gid, from, to),
    body: `<path d="M96 512 q6 -120 82 -150 q38 -16 78 -16 q40 0 78 16 q76 30 82 150 Z" fill="url(#${gid})" ${lnw()}/>`,
  };
}
const COLLAR = (skin) => `<path d="M226 330 q30 22 60 0 l-8 26 q-22 14 -44 0 Z" fill="${skin.shade}" opacity=".45"/>`;

const CLOTHES = {
  doctorCoat(skin) {
    const g = "cl_doc";
    return {
      defs: linGrad(g, "#ffffff", "#e9e4d8") + linGrad(g + "t", "#6d9484", "#5b8172"),
      body:
        `<path d="M96 512 q6 -120 82 -150 q38 -16 78 -16 q40 0 78 16 q76 30 82 150 Z" fill="url(#${g}t)"/>` +
        `<path d="M256 352 l-34 -6 l-52 22 q-62 34 -66 144 l86 0 Z" fill="url(#${g})" ${lnw()}/>` +
        `<path d="M256 352 l34 -6 l52 22 q62 34 66 144 l-86 0 Z" fill="url(#${g})" ${lnw()}/>` +
        `<path d="M222 346 l34 44 l34 -44" fill="none" ${lnw()}/>` +
        // stethoscope worn at the collar so the cue survives the stage crop
        `<path d="M204 338 q-6 30 20 44 M308 338 q6 30 -20 44" fill="none" stroke="#3f4a52" stroke-width="13" stroke-linecap="round"/>` +
        `<path d="M224 382 q32 20 64 0" fill="none" stroke="#3f4a52" stroke-width="13" stroke-linecap="round"/>` +
        `<circle cx="292" cy="396" r="20" fill="#4a565f" stroke="#2f3840" stroke-width="3"/><circle cx="292" cy="396" r="9" fill="#8fa0ab"/>`,
    };
  },
  clerk(skin) {
    const g = "cl_clk";
    const t = torsoBase(null, g, "#e6e2d4", "#d5cfbc");
    return { defs: t.defs, body: t.body + COLLAR(skin) +
      `<path d="M226 336 l-16 26 M286 336 l16 26" fill="none" ${lnw()}/>` +
      // lanyard + ID badge: the clerk cue that survives the crop
      `<path d="M226 342 L252 408 M286 342 L260 408" fill="none" stroke="#7f9c6c" stroke-width="7"/>` +
      `<g><rect x="236" y="404" width="40" height="30" rx="5" fill="#fdfbf4" ${lnw(3)}/>` +
      `<rect x="242" y="411" width="12" height="12" rx="3" fill="#c9b184"/>` +
      `<path d="M258 413 h12 M258 420 h12" stroke="#a89c84" stroke-width="3.4" stroke-linecap="round"/></g>`,
    };
  },
  polo(skin, c1 = "#e6e2d4", c2 = "#d5cfbc") {
    const g = "cl_polo";
    const t = torsoBase(null, g, c1, c2);
    return { defs: t.defs, body: t.body + COLLAR(skin) +
      `<path d="M226 336 l-16 22 M286 336 l16 22" fill="none" ${lnw()}/>` };
  },
  overalls(skin) {
    const g = "cl_ov";
    const t = torsoBase(null, g, "#5c6a75", "#49545e");
    return { defs: t.defs, body: t.body +
      `<path d="M196 380 l0 132 M316 380 l0 132" stroke="#3a434b" stroke-width="10"/>` +
      `<rect x="216" y="420" width="80" height="64" rx="10" fill="#6b7987" ${lnw()}/>` +
      `<g transform="rotate(-14 256 452)"><rect x="248" y="424" width="12" height="44" rx="5" fill="#a89c84"/><path d="M244 424 a10 10 0 1 1 24 0 l-5 0 a7 7 0 1 0 -14 0 Z" fill="#a89c84"/></g>` +
      COLLAR(skin) };
  },
  stylish(skin) {
    const g = "cl_sty";
    const t = torsoBase(null, g, "#c78a9b", "#b27487");
    return { defs: t.defs, body: t.body + COLLAR(skin) +
      `<path d="M186 512 q-4 -80 24 -118" fill="none" stroke="#a56276" stroke-width="8" stroke-linecap="round" opacity=".8"/>` };
  },
  waiter(skin) {
    const g = "cl_wai";
    return { defs: linGrad(g, "#454e57", "#343b43"),
      body:
        `<path d="M96 512 q6 -120 82 -150 q38 -16 78 -16 q40 0 78 16 q76 30 82 150 Z" fill="#f2efe6" ${lnw()}/>` +
        `<path d="M148 512 q4 -96 60 -132 l48 60 l48 -60 q56 36 60 132 Z" fill="url(#${g})" ${lnw()}/>` +
        `<path d="M236 356 l20 24 l20 -24 l-12 -12 l-16 0 Z" fill="#f2efe6" ${lnw(S - 1)}/>` +
        `<path d="M246 344 h20 l-4 10 h-12 Z" fill="#7c353b"/>`,
    };
  },
  whiteCoat(skin, topC = "#7f9c6c") {
    const g = "cl_wc";
    return { defs: linGrad(g, "#ffffff", "#eae5da"),
      body:
        `<path d="M96 512 q6 -120 82 -150 q38 -16 78 -16 q40 0 78 16 q76 30 82 150 Z" fill="${topC}"/>` +
        `<path d="M256 352 l-34 -6 l-52 22 q-62 34 -66 144 l86 0 Z" fill="url(#${g})" ${lnw()}/>` +
        `<path d="M256 352 l34 -6 l52 22 q62 34 66 144 l-86 0 Z" fill="url(#${g})" ${lnw()}/>` +
        `<path d="M222 346 l34 44 l34 -44" fill="none" ${lnw()}/>` +
        `<g><path d="M310 430 v26 M297 443 h26" stroke="#7f9c6c" stroke-width="8" stroke-linecap="round"/></g>`,
    };
  },
  headsetShirt(skin) {
    const g = "cl_hs";
    const t = torsoBase(null, g, "#8fae76", "#7c9a64");
    return { defs: t.defs, body: t.body + COLLAR(skin) +
      `<path d="M216 340 l-12 20 M296 340 l12 20" fill="none" ${lnw()}/>` };
  },
  jacket(skin) {
    const g = "cl_jk";
    return { defs: linGrad(g, "#8a7d67", "#756955"),
      body:
        `<path d="M96 512 q6 -120 82 -150 q38 -16 78 -16 q40 0 78 16 q76 30 82 150 Z" fill="#e6e2d4"/>` +
        `<path d="M256 358 l-38 -14 l-48 24 q-62 34 -66 144 l96 0 Z" fill="url(#${g})" ${lnw()}/>` +
        `<path d="M256 358 l38 -14 l48 24 q62 34 66 144 l-96 0 Z" fill="url(#${g})" ${lnw()}/>` +
        `<path d="M230 344 l26 36 l26 -36" fill="none" ${lnw()}/>`,
    };
  },
  suit(skin) {
    const g = "cl_st";
    return { defs: linGrad(g, "#4c5568", "#3b4354"),
      body:
        `<path d="M96 512 q6 -120 82 -150 q38 -16 78 -16 q40 0 78 16 q76 30 82 150 Z" fill="#f2efe6"/>` +
        `<path d="M256 356 l-36 -10 l-50 22 q-62 34 -66 144 l100 0 Z" fill="url(#${g})" ${lnw()}/>` +
        `<path d="M256 356 l36 -10 l50 22 q62 34 66 144 l-100 0 Z" fill="url(#${g})" ${lnw()}/>` +
        `<path d="M256 360 l-12 -14 l12 -8 l12 8 Z" fill="#7c353b" ${lnw(S - 1)}/>` +
        `<path d="M250 358 l6 74 l6 -74" fill="#7c353b"/>`,
    };
  },
  cardigan(skin) {
    const g = "cl_cd";
    const t = torsoBase(null, g, "#d8975f", "#c9854e");
    return { defs: t.defs, body: t.body + COLLAR(skin) +
      `<path d="M212 352 q-16 70 -8 160 M300 352 q16 70 8 160" fill="none" stroke="#b26f3c" stroke-width="7" opacity=".8"/>` +
      `<circle cx="256" cy="392" r="5" fill="#8a5a38"/><circle cx="256" cy="428" r="5" fill="#8a5a38"/>` +
      `<path d="M226 336 q30 26 60 0" fill="none" stroke="#e8e0cc" stroke-width="12" stroke-linecap="round"/>`,
    };
  },
};

/* ---------- extra hands for thinking / success ---------- */
function hand(state, skin, sleeve) {
  if (state === "thinking") {
    return `<g>
      <path d="M352 512 q34 -60 6 -128 q-16 -40 -44 -66" fill="none" stroke="${sleeve}" stroke-width="46" stroke-linecap="round"/>
      <g transform="rotate(-16 306 310)"><ellipse cx="306" cy="310" rx="26" ry="30" fill="${skin.base}" ${lnw()}/>
      <path d="M288 296 q8 -10 18 -6 M290 310 q8 -8 16 -5" fill="none" stroke="${skin.shade}" stroke-width="5" stroke-linecap="round"/></g></g>`;
  }
  if (state === "success") {
    return `<g>
      <path d="M394 512 q30 -72 6 -150 q-8 -26 -20 -44" fill="none" stroke="${sleeve}" stroke-width="46" stroke-linecap="round"/>
      <g transform="rotate(18 380 300)"><ellipse cx="380" cy="300" rx="26" ry="31" fill="${skin.base}" ${lnw()}/>
      <path d="M362 284 q4 -12 11 -3 M375 279 q4 -12 11 -3 M388 284 q4 -10 10 -2" fill="none" stroke="${skin.shade}" stroke-width="5" stroke-linecap="round"/></g>
      <g fill="${P.warmOrange}"><path d="M430 232 l5 12 12 5 -12 5 -5 12 -5 -12 -12 -5 12 -5 Z"/><path d="M452 286 l3.5 8 8 3.5 -8 3.5 -3.5 8 -3.5 -8 -8 -3.5 8 -3.5 Z" opacity=".85"/></g></g>`;
  }
  return "";
}

/* ---------- head + face assembly ---------- */
function head(cfg, state) {
  const skin = SKIN[cfg.skin], hair = HAIRC[cfg.hair];
  const hb = HAIR[cfg.hairStyle];
  const tilt = state === "listening" ? -3 : 0;
  const gid = "sk_" + cfg.id;
  const defs = radGrad(gid, skin.base, skin.shade, 0.5, 0.38, 0.75);
  const glasses = cfg.glasses
    ? `<g fill="none" stroke="${P.lens}" stroke-width="${S + 1}"><circle cx="${256 - 46}" cy="188" r="26"/><circle cx="${256 + 46}" cy="188" r="26"/><path d="M236 188 h40 M184 184 l-16 -6 M328 184 l16 -6"/></g>`
    : "";
  const beard = cfg.beard
    ? `<path d="M180 216 q-8 76 76 80 q84 -4 76 -80 q6 70 -28 90 q-22 12 -48 12 q-26 0 -48 -12 q-34 -20 -28 -90 Z" fill="${hair.dark}" stroke="${P.stroke}" stroke-width="3" stroke-linejoin="round"/>
       <path d="M226 268 q30 16 60 0" fill="none" stroke="${hair.light}" stroke-width="5" stroke-linecap="round" opacity=".5"/>`
    : "";
  const earr = cfg.earrings
    ? `<circle cx="162" cy="228" r="5" fill="${P.warmOrange}"/><circle cx="350" cy="228" r="5" fill="${P.warmOrange}"/>`
    : "";
  const headset = cfg.headset
    ? `<g><path d="M166 128 q90 -64 180 0" fill="none" stroke="#3f4a52" stroke-width="11"/><rect x="150" y="180" width="22" height="42" rx="10" fill="#3f4a52"/><path d="M162 222 q-4 34 40 40" fill="none" stroke="#3f4a52" stroke-width="8"/><circle cx="206" cy="264" r="8" fill="#3f4a52"/></g>`
    : "";
  const cap = cfg.cap
    ? `<g><path d="M170 152 q0 -72 86 -72 q86 0 86 72 l0 8 l-172 0 Z" fill="#5b7a52" ${lnw()}/><path d="M162 158 q94 -18 188 0 l0 14 q-94 -16 -188 0 Z" fill="#4c6845" ${lnw(S - 1)}/></g>`
    : "";
  return {
    defs,
    body: `<g${tilt ? ` transform="rotate(${tilt} 256 250)"` : ""}>
      ${hb ? hb.back(hair) : ""}
      <path d="M236 296 h40 l0 40 h-40 Z" fill="${skin.shade}"/>
      <ellipse cx="162" cy="206" rx="14" ry="18" fill="${skin.base}" ${lnw(S - 1)}/>
      <ellipse cx="350" cy="206" rx="14" ry="18" fill="${skin.base}" ${lnw(S - 1)}/>
      <path d="M166 186 q-4 -110 90 -110 q94 0 90 110 q2 88 -46 116 q-22 12 -44 12 q-22 0 -44 -12 q-48 -28 -46 -116 Z" fill="url(#${gid})" ${lnw()}/>
      <path d="M336 140 q14 26 10 62" fill="none" stroke="#ffffff" stroke-width="7" stroke-linecap="round" opacity=".35"/>
      ${beard}
      ${blush(skin, state === "success")}
      ${brows(state, hair)}
      ${eyes(state, cfg.iris || "#5d4227")}
      ${nose(skin)}
      ${mouth(state)}
      ${hb ? hb.front(hair) : ""}
      ${cap}
      ${glasses}
      ${headset}
      ${earr}
    </g>`,
  };
}

/* ---------- contact roster: personas match server.js AVATARS ---------- */
const CONTACTS = [
  { id: "arzt", family: "clinic", skin: "light", hair: "brown", hairStyle: "longWavy", iris: "#5d4227",
    clothes: "doctorCoat", sleeve: "#eae5da", earrings: true,
    label: "Doctor, Praxis Dr. Wagner" },
  { id: "amt", family: "public-office", skin: "medium", hair: "darkBrown", hairStyle: "shortSide",
    clothes: "clerk", sleeve: "#d5cfbc", label: "Citizens' office clerk" },
  { id: "werkstatt", family: "workshop", skin: "tan", hair: "black", hairStyle: "shortSide", cap: true,
    clothes: "overalls", sleeve: "#49545e", label: "Car mechanic, KFZ Reuter" },
  { id: "friseur", family: "reception", skin: "light", hair: "auburn", hairStyle: "bob", earrings: true,
    clothes: "stylish", sleeve: "#b27487", label: "Hair stylist, Salon Bergmann" },
  { id: "restaurant", family: "restaurant", skin: "medium", hair: "black", hairStyle: "shortSide",
    clothes: "waiter", sleeve: "#f2efe6", label: "Waiter, Restaurant Alte Mühle" },
  { id: "apotheke", family: "pharmacy", skin: "light", hair: "darkBrown", hairStyle: "bun", glasses: true,
    clothes: "whiteCoat", sleeve: "#eae5da", label: "Pharmacist, Adler-Apotheke" },
  { id: "paket", family: "retail", skin: "deep", hair: "black", hairStyle: "curlyShort", headset: true,
    clothes: "headsetShirt", sleeve: "#7c9a64", label: "Parcel-service agent" },
  { id: "vermieter", family: "utility", skin: "medium", hair: "grey", hairStyle: "greyShort", beard: true,
    clothes: "jacket", sleeve: "#8a7d67", label: "Property manager Krüger" },
  { id: "bank", family: "office", skin: "tan", hair: "darkBrown", hairStyle: "shortSide",
    clothes: "suit", sleeve: "#3b4354", label: "Bank service employee" },
  { id: "kita", family: "school", skin: "light", hair: "blonde", hairStyle: "ponytail", earrings: true,
    clothes: "cardigan", sleeve: "#c9854e", label: "Kindergarten teacher" },
];

const STATES = ["idle", "listening", "speaking", "thinking", "success"];

function portrait(cfg, state) {
  const bg = background(cfg.family);
  const cl = CLOTHES[cfg.clothes](SKIN[cfg.skin]);
  const hd = head(cfg, state);
  /* LANDSCAPE SCENE: the stage card is ~2.35:1, so the scene is authored at
     512x218 — at the 390x844 acceptance viewport the cover-crop shows the
     WHOLE composition, so face, collar and profession cues are all in frame
     (visual-director F1). The bust keeps its native 512-grid geometry and is
     mapped in with one uniform transform: head top -> y14, chin -> y150,
     collar/props -> y156-205. */
  const K = 0.596, TX = 256 - 256 * K, TY = 14 - 76 * K;
  const body =
    // backdrop: family scene squeezed to the landscape canvas
    `<g transform="scale(1 0.852)">${bg.body}</g>` +
    // ambient shadow behind the bust
    `<ellipse cx="256" cy="206" rx="130" ry="14" fill="${P.stroke}" opacity=".12"/>` +
    `<g transform="translate(${TX.toFixed(1)} ${TY.toFixed(1)}) scale(${K})">` +
    cl.body + hd.body + hand(state, SKIN[cfg.skin], cfg.sleeve || "#d5cfbc") +
    `</g>`;
  return svg("0 0 512 218", bg.defs + cl.defs + hd.defs, body, `${cfg.label} — ${state}`);
}

module.exports = { CONTACTS, STATES, portrait };
