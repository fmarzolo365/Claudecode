/* Marzi call poses + outfit variants (brief Layers C/D).
   Canonical DNA (style guide §1 + marziSVG): round green frog, huge glossy
   eyes, thin round glasses ON the eyes, big head ratio, two-tone green,
   light hoodie with the green "M" patch (call-art reference board).
   ViewBox 0 0 120 120, matching the shipped Marzi vector conventions. */
"use strict";
const { P, linGrad, radGrad, svg } = require("./lib");

const G1 = "#79a94c", G2 = "#97c162", G3 = "#5e8e32", DARK = "#33461f", LENS = "#4a3423";
/* stroke-only attrs (combine with any fill); lnf = stroke attrs for pure
   line work, carrying its own fill="none" */
const ln = (w = 2.6) => `stroke="${DARK}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;
const lnf = (w = 2.6) => `fill="none" ${ln(w)}`;

/* ---------- outfits: hoodie/garment layer over the body blob ---------- */
const OUTFITS = {
  base: { // light hoodie + green M (reference board default)
    fill: "#e9ead4", trim: "#c9cdaa", motif:
      `<path d="M52 89 v-10 l8 7 l8 -7 v10" ${lnf(2.4).replace(DARK, G3)}/>`,
    hood: `<path d="M36 62 q-8 6 -6 14 M84 62 q8 6 6 14" `, strings: true },
  university: { fill: "#8e3b3b", trim: "#722e2e", motif:
    `<path d="M52 89 v-10 l8 7 l8 -7 v10" fill="none" stroke="#f2e6c9" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`,
    hood: `<path d="M36 62 q-8 6 -6 14 M84 62 q8 6 6 14" `, strings: true },
  explorer: { fill: "#c9b184", trim: "#b39a6a", motif:
    `<rect x="50" y="80" width="8" height="7" rx="1.5" fill="#a8895a"/><rect x="62" y="80" width="8" height="7" rx="1.5" fill="#a8895a"/>`,
    hat: `<g><path d="M28 18 q32 -12 64 0 l5 3 q-37 10 -74 0 Z" fill="#b39a6a" ${ln(2)}/><path d="M40 15 q20 -14 40 0 l2 3 q-22 6 -44 0 Z" fill="#c9b184" ${ln(2)}/></g>` },
  graduate: { fill: "#3d4152", trim: "#2f3342", motif:
    `<path d="M54 82 q6 5 12 0" fill="none" stroke="#c9b184" stroke-width="2.4" stroke-linecap="round"/>`,
    cap: `<g><path d="M60 3 L94 14 L60 25 L26 14 Z" fill="#3d3d3d"/><rect x="56" y="17" width="8" height="6" rx="2" fill="#2c2c2c"/><path d="M92 15 v10" stroke="#3d3d3d" stroke-width="2.4"/><circle cx="92" cy="28" r="3" fill="#ff6f59"/></g>` },
};

/* ---------- pose pieces ---------- */

function eyes(kind) {
  const y = 34;
  const eye = (cx, inner) => `
    <circle cx="${cx}" cy="${y}" r="9.5" fill="#fff" stroke="${DARK}" stroke-width="1.5"/>${inner}`;
  const open = (cx, px = 0, py = 1) =>
    eye(cx, `<circle cx="${cx + px}" cy="${y + py}" r="4.6" fill="${DARK}"/>
      <circle cx="${cx + px + 1.6}" cy="${y + py - 2.4}" r="1.7" fill="#fff"/>
      <circle cx="${cx + px - 1.8}" cy="${y + py + 1.6}" r=".8" fill="#fff" opacity=".85"/>`);
  const happy = (cx) => `<path d="M${cx - 7} ${y + 2} q7 -8 14 0" ${lnf(2.6)}/>`;
  const sadLid = (cx) => eye(cx, `<circle cx="${cx}" cy="${y + 2}" r="4.6" fill="${DARK}"/>
      <circle cx="${cx + 1.6}" cy="${y - .6}" r="1.5" fill="#fff"/>
      <path d="M${cx - 9.5} ${y - 4} a9.5 9.5 0 0 1 19 0 l0 -1.5 q-9.5 -6 -19 0 Z" fill="${G1}"/>
      <path d="M${cx - 9} ${y - 5} q9 -5 18 0" ${lnf(1.8)}/>`);
  switch (kind) {
    case "happy": return happy(45) + happy(75);
    case "wink": return open(45) + happy(75);
    case "sad": return sadLid(45) + sadLid(75);
    case "up": return open(45, -1.4, -2.8) + open(75, -1.4, -2.8);
    default: return open(45) + open(75);
  }
}

function glassesArt() {
  return `<circle cx="45" cy="34" r="12.5" fill="none" stroke="${LENS}" stroke-width="3"/>
    <circle cx="75" cy="34" r="12.5" fill="none" stroke="${LENS}" stroke-width="3"/>
    <path d="M57.5 34 h5 M32.5 33 l-6 -3 M87.5 33 l6 -3" stroke="${LENS}" stroke-width="3" stroke-linecap="round"/>`;
}

function mouthArt(kind) {
  switch (kind) {
    case "big": return `<path d="M45 56 q15 16 30 0 q-6 12 -15 12 q-9 0 -15 -12 Z" fill="#5c3a30" ${ln(2)}/>
      <path d="M50 63 q10 6 20 0 q-4 5 -10 5 q-6 0 -10 -5 Z" fill="#e08a7a"/>`;
    case "open": return `<ellipse cx="60" cy="60" rx="7.5" ry="6" fill="#5c3a30" ${ln(2)}/>
      <path d="M54 62 q6 4 12 0 q-2 3.4 -6 3.4 q-4 0 -6 -3.4 Z" fill="#e08a7a"/>`;
    case "down": return `<path d="M47 64 q13 -9 26 0" ${lnf(2.8)}/>`;
    case "small": return `<path d="M52 60 q8 5 16 1" ${lnf(2.6)}/>`;
    case "o": return `<ellipse cx="60" cy="60" rx="4.5" ry="5" fill="#5c3a30" ${ln(1.8)}/>`;
    default: return `<path d="M47 58 q13 9 26 0" ${lnf(2.8)}/>`;
  }
}

/* hoodie sleeves + green mitten hands. kinds: down, wave, point, chin,
   ear, hearts, shrug, plug */
function arms(kind, o) {
  const sleeve = (d) => `<path d="${d}" fill="none" stroke="${o.fill}" stroke-width="10" stroke-linecap="round"/>`;
  const seam = (d) => `<path d="${d}" fill="none" stroke="${o.trim}" stroke-width="10" stroke-linecap="round" opacity=".35"/>`;
  const hand = (x, y) => `<circle cx="${x}" cy="${y}" r="6" fill="${G2}" ${ln(1.8)}/>`;
  switch (kind) {
    case "wave": return sleeve("M86 76 Q104 66 108 46") + seam("M86 76 Q104 66 108 46") + hand(109, 42) +
      sleeve("M34 80 Q24 86 22 94") + hand(21, 96);
    case "point": return sleeve("M86 78 Q102 70 104 52") + hand(105, 47) +
      `<circle cx="105" cy="41" r="2" fill="${G2}" ${ln(1.4)}/>` +
      sleeve("M34 80 Q24 86 22 94") + hand(21, 96);
    case "chin": return sleeve("M84 82 Q96 80 92 66") + hand(90, 62) +
      sleeve("M36 80 Q26 86 24 94") + hand(23, 96);
    case "ear": return sleeve("M86 78 Q100 68 96 50") + hand(94, 46) +
      sleeve("M34 80 Q24 86 22 94") + hand(21, 96);
    case "hearts": return sleeve("M84 80 Q94 74 96 64") + hand(96, 60) +
      sleeve("M36 80 Q26 74 24 64") + hand(24, 60) +
      `<path d="M60 14 c-2.6 -4.4 -9.4 -3 -9.4 2 c0 3.6 5 7.4 9.4 10 c4.4 -2.6 9.4 -6.4 9.4 -10 c0 -5 -6.8 -6.4 -9.4 -2 Z" fill="#e26d5a"/>`;
    case "shrug": return sleeve("M84 78 Q98 74 102 62") + hand(103, 58) +
      sleeve("M36 78 Q22 74 18 62") + hand(17, 58);
    case "plug": return sleeve("M84 82 Q96 84 100 92") + hand(101, 94) +
      sleeve("M36 82 Q24 84 20 92") + hand(19, 94) +
      `<g transform="translate(96 100) rotate(24)"><rect x="0" y="0" width="10" height="8" rx="2" fill="#8d867e"/><path d="M2.5 0 v-4 M7.5 0 v-4" stroke="#8d867e" stroke-width="2"/><path d="M10 4 q8 2 12 -4" fill="none" stroke="#8d867e" stroke-width="2"/></g>`;
    default: return sleeve("M86 80 Q98 86 100 94") + hand(101, 96) +
      sleeve("M34 80 Q22 86 20 94") + hand(19, 96);
  }
}

function extras(kind) {
  switch (kind) {
    case "sparkle": return `<g fill="${P.warmOrange}">
      <path d="M22 18 l2.4 6 6 2.4 -6 2.4 -2.4 6 -2.4 -6 -6 -2.4 6 -2.4 Z"/>
      <path d="M98 12 l1.8 4.6 4.6 1.8 -4.6 1.8 -1.8 4.6 -1.8 -4.6 -4.6 -1.8 4.6 -1.8 Z" opacity=".9"/>
      <circle cx="106" cy="34" r="2.4" opacity=".8"/></g>`;
    case "notes": return `<g fill="none" stroke="${G3}" stroke-width="2.4" stroke-linecap="round">
      <path d="M100 26 v-10 l7 -2 v10"/><circle cx="97.5" cy="26" r="3" fill="${G3}" stroke="none"/><circle cx="104.5" cy="24" r="3" fill="${G3}" stroke="none"/></g>`;
    case "qmark": return `<g><path d="M97 18 q10 -8 16 2 q4 8 -6 12 l-1 5" fill="none" stroke="${P.mutedBrown}" stroke-width="3.4" stroke-linecap="round"/><circle cx="105.4" cy="44" r="2.4" fill="${P.mutedBrown}"/></g>`;
    case "drop": return `<path d="M99 20 q7 9 0 13 q-8 -4 0 -13 Z" fill="#8fb7d9"/>`;
    case "retry": return `<g fill="none" stroke="${G3}" stroke-width="3.2" stroke-linecap="round">
      <path d="M94 24 a11 11 0 1 1 -4 14"/><path d="M92 18 l2 7 7 -1" stroke-linejoin="round"/></g>`;
    case "bulb": return `<g><circle cx="102" cy="22" r="8" fill="#f5d876" stroke="${P.warmOrange}" stroke-width="2"/><path d="M99 31 h6 M100 35 h4" stroke="${P.warmOrange}" stroke-width="2" stroke-linecap="round"/><path d="M102 8 v4 M91 12 l2.6 2.6 M113 12 l-2.6 2.6" stroke="${P.warmOrange}" stroke-width="2" stroke-linecap="round"/></g>`;
    default: return "";
  }
}

/* ---------- the frog itself ---------- */
function marziBody(o, pose) {
  const gid = "mz_" + pose.name.replace(/[^a-z]/g, "");
  const defs =
    radGrad(gid + "h", G2, G1, 0.5, 0.35, 0.8) +
    linGrad(gid + "b", o.fill, o.trim);
  const stalk = (cx) => `<circle cx="${cx}" cy="34" r="14" fill="url(#${gid}h)"/>`;
  /* the garment is an INSET vest over the blob — green stays visible at the
     shoulders and sides so Marzi reads as a frog wearing a hoodie, never as
     a shell (canonical DNA) */
  const hood = o.none ? `<ellipse cx="60" cy="84" rx="19" ry="14" fill="#f4ecd6"/>` : `
    <path d="M33 76 Q29 97 45 98 L75 98 Q91 97 87 76 Q85 66 76 68 Q60 76 44 68 Q35 66 33 76 Z" fill="url(#${gid}b)" ${ln(2)}/>
    <path d="M44 68 Q60 76 76 68" fill="none" stroke="${o.trim}" stroke-width="2.6" stroke-linecap="round"/>
    ${o.strings ? `<path d="M52 74 q0 5 -1.5 8 M68 74 q0 5 1.5 8" ${lnf(1.4).replace(DARK, o.trim)}/><circle cx="50.5" cy="84" r="1.4" fill="${o.trim}"/><circle cx="69.5" cy="84" r="1.4" fill="${o.trim}"/>` : ""}
    ${o.motif || ""}`;
  return {
    defs,
    body: `
    <ellipse cx="60" cy="103" rx="34" ry="6" fill="${DARK}" opacity=".12"/>
    <path d="M27 76 Q22 100 42 100 L78 100 Q98 100 93 76 Q88 46 60 46 Q32 46 27 76 Z" fill="url(#${gid}h)"/>
    ${stalk(45)}${stalk(75)}
    ${hood}
    ${arms(pose.arms, o)}
    <ellipse cx="42" cy="101" rx="9" ry="4.5" fill="${G2}" ${ln(1.6)}/>
    <ellipse cx="78" cy="101" rx="9" ry="4.5" fill="${G2}" ${ln(1.6)}/>
    ${eyes(pose.eyes)}
    ${pose.glasses === false ? "" : glassesArt()}
    <circle cx="40" cy="57" r="3.6" fill="${P.blush}" opacity=".5"/>
    <circle cx="80" cy="57" r="3.6" fill="${P.blush}" opacity=".5"/>
    ${mouthArt(pose.mouth)}
    ${o.hat || ""}${o.cap || ""}
    ${extras(pose.extra)}`,
  };
}

/* pose vocabulary (brief Layer C) */
const POSES = {
  idle: { eyes: "open", mouth: "smile", arms: "down" },
  listening: { eyes: "open", mouth: "smile", arms: "ear", extra: "notes" },
  thinking: { eyes: "up", mouth: "small", arms: "chin", extra: "qmark" },
  helping: { eyes: "open", mouth: "big", arms: "point", extra: "bulb" },
  suggesting: { eyes: "wink", mouth: "big", arms: "point", extra: "sparkle" },
  celebrating: { eyes: "happy", mouth: "big", arms: "wave", extra: "sparkle" },
  confused: { eyes: "open", mouth: "o", arms: "shrug", extra: "qmark" },
  error: { eyes: "sad", mouth: "down", arms: "down", extra: "drop" },
  disconnected: { eyes: "sad", mouth: "down", arms: "plug" },
  retry: { eyes: "open", mouth: "smile", arms: "wave", extra: "retry" },
  /* extra states used by the shipped stage-aware call registry */
  speaking: { eyes: "open", mouth: "open", arms: "down" },
  encouraging: { eyes: "wink", mouth: "big", arms: "point", extra: "sparkle" },
  limit: { eyes: "sad", mouth: "down", arms: "down", extra: "drop" },
  offline: { eyes: "sad", mouth: "down", arms: "plug" },
  ready: { eyes: "open", mouth: "smile", arms: "down" },
};

function marziPose(poseName, { outfit = "base", stage = 5 } = {}) {
  const p = POSES[poseName];
  if (!p) throw new Error("unknown Marzi pose: " + poseName);
  const o = { ...OUTFITS[outfit] };
  const pose = { ...p, name: poseName };
  if (stage === 4) { pose.glasses = false; o.hat = ""; o.cap = ""; o.none = true; o.motif = ""; o.strings = false; }
  if (stage === 6 && !o.cap) o.cap = OUTFITS.graduate.cap;
  const { defs, body } = marziBody(o, pose);
  return svg("0 0 120 120", defs, body, `Marzi — ${poseName}`);
}

module.exports = { marziPose, POSES, OUTFITS };
