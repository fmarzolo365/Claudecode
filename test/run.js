/**
 * Telefontrainer test suite - dependency-free, runs with plain `node test/run.js`.
 *
 * Extracts the inline <script> from public/index.html, evaluates it against a
 * minimal DOM stub, and checks the invariants that past regressions came from:
 * i18n completeness across all 6 languages, deck data integrity, the
 * pronunciation matcher, XP/rank math, and scenario/character completeness.
 */
const fs = require("fs");
const path = require("path");

let failures = 0;
function check(name, fn) {
  try {
    fn();
    console.log("  ok  " + name);
  } catch (e) {
    failures++;
    console.error("FAIL  " + name + " — " + e.message);
  }
}

/* ---------- browser stubs ---------- */
const store = {};
globalThis.localStorage = {
  getItem: (k) => store[k] ?? null,
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: (k) => { delete store[k]; },
};
const els = {};
function mkEl() {
  return {
    classList: {
      _c: new Set(),
      toggle(c, f) { f === undefined ? (this._c.has(c) ? this._c.delete(c) : this._c.add(c)) : (f ? this._c.add(c) : this._c.delete(c)); },
      add(c) { this._c.add(c); }, remove(c) { this._c.delete(c); }, has(c) { return this._c.has(c); },
    },
    style: {}, dataset: {}, innerHTML: "", textContent: "", value: "", placeholder: "",
    disabled: false, className: "", onclick: null, oninput: null, onkeydown: null,
    querySelector() { return null; }, querySelectorAll: () => [],
    appendChild() {}, focus() {}, removeAttribute() {}, scrollTop: 0, scrollHeight: 0,
  };
}
globalThis.document = {
  getElementById: (id) => els[id] || (els[id] = mkEl()),
  addEventListener() {}, createElement: () => mkEl(),
  body: { appendChild() {} }, querySelectorAll: () => [],
};
globalThis.window = globalThis;
globalThis.speechSynthesis = { getVoices: () => [], cancel() {}, speak() {}, onvoiceschanged: null };
globalThis.SpeechSynthesisUtterance = function () {};
globalThis.webkitSpeechRecognition = function () { this.start = () => {}; };
globalThis.matchMedia = () => ({ matches: true });
globalThis.prompt = () => null;
globalThis.confirm = () => true;
globalThis.URL.createObjectURL = () => "blob:x";
globalThis.Audio = function () { this.play = async () => {}; };
globalThis.requestAnimationFrame = () => 1;
globalThis.cancelAnimationFrame = () => {};
if (!globalThis.performance) globalThis.performance = { now: () => 0 };
const nav = { mediaDevices: { getUserMedia: async () => ({ getTracks: () => [] }) } };
try { Object.defineProperty(globalThis, "navigator", { value: nav, configurable: true }); } catch (e) {}
globalThis.fetch = async () => ({ ok: true, status: 200, json: async () => ({}), blob: async () => ({}) });

/* ---------- load the app ---------- */
const html = fs.readFileSync(path.join(__dirname, "..", "public", "index.html"), "utf8");
const m = html.match(/<script>([\s\S]*)<\/script>/);
if (!m) { console.error("FAIL  could not extract app script"); process.exit(1); }
let src = m[1];
src += `\n;globalThis.__t = { T, TARGET, TARGETS, LEVELS, LEVEL_ORDER, SCENARIOS, GROUPS, BASIC_DECKS, HELP_LANG,
  saidWord, normDe, lev, rankFor, recordCall, addXp, loadStats, loadFixes, saveFixes,
  voiceOf, timerText, systemPrompt, S, chartSVG, loadTests, saveTestResult,
  MARZI_NAMES, stageFor, addCoins, COIN_PACKS, buyPack, planLimitToday, planUsedToday, PLAN_SECONDS };`;
eval(src);
const tt = globalThis.__t;

const LANGS = ["es", "en", "it", "tr", "ar", "uk"];

