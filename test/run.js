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
const pending = []; // async checks settle before the summary
function check(name, fn) {
  try {
    const r = fn();
    if (r && typeof r.then === "function") {
      pending.push(r.then(
        () => console.log("  ok  " + name),
        (e) => { failures++; console.error("FAIL  " + name + " — " + e.message); }
      ));
      return;
    }
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
  key: (i) => Object.keys(store)[i] ?? null,
  get length() { return Object.keys(store).length; },
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
    setAttribute() {}, getAttribute() { return null; },
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
globalThis.addEventListener = () => {};
globalThis.location = { hash: "", reload() {} };
globalThis.history = {
  replaceState: (_s, _t, url) => { globalThis.location.hash = String(url); },
  pushState() {},
};
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
  MARZI_NAMES, marziStageForXp, currentMarziStage, renderCallCompanion, addCoins, COIN_PACKS, buyPack, planLimitToday, planUsedToday, PLAN_SECONDS,
  normalizeStats, claimReward, newRewardId, migratedName, migrateStorageKeys, micStatusFor, MARZI_KEY,
  TAB_HASH, tabFromHash, showTab, updateTopbar,
  ENGINE_CONTRACTS, validateProvider, createProviderRegistry, ScenarioRegistry, CharacterRegistry,
  createTranscript, PromptBuilder, createConversationSession, ENGINE, send, ask,
  callStateFor, callStateLabel, callStateIcon, callSecondsLeft, renderScenarioCards, renderCharacterCard, scenarioSubtitle,
  UI, IC, evolutionHTML };`;
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
  // canonical XP thresholds (MARZI-001): exact values map UP, invalid maps to 1
  const cases = [[0,1],[149,1],[150,2],[399,2],[400,3],[799,3],[800,4],[1499,4],[1500,5],[2599,5],[2600,6],[999999,6],[-5,1],[NaN,1],["nope",1],[null,1],[undefined,1]];
  for (const [xp, want] of cases) {
    const got = tt.marziStageForXp(xp);
    if (got !== want) throw new Error(`marziStageForXp(${xp}) = ${got}, want ${want}`);
  }
  // the call companion must show the EARNED stage - stage 5 is never forced
  localStorage.setItem("marzi.stats.v1", JSON.stringify({ days:{}, xp: 0 }));
  for (const [xp, want] of [[0,1],[200,2],[500,3],[900,4],[1600,5],[3000,6]]) {
    localStorage.setItem("marzi.stats.v1", JSON.stringify({ days:{}, xp }));
    tt.renderCallCompanion();
    const el = document.getElementById("vcMarzi");
    if (el.dataset.stage !== String(want)) throw new Error(`companion at ${xp} XP shows stage ${el.dataset.stage}, want ${want}`);
  }
  localStorage.setItem("marzi.stats.v1", JSON.stringify({ days:{}, xp: 0 }));
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

check("MARZI-001 corrections: ledger idempotency, per-call ids, hardened storage", () => {
  // claimReward pays exactly once per id (double tap / re-render safety)
  localStorage.setItem("marzi.stats.v1", JSON.stringify({ xp: 0, coins: 0 }));
  localStorage.setItem("marzi.reward-ledger.v1", JSON.stringify({}));
  const first = tt.claimReward("test:once", { xp: 10, coins: 5 });
  const dupe = tt.claimReward("test:once", { xp: 10, coins: 5 });
  if (!first.claimed || dupe.claimed) throw new Error("ledger not idempotent");
  let st = tt.loadStats();
  if (st.xp !== 10 || st.coins !== 5) throw new Error(`paid ${st.xp}xp/${st.coins}c, want 10/5`);
  // two calls with fresh ids BOTH record (regression: callId was never reset)
  tt.S.turns = [{ me: true, text: "Guten Tag" }]; tt.S.seconds = 30;
  tt.S.callId = tt.newRewardId();
  const g1 = tt.recordCall();
  const g2 = tt.recordCall(); // same call re-finalized: must NOT pay twice
  tt.S.callId = tt.newRewardId(); // what startConversation now does per call
  const g3 = tt.recordCall();
  if (!(g1 > 0) || g2 !== 0 || !(g3 > 0)) throw new Error(`gains ${g1}/${g2}/${g3}, want >0/0/>0`);
  if (tt.loadStats().calls !== 2) throw new Error(`calls=${tt.loadStats().calls}, want 2`);
  const startSrc = String(src.match(/function startConversation\(\)[\s\S]*?\n\}/)[0]);
  if (!/S\.callId = newRewardId\(\)/.test(startSrc)) throw new Error("startConversation does not reset S.callId");
  // normalizeStats survives corrupt localStorage shapes
  const n = tt.normalizeStats({ xp: -3, coins: "x", seconds: NaN, days: [], ownedItemIds: "no" });
  if (n.xp !== 0 || n.coins !== 0 || n.seconds !== 0) throw new Error("negative/NaN not zeroed");
  if (Array.isArray(n.days) || typeof n.days !== "object" || n.ownedItemIds.length !== 0) throw new Error("shapes not normalized");
  if (tt.normalizeStats(null).calls !== 0) throw new Error("null stats not defaulted");
  // brand migration copies every legacy key; evolution key reads the new name
  if (tt.migratedName("telefontrainer.stats") !== "marzi.stats.v1") throw new Error("stats key unmapped");
  if (tt.migratedName("telefontrainer.vocab.kita.A1") !== "marzi.vocab.v1.kita.A1") throw new Error("vocab prefix unmapped");
  if (tt.MARZI_KEY !== "marzi.stage.v1") throw new Error("MARZI_KEY still legacy: " + tt.MARZI_KEY);
  localStorage.setItem("telefontrainer.marzi", "4");
  tt.migrateStorageKeys();
  if (localStorage.getItem("marzi.stage.v1") !== "4") throw new Error("migration did not copy stage");
  localStorage.removeItem("telefontrainer.marzi"); localStorage.removeItem("marzi.stage.v1");
  // mic button states: busy wins, listening pulses, idle is ready
  if (tt.micStatusFor({ busy: true, listening: true }) !== "processing") throw new Error("busy should win");
  if (tt.micStatusFor({ busy: false, listening: true }) !== "listening") throw new Error("listening state");
  if (tt.micStatusFor({ busy: false, listening: false }) !== "ready") throw new Error("ready state");
});

check("MARZI-002 shell: hash routing, top-bar resources, reusable primitives", () => {
  // the four canonical tabs each own a hash; junk hashes resolve to null
  if (Object.keys(tt.TAB_HASH).join() !== "learn,talk,store,profile") throw new Error("tab set changed");
  if (tt.tabFromHash("#store") !== "store" || tt.tabFromHash("store") !== "store") throw new Error("hash not resolved");
  if (tt.tabFromHash("#nope") !== null || tt.tabFromHash("") !== null || tt.tabFromHash(null) !== null) throw new Error("junk hash not rejected");
  // navigating writes the hash (back-button support)
  tt.showTab("store");
  if (globalThis.location.hash !== "#store") throw new Error("store hash " + globalThis.location.hash);
  tt.showTab("profile");
  if (globalThis.location.hash !== "#profile") throw new Error("profile hash " + globalThis.location.hash);
  // top bar shows coins and the remaining daily call minutes
  const today = new Date().toISOString().slice(0, 10);
  localStorage.setItem("marzi.stats.v1", JSON.stringify({ coins: 77, days: {}, secDays: { [today]: 360 } }));
  tt.updateTopbar();
  if (!document.getElementById("tbCoins").innerHTML.includes("77")) throw new Error("coins chip");
  if (!document.getElementById("tbMins").innerHTML.endsWith(" 24")) throw new Error("minutes chip: " + document.getElementById("tbMins").innerHTML);
  // shell primitives, tokens and chrome exist in the document
  for (const needle of [".card {", ".btn {", "--space-3:", "--text-sm:", 'id="tbGear"', 'id="tbMins"', "hashchange"]) {
    if (!html.includes(needle)) throw new Error("shell missing " + needle);
  }
  tt.showTab("learn");
});

check("MARZI-003 engine: contracts, DI, registries, transcript, lifecycle", async () => {
  // interface contracts reject incomplete providers; DI throws before registration
  const P = tt.createProviderRegistry();
  let threw = 0;
  try { P.register("ai", {}); } catch (e) { threw++; if (!/complete/.test(e.message)) throw e; }
  try { P.register("nope", { x() {} }); } catch (e) { threw++; }
  try { P.get("ai"); } catch (e) { threw++; }
  if (threw !== 3) throw new Error("contract/DI violations not rejected: " + threw);
  if (P.has("ai")) throw new Error("failed registration must not register");
  P.register("voice", { speak: async () => {}, stopAll() {} });
  if (!P.has("voice") || typeof P.get("voice").speak !== "function") throw new Error("DI roundtrip");
  // registries are read-only views over the canonical scenario data
  const ids = tt.ScenarioRegistry.ids();
  if (!ids.length || ids.some((id) => !tt.SCENARIOS.find((s) => s.id === id && s.goals))) throw new Error("scenario ids");
  try { tt.ScenarioRegistry.get("no-such"); throw new Error("unknown scenario accepted"); }
  catch (e) { if (!/unknown scenario/.test(e.message)) throw e; }
  const c1 = tt.CharacterRegistry.get(ids[0], 1), c2 = tt.CharacterRegistry.get(ids[0], 2);
  if (c1.name !== tt.ScenarioRegistry.get(ids[0]).who || !c1.voice) throw new Error("character view");
  if (c2.id !== ids[0] + "2" || c2.speaker !== 2) throw new Error("second speaker view");
  // transcript model validates turns and maps to provider messages
  const tr = tt.createTranscript();
  for (const bad of [null, {}, { speaker: "learner", text: "" }, { speaker: "robot", text: "hi" }]) {
    try { tr.add(bad); throw new Error("bad turn accepted: " + JSON.stringify(bad)); }
    catch (e) { if (!/turn/.test(e.message)) throw e; }
  }
  tr.add({ speaker: "character", text: "Guten Tag!" });
  tr.add({ speaker: "learner", text: "Hallo, ich möchte einen Termin." });
  const msgs = tr.forPrompt("SEED");
  if (msgs.length !== 3 || msgs[0].content !== "SEED" || msgs[1].role !== "assistant" || msgs[2].role !== "user") throw new Error("forPrompt mapping");
  if (tr.last().index !== 1 || tr.list().length !== 2) throw new Error("transcript accessors");
  // prompt builder delegates to the frozen prompt and never leaks state into S
  const before = JSON.stringify({ sc: tt.S.scenario.id, lvl: tt.S.level, lang: tt.S.lang, goal: tt.S.currentGoal });
  const sc = tt.ScenarioRegistry.get(ids[0]);
  const prompt = tt.PromptBuilder.rolePlay({ scenario: sc, level: "A2", lang: "en", goal: sc.goals[0] });
  if (!prompt.includes(sc.goals[0]) || !prompt.includes("CEFR level A2")) throw new Error("prompt content");
  if (JSON.stringify({ sc: tt.S.scenario.id, lvl: tt.S.level, lang: tt.S.lang, goal: tt.S.currentGoal }) !== before) throw new Error("PromptBuilder leaked state into S");
  // lifecycle: created -> active -> ended, with a fake injected AI provider
  const providers = tt.createProviderRegistry();
  const seen = {};
  providers.register("ai", { complete: async ({ system, messages }) => { seen.system = system; seen.messages = messages; return { text: "Praxis Dr. Weber, guten Tag!" }; } });
  const ses = tt.createConversationSession({ scenarioId: ids[0], level: "A1", lang: "en", goal: sc.goals[0], providers });
  if (ses.state !== "created" || ses.character(2).speaker !== 2) throw new Error("session init");
  let notActive = false;
  try { await ses.send("Hallo?"); } catch (e) { notActive = /not active/.test(e.message); }
  if (!notActive) throw new Error("send before start accepted");
  ses.start();
  try { ses.start(); throw new Error("double start accepted"); } catch (e) { if (!/cannot start/.test(e.message)) throw e; }
  const reply = await ses.send("Guten Tag, ich hätte gern einen Termin.");
  if (reply.text !== "Praxis Dr. Weber, guten Tag!") throw new Error("reply not returned");
  if (ses.transcript.list().length !== 2 || ses.transcript.last().speaker !== "character") throw new Error("send did not record turns");
  if (!seen.system.includes("CEFR level A1") || seen.messages[0].content !== tt.TARGET.seed) throw new Error("provider not fed prompt+seed");
  ses.end();
  let endedThrew = false;
  try { await ses.send("noch da?"); } catch (e) { endedThrew = /ended/.test(e.message); }
  if (!endedThrew) throw new Error("send after end accepted");
});

check("MARZI-004 integration: live call flow runs on the engine, guarded", async () => {
  // boot registered the three live adapters
  for (const kind of ["ai", "speech", "voice"]) if (!tt.ENGINE.has(kind)) throw new Error("live adapter missing: " + kind);
  const sc = tt.ScenarioRegistry.get(tt.ScenarioRegistry.ids()[0]);
  // -- session-level guards with fake providers --
  const P = tt.createProviderRegistry();
  P.register("ai", { complete: async () => ({ text: "Praxis, guten Tag!", raw: { reply: "Praxis, guten Tag!", speaker: "main" } }) });
  const ses = tt.createConversationSession({ scenario: sc, level: "A1", lang: "en", goal: sc.goals[0], providers: P }).start();
  const opening = await ses.ask(); // a call opens with the character: no learner turn needed
  if (opening.text !== "Praxis, guten Tag!" || ses.transcript.list().length !== 1) throw new Error("opening ask");
  await ses.send("Guten Tag, ich hätte gern einen Termin.");
  if (ses.transcript.list().length !== 3) throw new Error("send lifecycle");
  // duplicate turn: same speaker + same text back to back is rejected
  const tr = tt.createTranscript();
  tr.add({ speaker: "learner", text: "Wie bitte?" });
  try { tr.add({ speaker: "learner", text: "Wie bitte?" }); throw new Error("dup accepted"); }
  catch (e) { if (!/duplicate/.test(e.message)) throw e; }
  tr.add({ speaker: "character", text: "Gern." }); tr.add({ speaker: "learner", text: "Wie bitte?" }); // legit repeat
  // concurrent AI requests are rejected while one is in flight
  let releaseLate;
  P.register("ai", { complete: () => new Promise((resolve) => { releaseLate = resolve; }) });
  const pendingReply = ses.ask();
  let dupRejected = false;
  try { await ses.ask(); } catch (e) { dupRejected = /duplicate ai request/.test(e.message); }
  if (!dupRejected) throw new Error("concurrent ask accepted");
  // call end during pending response: the late reply is dropped, transcript frozen
  const frozenLen = ses.transcript.list().length;
  ses.end();
  releaseLate({ text: "zu spät", raw: {} });
  if ((await pendingReply) !== null) throw new Error("late reply not dropped");
  if (ses.transcript.list().length !== frozenLen) throw new Error("late reply mutated ended transcript");
  // provider failure: session state survives and the next request works
  const ses2 = tt.createConversationSession({ scenario: sc, level: "A1", lang: "en", goal: sc.goals[0], providers: P }).start();
  P.register("ai", { complete: async () => { throw new Error("boom"); } });
  let failed = false;
  try { await ses2.ask(); } catch (e) { failed = true; }
  if (!failed || ses2.state !== "active" || ses2.busy) throw new Error("provider error corrupted session state");
  P.register("ai", { complete: async () => ({ text: "Wieder da.", raw: {} }) });
  if ((await ses2.ask()).text !== "Wieder da.") throw new Error("no recovery after provider failure");
  // -- UI-level wiring: send()/ask() route through S.session + ENGINE voice --
  const spoken = [];
  tt.ENGINE.register("ai", { complete: async ({ messages }) => {
    if (messages[0].content !== tt.TARGET.seed) throw new Error("seed missing from canonical history");
    return { text: "Praxis Dr. Weber, guten Tag!", raw: { reply: "Praxis Dr. Weber, guten Tag!", translation: "tr", suggestion: "Ich möchte einen Termin.", speaker: "second" } };
  } });
  tt.ENGINE.register("voice", { speak: async (o) => spoken.push(o.text), stopAll() {} });
  tt.S.active = sc; tt.S.turns = []; tt.S.handsFree = false; tt.S.busy = false;
  tt.S.session = tt.createConversationSession({ scenario: sc, level: "A1", lang: "en", goal: sc.goals[0], providers: tt.ENGINE }).start();
  tt.send("Hallo, ich brauche einen Termin.");
  tt.send("Hallo, ich brauche einen Termin."); // double submit while busy: ignored
  await new Promise((r) => setTimeout(r, 0));
  if (tt.S.turns.length !== 2 || !tt.S.turns[0].me || tt.S.turns[1].me) throw new Error("render model turns: " + tt.S.turns.length);
  if (tt.S.session.transcript.list().length !== 2) throw new Error("canonical transcript diverged");
  if (tt.S.speaker !== 2 || tt.S.turns[1].sp !== 2) throw new Error("character handover not applied");
  if (tt.S.hint !== "Ich möchte einen Termin.") throw new Error("hint not applied");
  if (spoken.join() !== "Praxis Dr. Weber, guten Tag!") throw new Error("voice provider not used: " + spoken.join());
  if (tt.S.busy) throw new Error("busy flag stuck");
  tt.S.session.end(); tt.S.session = null; tt.S.turns = [];
});

check("MARZI-005 practice + call UI: cards, states, bubbles, a11y", () => {
  const L = tt.T[tt.S.lang] || tt.T.en;
  // every call state resolves, and each has BOTH an icon and a text label
  const cases = [
    [{ session: { state: "ended" } }, "disconnected"],
    [{ callError: true }, "error"],
    [{ speaking: true }, "speaking"],
    [{ busy: true }, "processing"],
    [{ listening: true }, "listening"],
    [{}, "ready"],
  ];
  for (const [st, want] of cases) {
    const got = tt.callStateFor(st);
    if (got !== want) throw new Error(`callStateFor ${JSON.stringify(st)} = ${got}, want ${want}`);
    if (!tt.callStateLabel(got) || !/<svg/.test(tt.callStateIcon(got))) throw new Error("state without icon+text: " + got);
  }
  // precedence: an ended session outranks every transient state
  if (tt.callStateFor({ session: { state: "ended" }, listening: true, busy: true }) !== "disconnected") throw new Error("ended precedence");
  if (tt.callStateFor({ callError: true, speaking: true }) !== "error") throw new Error("error precedence");
  // the six state labels are localized in every help language
  for (const lang of Object.keys(tt.T)) {
    for (const k of ["stProcessing", "stSpeaking", "stEnded", "stError", "playLast", "contact", "prepHint", "timeLeft"]) {
      if (!tt.T[lang][k]) throw new Error(`missing ${k} in ${lang}`);
    }
  }
  // remaining call time comes from the existing plan math and never goes negative
  const today = new Date().toISOString().slice(0, 10);
  localStorage.setItem("marzi.stats.v1", JSON.stringify({ days: {}, secDays: { [today]: 600 } }));
  tt.S.seconds = 60;
  if (tt.callSecondsLeft() !== tt.PLAN_SECONDS - 660) throw new Error("time left: " + tt.callSecondsLeft());
  tt.S.seconds = 99999;
  if (tt.callSecondsLeft() !== 0) throw new Error("time left went negative");
  tt.S.seconds = 0;
  // scenario cards: selected state is exposed via aria-pressed, plus a check icon
  tt.renderScenarioCards();
  const rail = document.getElementById("scnRail").innerHTML;
  if (!rail.includes('aria-pressed="true"')) throw new Error("no selected scenario card");
  if ((rail.match(/aria-pressed="true"/g) || []).length !== 1) throw new Error("more than one selected card");
  if (!rail.includes("scn-on")) throw new Error("selected card has no non-colour indicator");
  if (!rail.includes(tt.S.scenario.de)) throw new Error("card missing scenario title");
  // character card uses existing scenario data only (built by UI.characterCard)
  tt.renderCharacterCard();
  const charHTML = document.getElementById("charCard").innerHTML;
  if (!charHTML.includes(tt.S.scenario.who)) throw new Error("character name");
  if (!charHTML.includes("char-card")) throw new Error("character card not built by the component");
  if (!tt.scenarioSubtitle(tt.S.scenario)) throw new Error("character place");
  // the preparation hint is advisory: goCall gating must be untouched
  const goCallSrc = String(src.match(/function goCall\(\)[\s\S]*?\n\}/)[0]);
  if (/charPrep|prepHint/.test(goCallSrc)) throw new Error("prep hint leaked into goCall gating");
  // markup guarantees: bubbles, identity outside the portrait, 48px targets, reduced motion
  for (const needle of [
    "UI.bubble({", 'class="bub"',                               // left/right bubbles
    'id="vcPlace"', 'class="vc-id"',                            // identity below the portrait
    'id="playBtn"', 'id="callStatus"',                          // speaker replay + status chip
    "prefers-reduced-motion", ":focus-visible",                 // a11y
    "min-height: 48px",
  ]) if (!html.includes(needle)) throw new Error("missing from markup: " + needle);
  // word tap and per-line translation survive the bubble rewrite
  const tpl = String(src.match(/\$\("log"\)\.innerHTML = S\.turns\.map[\s\S]*?\.join\(""\)/)[0]);
  for (const needle of ["tappable(x.text, i)", "data-play=", "data-tr=", "data-say=", "x.open"]) {
    if (!tpl.includes(needle)) throw new Error("bubble rewrite dropped: " + needle);
  }
});

check("design system: canonical components, tokens and documentation", () => {
  // 1. every documented component exists exactly once, as a builder
  const COMPONENTS = ["marziAvatar", "characterAvatar", "topBar", "coinChip", "xpBar",
    "evolutionCard", "characterCard", "scenarioCard", "bubble", "storeItem", "outfitCard",
    "buttonPrimary", "buttonSecondary", "statusBadge", "progressCard", "rewardPopup",
    "modal", "emptyState", "errorState"];
  for (const c of COMPONENTS) if (typeof tt.UI[c] !== "function") throw new Error("missing component: " + c);
  if (Object.keys(tt.UI).length !== COMPONENTS.length) {
    throw new Error("UI has undocumented members: " + Object.keys(tt.UI).filter((k) => !COMPONENTS.includes(k)));
  }
  // 2. every builder renders without arguments (safe defaults) and returns markup
  for (const c of COMPONENTS) {
    const out = tt.UI[c]();
    if (typeof out !== "string" || !out.trim().startsWith("<")) throw new Error(c + " did not render markup");
  }
  // 3. design tokens exist for every documented scale
  const root = html.slice(html.indexOf(":root {"), html.indexOf("}", html.indexOf(":root {")));
  for (const token of ["--bg:", "--primary:", "--ink:", "--space-3:", "--text-md:", "--radius:",
                       "--shadow:", "--dur:", "--ease:", "--icon-md:", "--touch-min:", "--avatar-md:"]) {
    if (!root.includes(token)) throw new Error("missing design token: " + token);
  }
  if (!/--touch-min:\s*48px/.test(root)) throw new Error("touch target token must be 48px");
  // 4. accessibility contracts baked into the components
  const sc = tt.SCENARIOS.find((x) => x.goals);
  if (!tt.UI.marziAvatar({ stage: 3 }).includes('role="img"')) throw new Error("marzi avatar needs role=img");
  if (!/aria-label="Marzi, [^"]+, 3\/6"/.test(tt.UI.marziAvatar({ stage: 3 }))) throw new Error("marzi avatar label");
  if (!tt.UI.scenarioCard({ scenario: sc, selected: true }).includes('aria-pressed="true"')) throw new Error("scenario card selected state");
  if (!tt.UI.scenarioCard({ scenario: sc, selected: true }).includes("scn-on")) throw new Error("selected state must not be colour-only");
  if (!tt.UI.xpBar({ percent: 40 }).includes('role="progressbar"')) throw new Error("xp bar needs progressbar role");
  if (!tt.UI.xpBar({ percent: 40 }).includes('aria-valuenow="40"')) throw new Error("xp bar value");
  if (!tt.UI.modal({ title: "t" }).includes('role="dialog"') || !tt.UI.modal({ title: "t" }).includes('aria-modal="true"')) throw new Error("modal a11y");
  if (!tt.UI.errorState({ title: "x" }).includes('role="alert"')) throw new Error("error state needs role=alert");
  if (!tt.UI.rewardPopup({ title: "x", xp: 5 }).includes('aria-live="polite"')) throw new Error("reward popup must announce");
  if (!tt.UI.statusBadge({ label: "on", icon: tt.IC.mic(12), tone: "success" }).includes('data-tone="success"')) throw new Error("status badge tone");
  // clamping and escaping
  if (!tt.UI.marziAvatar({ stage: 99 }).includes('data-stage="6"')) throw new Error("stage not clamped");
  if (!tt.UI.xpBar({ percent: 999 }).includes("width:100%")) throw new Error("percent not clamped");
  if (tt.UI.emptyState({ title: "<script>" }).includes("<script>")) throw new Error("empty state does not escape");
  // 5. shipped screens COMPOSE the components instead of re-declaring markup
  for (const [fn, comp] of [["renderScenarioCards", "UI.scenarioCard("], ["renderCharacterCard", "UI.characterCard("],
                            ["evolutionHTML", "UI.evolutionCard("], ["renderCall", "UI.bubble("]]) {
    const body = String(src.match(new RegExp("function " + fn + "\\([\\s\\S]*?\\n\\}"))[0]);
    if (!body.includes(comp)) throw new Error(fn + " does not use " + comp);
  }
  // 6. the written spec documents every component and token group
  const doc = fs.readFileSync(path.join(__dirname, "..", "docs", "DESIGN_SYSTEM.md"), "utf8");
  for (const c of COMPONENTS) if (!doc.includes("`UI." + c)) throw new Error("undocumented component: " + c);
  for (const sec of ["## Tokens", "Purpose", "States", "Accessibility", "Responsive", "Usage"]) {
    if (!doc.includes(sec)) throw new Error("design doc missing section: " + sec);
  }
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
Promise.all(pending).then(() => {
  if (failures) {
    console.error("\n" + failures + " check(s) failed");
    process.exit(1);
  }
  console.log("\nAll checks passed.");
});
