/* MARZI call-art generator — shared drawing library.
   Dependency-free Node. Every asset family composes from these helpers so
   stroke, palette and shading stay consistent (technical art brief §1). */
"use strict";

/* ---------- palette (brief §1C + canonical Marzi DNA) ---------- */
const P = {
  stroke: "#4a3427",         // warm dark brown line
  cream: "#f6f1e7",
  creamDeep: "#efe7d6",
  shadowBeige: "#e8ddcb",
  marziGreen: "#7baf45",
  marziBody: "#79a94c",      // canonical body green (marziSVG)
  marziLight: "#97c162",
  marziDark: "#5e8e32",
  marziLine: "#33461f",
  accentSoft: "#a8c97a",
  belly: "#f4ecd6",
  lens: "#4a3423",
  textDark: "#2e2b26",
  mutedBrown: "#7c7468",
  blush: "#e9a08b",
  white: "#ffffff",
  warmOrange: "#ffaa47",
};

/* skin/hair ramps: warm flat tones, 2-3 steps each (brief §1C) */
const SKIN = {
  light: { base: "#f3cfa8", shade: "#e5b98d", cheek: "#eda286" },
  medium: { base: "#e0ac77", shade: "#cf9763", cheek: "#d98f6d" },
  tan: { base: "#c98d5d", shade: "#b87a4c", cheek: "#c47c55" },
  deep: { base: "#9c6b45", shade: "#8a5a38", cheek: "#a56a48" },
};
const HAIRC = {
  brown: { base: "#6d4c33", light: "#8a6544", dark: "#54371f" },
  darkBrown: { base: "#4f3623", light: "#6a4c33", dark: "#3a2617" },
  black: { base: "#38302b", light: "#4f453e", dark: "#272220" },
  blonde: { base: "#d9a860", light: "#e8c184", dark: "#b98a47" },
  grey: { base: "#a9a29a", light: "#c2bcb4", dark: "#8d867e" },
  auburn: { base: "#8a4a30", light: "#a56344", dark: "#6d3722" },
};

let uid = 0;
function id(prefix) { return `${prefix}${(uid++).toString(36)}`; }
function resetIds() { uid = 0; }

/* soft vertical/linear gradient */
function linGrad(gid, from, to, x1 = 0, y1 = 0, x2 = 0, y2 = 1) {
  return `<linearGradient id="${gid}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">` +
    `<stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient>`;
}
function radGrad(gid, from, to, cx = 0.5, cy = 0.4, r = 0.7) {
  return `<radialGradient id="${gid}" cx="${cx}" cy="${cy}" r="${r}">` +
    `<stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></radialGradient>`;
}

/* stroke attrs: consistent line per family (brief §1B) */
function ln(w = 6) {
  return `fill="none" stroke="${P.stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;
}

function svg(view, defs, body, title) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${view}" role="img" aria-label="${title}">` +
    (defs ? `<defs>${defs}</defs>` : "") + body + `</svg>`;
}

module.exports = { P, SKIN, HAIRC, id, resetIds, linGrad, radGrad, ln, svg };