/* voice/portrait gender helpers shared by the character checks */
const FEMALE = new Set(["coral", "nova", "sage", "shimmer"]);
const MALE = new Set(["alloy", "ash", "ballad", "echo", "onyx", "fable"]);
const genderOf = (v) => (FEMALE.has(v) ? "F" : MALE.has(v) ? "M" : "?");
function parsePortraits() {
  const server = fs.readFileSync(path.join(__dirname, "..", "server.js"), "utf8");
  const block = server.slice(server.indexOf("const AVATARS"), server.indexOf("};", server.indexOf("const AVATARS")));
  const portraits = {};
  for (const m2 of block.matchAll(/^\s{2}(\w+): "([^"]+)"/gm)) {
    portraits[m2[1]] = /\bwoman\b/.test(m2[2]) ? "F" : /\bman\b/.test(m2[2]) ? "M" : "?";
  }
  if (Object.keys(portraits).length < 30) throw new Error("could not parse AVATARS from server.js");
  return portraits;
}
function checkPack(scenarios, groups, portraits, label) {
  const VOICES = ["alloy", "ash", "ballad", "coral", "echo", "fable", "nova", "onyx", "sage", "shimmer"];
  const ids = new Set(scenarios.map((s) => s.id));
  const grouped = new Set();
  for (const g of groups) {
    for (const l of LANGS) if (!g[l]) throw new Error(label + " group missing " + l);
    for (const id of g.ids) {
      if (!ids.has(id)) throw new Error(label + " group references unknown " + id);
      grouped.add(id);
    }
  }
  for (const sc of scenarios) {
    if (!sc.avatar) throw new Error(label + " " + sc.id + " no avatar");
    if (!grouped.has(sc.id)) throw new Error(label + " " + sc.id + " not in any group");
    if (!sc.goals) continue;
    if (!VOICES.includes(sc.voice)) throw new Error(sc.id + " voice " + sc.voice);
    if (!VOICES.includes(sc.voice2)) throw new Error(sc.id + " voice2 " + sc.voice2);
    if (sc.voice === sc.voice2) throw new Error(sc.id + " voice == voice2");
    if (!sc.who || !sc.tag || !sc.role || !sc.place) throw new Error(sc.id + " incomplete");
    for (const l of LANGS) if (!sc[l]) throw new Error(sc.id + " missing " + l);
    for (const [key, voice] of [[sc.id, sc.voice], [sc.id + "2", sc.voice2]]) {
      const pg = portraits[key];
      if (!pg) throw new Error("no portrait for " + key);
      if (pg !== "?" && genderOf(voice) !== pg) {
        throw new Error(key + ": portrait is " + pg + " but voice " + voice + " is " + genderOf(voice));
      }
    }
  }
}

/* ---------- checks ---------- */
check("all languages share the exact same i18n key set", () => {
  const ref = Object.keys(tt.T.es).sort().join(",");
  for (const l of LANGS) {
    const keys = Object.keys(tt.T[l]).sort().join(",");
    if (keys !== ref) {
      const a = new Set(Object.keys(tt.T.es)), b = new Set(Object.keys(tt.T[l]));
      const missing = [...a].filter((k) => !b.has(k));
      const extra = [...b].filter((k) => !a.has(k));
      throw new Error(l + " missing:[" + missing + "] extra:[" + extra + "]");
    }
  }
});

check("level order is A0..C1 and every level is localized", () => {
  if (tt.LEVEL_ORDER.join(",") !== "A0,A1,A2,B1,B2,C1") throw new Error(tt.LEVEL_ORDER.join(","));
  for (const k of tt.LEVEL_ORDER) {
    if (!tt.LEVELS[k] || !tt.LEVELS[k].guide) throw new Error(k + " incomplete");
    for (const l of LANGS) if (!tt.LEVELS[k][l]) throw new Error(k + " missing " + l);
  }
});

check("every real scenario has goals, avatar, whitelisted voices and 6 localizations", () => {
  const VOICES = ["alloy", "ash", "ballad", "coral", "echo", "fable", "nova", "onyx", "sage", "shimmer"];
  for (const sc of tt.SCENARIOS) {
    if (!sc.avatar) throw new Error(sc.id + " no avatar");
    if (sc.goals) {
      if (!VOICES.includes(sc.voice)) throw new Error(sc.id + " voice " + sc.voice);
      if (!VOICES.includes(sc.voice2)) throw new Error(sc.id + " voice2 " + sc.voice2);
      for (const l of LANGS) if (!sc[l]) throw new Error(sc.id + " missing " + l);
    }
  }
});

check("every scenario id in GROUPS exists, and every real scenario is in a group", () => {
  const ids = new Set(tt.SCENARIOS.map((s) => s.id));
  const grouped = new Set();
  for (const g of tt.GROUPS) {
    for (const l of LANGS) if (!g[l]) throw new Error("group missing " + l);
    for (const id of g.ids) {
      if (!ids.has(id)) throw new Error("group references unknown " + id);
      grouped.add(id);
    }
  }
  for (const sc of tt.SCENARIOS) if (!grouped.has(sc.id)) throw new Error(sc.id + " not in any group");
});

check("basics decks: 3 decks x 12 items, fully localized, examples translated", () => {
  if (tt.BASIC_DECKS.length !== 3) throw new Error("deck count " + tt.BASIC_DECKS.length);
  for (const d of tt.BASIC_DECKS) {
    if (d.items.length !== 12) throw new Error(d.id + " has " + d.items.length);
    for (const l of LANGS) if (!d[l]) throw new Error(d.id + " title missing " + l);
    for (const it of d.items) {
      if (!it.de) throw new Error(d.id + " item missing de");
      for (const l of LANGS) if (!it[l]) throw new Error(d.id + "/" + it.de + " missing " + l);
      if (it.ex) for (const l of LANGS) if (!it.xl || !it.xl[l]) throw new Error(d.id + "/" + it.de + " example missing " + l);
    }
  }
});

check("pronunciation matcher accepts honest attempts and rejects wrong words", () => {
  const cases = [
    ["Wann?", "wann", true], ["Wann?", "van", true], ["Wann?", "gestern", false],
    ["Wo?", "wo", true], ["Wo?", "vor", false],
    ["das Rezept", "rezept", true], ["der Termin", "tourist", false],
    ["die Krankenkasse", "kranken kasse", true],
    ["Können Sie das bitte wiederholen?", "können sie bitte wiederholen", true],
    ["Können Sie das bitte wiederholen?", "können bitte", false],
    ["um halb zehn", "halb zehn", true],
    ["Auf Wiederhören!", "wiederholen", false],
  ];
  for (const [target, heard, want] of cases) {
    if (tt.saidWord(heard, target) !== want) throw new Error(`saidWord("${heard}", "${target}") != ${want}`);
  }
});

check("XP and rank math", () => {
  const r0 = tt.rankFor(0), r1 = tt.rankFor(85), rTop = tt.rankFor(99999);
  if (r0.title !== "Neuling" || r0.next !== 80) throw new Error("rank0");
  if (r1.title !== "Anrufer") throw new Error("rank1");
  if (rTop.next !== null) throw new Error("top rank should have no next");
  tt.S.turns = [{ me: true, text: "a" }, { me: false, text: "b" }, { me: true, text: "c" }];
  tt.S.seconds = 60;
  const gained = tt.recordCall();
  if (gained !== 19) throw new Error("gain " + gained);
  if ((tt.loadStats().xp || 0) !== 19) throw new Error("xp not stored");
});

check("speaker voices: main and second differ where defined", () => {
  for (const sc of tt.SCENARIOS) {
    if (sc.goals && sc.voice === sc.voice2) throw new Error(sc.id + " voice == voice2");
  }
  tt.S.active = tt.SCENARIOS.find((x) => x.id === "arzt");
  if (tt.voiceOf(1) !== "coral" || tt.voiceOf(2) !== "onyx") throw new Error(tt.voiceOf(1) + "/" + tt.voiceOf(2));
});

check("voice gender matches the portrait gender for every character", () => {
  const portraits = parsePortraits();
  for (const sc of tt.SCENARIOS) {
    if (!sc.goals) continue;
    for (const [key, voice] of [[sc.id, sc.voice], [sc.id + "2", sc.voice2]]) {
      const pg = portraits[key];
      if (!pg) throw new Error("no portrait for " + key);
      if (pg !== "?" && genderOf(voice) !== pg) {
        throw new Error(key + ": portrait is " + pg + " but voice " + voice + " is " + genderOf(voice));
      }
    }
  }
});

check("timer label switches for face-to-face scenarios", () => {
  tt.S.active = tt.SCENARIOS.find((x) => x.id === "nachbar");
  if (!tt.timerText().startsWith("IM GESPRÄCH")) throw new Error(tt.timerText());
  tt.S.active = tt.SCENARIOS.find((x) => x.id === "arzt");
  if (!tt.timerText().startsWith("VERBUNDEN")) throw new Error(tt.timerText());
});

check("system prompt: face register, in-character correction, speaker contract", () => {
  tt.S.active = tt.SCENARIOS.find((x) => x.id === "nachbar");
  tt.S.currentGoal = "x";
  const p = tt.systemPrompt();
  if (!p.includes("face-to-face") || p.includes("Answer the phone")) throw new Error("face register");
  if (!p.includes('"speaker"')) throw new Error("speaker contract missing");
  if (!p.includes("Man sagt übrigens")) throw new Error("in-character correction missing");
  tt.S.active = tt.SCENARIOS.find((x) => x.id === "arzt");
  if (!tt.systemPrompt().includes("Answer the phone")) throw new Error("phone register regressed");
});

check("TARGET drives the taught language: registry shape, prompt language, recognition locale", () => {
  const R = tt.TARGETS;
  if (!R || !R.de || !R.en) throw new Error("TARGETS registry missing de/en");
  for (const code of ["de", "en"]) {
    const tg = R[code];
    for (const k of ["code", "locale", "name", "nativeName", "exam", "charset", "seed"]) {
      if (!tg[k] || typeof tg[k] !== "string") throw new Error(code + ": TARGET." + k + " missing");
    }
    if (tg.code !== code) throw new Error(code + ": code mismatch");
    if (!Array.isArray(tg.scenarios) || !Array.isArray(tg.groups) || !Array.isArray(tg.decks)) {
      throw new Error(code + ": content refs (scenarios/groups/decks) missing");
    }
  }
  if (R.de.locale !== "de-DE") throw new Error("de recognition locale is " + R.de.locale);
  if (R.en.locale !== "en-US") throw new Error("en recognition locale is " + R.en.locale);
  if (R.en.exam !== "IELTS") throw new Error("en exam is " + R.en.exam);
  // the default build teaches German - switching stays an explicit user choice
  if (tt.TARGET !== R.de) throw new Error("default TARGET must resolve to de");
  tt.S.active = tt.SCENARIOS.find((x) => x.id === "arzt");
  tt.S.currentGoal = "x";
  const p = tt.systemPrompt();
  if (!p.includes("German")) throw new Error("role-play prompt lost the target language name");
  // German prompt content must not drift when targets are added
  if (!p.includes("Man sagt übrigens: 'Ich hätte gern einen Termin.'")) throw new Error("German correction example changed");
  // the locale must come from TARGET, never be hardcoded at the recognition sites
  if (/\.lang = "de-DE"/.test(src)) throw new Error('speech recognition/TTS locale hardcoded as "de-DE" instead of TARGET.locale');

  // the EN pilot pack obeys the same rules as the German one
  const portraits = parsePortraits();
  checkPack(R.en.scenarios, R.en.groups, portraits, "en");
  const playable = R.en.scenarios.filter((s) => s.goals);
  if (playable.length !== 10) throw new Error("en pack has " + playable.length + " playable scenarios, expected 10");
  if (playable.filter((s) => s.kind === "face").length !== 2) throw new Error("en pack needs exactly 2 face-to-face scenarios");
  if (R.en.decks.length !== 3) throw new Error("en deck count " + R.en.decks.length);
  for (const d of R.en.decks) {
    if (d.items.length !== 12) throw new Error(d.id + " has " + d.items.length);
    for (const l of LANGS) if (!d[l]) throw new Error(d.id + " title missing " + l);
    for (const it of d.items) {
      if (!it.de) throw new Error(d.id + " item missing target text");
      for (const l of LANGS) if (!it[l]) throw new Error(d.id + "/" + it.de + " missing " + l);
      if (it.ex) for (const l of LANGS) if (!it.xl || !it.xl[l]) throw new Error(d.id + "/" + it.de + " example missing " + l);
    }
  }
});

check("marzi has 6 canonical stages and the coin economy works", () => {
  // six lamina stages (Marzi spec §15); the 7 XP ranks collapse onto them
  if (tt.MARZI_NAMES.length !== 6) throw new Error("stages " + tt.MARZI_NAMES.length);
  const map = [1, 2, 3, 4, 5, 5, 6];
  map.forEach((want, i) => {
    if (tt.stageFor(i + 1) !== want) throw new Error(`stageFor(${i + 1}) = ${tt.stageFor(i + 1)}, want ${want}`);
  });
  // coins: earned on rewards, spent on minute packages that extend today's plan
  const before = tt.loadStats().coins || 0;
  tt.addCoins(250);
  if ((tt.loadStats().coins || 0) !== before + 250) throw new Error("coins not stored");
  const pack = tt.COIN_PACKS[0];
  const limitBefore = tt.planLimitToday();
  tt.buyPack(pack.id);
  if ((tt.loadStats().coins || 0) !== before + 250 - pack.price) throw new Error("purchase did not deduct");
  if (tt.planLimitToday() !== limitBefore + pack.minutes * 60) throw new Error("purchase did not extend the plan");
  const poor = tt.loadStats().coins || 0;
  tt.buyPack("min100"); // 1500 coins - cannot afford, must be rejected
  if ((tt.loadStats().coins || 0) !== poor) throw new Error("insufficient-coin purchase went through");
});

check("progress chart renders points, CEFR bands and a projection", () => {
  const tests = [
    { date: "2026-07-01", score: 20, cefr: "A1" },
    { date: "2026-07-08", score: 30, cefr: "A1" },
    { date: "2026-07-15", score: 41, cefr: "A2" },
  ];
  const svg = tt.chartSVG(tests);
  if (!svg.includes("<svg") || !svg.includes("stroke-dasharray")) throw new Error("no projection");
  for (const band of ["A1", "A2", "B1", "B2", "C1"]) if (!svg.includes(">" + band + "<")) throw new Error("band " + band);
});

/* ---------- result ---------- */
if (failures) {
  console.error("\n" + failures + " check(s) failed");
  process.exit(1);
}
console.log("\nAll checks passed.");
