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
const os = require("os");
const { scanConflictMarkers } = require("./conflict-markers.js");

let failures = 0;
const pending = []; // async checks settle before the summary
/* async checks mutate shared app state (S), so they run one at a time and
   only after every synchronous check has finished */
let chain = Promise.resolve();
function checkAsync(name, fn) {
  chain = chain.then(async () => {
    try { await fn(); console.log("  ok  " + name); }
    catch (e) { failures++; console.error("FAIL  " + name + " — " + e.message); }
  });
  pending.push(chain);
}
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
    style: { _p: {}, setProperty(k, v) { this._p[k] = v; }, getPropertyValue(k) { return this._p[k] ?? ""; } },
    dataset: {}, innerHTML: "", textContent: "", value: "", placeholder: "",
    setAttribute() {}, getAttribute() { return null; },
    disabled: false, className: "", onclick: null, oninput: null, onkeydown: null,
    querySelector() { return null; }, querySelectorAll: () => [],
    appendChild() {}, focus() {}, removeAttribute() {}, scrollTop: 0, scrollHeight: 0,
    offsetHeight: 0, offsetWidth: 0,
  };
}
globalThis.document = {
  getElementById: (id) => els[id] || (els[id] = mkEl()),
  addEventListener() {}, createElement: () => mkEl(),
  // body carries a real classList: modal-lock, in-call and reduce-motion are
  // all applied there, so the stub has to be able to observe them
  body: Object.assign(mkEl(), { appendChild() {} }), querySelectorAll: () => [],
  // MARZI-062: every browser exposes documentElement, and the staging marker's
  // observer writes --staging-bar on it. The stub lacked it entirely.
  documentElement: mkEl(),
};
globalThis.ResizeObserver = function (cb) { this.observe = () => cb([]); this.disconnect = () => {}; };
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
  saidWord, normDe, lev, rankFor, RANKS, rankNames, legacyPromptHistory, recordCall, addXp, loadStats, loadFixes, saveFixes,
  voiceOf, timerText, systemPrompt, S, chartSVG, loadTests, saveTestResult,
  marziNames, marziDescs, MARZI_STAGE_COUNT, marziStageForXp, currentMarziStage, renderCallCompanion, addCoins, COIN_PACKS, buyPack, planLimitToday, planUsedToday, PLAN_SECONDS,
  normalizeStats, claimReward, newRewardId, migratedName, migrateStorageKeys, micStatusFor, MARZI_KEY,
  TAB_HASH, tabFromHash, showTab, updateTopbar,
  ENGINE_CONTRACTS, validateProvider, createProviderRegistry, ScenarioRegistry, CharacterRegistry,
  createTranscript, PromptBuilder, createConversationSession, ENGINE, send, ask,
  renderLearn, renderCall, renderTranscript, openCallSheet, closeCallSheet, sheetOpen, endCall, callStateFor, callStateLabel, callStateIcon, callSecondsLeft, renderScenarioCards, renderCharacterCard, scenarioSubtitle,
  UI, IC, ICON, evolutionHTML, renderCallStatus,
  MARZI_STATES, marziStateForCall, marziStateForReward, isMarziState, marziArt,
  marziAssetPath, hasMarziAsset, MARZI_ASSETS, marziSVG,
  showLimit, closeLimit, limitOpen, planSnapshot, mbFromSeconds, MB_PER_MINUTE, isPremium,
  premiumPreviewState, __setPremiumPreview, openPlanScreen, closePlanScreen, planScreenOpen,
  openPremiumScreen, closePremiumScreen, premiumScreenOpen, applyLangDirection, RTL_LANGS, isOffline, renderNetBanner, notifyStorageFailure, buildRewardSummary, isHighPerformance, renderRewardSummary, animateReward, celebrateEvolution,
  closeEvolutionCelebration, evolutionCelebrationOpen, CELEBRATED_KEY, claimReward, loadRewardLedger,
  OUTFITS, STORE_CATS, LEGACY_OUTFIT_IDS, outfitById, outfitName, outfitState,
  purchaseOutfit, equipOutfit, unequipOutfit, renderStore, openOutfitPreview, normalizeWardrobe,
  profileSnapshot, reviewedMistakeCount, ACHIEVEMENTS, achievementState, renderProfile, applyReduceMotion,
  MARZI_STAGE_XP, currentStreak, loadWords,
  journeyNodes, journeyState, renderJourney, setJourneyView, goToScenario, renderLearn,
  showOffline, closeOffline, offlineScreenOpen,
  CALL_POSE_STATES, CALL_POSE_TO_STATE, MARZI_CALL_ASSETS, marziCallPose, marziCallAssetPath,
  hasMarziCallAsset, marziCallArt, __registerCallAsset, renderCallCompanion,
  ONBOARD_KEY, LEARN_GOALS, DAILY_MINUTES, normalizeOnboarding, loadOnboarding, hasMeaningfulUserData,
  onboardingComplete, commitOnboarding, showOnboarding, renderOnboard, obPick, obNext, obBack, obStep,
  obCanAdvance, OB_STEPS, settingsPayload, fmtNum, plural, localeForLang, chipNum,
  isStandalone, installRecVisible, renderInstallRec, dismissInstallRec, INSTALL_DISMISS_KEY,
  weeklyActivity, recentActivity, renderRecommended, renderRecentActivity, renderJourneyPreview,
  journeyPreview, hasBrandMarkAsset, __registerBrandMark, BRAND_MARK_ASSET };`;
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
  // MARZI-017: rank titles are interface copy and follow the help language;
  // the thresholds and the rank ORDER are what must stay frozen.
  tt.S.lang = "en";
  const r0 = tt.rankFor(0), r1 = tt.rankFor(85), rTop = tt.rankFor(99999);
  if (r0.n !== 1 || r0.base !== 0 || r0.next !== 80) throw new Error("rank0");
  if (r1.n !== 2 || r1.base !== 80) throw new Error("rank1");
  if (r0.title !== tt.T.en.rankTitles[0] || r1.title !== tt.T.en.rankTitles[1]) throw new Error("rank titles not localized");
  tt.S.lang = "es";
  if (tt.rankFor(0).title !== tt.T.es.rankTitles[0]) throw new Error("rank title did not follow the help language");
  tt.S.lang = "en";
  if (tt.RANKS.map((r) => r[0]).join() !== "0,80,200,400,700,1100,1700") throw new Error("rank thresholds changed");
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
  // six canonical stages (concept boards 01/04); names are localized
  if (tt.MARZI_STAGE_COUNT !== 6) throw new Error("stage count " + tt.MARZI_STAGE_COUNT);
  if (tt.marziNames().length !== 6) throw new Error("stages " + tt.marziNames().length);
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

checkAsync("MARZI-003 engine: contracts, DI, registries, transcript, lifecycle", async () => {
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

checkAsync("MARZI-004 integration: live call flow runs on the engine, guarded", async () => {
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
    'id="callId"', "UI.callIdentity(",                          // identity block (MARZI-006)
    "UI.callControl(", 'id="callStatus"',                       // circular controls + status chip
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
    "modal", "emptyState", "errorState",
    "callControl", "speechBubble", "callIdentity", "callSheet", "categoryTabs", "rewardSummary",
    "brandLockup", "statCard", "activitySummary"];
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
                            ["evolutionHTML", "UI.evolutionCard("], ["renderTranscript", "UI.bubble("],
                            ["renderCall", "UI.callControl("], ["renderCall", "UI.callIdentity("]]) {
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

check("design tokens: no raw colours, timings, type sizes or icon sizes", () => {
  // the CSS outside :root must be token-only - this is what keeps the
  // design system canonical as new screens are added
  const styleBlock = html.slice(html.indexOf("<style>"), html.indexOf("</style>"));
  const rootStart = styleBlock.indexOf(":root {");
  const root = styleBlock.slice(rootStart, styleBlock.indexOf("}", rootStart));
  const body = styleBlock.replace(root, "");
  const hexes = body.match(/#[0-9a-fA-F]{3,8}\b/g) || [];
  if (hexes.length) throw new Error("hard-coded colours outside :root: " + [...new Set(hexes)].join(" "));
  const durs = body.match(/(?:transition|animation)[^;]*?(?<![\w-])\d*\.?\d+s/g) || [];
  if (durs.length) throw new Error("hard-coded timings outside :root: " + durs.join(" | "));
  const sizes = (body.match(/font-size:\s*\d+\.?\d*px/g) || [])
    .concat((body.match(/font:\s*[^;]+;/g) || []).flatMap((f) => f.match(/(?<![\w.-])\d+\.?\d*px(?=[\s/])/g) || []));
  if (sizes.length) throw new Error("raw type sizes outside :root: " + [...new Set(sizes)].join(" "));
  const icons = src.match(/IC\.\w+\(\d+\)/g) || [];
  if (icons.length) throw new Error("raw icon sizes: " + [...new Set(icons)].join(" "));
  // the JS icon scale and the CSS icon tokens must stay in step
  for (const [name, px] of Object.entries(tt.ICON)) {
    if (!root.includes(`--icon-${name === "xxs" ? "xxs" : name}: ${px}px`)) {
      throw new Error(`icon scale drift: ICON.${name}=${px} has no matching --icon-${name}`);
    }
  }
});

check("stage naming: localized names + descriptions match the concept boards", () => {
  // every help language carries six names and six descriptions
  for (const lang of LANGS) {
    const L = tt.T[lang];
    if (!Array.isArray(L.stageNames) || L.stageNames.length !== 6) throw new Error(lang + " stageNames");
    if (!Array.isArray(L.stageDescs) || L.stageDescs.length !== 6) throw new Error(lang + " stageDescs");
    if (L.stageNames.some((n) => !n || !n.trim())) throw new Error(lang + " empty stage name");
    if (L.stageDescs.some((d) => !d || d.length < 10)) throw new Error(lang + " weak stage description");
    if (!L.stageWord) throw new Error(lang + " stageWord");
  }
  // Spanish is transcribed verbatim from board 04_progress
  const es = tt.T.es.stageNames;
  const want = ["Huevos de rana", "Renacuajo", "Renacuajo con patas", "Ranita joven", "Rana estudiosa", "Rana experta"];
  if (es.join("|") !== want.join("|")) throw new Error("es stage names drifted from the board: " + es.join("|"));
  if (!/^Todo comienza/.test(tt.T.es.stageDescs[0])) throw new Error("es stage description drifted from the board");
  // stage 1 is plural in every language the board fixes
  if (tt.T.en.stageNames[0] !== "Frog eggs") throw new Error("stage 1 must be plural");
  // names follow the active help language, and the XP thresholds are untouched
  tt.S.lang = "es";
  if (tt.marziNames()[4] !== "Rana estudiosa") throw new Error("names not localized");
  if (tt.marziDescs().length !== 6) throw new Error("descs not localized");
  tt.S.lang = "en";
  if (tt.marziNames()[4] !== "Studious frog") throw new Error("names did not follow language");
  for (const [xp, want2] of [[0,1],[150,2],[400,3],[800,4],[1500,5],[2600,6]]) {
    if (tt.marziStageForXp(xp) !== want2) throw new Error("XP threshold changed at " + xp);
  }
});

check("home hero + XP bar follow the concept boards", () => {
  // board palette values applied as tokens
  const root = html.slice(html.indexOf(":root {"), html.indexOf("}", html.indexOf(":root {")));
  for (const [token, value] of [["--bg", "#fcf8f0"], ["--primary", "#547c2c"], ["--xp-fill", "#709820"], ["--track", "#e0dcc4"]]) {
    if (!root.includes(`${token}: ${value}`)) throw new Error(`${token} is not the board value ${value}`);
  }
  // XP fill is solid, not a gradient
  const xpCss = html.slice(html.indexOf("  .xpbar {"), html.indexOf("  .xpbar .xp-val"));
  if (/linear-gradient/.test(xpCss)) throw new Error("XP fill must be solid");
  if (!/height:\s*22px/.test(xpCss)) throw new Error("XP bar proportion");
  // hero renders stage identity, XP inside the bar, rank as a secondary line
  localStorage.setItem("marzi.stats.v1", JSON.stringify({ days: {}, xp: 520, calls: 4 }));
  tt.S.lang = "en";
  tt.renderLearn();
  if (document.getElementById("heroStage").textContent !== "Level 3") throw new Error("stage line: " + document.getElementById("heroStage").textContent);
  if (document.getElementById("heroStageName").textContent !== "Tadpole with legs") throw new Error("stage name line");
  if (!/^\d+ \/ \d+ XP$/.test(document.getElementById("heroXp").textContent)) throw new Error("XP value: " + document.getElementById("heroXp").textContent);
  if (!/^Lv\. \d+ · /.test(document.getElementById("heroLv").textContent)) throw new Error("learner rank must stay visible");
  // sparkles are CSS-only: no new image assets
  const hero = html.slice(html.indexOf("  .learn-hero {"), html.indexOf("  .hero-greet"));
  if (!hero.includes("radial-gradient")) throw new Error("sparkles missing");
  if (/url\(/.test(hero)) throw new Error("sparkles must not use image assets");
});

checkAsync("MARZI-006 call layer: states, sheet, guards, targets", async () => {
  const sc = tt.ScenarioRegistry.get(tt.ScenarioRegistry.ids()[0]);
  tt.S.lang = "en"; tt.S.active = sc; tt.S.turns = []; tt.S.busy = false;
  tt.S.listening = false; tt.S.speaking = false; tt.S.callError = false; tt.S.handsFree = false;
  const spoken = [];
  tt.ENGINE.register("voice", { speak: async (o) => spoken.push(o.text), stopAll() {} });
  tt.ENGINE.register("ai", { complete: async () => ({ text: "Praxis, guten Tag!", raw: { reply: "Praxis, guten Tag!", suggestion: "Ich möchte einen Termin.", speaker: "main" } }) });
  tt.S.session = tt.createConversationSession({ scenario: sc, level: "A1", lang: "en", goal: sc.goals[0], providers: tt.ENGINE }).start();

  // identity, controls and the labelled sheet opener all render
  tt.renderCall();
  const idHTML = document.getElementById("callId").innerHTML;
  if (!idHTML.includes(sc.who) || !idHTML.includes("Talking with")) throw new Error("identity block");
  const ctrls = document.getElementById("callControls").innerHTML;
  for (const id of ["micBtn", "hangBtn", "playBtn"]) if (!ctrls.includes(`id="${id}"`)) throw new Error("missing control " + id);
  if (!/class="call-ctrl danger"/.test(ctrls)) throw new Error("hang-up must be the danger control");
  if (!document.getElementById("sheetBtn").innerHTML.includes("Transcript")) throw new Error("sheet opener must be labelled, not icon-only");

  // every call state renders icon + text, and the mic follows
  for (const [set, want] of [
    [() => { tt.S.listening = true; }, "listening"],
    [() => { tt.S.listening = false; tt.S.speaking = true; }, "speaking"],
    [() => { tt.S.speaking = false; tt.S.busy = true; }, "processing"],
    [() => { tt.S.busy = false; tt.S.callError = true; }, "error"],
  ]) {
    set(); tt.renderCallStatus();
    const chip = document.getElementById("callStatus");
    if (chip.dataset.state !== want) throw new Error(`state ${chip.dataset.state}, want ${want}`);
    if (!/<svg/.test(chip.innerHTML) || !/<span>/.test(chip.innerHTML)) throw new Error(want + " needs icon + text");
    if (!document.getElementById("callStatusLive").textContent) throw new Error(want + " not announced");
  }
  if (document.getElementById("micBtn").dataset.status !== "failed") throw new Error("mic must show the error state");
  tt.S.callError = false;
  // disconnected persists while the session is ended
  tt.S.session.end(); tt.renderCallStatus();
  if (document.getElementById("callStatus").dataset.state !== "disconnected") throw new Error("disconnected state");

  // sheet: open/close, Escape and Android back all dismiss it
  tt.S.session = tt.createConversationSession({ scenario: sc, level: "A1", lang: "en", goal: sc.goals[0], providers: tt.ENGINE }).start();
  tt.openCallSheet();
  if (!tt.sheetOpen()) throw new Error("sheet did not open");
  tt.closeCallSheet();
  if (tt.sheetOpen()) throw new Error("sheet did not close");
  tt.openCallSheet(); tt.closeCallSheet(true); // popstate path (Android back)
  if (tt.sheetOpen()) throw new Error("back did not close the sheet");

  // full turn: transcript bubbles, no duplicates, speaker replay
  tt.send("Guten Morgen, ich hätte gern einen Termin.");
  tt.send("Guten Morgen, ich hätte gern einen Termin."); // immediate re-submit: must be ignored
  await new Promise((r) => setTimeout(r, 0));
  if (tt.S.turns.length !== 2) throw new Error("turns " + tt.S.turns.length);
  if (tt.S.session.transcript.list().length !== 2) throw new Error("duplicate turn accepted");
  tt.renderTranscript();
  const log = document.getElementById("log").innerHTML;
  if (!log.includes('class="turn me"') || !log.includes('class="turn char"')) throw new Error("transcript bubbles");
  if (!log.includes("data-tr=") || !log.includes("data-play=") || !log.includes("data-w=")) throw new Error("translation / slow repeat / word tap lost");
  tt.renderCall();
  spoken.length = 0; // the reply was already spoken once by the call flow
  document.getElementById("playBtn").onclick();
  if (spoken.join() !== "Praxis, guten Tag!") throw new Error("speaker replay: " + spoken.join());

  // late reply after hang-up is still dropped
  let release;
  tt.ENGINE.register("ai", { complete: () => new Promise((r) => { release = r; }) });
  const pending2 = tt.S.session.ask();
  const frozen = tt.S.session.transcript.list().length;
  tt.endCall();
  release({ text: "zu spät", raw: {} });
  if ((await pending2) !== null) throw new Error("late reply not dropped");
  if (tt.S.session.transcript.list().length !== frozen) throw new Error("late reply mutated the transcript");

  // layout contracts in the markup
  for (const needle of ["100dvh", "env(safe-area-inset-bottom", "env(safe-area-inset-top",
                        'class="callscreen"', "prefers-reduced-motion", 'role="dialog"']) {
    if (!html.includes(needle)) throw new Error("call layer missing: " + needle);
  }
  const ctrlCss = html.slice(html.indexOf("  .call-ctrl {"), html.indexOf("  .call-ctrl .call-ctrl-lb"));
  if (!/width:\s*64px/.test(ctrlCss)) throw new Error("controls must be at least 48px (64 specified)");
  if (!/width:\s*72px/.test(html.slice(html.indexOf("  .call-ctrl.danger"), html.indexOf("  .call-ctrl.danger:hover")))) throw new Error("hang-up size");
  const pillCss = html.slice(html.indexOf("  .call-pill {"), html.indexOf("  .call-pill[aria-pressed"));
  if (!/min-height:\s*var\(--touch-min\)/.test(pillCss)) throw new Error("tool pills must meet the touch floor");
  tt.S.session = null; tt.S.turns = [];
});

check("MARZI-007 store: catalog, purchase transaction, equip, migration", () => {
  const L = tt.T.en;
  // catalog matches the board panel exactly (slugs also match the asset spec)
  const want = [["explorer",4,800],["sporty",4,800],["rainbow",4,800],
                ["classic",5,900],["university",5,900],["artistic",5,900],
                ["professional",6,1200],["adventurer",6,1200],["graduate",6,1200]];
  if (tt.OUTFITS.length !== 9) throw new Error("catalog size " + tt.OUTFITS.length);
  want.forEach(([id, stage, price], i) => {
    const o = tt.OUTFITS[i];
    if (o.id !== id || o.stage !== stage || o.price !== price) throw new Error(`catalog[${i}] = ${o.id}/${o.stage}/${o.price}`);
    if (o.cat !== "outfits") throw new Error(id + " category");
  });
  if (tt.STORE_CATS.join() !== "outfits,hats,glasses,backpacks,pants") throw new Error("categories");
  for (const lang of LANGS) {
    if ((tt.T[lang].outfitNames || []).length !== 9) throw new Error(lang + " outfitNames");
    if ((tt.T[lang].catNames || []).length !== 5) throw new Error(lang + " catNames");
  }
  if (tt.T.es.outfitNames[0] !== "Exploradora") throw new Error("es names must match the board");

  const setStats = (o) => localStorage.setItem("marzi.stats.v1", JSON.stringify(o));
  // locked -> insufficient -> available
  setStats({ xp: 0, coins: 5000, ownedItemIds: [], equippedItemIds: [] });
  if (tt.outfitState("explorer") !== "locked") throw new Error("stage gate");
  setStats({ xp: 900, coins: 10, ownedItemIds: [], equippedItemIds: [] });
  if (tt.outfitState("explorer") !== "insufficient") throw new Error("insufficient state");
  setStats({ xp: 900, coins: 1000, ownedItemIds: [], equippedItemIds: [] });
  if (tt.outfitState("explorer") !== "available") throw new Error("available state");

  // buy deducts exactly once and does NOT auto-equip
  const r1 = tt.purchaseOutfit("explorer");
  if (!r1.ok || r1.code !== "bought") throw new Error("purchase failed");
  let st = tt.loadStats();
  if (st.coins !== 200) throw new Error("coins after buy: " + st.coins);
  if (!st.ownedItemIds.includes("explorer")) throw new Error("not owned");
  if (st.equippedItemIds.length !== 0) throw new Error("buying must not auto-equip");
  if (tt.outfitState("explorer") !== "owned") throw new Error("owned state");
  // duplicate purchase never deducts again
  const r2 = tt.purchaseOutfit("explorer");
  if (r2.ok || r2.code !== "already") throw new Error("duplicate purchase allowed");
  if (tt.loadStats().coins !== 200) throw new Error("duplicate purchase deducted coins");
  // locked and insufficient purchases are refused without touching the wallet
  setStats({ xp: 900, coins: 5000, ownedItemIds: [], equippedItemIds: [] });
  if (tt.purchaseOutfit("graduate").code !== "locked") throw new Error("locked purchase allowed");
  if (tt.loadStats().coins !== 5000) throw new Error("locked purchase touched the wallet");
  setStats({ xp: 900, coins: 10, ownedItemIds: [], equippedItemIds: [] });
  if (tt.purchaseOutfit("explorer").code !== "insufficient") throw new Error("insufficient purchase allowed");
  if (tt.loadStats().coins !== 10) throw new Error("insufficient purchase touched the wallet");

  // storage failure rolls back: neither coins nor ownership change
  setStats({ xp: 900, coins: 1000, ownedItemIds: [], equippedItemIds: [] });
  const realSet = localStorage.setItem;
  localStorage.setItem = () => { throw new Error("quota"); };
  const rf = tt.purchaseOutfit("explorer");
  localStorage.setItem = realSet;
  if (rf.ok || rf.code !== "save-failed") throw new Error("save failure not reported");
  st = tt.loadStats();
  if (st.coins !== 1000 || st.ownedItemIds.length !== 0) throw new Error("purchase not atomic on save failure");

  // exactly one outfit equipped; switching replaces
  setStats({ xp: 3000, coins: 5000, ownedItemIds: ["explorer", "graduate"], equippedItemIds: [] });
  if (tt.equipOutfit("sporty").code !== "not-owned") throw new Error("equipped an unowned item");
  tt.equipOutfit("explorer");
  if (tt.loadStats().equippedItemIds.join() !== "explorer") throw new Error("equip");
  tt.equipOutfit("graduate");
  const eq = tt.loadStats().equippedItemIds;
  if (eq.length !== 1 || eq[0] !== "graduate") throw new Error("more than one equipped: " + eq.join());
  if (tt.outfitState("explorer") !== "owned" || tt.outfitState("graduate") !== "equipped") throw new Error("switch states");
  tt.unequipOutfit();
  if (tt.loadStats().equippedItemIds.length !== 0) throw new Error("unequip");

  // migration: legacy ids map, unknown ids are preserved, never deleted
  const w = tt.normalizeWardrobe(["young-frog-adventurer", "expert-frog-graduate", "mystery-hat", "explorer"], ["mystery-hat"], []);
  if (!w.ownedItemIds.includes("explorer") || !w.ownedItemIds.includes("graduate")) throw new Error("legacy ids not migrated");
  if (w.ownedItemIds.filter((x) => x === "explorer").length !== 1) throw new Error("migration duplicated an id");
  if (!w.legacyUnknownItemIds.includes("mystery-hat")) throw new Error("unknown id was lost");
  if (w.equippedItemIds.length !== 0) throw new Error("unknown id must not end up equipped");
  // corrupt storage never throws and never yields ghosts
  setStats({ xp: "bad", coins: null, ownedItemIds: "nope", equippedItemIds: [{}, "explorer"] });
  const safe = tt.loadStats();
  if (!Array.isArray(safe.ownedItemIds) || safe.ownedItemIds.length !== 0) throw new Error("corrupt owned not recovered");
  if (safe.equippedItemIds.length !== 0) throw new Error("equipped an item that is not owned");
  if (safe.coins !== 0 || safe.xp !== 0) throw new Error("corrupt wallet not recovered");

  // render: five tabs, nine cards, empty categories say "coming later"
  setStats({ xp: 3000, coins: 5000, ownedItemIds: ["graduate"], equippedItemIds: ["graduate"] });
  tt.S.lang = "en";
  tt.renderStore();
  const body = document.getElementById("storeBody").innerHTML;
  if ((body.match(/data-cat="/g) || []).length !== 5) throw new Error("five category tabs");
  if ((body.match(/data-outfit="/g) || []).length !== 9) throw new Error("nine cards");
  if (!body.includes('data-state="equipped"')) throw new Error("equipped card state");
  if (!body.includes(L.collectAll)) throw new Error("collection line");
  if (!body.includes("+10 min")) throw new Error("minute packs must stay in their own section");
  const before = tt.loadStats().coins;
  tt.openOutfitPreview("graduate");
  if (!document.getElementById("storeModal").innerHTML.includes(L.unequipBtn)) throw new Error("equipped preview must offer unequip");
  if (tt.loadStats().coins !== before) throw new Error("opening a preview changed the wallet");
});

check("MARZI-008 rewards: summary states, thresholds, rollback, celebration", () => {
  const setStats = (o) => localStorage.setItem("marzi.stats.v1", JSON.stringify(o));
  const ledgerClear = () => localStorage.setItem("marzi.reward-ledger.v1", JSON.stringify({}));
  tt.S.lang = "en";

  // the six thresholds are untouched and every crossing is detected
  const T6 = [0, 150, 400, 800, 1500, 2600];
  T6.forEach((edge, i) => {
    if (i === 0) return;
    setStats({ xp: edge, coins: 0, days: {} });   // committed state = just crossed
    const sum = tt.buildRewardSummary({ xpBefore: edge - 1, coinsBefore: 0, gained: 1,
      claim: { claimed: true, saved: true, duplicate: false }, turns: 2, mistakes: 0, seconds: 60, abandoned: false });
    if (!sum.evolved) throw new Error("no crossing detected at " + edge);
    if (sum.stageAfter !== i + 1 || sum.stageBefore !== i) throw new Error(`stage ${sum.stageBefore}->${sum.stageAfter} at ${edge}`);
    if (sum.state !== "evolved") throw new Error("state at " + edge + " = " + sum.state);
    if (Object.isFrozen(sum) !== true) throw new Error("summary must be frozen");
  });

  // high-performance rule, exactly as documented
  const hp = (turns, mistakes, abandoned) => tt.isHighPerformance({ turns, mistakes, abandoned });
  if (!hp(4, 1, false)) throw new Error("4 turns / 1 correction should qualify");
  if (hp(4, 2, false)) throw new Error("4 turns / 2 corrections must not qualify");
  if (hp(3, 0, false)) throw new Error("fewer than 4 turns must not qualify");
  if (hp(8, 2, true)) throw new Error("abandoned call must not qualify");
  if (!hp(8, 2, false)) throw new Error("8 turns / 2 corrections should qualify");

  // normal vs high vs none
  setStats({ xp: 100, coins: 40, days: {} });
  const normal = tt.buildRewardSummary({ xpBefore: 80, coinsBefore: 20, gained: 20,
    claim: { claimed: true, saved: true, duplicate: false }, turns: 2, mistakes: 2, seconds: 90, abandoned: false });
  if (normal.state !== "normal" || normal.xp !== 20 || normal.coins !== 20) throw new Error("normal summary");
  const high = tt.buildRewardSummary({ xpBefore: 80, coinsBefore: 20, gained: 20,
    claim: { claimed: true, saved: true, duplicate: false }, turns: 6, mistakes: 1, seconds: 90, abandoned: false });
  if (high.state !== "high") throw new Error("high summary: " + high.state);
  setStats({ xp: 80, coins: 20, days: {} });
  const none = tt.buildRewardSummary({ xpBefore: 80, coinsBefore: 20, gained: 0,
    claim: { claimed: false, saved: true, duplicate: false }, turns: 0, mistakes: 0, seconds: 5, abandoned: false });
  if (none.state !== "none" || none.xp !== 0 || none.coins !== 0) throw new Error("zero-reward summary");
  const dup = tt.buildRewardSummary({ xpBefore: 80, coinsBefore: 20, gained: 0,
    claim: { claimed: false, saved: true, duplicate: true }, turns: 3, mistakes: 0, seconds: 60, abandoned: false });
  if (dup.state !== "duplicate" || dup.xp !== 0) throw new Error("duplicate must award nothing");

  // duplicate completion never replays the data award
  ledgerClear();
  setStats({ xp: 0, coins: 0, days: {} });
  tt.claimReward("call:dup-test", { xp: 30, coins: 20 });
  const afterFirst = tt.loadStats();
  tt.claimReward("call:dup-test", { xp: 30, coins: 20 });
  const afterSecond = tt.loadStats();
  if (afterSecond.xp !== afterFirst.xp || afterSecond.coins !== afterFirst.coins) throw new Error("duplicate replayed the award");

  // storage failure: committed state is restored and nothing is reported as earned
  ledgerClear();
  setStats({ xp: 500, coins: 300, days: {} });
  const beforeRaw = localStorage.getItem("marzi.stats.v1");
  const realSet = localStorage.setItem;
  localStorage.setItem = () => { throw new Error("quota"); };
  const failed = tt.claimReward("call:fail-test", { xp: 30, coins: 20 });
  localStorage.setItem = realSet;
  if (failed.claimed || failed.saved !== false) throw new Error("save failure not reported");
  if (localStorage.getItem("marzi.stats.v1") !== beforeRaw) throw new Error("committed state not restored");
  if (tt.loadRewardLedger()["call:fail-test"]) throw new Error("ledger recorded an unsaved award");
  const sf = tt.buildRewardSummary({ xpBefore: 500, coinsBefore: 300, gained: 30,
    claim: { claimed: false, saved: false, duplicate: false }, turns: 5, mistakes: 0, seconds: 90, abandoned: false });
  if (sf.state !== "save-failed" || sf.xp !== 0 || sf.coins !== 0) throw new Error("save-failed must not show a gain");
  if (sf.xpAfter !== 500) throw new Error("save-failed must report committed XP");

  // rendering + animation never mutate XP, coins or the ledger
  setStats({ xp: 420, coins: 100, days: {} });
  const snapStats = localStorage.getItem("marzi.stats.v1");
  const snapLedger = localStorage.getItem("marzi.reward-ledger.v1");
  const sum = tt.buildRewardSummary({ xpBefore: 380, coinsBefore: 80, gained: 40,
    claim: { claimed: true, saved: true, duplicate: false }, turns: 5, mistakes: 1, seconds: 120, abandoned: false });
  tt.renderRewardSummary(sum);
  tt.animateReward(sum);
  if (localStorage.getItem("marzi.stats.v1") !== snapStats) throw new Error("rendering mutated stats");
  if (localStorage.getItem("marzi.reward-ledger.v1") !== snapLedger) throw new Error("rendering mutated the ledger");
  const box = document.getElementById("rewardBox").innerHTML;
  if (!box.includes("+40 XP") || !box.includes("+20")) throw new Error("gains not shown");
  if (!box.includes("rw-stats")) throw new Error("call stats not shown");
  if (!document.getElementById("rewardLive").textContent.includes("+40 XP")) throw new Error("reward not announced");

  // celebration: old -> new, localized name + description, dismissible, marks the stage
  localStorage.removeItem(tt.CELEBRATED_KEY);
  const evo = tt.buildRewardSummary({ xpBefore: 399, coinsBefore: 0, gained: 1,
    claim: { claimed: true, saved: true, duplicate: false }, turns: 4, mistakes: 0, seconds: 60, abandoned: false });
  setStats({ xp: 400, coins: 0, days: {} });
  tt.celebrateEvolution({ ...evo, stageBefore: 2, stageAfter: 3 });
  const cel = document.getElementById("evoCelBox").innerHTML;
  if (!cel.includes(tt.T.en.stageNames[2])) throw new Error("celebration missing the localized name");
  if (!cel.includes(tt.T.en.stageDescs[2].slice(0, 20))) throw new Error("celebration missing the description");
  if (!cel.includes('role="dialog"')) throw new Error("celebration must be a dialog");
  if (!tt.evolutionCelebrationOpen()) throw new Error("celebration state");
  if (localStorage.getItem(tt.CELEBRATED_KEY) !== "3") throw new Error("celebrated stage not recorded");
  tt.closeEvolutionCelebration();
  if (tt.evolutionCelebrationOpen()) throw new Error("celebration not dismissible");
  // and the Learn hero must not replay the same stage
  const learnSrc = String(src.match(/function renderLearn\(\)[\s\S]*?\n\}/)[0]);
  if (!learnSrc.includes("CELEBRATED_KEY")) throw new Error("Learn hero does not check the celebrated stage");
});

check("MARZI-009 plan limit: full-screen, plan detail, dismissal", () => {
  const L = tt.T.en;
  tt.S.lang = "en";
  const today = new Date().toISOString().slice(0, 10);
  // the daily allowance is exhausted; detail comes from the existing plan math
  localStorage.setItem("marzi.stats.v1", JSON.stringify({ days: {}, xp: 500, coins: 50, secDays: { [today]: tt.PLAN_SECONDS } }));
  tt.showLimit();
  const box = document.getElementById("limitBox");
  if (!box.classList.has("limit-full")) throw new Error("limit must use the full-screen variant");
  if (!tt.limitOpen()) throw new Error("limit state");
  const plan = document.getElementById("limitPlan").innerHTML;
  if (!plan.includes(`${Math.round(tt.PLAN_SECONDS / 60)} / ${Math.round(tt.PLAN_SECONDS / 60)} min`)) throw new Error("plan detail: " + plan.slice(0, 80));
  if (!plan.includes('role="progressbar"')) throw new Error("plan meter must expose progress");
  if (!document.getElementById("limitReset").textContent.includes(L.resetsIn)) throw new Error("reset countdown");
  if (!document.getElementById("limitLive").textContent.includes(L.limitTitle)) throw new Error("limit not announced");
  if (document.getElementById("limitStore").classList.has("hidden")) throw new Error("store route missing");
  if (!html.includes("body.modal-lock")) throw new Error("background scroll must be locked behind the overlay");
  tt.closeLimit();
  if (tt.limitOpen() || !box.classList.has("hidden")) throw new Error("limit not dismissible");
  if (box.classList.has("limit-full")) throw new Error("full-screen variant must be cleared on close");
  // the evolution showcase shares the surface and must stay a card
  const learnSrc = String(src.match(/function renderLearn\(\)[\s\S]*?\n\}/)[0]);
  if (!learnSrc.includes('classList.remove("limit-full")')) throw new Error("evolution showcase must clear the full-screen variant");
  // plan math untouched
  if (tt.PLAN_SECONDS !== 30 * 60) throw new Error("daily plan changed");
  if (tt.COIN_PACKS.map((p) => p.price).join() !== "200,450,800,1500") throw new Error("minute-pack prices changed");
});

check("MARZI-010 direction + touch targets", () => {
  // direction follows the help language and restores for LTR
  if (tt.RTL_LANGS.join() !== "ar") throw new Error("RTL language set");
  if (tt.applyLangDirection("ar") !== "rtl") throw new Error("Arabic must be rtl");
  if (tt.applyLangDirection("es") !== "ltr") throw new Error("Spanish must be ltr");
  if (tt.applyLangDirection("en") !== "ltr") throw new Error("English must be ltr");
  // the document is updated at boot and whenever the help language changes
  if (!/applyLangDirection\(\);\s*\n/.test(src)) throw new Error("direction not applied at boot");
  // whatever the picker's shape, changing the help language must re-apply direction
  const obPick = String(src.match(/function obPick\([\s\S]*?\n\}/)[0]);
  if (!/S\.lang = value/.test(obPick) || !/applyLangDirection\(\)/.test(obPick))
    throw new Error("direction not applied on language change");
  // layout uses logical properties so RTL mirrors without a second stylesheet
  const styles = html.slice(html.indexOf("<style>"), html.indexOf("</style>"));
  for (const needle of ["inset-inline-start", "inset-inline-end", "margin-inline-start", "text-align: start"]) {
    if (!styles.includes(needle)) throw new Error("missing logical property: " + needle);
  }
  if (/\.dlg-marzi \{[^}]*margin-left: auto/.test(styles)) throw new Error("physical margin left in a mirrored component");
  // compact chrome keeps its size but gains a full hit area
  if (!styles.includes(".chip-res::after")) throw new Error("hit-area extension missing");
  // the hit area is centred on its control: anchored to the inline start it
  // grew outwards only, and the last top-bar chip pushed its box past the
  // viewport, giving the whole page horizontal scroll
  const hit = styles.match(/\.chip-res::after[^}]*\}/)[0];
  if (!/left: 50%/.test(hit) || !/translate\(-50%, -50%\)/.test(hit)) throw new Error("hit area is not centred on its control");
  if (/inset-inline: 0/.test(hit)) throw new Error("hit area still anchored to the inline start");
  if (!/min-width: var\(--touch-min\)/.test(hit) || !/height: var\(--touch-min\)/.test(hit)) throw new Error("hit area below the touch floor");
  // small phones tighten the top bar so four resource chips fit without scroll
  if (!/@media \(max-width: 420px\) \{\s*\.topbar-in \{ gap: 4px; \}/.test(styles)) throw new Error("narrow top-bar rule missing");
  if (!/\.seg button \{ min-height: var\(--touch-min\)/.test(styles)) throw new Error("segmented controls below the floor");
  if (!/\.routine button \{ min-height: var\(--touch-min\)/.test(styles)) throw new Error("routine chips below the floor");
  if (!/\.legal a \{[^}]*min-height: var\(--touch-min\)/.test(styles)) throw new Error("legal links below the floor");
});

check("MARZI-011 offline + storage resilience", () => {
  const L = tt.T.en;
  tt.S.lang = "en";
  const realNav = globalThis.navigator;
  const setOnline = (v) => { try { Object.defineProperty(globalThis, "navigator", { value: { ...realNav, onLine: v }, configurable: true }); } catch (e) {} };
  // online: no banner
  setOnline(true);
  if (tt.isOffline()) throw new Error("online reported as offline");
  if (tt.renderNetBanner()) throw new Error("banner shown while online");
  // offline: persistent banner naming the problem and the recovery
  setOnline(false);
  if (!tt.isOffline()) throw new Error("offline not detected");
  if (!tt.renderNetBanner()) throw new Error("banner not shown while offline");
  const banner = document.getElementById("netBanner").innerHTML;
  if (!banner.includes(L.offlineTitle) || !banner.includes(L.offlineMsg)) throw new Error("banner copy");
  if (document.getElementById("netBanner").classList.has("hidden")) throw new Error("banner hidden while offline");
  // a call refuses to start offline, with the recovery message - not a silent no-op
  const goCallSrc = String(src.match(/function goCall\(\)[\s\S]*?\n\}/)[0]);
  if (!/isOffline\(\)/.test(goCallSrc)) throw new Error("goCall does not gate on connectivity");
  if (!/renderNetBanner\(\)/.test(goCallSrc)) throw new Error("goCall does not surface the reason");
  if (/alertMsg\(/.test(goCallSrc)) throw new Error("goCall must not write to the call-scoped alert");
  // in-call failures tell offline apart from a server error, keeping both alerts
  const askSrc = String(src.match(/async function ask\(\)[\s\S]*?\n\}/)[0]);
  if (!/isOffline\(\) \? t\(\)\.offlineMsg : t\(\)\.err/.test(askSrc)) throw new Error("ask does not distinguish offline from server error");
  // storage failure is surfaced, never silent
  tt.notifyStorageFailure();
  if (!document.getElementById("netBanner").innerHTML.includes(L.saveFailed)) throw new Error("storage failure not surfaced");
  if (!/catch \(e\) \{ try \{ notifyStorageFailure\(\)/.test(src)) throw new Error("settings write swallows failures");
  // connectivity changes are observed
  if (!src.includes('window.addEventListener("online", renderNetBanner)')) throw new Error("no online listener");
  if (!src.includes('window.addEventListener("offline", renderNetBanner)')) throw new Error("no offline listener");
  // the service worker still never caches API responses
  const sw = fs.readFileSync(path.join(__dirname, "..", "public", "sw.js"), "utf8");
  if (!/\/api\//.test(sw)) throw new Error("service worker lost its API rule");
  setOnline(true); tt.renderNetBanner();
});

check("release gates: hygiene, versioning and documentation", () => {
  // 1. nothing debug-only ships in the inline app script
  for (const [re_, name] of [[/console\.log\(/g, "console.log"], [/\bdebugger\b/g, "debugger"],
                             [/\bTODO\b/g, "TODO"], [/\bFIXME\b/g, "FIXME"], [/\bXXX\b/g, "XXX"]]) {
    const hits = src.match(re_) || [];
    if (hits.length) throw new Error(`${name} left in the shipped script (${hits.length})`);
  }
  // 2. the service worker is versioned and still excludes the API
  const sw = fs.readFileSync(path.join(__dirname, "..", "public", "sw.js"), "utf8");
  const cache = (sw.match(/const CACHE = "([^"]+)"/) || [])[1];
  // MARZI-062: a build identifier may follow the version so a preview cache is
  // distinguishable, but the version itself is still mandatory
  if (!/^telefontrainer-v\d+(-[a-z0-9-]+)?$/.test(cache || "")) throw new Error("service worker cache not versioned: " + cache);
  if (!/\/api\//.test(sw)) throw new Error("service worker must never cache API responses");
  // 3. CI runs both gates, on feature branches too
  const ci = fs.readFileSync(path.join(__dirname, "..", ".github", "workflows", "ci.yml"), "utf8");
  if (!ci.includes("node --check server.js")) throw new Error("CI missing the server syntax check");
  if (!ci.includes("node test/run.js")) throw new Error("CI missing the test suite");
  if (!/branches: \['\*\*'\]/.test(ci)) throw new Error("CI does not run on feature branches");
  // 4. the canonical documents exist and are indexed
  const docs = ["DECISIONS.md", "DESIGN_SYSTEM.md", "IMPLEMENTATION_REPORT.md",
                "design/MARZI_ASSET_SPEC.md", "design/MARZI_ASSET_DELIVERY_CHECKLIST.md",
                "design/concept-boards/README.md", "automation/MARZI_QUEUE.md", "README.md"];
  for (const d of docs) {
    const f = path.join(__dirname, "..", "docs", d);
    if (!fs.existsSync(f)) throw new Error("missing canonical document: docs/" + d);
  }
  const index = fs.readFileSync(path.join(__dirname, "..", "docs", "README.md"), "utf8");
  for (const d of docs.filter((x) => x !== "README.md")) {
    if (!index.includes(d)) throw new Error("docs/README.md does not index " + d);
  }
  // 5. no dependencies crept in - the app stays dependency-free (ADR-3)
  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf8"));
  if (Object.keys(pkg.dependencies || {}).length) throw new Error("runtime dependencies added");
  // 6. CI runs the conflict-marker gate as its own named step
  if (!ci.includes("node test/conflict-markers.js")) throw new Error("CI missing the conflict-marker gate");
});

check("no unresolved conflict markers anywhere in the repository", () => {
  // docs/EXPANSION.md once shipped with a committed three-way conflict, so
  // this gate is repository-wide: every text file, not just the shipped app.
  const hits = scanConflictMarkers();
  if (hits.length) {
    const where = hits.map((h) => `${h.file}:${h.markers.map((m) => m.line).join(",")}`).join(" ");
    throw new Error(`unresolved conflict markers in ${hits.length} file(s): ${where}`);
  }
  // and the gate itself must actually detect one - a scanner that can only
  // ever return zero would pass this check while proving nothing
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "cm-"));
  try {
    const marked = ["a", "<".repeat(7) + " HEAD", "x", "=".repeat(7), "y", ">".repeat(7) + " other", "b"].join("\n");
    fs.writeFileSync(path.join(tmp, "conflicted.md"), marked);
    fs.writeFileSync(path.join(tmp, "heading.md"), "# Title\n" + "=".repeat(7) + "\nbody\n");
    const found = scanConflictMarkers(tmp);
    if (found.length !== 1) throw new Error("scanner flagged " + found.length + " files, expected exactly the conflicted one");
    if (found[0].file !== "conflicted.md") throw new Error("scanner flagged the wrong file: " + found[0].file);
    if (found[0].markers.map((m) => m.line).join() !== "2,4,6") throw new Error("scanner missed a marker line");
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

check("MARZI-013 Marzi states: mapping, fallback, asset paths", () => {
  // the eight canonical states, exactly
  if (tt.MARZI_STATES.join() !== "neutral,happy,listening,thinking,speaking,sad,error,celebrating")
    throw new Error("state vocabulary: " + tt.MARZI_STATES.join());

  // deterministic mapping from the existing call state machine
  for (const [call, want] of [["ready","neutral"],["listening","listening"],["processing","thinking"],
                              ["speaking","speaking"],["disconnected","sad"],["error","error"]]) {
    if (tt.marziStateForCall(call) !== want) throw new Error(`call ${call} -> ${tt.marziStateForCall(call)}, want ${want}`);
  }
  // and from the existing reward summary state
  for (const [rw, want] of [["normal","happy"],["high","celebrating"],["evolved","celebrating"],
                            ["none","sad"],["duplicate","neutral"],["save-failed","error"]]) {
    if (tt.marziStateForReward(rw) !== want) throw new Error(`reward ${rw} -> ${tt.marziStateForReward(rw)}, want ${want}`);
  }
  // unknown input never throws and never invents a state
  if (tt.marziStateForCall("nope") !== "neutral" || tt.marziStateForReward(undefined) !== "neutral")
    throw new Error("unknown state must fall back to neutral");
  if (tt.isMarziState("wat") || !tt.isMarziState("thinking")) throw new Error("state guard");

  // every state renders, and with no approved files present it is the shipped
  // artwork - never a request for a file that does not exist
  if (Object.keys(tt.MARZI_ASSETS).length !== 0) throw new Error("asset registry must ship empty");
  for (const st of tt.MARZI_STATES) {
    for (const stage of [1, 3, 6]) {
      const art = tt.marziArt(stage, st);
      if (!art.includes("<svg")) throw new Error(`${st}@${stage} did not fall back to the shipped artwork`);
      if (art.includes("<img")) throw new Error(`${st}@${stage} requested a file that does not exist`);
    }
  }
  // asset paths follow the approved naming, ready for production files
  const p1 = tt.marziAssetPath(5, "listening");
  if (p1 !== "/assets/marzi/svg/marzi_05_studious_frog_call_listening.svg") throw new Error("asset path: " + p1);
  if (tt.marziAssetPath(1, "celebrating") !== "/assets/marzi/svg/marzi_01_eggs_reward_celebrating.svg") throw new Error("reward pose path");
  if (tt.marziAssetPath(99, "wat") !== "/assets/marzi/svg/marzi_06_expert_frog_hero_neutral.svg") throw new Error("path clamping");
  if (tt.hasMarziAsset(5, "listening")) throw new Error("no approved asset should be reported as present");
  // registering an approved file switches the resolver without touching call sites
  tt.MARZI_ASSETS[p1] = true;
  if (!tt.marziArt(5, "listening").includes("<img")) throw new Error("registered asset not used");
  delete tt.MARZI_ASSETS[p1];

  // the companion follows the call state; the reward card follows the reward state
  const compSrc = String(src.match(/function renderCallCompanion\(\)[\s\S]*?\n\}/)[0]);
  if (!compSrc.includes("marziStateForCall(callStateFor(S))")) throw new Error("companion does not use the canonical mapping");
  const rwSrc = String(src.match(/function renderRewardSummary\([\s\S]*?\n\}/)[0]);
  if (!rwSrc.includes("marziStateForReward(sum.state)")) throw new Error("reward card does not use the canonical mapping");
  // the placeholder artwork answers every state (sad-family shares one mouth)
  for (const st of tt.MARZI_STATES) if (!tt.marziSVG(4, st).includes("<svg")) throw new Error("placeholder missing for " + st);
  // motion is per-state and reduced-motion still governs it
  const styles = html.slice(html.indexOf("<style>"), html.indexOf("</style>"));
  for (const st of ["listening", "thinking", "speaking", "celebrating"]) {
    if (!styles.includes(`[data-state="${st}"] > svg`)) throw new Error("no motion rule for " + st);
  }
  if (!styles.includes("prefers-reduced-motion")) throw new Error("reduced-motion guard missing");
});

check("MARZI-014 plan + premium: one value, board pricing, no entitlement", () => {
  const L = tt.T.en;
  tt.S.lang = "en";
  const today = new Date().toISOString().slice(0, 10);

  // MB is a VIEW of minutes at the board ratio; never a second resource
  if (tt.MB_PER_MINUTE !== 10) throw new Error("board ratio must be 10 MB per minute");
  if (tt.mbFromSeconds(600) !== 100) throw new Error("100 MB should equal 10 minutes");
  if (tt.mbFromSeconds(0) !== 0 || tt.mbFromSeconds(-5) !== 0) throw new Error("MB must never go negative");
  localStorage.setItem("marzi.stats.v1", JSON.stringify({ days: {}, xp: 500, coins: 300, secDays: { [today]: 600 } }));
  const P = tt.planSnapshot();
  if (P.limitMin !== 30 || P.usedMin !== 10 || P.leftMin !== 20) throw new Error(`minutes ${P.usedMin}/${P.limitMin}, left ${P.leftMin}`);
  if (P.limitMb !== 300 || P.usedMb !== 100 || P.leftMb !== 200) throw new Error(`MB ${P.usedMb}/${P.limitMb}, left ${P.leftMb}`);
  // both readouts derive from the same seconds - they cannot disagree
  if (P.leftMb !== tt.mbFromSeconds(P.leftSec)) throw new Error("MB and minutes diverged");
  if (P.exhausted) throw new Error("not exhausted at 10/30");
  localStorage.setItem("marzi.stats.v1", JSON.stringify({ days: {}, xp: 500, coins: 300, secDays: { [today]: tt.PLAN_SECONDS } }));
  const E = tt.planSnapshot();
  if (!E.exhausted || E.leftMin !== 0 || E.leftMb !== 0) throw new Error("exhausted state");

  // plan screen shows call time AND internet from that one snapshot
  tt.openPlanScreen();
  const plan = document.getElementById("planScreen").innerHTML;
  if (!tt.planScreenOpen()) throw new Error("plan screen state");
  if (!plan.includes(L.planCallTime) || !plan.includes(L.planInternet)) throw new Error("plan sections");
  if (!plan.includes("30 / 30")) throw new Error("call time readout");
  if (!plan.includes("MB")) throw new Error("internet readout");
  if (!plan.includes(L.planBuyNet) || !plan.includes(L.premGet)) throw new Error("plan actions");
  tt.closePlanScreen();
  if (tt.planScreenOpen()) throw new Error("plan screen not dismissible");

  // premium: board pricing, benefits, both states, and NO entitlement
  tt.openPremiumScreen();
  const prem = document.getElementById("premScreen").innerHTML;
  if (!prem.includes("$4.99") || !prem.includes("$39.99")) throw new Error("board pricing missing");
  if (!prem.includes(L.premSave)) throw new Error("Save 33% missing");
  if (!prem.includes(L.premBest)) throw new Error("best-value badge missing");
  for (const bnf of [L.premB1, L.premB2, L.premB3, L.premB4]) if (!prem.includes(bnf)) throw new Error("benefit missing: " + bnf);
  if (!prem.includes(L.premFree)) throw new Error("free state not shown");
  // the purchase action states plainly that Premium is not available yet
  document.getElementById("premGo").onclick();
  if (document.getElementById("premNotice").textContent !== L.premNotYet) throw new Error("purchase action must say Premium is unavailable");
  // nothing is unlocked, ever
  if (tt.isPremium() !== false) throw new Error("Premium must never be entitled");
  const beforeLimit = tt.planLimitToday();
  tt.__setPremiumPreview(true);                    // test-only visual hook
  tt.openPremiumScreen();
  if (!document.getElementById("premScreen").innerHTML.includes(L.premGet)) throw new Error("premium visual state");
  if (tt.premiumPreviewState() !== "premium") throw new Error("preview hook");
  if (tt.isPremium() !== false) throw new Error("preview must not grant entitlement");
  if (tt.planLimitToday() !== beforeLimit) throw new Error("preview changed the minute allowance");
  tt.__setPremiumPreview(false);
  tt.closePremiumScreen();
  if (tt.premiumScreenOpen()) throw new Error("premium screen not dismissible");

  // no user-facing activation switch anywhere in the shipped script
  if (/__setPremiumPreview\(\s*true\s*\)/.test(src.replace(/function __setPremiumPreview[^\n]*\n/, "")))
    throw new Error("a user-facing premium activation path exists");
  // economy untouched
  if (tt.COIN_PACKS.map((p) => p.price).join() !== "200,450,800,1500") throw new Error("package prices changed");
  if (tt.PLAN_SECONDS !== 30 * 60) throw new Error("daily allowance changed");
  if (!/function buyPack\(id\) \{\n  const p = COIN_PACKS\.find/.test(src)) throw new Error("buyPack changed");
});

check("MARZI-015 profile: verified data only, wardrobe, achievements, a11y", () => {
  const L = tt.T.en;
  tt.S.lang = "en";
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);

  // a learner with a known, fully verifiable history
  localStorage.setItem("marzi.stats.v1", JSON.stringify({
    days: { [today]: { calls: 1 }, [yesterday]: { calls: 1 } },
    calls: 12, seconds: 3900, xp: 500, coins: 640,
    ownedItemIds: ["explorer", "sporty"], equippedItemIds: ["sporty"],
  }));
  localStorage.setItem("telefontrainer.fixes", JSON.stringify([
    { text: "a", corrected: "A", drilled: today }, { text: "b", corrected: "B", drilled: today }, { text: "c", corrected: "C" },
  ]));
  localStorage.setItem("telefontrainer.words", JSON.stringify(["Haus", "Baum"]));

  const p = tt.profileSnapshot();
  // every figure is the stored counter, never an estimate
  if (p.calls !== 12 || p.coins !== 640 || p.xp !== 500) throw new Error("counters not read verbatim");
  if (p.minutes !== 65) throw new Error("speaking time is not seconds/60: " + p.minutes);
  if (p.reviewed !== 2) throw new Error("reviewed counts only drilled mistakes: " + p.reviewed);
  if (p.words !== 2) throw new Error("saved words");
  if (p.streak !== 2) throw new Error("streak: " + p.streak);
  // stage and rank are two separate systems and stay separate
  if (p.stage !== tt.marziStageForXp(500)) throw new Error("stage not derived from the XP thresholds");
  if (p.rank.n !== tt.rankFor(500).n) throw new Error("rank must stay the learner rank");
  if (p.stageBase !== tt.MARZI_STAGE_XP[p.stage - 1]) throw new Error("stage base");
  if (p.stageNext !== tt.MARZI_STAGE_XP[p.stage]) throw new Error("next threshold");
  if (p.xpToNext !== p.stageNext - 500) throw new Error("XP to next stage");
  if (p.stageGained + p.xpToNext !== p.stageSpan) throw new Error("stage progress does not span the thresholds");
  // the six thresholds are untouched
  if (tt.MARZI_STAGE_XP.join() !== "0,150,400,800,1500,2600") throw new Error("XP thresholds changed");

  // wardrobe: owned items only, at most one equipped, unknown ids never shown
  if (p.owned.join() !== "explorer,sporty") throw new Error("owned outfits");
  if (p.equipped !== "sporty") throw new Error("equipped outfit");

  // achievements are pure functions of the snapshot - nothing else can grant one
  const achv = tt.achievementState(p);
  const by = Object.fromEntries(achv.map((a) => [a.id, a]));
  if (!by.call1.earned || !by.call10.earned) throw new Error("call achievements not earned at 12 calls");
  if (by.call50.earned) throw new Error("50-call achievement earned at 12 calls");
  if (!by.min60.earned) throw new Error("60 minutes not earned at 65 minutes");
  if (by.streak7.earned) throw new Error("7-day streak earned at 2 days");
  if (by.fix25.earned) throw new Error("25 reviewed earned at 2");
  if (!by.outfit1.earned) throw new Error("first outfit not earned");
  if (by.streak7.have !== 2 || by.streak7.goal !== 7) throw new Error("locked achievements must show real progress");
  for (const a of achv) if (a.have > a.goal) throw new Error("progress above the goal: " + a.id);
  // a fresh learner earns nothing at all
  localStorage.setItem("marzi.stats.v1", JSON.stringify({ days: {}, calls: 0, seconds: 0, xp: 0, coins: 0 }));
  localStorage.setItem("telefontrainer.fixes", "[]");
  localStorage.setItem("telefontrainer.words", "[]");
  const zero = tt.achievementState(tt.profileSnapshot());
  if (zero.some((a) => a.earned)) throw new Error("an empty profile earned an achievement");
  if (tt.profileSnapshot().owned.length) throw new Error("empty wardrobe");

  // rendering: identity, both localized stage strings, and the empty wardrobe state
  tt.renderProfile();
  const body = document.getElementById("profBody").innerHTML;
  const stage = tt.marziStageForXp(0);
  if (!body.includes(L.stageNames[stage - 1])) throw new Error("stage name missing");
  if (!body.includes(L.stageDescs[stage - 1])) throw new Error("localized stage description missing");
  if (!body.includes("Lv. " + tt.rankFor(0).n)) throw new Error("learner rank not shown separately");
  if (!body.includes(L.profNoOutfits)) throw new Error("empty wardrobe state missing");
  if (!body.includes(L.profAchv) || !body.includes("0/" + tt.ACHIEVEMENTS.length)) throw new Error("achievement summary");
  if (!body.includes(L.profReviewed)) throw new Error("mistakes reviewed missing");

  // accessibility control: reduce motion is a real, persisted, additive setting
  const styles = html.slice(html.indexOf("<style>"), html.indexOf("</style>"));
  if (!/body\.reduce-motion \*/.test(styles)) throw new Error("reduce-motion class has no effect");
  if (!/@media \(prefers-reduced-motion: reduce\)/.test(styles)) throw new Error("OS preference no longer honoured");
  tt.S.reduceMotion = true;
  if (tt.applyReduceMotion() !== true || !document.body.classList.has("reduce-motion")) throw new Error("reduce motion not applied");
  tt.S.reduceMotion = false;
  tt.applyReduceMotion();
  if (document.body.classList.has("reduce-motion")) throw new Error("reduce motion not removable");
  if (!/reduceMotion:!!S\.reduceMotion/.test(src)) throw new Error("reduce motion is not persisted");
  if (!/applyReduceMotion\(\);\s*\n/.test(src)) throw new Error("reduce motion not applied at boot");
});

check("MARZI-016 journey: existing scenarios, states, one next action, list view", () => {
  const L = tt.T.en;
  tt.S.lang = "en";

  // the map is built from the EXISTING groups and playable scenarios only
  const nodes = tt.journeyNodes();
  const playable = tt.SCENARIOS.filter((s) => s.goals).map((s) => s.id).sort();
  if (nodes.map((n) => n.id).sort().join() !== playable.join()) throw new Error("map is not the existing playable scenarios");
  if (new Set(nodes.map((n) => n.id)).size !== nodes.length) throw new Error("a scenario appears twice on the path");
  const groupOrder = nodes.map((n) => n.groupIndex);
  if (groupOrder.join() !== [...groupOrder].sort((a, b) => a - b).join()) throw new Error("path does not follow the existing group order");
  for (const n of nodes) if (!tt.GROUPS[n.groupIndex].ids.includes(n.id)) throw new Error("node outside its group");

  // an untouched learner: nothing done, position at the very first node
  localStorage.setItem("marzi.stats.v1", JSON.stringify({ days: {}, xp: 0, coins: 0 }));
  const fresh = tt.journeyState();
  if (fresh.doneCount !== 0) throw new Error("a fresh learner has completed nodes");
  if (fresh.total !== nodes.length) throw new Error("total is not the node count");
  if (!fresh.here || fresh.here.id !== nodes[0].id) throw new Error("current position is not the first node");
  if (fresh.here.state !== "here") throw new Error("the position node is not marked");
  // every state that exists is one of the four, and later groups read as future
  for (const n of fresh.nodes) if (!["done", "here", "open", "future"].includes(n.state)) throw new Error("unknown state: " + n.state);
  if (!fresh.nodes.some((n) => n.state === "future")) throw new Error("no future nodes on an untouched path");
  if (!fresh.nodes.some((n) => n.state === "open")) throw new Error("no available nodes beside the current one");

  // after finishing the first two, they read as done and the position moves on
  const first = nodes[0].id, second = nodes[1].id;
  localStorage.setItem("marzi.stats.v1", JSON.stringify({ days: {}, xp: 0, coins: 0, scenariosDone: { [first]: 2, [second]: 1 } }));
  const J = tt.journeyState();
  if (J.doneCount !== 2) throw new Error("completed count: " + J.doneCount);
  if (J.nodes[0].state !== "done" || J.nodes[1].state !== "done") throw new Error("finished scenarios not marked done");
  if (J.nodes[0].times !== 2) throw new Error("repeat count not kept");
  if (!J.here || J.here.id !== nodes[2].id) throw new Error("position did not advance");
  if (J.nodes.filter((n) => n.state === "here").length !== 1) throw new Error("more than one current position");
  // a group with a completion is open, never future
  const started = new Set(J.nodes.filter((n) => n.state === "done").map((n) => n.groupIndex));
  for (const n of J.nodes) if (started.has(n.groupIndex) && n.state === "future") throw new Error("a started group must not read as future");

  // completion comes from real calls: recordCall writes the scenario it finished
  const rc = String(src.match(/function recordCall\(\)[\s\S]*?\n\}/)[0]);
  if (!/st\.scenariosDone\[sid\] = \(st\.scenariosDone\[sid\] \|\| 0\) \+ 1/.test(rc)) throw new Error("completion is not recorded from a real call");
  if (!/sid !== "custom" && sid !== "random"/.test(rc)) throw new Error("ad-hoc topics must not create a node");
  if (!/scenariosDone: obj\(s\.scenariosDone\)/.test(src)) throw new Error("completion is not normalized with the rest of stats");

  // rendering: map view, four states, one recommended action, nothing locked
  tt.setJourneyView("map");
  tt.renderJourney();
  const map = document.getElementById("jrBody").innerHTML;
  if (!map.includes('data-state="done"') || !map.includes('data-state="here"') || !map.includes('data-state="future"'))
    throw new Error("map does not render the node states");
  if (!map.includes('aria-current="step"')) throw new Error("current position not exposed to assistive tech");
  if (/data-jn="[^"]*"[^>]*disabled/.test(map)) throw new Error("a node was disabled - the map must not lock navigation");
  if (!map.includes(tt.GROUPS[0].en)) throw new Error("group headings missing");
  if (document.getElementById("jrCount").textContent !== `2/${J.total}`) throw new Error("progress count");
  const nextLabel = document.getElementById("jrNext").innerHTML;
  if (!nextLabel.includes(L.jrNext) || !nextLabel.includes(J.here.scenario.de)) throw new Error("the one recommended action is wrong");
  if (document.getElementById("jrNext").classList.has("hidden")) throw new Error("recommended action hidden");

  // accessible list alternative renders the same nodes with their state in text
  if (tt.setJourneyView("list") !== "list") throw new Error("list view not selectable");
  const list = document.getElementById("jrBody").innerHTML;
  const ids = (s) => (s.match(/data-jn="([^"]+)"/g) || []).join();
  if (ids(list) !== ids(map)) throw new Error("the list alternative shows different nodes");
  if (!list.includes(L.jrDone) || !list.includes(L.jrFuture)) throw new Error("states are not written out in the list view");
  tt.setJourneyView("map");

  // MARZI-017: Learn keeps a COMPACT preview, the full path is owned by Talk
  const learn = html.slice(html.indexOf('<section id="learn"'), html.indexOf('<section id="setup"'));
  const talk = html.slice(html.indexOf('<section id="setup"'), html.indexOf('<section id="onboard"'));
  if (!learn.includes('id="jrPreview"')) throw new Error("Learn must keep the journey preview");
  if (learn.includes('id="jrBody"')) throw new Error("the full journey must not be duplicated on Learn");
  if (!talk.includes('id="jrBody"')) throw new Error("the full journey must live inside Talk");
  if (Object.keys(tt.TAB_HASH).join() !== "learn,talk,store,profile") throw new Error("navigation changed");

  // no new scenarios or characters were introduced
  if (tt.SCENARIOS.length !== new Set(tt.SCENARIOS.map((s) => s.id)).size) throw new Error("duplicate scenario ids");
  if (tt.GROUPS.flatMap((g) => g.ids).some((id) => !tt.SCENARIOS.find((s) => s.id === id))) throw new Error("a group points at a scenario that does not exist");
});


check("MARZI-017 navigation: four tabs, canonical feature ownership", () => {
  // exactly four primary tabs, unchanged, and no Training tab
  if (Object.keys(tt.TAB_HASH).join() !== "learn,talk,store,profile") throw new Error("tab set changed");
  const nav = html.slice(html.indexOf('<nav class="bottomnav"'), html.indexOf("</nav>"));
  const tabs = (nav.match(/data-tab="([a-z]+)"/g) || []).map((m) => m.slice(10, -1));
  if (tabs.join() !== "learn,talk,store,profile") throw new Error("bottom nav tabs: " + tabs.join());
  if (/data-tab="training"/i.test(html) || /\btraining\b/i.test(nav)) throw new Error("a fifth Training tab exists");
  const learn = html.slice(html.indexOf('<section id="learn"'), html.indexOf('<section id="setup"'));
  const talk = html.slice(html.indexOf('<section id="setup"'), html.indexOf('<section id="onboard"'));
  const profile = html.slice(html.indexOf('<section id="profile"'), html.indexOf("</section>", html.indexOf('<section id="profile"')));
  // the duplicated Learn shortcut strip is gone
  if (html.includes('id="learnActs"')) throw new Error("the duplicated Learn shortcut strip is still present");
  if (/data-la="(dialog|progress|mistakes)"/.test(src)) throw new Error("Learn still renders duplicate shortcuts");
  // one canonical destination each
  if (!talk.includes('id="dialogBtn"') || !talk.includes('id="mistakesBtn"')) throw new Error("Talk must own guided dialogue and mistakes");
  if (learn.includes('id="dialogBtn"') || learn.includes('id="mistakesBtn"')) throw new Error("Learn duplicates a Talk destination");
  if (!profile.includes('id="progressBtn"')) throw new Error("Profile must own My progress");
  if (talk.includes('id="progressBtn"')) throw new Error("My progress must not stay on Talk");
  if (!profile.includes('id="shareBtn"')) throw new Error("Profile must own Recommend the app");
  if (talk.includes('id="shareBtn"')) throw new Error("Recommend the app must not stay on Talk");
  // Talk is sectioned as the training hub
  for (const id of ["lblTrainNow", "lblTrainCall", "lblTrainReview", "lblTrainRecent"])
    if (!talk.includes(`id="${id}"`)) throw new Error("Talk missing hub section: " + id);
});

check("MARZI-017 brand lockup: mark before wordmark, one implementation", () => {
  const L = tt.T.en;
  tt.S.lang = "en";
  const lock = tt.UI.brandLockup({ label: L.appName });
  // the mark must come BEFORE the wordmark in source order
  const iMark = lock.indexOf("brand-mark"), iWord = lock.indexOf("wordmark");
  if (iMark < 0 || iWord < 0 || iMark > iWord) throw new Error("the Marzi mark must sit before the wordmark");
  if (!lock.includes('role="img"') || !lock.includes(L.appName)) throw new Error("lockup is not labelled");
  // ships unregistered -> falls back to approved SVG, never requests a missing file
  if (tt.hasBrandMarkAsset()) throw new Error("the brand mark asset must ship unregistered");
  if (lock.includes("<img")) throw new Error("an unregistered mark must not emit an <img>");
  tt.__registerBrandMark(true);
  const withAsset = tt.UI.brandLockup({});
  if (!withAsset.includes(tt.BRAND_MARK_ASSET)) throw new Error("a registered mark is not used");
  tt.__registerBrandMark(false);
  // one implementation: the top bar composes it rather than building its own
  if (!/UI\.brandLockup\(/.test(String(src.match(/topBar\(\{[\s\S]*?\n  \},/)[0]))) throw new Error("topBar does not reuse the lockup");
  const styles = html.slice(html.indexOf("<style>"), html.indexOf("</style>"));
  if (!/\.brand-lockup \.wordmark \{ flex: 0 0 auto; \}/.test(styles)) throw new Error("the wordmark must never shrink");
});

check("MARZI-017 formatting: localized numbers, plurals, never concatenated", () => {
  tt.S.lang = "en";
  if (tt.fmtNum(1234) !== new Intl.NumberFormat("en-GB").format(1234)) throw new Error("fmtNum is not locale aware");
  if (tt.plural(1, tt.T.en.callUnit) !== "call" || tt.plural(2, tt.T.en.callUnit) !== "calls") throw new Error("English plural");
  tt.S.lang = "es";
  if (tt.plural(1, tt.T.es.dayUnit) !== "día" || tt.plural(3, tt.T.es.dayUnit) !== "días") throw new Error("Spanish plural");
  tt.S.lang = "en";
  // chips may compact, but the exact value must survive in the accessible name
  if (tt.chipNum(999) !== "999") throw new Error("small values must not compact");
  if (!/k$/.test(tt.chipNum(12500))) throw new Error("large values must compact");
  // the stat card keeps value and label as separate elements
  const card = tt.UI.statCard({ icon: "", value: "0", label: "coins" });
  if (/>0coins/.test(card) || !/<b class="stat-val">0<\/b>/.test(card)) throw new Error("value concatenated into its label");
});

check("MARZI-017 onboarding: steps, atomic save, rollback, existing-user migration", () => {
  const L = tt.T.en;
  const clear = () => ["marzi.stats.v1", "marzi.settings.v1", tt.ONBOARD_KEY, "telefontrainer.fixes",
    "telefontrainer.words", "telefontrainer.tests", "marzi.reward-ledger.v1"].forEach((k) => localStorage.removeItem(k));

  // --- genuinely new install: onboarding runs
  clear();
  if (tt.hasMeaningfulUserData()) throw new Error("an empty install must not look like an existing user");
  if (tt.onboardingComplete()) throw new Error("a new install must see onboarding");

  // --- existing user: never re-onboarded, never reset
  clear();
  localStorage.setItem("marzi.stats.v1", JSON.stringify({ days: {}, xp: 420, calls: 7, coins: 300 }));
  if (!tt.hasMeaningfulUserData()) throw new Error("XP and calls must count as meaningful data");
  if (!tt.onboardingComplete()) throw new Error("an existing user must not be re-onboarded");
  // every individual signal counts on its own
  for (const [key, value] of [
    ["marzi.stats.v1", JSON.stringify({ days: { "2026-01-01": 1 }, xp: 0, calls: 0 })],
    ["marzi.stats.v1", JSON.stringify({ days: {}, xp: 0, calls: 0, ownedItemIds: ["sporty"] })],
    ["marzi.stats.v1", JSON.stringify({ days: {}, xp: 0, calls: 0, scenariosDone: { arzt: 1 } })],
  ]) { clear(); localStorage.setItem(key, value); if (!tt.hasMeaningfulUserData()) throw new Error("missed signal: " + value); }
  clear(); localStorage.setItem("telefontrainer.fixes", JSON.stringify([{ text: "a" }]));
  if (!tt.hasMeaningfulUserData()) throw new Error("stored mistakes must count");
  clear(); localStorage.setItem("marzi.reward-ledger.v1", JSON.stringify({ "call:1": true }));
  if (!tt.hasMeaningfulUserData()) throw new Error("reward-ledger entries must count");

  // --- the four steps, and Back walking them in reverse
  clear();
  tt.S.lang = "en";
  tt.showOnboarding();
  if (tt.OB_STEPS.join() !== "lang,target,goal,daily") throw new Error("step order");
  if (tt.obStep() !== "lang") throw new Error("first step");
  tt.obPick("es");
  if (tt.S.lang !== "es") throw new Error("language preview not applied");
  if (!tt.obNext() || tt.obStep() !== "target") throw new Error("advance to target");
  tt.obPick("de"); tt.obNext();
  if (tt.obStep() !== "goal") throw new Error("advance to goal");
  if (tt.obCanAdvance()) throw new Error("goal step must require a choice");
  tt.obPick("work"); tt.obNext();
  if (tt.obStep() !== "daily") throw new Error("advance to daily");
  if (!tt.obBack() || tt.obStep() !== "goal") throw new Error("Back must return to the previous step");
  if (!tt.obBack() || tt.obStep() !== "target") throw new Error("Back must keep walking");
  tt.obNext(); tt.obPick("10");
  if (tt.obStep() !== "goal") throw new Error("step tracking after back/next");

  // --- atomic commit: the record holds only what onboarding asked
  clear();
  tt.S.lang = "en"; tt.S.targetLang = "de";
  const res = tt.commitOnboarding({ lang: "it", targetLang: "de", goal: "travel", dailyMin: 15 });
  if (!res.ok) throw new Error("commit failed");
  const rec = tt.loadOnboarding();
  if (!rec.done || rec.goal !== "travel" || rec.dailyMin !== 15) throw new Error("onboarding record");
  if (tt.S.lang !== "it") throw new Error("interface language not applied");
  // the canonical settings record carries it - no second language state
  const saved = JSON.parse(localStorage.getItem("marzi.settings.v1"));
  if (saved.lang !== "it" || saved.targetLang !== "de") throw new Error("language must live in the canonical settings record");
  if (Object.keys(rec).sort().join() !== "dailyMin,done,goal,version") throw new Error("onboarding key duplicates other state: " + Object.keys(rec));

  // --- corruption and defaults
  localStorage.setItem(tt.ONBOARD_KEY, "{not json");
  if (tt.loadOnboarding().done !== false) throw new Error("corrupt record must default safely");
  localStorage.setItem(tt.ONBOARD_KEY, JSON.stringify({ done: "yes", goal: "hacking", dailyMin: 999 }));
  const norm = tt.loadOnboarding();
  if (norm.done !== false || norm.goal !== null || norm.dailyMin !== null) throw new Error("normalization: " + JSON.stringify(norm));

  // --- storage failure rolls back EXACTLY, saving nothing partially
  clear();
  tt.S.lang = "en"; tt.S.targetLang = "de";
  localStorage.setItem("marzi.settings.v1", JSON.stringify({ lang: "en", targetLang: "de" }));
  const before = localStorage.getItem("marzi.settings.v1");
  const realSet = localStorage.setItem;
  localStorage.setItem = function (k, v) { if (k === tt.ONBOARD_KEY) throw new Error("quota"); return realSet.call(localStorage, k, v); };
  let failed;
  try { failed = tt.commitOnboarding({ lang: "tr", targetLang: "de", goal: "work", dailyMin: 20 }); }
  finally { localStorage.setItem = realSet; }
  if (failed.ok !== false || failed.code !== "save-failed") throw new Error("failure not reported");
  if (localStorage.getItem("marzi.settings.v1") !== before) throw new Error("settings not restored after failure");
  if (localStorage.getItem(tt.ONBOARD_KEY) !== null) throw new Error("a partial onboarding record survived");
  if (tt.S.lang !== "en" || tt.S.targetLang !== "de") throw new Error("in-memory state not restored");
  if (!L.obSaveFailed) throw new Error("no localized recoverable error");
});

check("MARZI-017 existing-user data survives onboarding byte-for-byte", () => {
  const keys = ["marzi.stats.v1", "telefontrainer.fixes", "telefontrainer.words", "marzi.reward-ledger.v1"];
  const seed = {
    "marzi.stats.v1": JSON.stringify({ days: { "2026-07-30": 2 }, calls: 9, seconds: 5400, xp: 900, coins: 750,
      ownedItemIds: ["explorer"], equippedItemIds: ["explorer"], scenariosDone: { arzt: 3 } }),
    "telefontrainer.fixes": JSON.stringify([{ text: "a", corrected: "A", drilled: "2026-07-30" }]),
    "telefontrainer.words": JSON.stringify(["Haus"]),
    "marzi.reward-ledger.v1": JSON.stringify({ "call:abc": { xp: 20, coins: 20 } }),
  };
  keys.forEach((k) => localStorage.setItem(k, seed[k]));
  localStorage.removeItem(tt.ONBOARD_KEY);
  if (!tt.onboardingComplete()) throw new Error("an existing learner was sent back to onboarding");
  // even a deliberate commit must not touch learner data
  tt.commitOnboarding({ lang: "en", targetLang: "de", goal: "daily", dailyMin: 10 });
  for (const k of keys) if (localStorage.getItem(k) !== seed[k]) throw new Error("mutated learner data: " + k);
});

check("MARZI-017 store: nine outfits, locked stays visible and tappable", () => {
  const L = tt.T.en;
  tt.S.lang = "en";
  // the canonical catalog, unchanged
  if (tt.OUTFITS.length !== 9) throw new Error("catalog size: " + tt.OUTFITS.length);
  if (tt.OUTFITS.map((o) => o.id).join() !== "explorer,sporty,rainbow,classic,university,artistic,professional,adventurer,graduate")
    throw new Error("catalog order/ids changed");
  if (tt.OUTFITS.filter((o) => o.stage === 4).length !== 3 || tt.OUTFITS.filter((o) => o.stage === 5).length !== 3 ||
      tt.OUTFITS.filter((o) => o.stage === 6).length !== 3) throw new Error("stage distribution changed");
  if (tt.OUTFITS.map((o) => o.price).join() !== "800,800,800,900,900,900,1200,1200,1200") throw new Error("outfit prices changed");

  // a stage-1 learner still sees all nine, every one of them tappable
  localStorage.setItem("marzi.stats.v1", JSON.stringify({ days: {}, xp: 0, coins: 0 }));
  tt.renderStore();
  const body = document.getElementById("storeBody").innerHTML;
  const cards = body.match(/data-outfit="[a-z]+"/g) || [];
  if (cards.length !== 9) throw new Error("visible outfits: " + cards.length);
  if (/data-outfit="[^"]*"[^>]*\sdisabled/.test(body)) throw new Error("a locked card used the disabled attribute");
  if (!body.includes('aria-disabled="true"')) throw new Error("locked cards must be aria-disabled");
  if (!body.includes('data-state="locked"')) throw new Error("no locked state rendered");
  // the locked card carries a stage badge and a price, and states are not colour-only
  const locked = tt.UI.outfitCard({ id: "graduate", name: "Graduate", price: 1200, state: "locked", stageLabel: `${L.lockedAt} 6` });
  if (!locked.includes("outfit-stage")) throw new Error("locked card has no stage badge");
  if (!locked.includes("outfit-lock")) throw new Error("locked card has no lock icon");
  if (!locked.includes("1200")) throw new Error("locked card hides the price");
  if (!/aria-label="[^"]*6[^"]*1200/.test(locked)) throw new Error("locked accessible label incomplete");

  // preview opens for a locked outfit, and offers no purchase
  tt.openOutfitPreview("graduate");
  const modal = document.getElementById("storeModal").innerHTML;
  if (!modal.includes("Graduate") && !modal.includes(tt.outfitName("graduate"))) throw new Error("locked preview did not open");
  if (modal.includes('id="storeBuy"')) throw new Error("a stage-locked outfit offered a purchase");
  if (!modal.includes(L.lockedHow)) throw new Error("the modal must explain how it unlocks");
  if (!modal.includes('id="storeCancel"')) throw new Error("no way to close the preview");

  // the five canonical states still come from one function
  const st = { xp: 0, coins: 0, ownedItemIds: [], equippedItemIds: [] };
  if (tt.outfitState("graduate", st) !== "locked") throw new Error("locked state");
  if (tt.outfitState("explorer", { ...st, xp: 900, coins: 0 }) !== "insufficient") throw new Error("insufficient state");
  if (tt.outfitState("explorer", { ...st, xp: 900, coins: 5000 }) !== "available") throw new Error("available state");
  if (tt.outfitState("explorer", { ...st, ownedItemIds: ["explorer"] }) !== "owned") throw new Error("owned state");
  if (tt.outfitState("explorer", { ...st, ownedItemIds: ["explorer"], equippedItemIds: ["explorer"] }) !== "equipped") throw new Error("equipped state");
});

check("MARZI-017 profile: formatted cards, truthful weekly history, empty states", () => {
  const L = tt.T.en;
  tt.S.lang = "en";
  // no dated history at all -> no chart is invented
  localStorage.setItem("marzi.stats.v1", JSON.stringify({ days: {}, calls: 0, seconds: 0, xp: 0, coins: 0 }));
  localStorage.setItem("telefontrainer.fixes", "[]");
  localStorage.setItem("telefontrainer.words", "[]");
  const empty = tt.weeklyActivity();
  if (empty.hasHistory) throw new Error("an empty profile must not claim history");
  if (empty.entries.length !== 7) throw new Error("a week is seven days");
  if (empty.entries.some((e) => e.value !== 0)) throw new Error("fabricated values");
  tt.renderProfile();
  let body = document.getElementById("profBody").innerHTML;
  if (!body.includes(L.profNoHistory)) throw new Error("missing weekly empty state");
  if (body.includes("act-bars")) throw new Error("a zero-filled chart was rendered as history");
  if (!body.includes('data-state="empty"')) throw new Error("zero counters must be marked empty");
  // values and labels are separate, spaced, and pluralized
  if (/>0calls</.test(body) || /\d[a-z]{3,}</.test(body.replace(/<[^>]+>/g, "")))
    throw new Error("a value ran into its label");
  if (!body.includes(">0</b>")) throw new Error("formatted zero missing");
  // the old defect was two INLINE elements rendering as "0coins": both are blocks now
  const st2 = html.slice(html.indexOf("<style>"), html.indexOf("</style>"));
  if (!/\.stat-val \{ display: block;/.test(st2)) throw new Error("stat value is not a block");
  if (!/\.stat-lb \{ display: block;/.test(st2)) throw new Error("stat label is not a block");

  // real dated activity -> a real chart, from stats.days only
  const today = new Date().toISOString().slice(0, 10);
  localStorage.setItem("marzi.stats.v1", JSON.stringify({ days: { [today]: 2 }, secDays: { [today]: 600 },
    calls: 2, seconds: 600, xp: 100, coins: 1500 }));
  const wk = tt.weeklyActivity();
  if (!wk.hasHistory) throw new Error("real history not detected");
  if (wk.entries[wk.entries.length - 1].value !== 2) throw new Error("today's calls not read from stats.days");
  if (wk.entries.reduce((a, e) => a + e.value, 0) !== 2) throw new Error("values beyond the stored day");
  tt.renderProfile();
  body = document.getElementById("profBody").innerHTML;
  if (!body.includes("act-bars")) throw new Error("chart missing when history exists");
  if (!body.includes(new Intl.NumberFormat("en-GB").format(1500))) throw new Error("coins not locale-formatted");
  // recent activity lists only recorded calls
  if (tt.recentActivity().length !== 1) throw new Error("recent activity must list only recorded days");
  localStorage.setItem("marzi.stats.v1", JSON.stringify({ days: {}, calls: 0, seconds: 0, xp: 0, coins: 0 }));
  if (tt.recentActivity().length !== 0) throw new Error("recent activity invented rows");
});

check("MARZI-017 PWA: manifest contract, standalone detection, install hint", () => {
  const m = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "public", "manifest.webmanifest"), "utf8"));
  if (m.display !== "standalone") throw new Error("display must be standalone");
  if (!Array.isArray(m.display_override) || m.display_override[0] !== "standalone" || m.display_override[1] !== "minimal-ui")
    throw new Error("display_override must be [standalone, minimal-ui]");
  if (m.short_name !== "Marzi") throw new Error("short_name must be the product name: " + m.short_name);
  if (!/Marzi/.test(m.name)) throw new Error("name must carry the brand: " + m.name);
  for (const k of ["start_url", "scope", "theme_color", "background_color", "id"]) if (!m[k]) throw new Error("manifest missing " + k);
  if (m.scope !== "/" || m.start_url.indexOf("/") !== 0) throw new Error("scope/start_url must stay in-origin");
  if (!/^#[0-9a-f]{6}$/i.test(m.theme_color) || !/^#[0-9a-f]{6}$/i.test(m.background_color)) throw new Error("colour format");
  const sizes = (m.icons || []).map((i) => i.sizes);
  if (!sizes.includes("192x192") || !sizes.includes("512x512")) throw new Error("production icons missing");
  if (!(m.icons || []).some((i) => i.purpose === "maskable")) throw new Error("no maskable icon");

  // standalone detection handles both display-mode and the iOS fallback
  const detect = String(src.match(/function isStandalone\(\)[\s\S]*?\n\}/)[0]);
  if (!/display-mode: \$\{mode\}/.test(detect)) throw new Error("display-mode not queried");
  if (!/navigator\.standalone/.test(detect)) throw new Error("navigator.standalone fallback missing");
  // the hint is browser-only and its dismissal persists
  const realMM = globalThis.matchMedia;
  globalThis.matchMedia = () => ({ matches: true });
  if (tt.isStandalone() !== true) throw new Error("standalone not detected");
  if (tt.installRecVisible()) throw new Error("the install hint must never show in standalone mode");
  globalThis.matchMedia = () => ({ matches: false });
  localStorage.removeItem(tt.INSTALL_DISMISS_KEY);
  if (!tt.installRecVisible()) throw new Error("the install hint must show in a browser");
  tt.dismissInstallRec();
  if (tt.installRecVisible()) throw new Error("dismissal must persist");
  localStorage.removeItem(tt.INSTALL_DISMISS_KEY);
  globalThis.matchMedia = realMM;
  // safe-area contract survives
  const styles = html.slice(html.indexOf("<style>"), html.indexOf("</style>"));
  if (!/env\(safe-area-inset/.test(styles)) throw new Error("safe-area insets dropped");
  if (/100vh(?![a-z-])/.test(styles.replace(/100vh\s*\)/g, "")) && !/100dvh/.test(styles)) throw new Error("dynamic viewport units dropped");
});

check("MARZI-017 regression: economy, prompts and engine untouched", () => {
  // the six thresholds and the reward maths
  if (tt.MARZI_STAGE_XP.join() !== "0,150,400,800,1500,2600") throw new Error("XP thresholds changed");
  const rc = String(src.match(/function recordCall\(\)[\s\S]*?\n\}/)[0]);
  if (!/const gained = 15 \+ Math\.min\(20, S\.turns\.filter\(\(x\) => x\.me\)\.length \* 2\)/.test(rc)) throw new Error("XP formula changed");
  if (!/\{ xp: gained, coins: 20 \}/.test(rc)) throw new Error("coins per call changed");
  if (!/claimReward\("call:"/.test(rc)) throw new Error("reward idempotency changed");
  // prices
  if (tt.COIN_PACKS.map((p) => p.price).join() !== "200,450,800,1500") throw new Error("minute-pack prices changed");
  if (!/function buyPack\(id\) \{\n  const p = COIN_PACKS\.find/.test(src)) throw new Error("buyPack changed");
  if (tt.PLAN_SECONDS !== 30 * 60) throw new Error("daily allowance changed");
  if (tt.MB_PER_MINUTE !== 10) throw new Error("MB relationship changed");
  if (tt.isPremium() !== false) throw new Error("Premium entitlement changed");
  // engine + providers + prompts
  if (tt.ENGINE_CONTRACTS.ai.join() !== "complete") throw new Error("AI provider contract changed");
  if (!/function systemPrompt\(/.test(src)) throw new Error("systemPrompt missing");
  for (const fn of ["createConversationSession", "createTranscript", "createProviderRegistry"])
    if (typeof tt[fn] !== "function") throw new Error("engine export missing: " + fn);
  if (!tt.PromptBuilder || typeof tt.PromptBuilder.rolePlay !== "function") throw new Error("PromptBuilder contract changed");
  // storage stays backwards compatible: unknown keys survive normalization
  const norm = tt.normalizeStats({ xp: 5, coins: 6, calls: 7, ownedItemIds: ["explorer"], mystery: 1 });
  if (norm.xp !== 5 || norm.coins !== 6 || norm.calls !== 7) throw new Error("normalizeStats lost a counter");
  if (norm.ownedItemIds.join() !== "explorer") throw new Error("wardrobe lost on normalization");
  if (tt.normalizeStats(null).xp !== 0) throw new Error("normalizeStats must default safely");
});


check("MARZI-018 call render: last character line survives processing", () => {
  // OBSERVED BEFORE CHANGING ANYTHING (MARZI-018 constraint 4): with a
  // contract-correct stub the character's last line stayed visible right
  // through the processing window. That is correct behaviour and this check
  // locks it, rather than "fixing" something that already works.
  tt.S.lang = "es";
  const A = tt.SCENARIOS.find((x) => x.id === "arzt");
  tt.S.scenario = A; tt.S.active = A;
  tt.S.hint = "Ich möchte einen Termin reservieren.";
  tt.S.turns = [
    { me: false, text: "Guten Tag! Praxis Dr. Wagner." },
    { me: true, text: "Ich hätte gern einen Termin." },
  ];
  // idle: the line and the suggestion are both up
  tt.S.busy = false;
  tt.renderCall();
  const say = document.getElementById("vcSay");
  const bub = document.getElementById("vcBubble");
  if (say.textContent !== "Guten Tag! Praxis Dr. Wagner.") throw new Error("character line not rendered");
  if (say.classList.has("hidden")) throw new Error("character line hidden while idle");
  if (bub.classList.has("hidden")) throw new Error("suggestion hidden while idle");

  // processing: the character line MUST remain; the suggestion steps aside
  tt.S.busy = true;
  tt.renderCall();
  if (say.textContent !== "Guten Tag! Praxis Dr. Wagner.") throw new Error("character line lost during processing");
  if (say.classList.has("hidden")) throw new Error("character line hidden during processing");
  if (!bub.classList.has("hidden")) throw new Error("the suggestion must not survive into processing");

  // the line is derived from the render model, never from the busy flag
  const rc = String(src.match(/const lastChar = [^\n]*/)[0]);
  if (!/\[\.\.\.S\.turns\]\.reverse\(\)\.find\(\(x\) => !x\.me\)/.test(rc))
    throw new Error("last character line is no longer derived from the turn list");
  if (/S\.busy/.test(String(src.match(/\$\("vcSay"\)\.classList\.toggle[^\n]*/)[0])))
    throw new Error("the character bubble must not depend on the busy flag");
  tt.S.busy = false; tt.S.turns = []; tt.S.hint = null;
});


check("MARZI-018 call chrome: emoji fallback, one danger control, targets, safe areas", () => {
  const styles = html.slice(html.indexOf("<style>"), html.indexOf("</style>"));

  // M-01 (mandatory): a loaded portrait removes the emoji from the scene
  if (!/\.callscreen:has\(\.call-portrait\.ok\) \.call-emoji \{ display: none; \}/.test(styles))
    throw new Error("a loaded portrait must hide the emoji fallback");
  // ...and the fallback still exists, with an accessible name, when it fails
  if (!/\.call-portrait\.ok \{ display: block; \}/.test(styles)) throw new Error("portrait success class lost");
  if (!html.includes('id="vcEmoji"')) throw new Error("the emoji fallback element was removed");
  if (!/\$\("vcEmoji"\)\.textContent = A\.avatar/.test(src)) throw new Error("the fallback no longer carries the character emoji");
  // constraint 3: while the fallback IS the visual it must be announced;
  // once the portrait loads it becomes decorative
  const mk = String(src.match(/const markEmoji = [\s\S]*?\n  \};/)[0]);
  if (!/portraitOk\)/.test(mk)) throw new Error("fallback accessibility does not follow portrait state");
  if (!/aria-hidden", "true"/.test(mk)) throw new Error("a loaded portrait must leave the emoji decorative");
  if (!/setAttribute\("role", "img"\)/.test(mk) || !/aria-label", A\.who/.test(mk))
    throw new Error("the failure fallback must be announced with the character name");
  if (!/markEmoji\(true\)/.test(src) || !/markEmoji\(false\)/.test(src))
    throw new Error("markEmoji is not wired to load and error");
  if (!/id="vcImg"/.test(html) || !/class="call-portrait"/.test(html)) throw new Error("portrait element changed");

  // M-05 / constraint 7: only hang-up may be red
  const dangerRules = (styles.match(/\.call-ctrl[^{]*\{[^}]*background: var\(--red\)[^}]*\}/g) || []);
  if (dangerRules.length !== 1) throw new Error("exactly one call control may use the danger red, found " + dangerRules.length);
  if (!/\.call-ctrl\.danger \{[^}]*background: var\(--red\)/.test(styles)) throw new Error("the danger red must belong to hang-up");
  if (/\.call-ctrl\[data-status="failed"\] \{[^}]*var\(--red\)/.test(styles)) throw new Error("a failed mic must not borrow the hang-up red");
  if (!/\.call-ctrl\[data-status="failed"\] \{[^}]*var\(--warn-soft\)/.test(styles)) throw new Error("failed mic has no warning treatment");

  // M-06 / constraint 8: secondary tools meet the touch floor in BOTH axes
  if (!/\.call-pill \{[^}]*min-height: var\(--touch-min\)[^}]*min-width: var\(--touch-min\)/.test(styles))
    throw new Error("secondary call tools must be at least 48px in both axes");

  // M-09: the call layer honours both safe areas
  if (!/--safe-top: env\(safe-area-inset-top, 0px\)/.test(styles)) throw new Error("--safe-top token missing");
  // R2-APP-04: exactly ONE owner per call safe-area edge. .callscreen owns
  // both; anything else consuming them again double-counts the inset.
  if (!/\.callscreen \{[^}]*padding: calc\(var\(--safe-top\) \+ var\(--space-2\)\) 0\s*calc\(var\(--safe-bottom\) \+ var\(--space-2\)\)/.test(styles))
    throw new Error(".callscreen must be the single owner of both call insets");
  const dupTop = (styles.match(/var\(--safe-top\)/g) || []).length;
  const dupBot = (styles.match(/var\(--safe-bottom\)/g) || []).length;
  if (dupTop !== 1) throw new Error("--safe-top must have exactly ONE consumer, found " + dupTop);
  if (dupBot > 4) throw new Error("--safe-bottom consumed by too many owners: " + dupBot);
  if (/body\.in-call \.call-(top|stack) \{[^}]*safe-(top|bottom)/.test(styles))
    throw new Error("call chrome consumes an inset already owned by .callscreen");

  // M-07: the timer reads as primary, remaining allowance as context
  if (!/\.call-meta #timer \{ font-size: var\(--text-md\)/.test(styles)) throw new Error("timer is not the primary reading");
  if (!html.includes('id="vcLeft" class="call-meta-ctx"')) throw new Error("remaining allowance is not marked as context");

  // three primary controls, one of them hang-up, all built by the same component
  const ctrls = String(src.match(/UI\.callControl\(\{ id: "micBtn"[\s\S]*?UI\.callControl\(\{ id: "playBtn"[^\n]*/)[0]);
  if ((ctrls.match(/UI\.callControl\(\{/g) || []).length !== 3) throw new Error("there must be exactly three primary controls");
  if ((ctrls.match(/variant: "danger"/g) || []).length !== 1) throw new Error("exactly one primary control may be danger");

  // identity: the name line is present and place is optional context
  const idc = String(src.match(/callIdentity\(\{[\s\S]*?\n  \},/)[0]);
  if (!/call-id-name/.test(idc) || !/call-id-place/.test(idc)) throw new Error("identity hierarchy changed");
  if (!/place \?/.test(idc)) throw new Error("place must be optional so it cannot render empty");
});


check("MARZI-018 call poses: stable paths, empty registry, safe fallback", () => {
  // 21 canonical paths: stages 4-6 x seven poses
  if (tt.CALL_POSE_STATES.join() !== "ready,listening,thinking,speaking,encouraging,limit,offline")
    throw new Error("call pose vocabulary: " + tt.CALL_POSE_STATES.join());
  const paths = [];
  for (const st of [4, 5, 6]) for (const pose of tt.CALL_POSE_STATES) paths.push(tt.marziCallAssetPath(st, pose));
  if (paths.length !== 21 || new Set(paths).size !== 21) throw new Error("expected 21 distinct paths");
  if (paths[0] !== "/assets/marzi/call/stage-4-ready.svg") throw new Error("path shape: " + paths[0]);
  if (paths[20] !== "/assets/marzi/call/stage-6-offline.svg") throw new Error("last path: " + paths[20]);

  // no new state vocabulary - every pose maps onto a shipped MARZI_STATE
  for (const pose of tt.CALL_POSE_STATES) {
    const mapped = tt.CALL_POSE_TO_STATE[pose];
    if (!tt.MARZI_STATES.includes(mapped)) throw new Error(`pose ${pose} maps to unknown state ${mapped}`);
  }
  if (tt.MARZI_STATES.join() !== "neutral,happy,listening,thinking,speaking,sad,error,celebrating")
    throw new Error("MARZI-013 state vocabulary changed");

  // stages are clamped into the 4-6 range the spec defines
  if (tt.marziCallAssetPath(1, "ready") !== "/assets/marzi/call/stage-4-ready.svg") throw new Error("low stage not clamped");
  if (tt.marziCallAssetPath(99, "ready") !== "/assets/marzi/call/stage-6-ready.svg") throw new Error("high stage not clamped");
  if (tt.marziCallAssetPath(5, "nonsense") !== "/assets/marzi/call/stage-5-ready.svg") throw new Error("unknown pose must fall back to ready");
  if (tt.marziCallPose("listening") !== "listening") throw new Error("pose passthrough");
  if (tt.marziCallPose("sad") !== "limit") throw new Error("a canonical state must resolve to its pose");

  // THE REGISTRY SHIPS EMPTY: no request is ever made for a missing file
  if (Object.keys(tt.MARZI_CALL_ASSETS).length !== 0) throw new Error("the call asset registry must ship empty");
  for (const st of [4, 5, 6]) for (const pose of tt.CALL_POSE_STATES) {
    if (tt.hasMarziCallAsset(st, pose)) throw new Error("an asset is registered before delivery");
    const art = tt.marziCallArt(st, pose);
    if (/<img/.test(art)) throw new Error(`unregistered ${st}/${pose} emitted an <img>`);
    if (!/<svg/.test(art)) throw new Error(`no fallback artwork for ${st}/${pose}`);
  }
  // registering one swaps only that one, through the same entry point
  tt.__registerCallAsset(5, "listening", true);
  if (!/<img[^>]*stage-5-listening\.svg/.test(tt.marziCallArt(5, "listening"))) throw new Error("a registered asset is not used");
  if (/<img/.test(tt.marziCallArt(5, "thinking"))) throw new Error("registering one asset affected another");
  tt.__registerCallAsset(5, "listening", false);
  if (/<img/.test(tt.marziCallArt(5, "listening"))) throw new Error("unregistering did not restore the fallback");

  // stages below 4 always use the approved SVG, even if a path is registered
  tt.__registerCallAsset(4, "ready", true);
  if (/<img/.test(tt.marziCallArt(3, "ready"))) throw new Error("stage 3 must not use a call asset");
  tt.__registerCallAsset(4, "ready", false);

  // the companion renders through the resolver and keeps its earned stage
  tt.S.lang = "es";
  localStorage.setItem("marzi.stats.v1", JSON.stringify({ days: {}, xp: 1600, calls: 4, seconds: 300, coins: 0 }));
  tt.renderCallCompanion();
  const el = document.getElementById("vcMarzi");
  if (el.dataset.stage !== String(tt.marziStageForXp(1600))) throw new Error("companion is not on the earned stage");
  if (!/vc-marzi-art/.test(el.innerHTML) || !/<svg/.test(el.innerHTML)) throw new Error("companion artwork missing");
  if (!/marziCallArt\(stage, state\)/.test(src)) throw new Error("the companion must render through the resolver");
});

check("MARZI-018 Marzi presence and bubble anchoring", () => {
  const styles = html.slice(html.indexOf("<style>"), html.indexOf("</style>"));
  // M-02: the art scales with the viewport instead of a fixed 108px badge
  // R2-APP-01: the ARTWORK carries the presence contract, at every stage
  // MARZI-062: the same viewport scale, now also bounded by the row Marzi sits
  // in, so a short viewport at 200% text shrinks him instead of letting him
  // overrun the stage. The dvh term is still what drives his size.
  const MARZI_SIZE = /height: clamp\(112px, 25\.5dvh, 208px\); max-height: 100%/;
  const artRule = (styles.match(/\.call-marzi \.vc-marzi-art \{[^}]*\}/) || [""])[0];
  if (!MARZI_SIZE.test(artRule)) throw new Error("Marzi artwork no longer scales with the dynamic viewport");
  if (!/aspect-ratio: 1 \/ 1/.test(artRule)) throw new Error("Marzi artwork is no longer square");
  const stage3 = (styles.match(/\.call-marzi\[data-stage="3"\][\s\S]*?\{[^}]*\}/) || [""])[0];
  if (!MARZI_SIZE.test(stage3)) throw new Error("early stages must scale like 4-6 inside the call");
  if (!/border: 0/.test(stage3)) throw new Error("early stages must not keep the badge treatment in the call");
  if (/max-width: 128px/.test(styles)) throw new Error("the old 128px cap still clips Marzi");
  if (!/max-width: min\(46vw, 220px\)/.test(styles)) throw new Error("Marzi container cap missing");
  // M-03: the suggestion is anchored beside Marzi and carries a tail back to him
  if (!/\.call-bubble\.marzi::after \{/.test(styles)) throw new Error("the Marzi bubble has no tail");
  // MARZI-062: "beside Marzi" is now expressed as the second column of the same
  // grid row rather than as an absolute inset. Both cells must exist and share
  // the row, or the suggestion is no longer anchored to him.
  if (!/"marzi  hint"/.test(styles)) throw new Error("the suggestion is not anchored beside Marzi");
  if (!/\.call-bubble\.marzi \{[^}]*grid-area: hint/.test(styles))
    throw new Error("the suggestion left the row it shares with Marzi");
  if (!/\.call-marzi \{[^}]*grid-area: marzi/.test(styles))
    throw new Error("Marzi left the row he shares with the suggestion");
  // M-10: the lower third is seated, not empty
  if (!/\.call-mid::after \{/.test(styles)) throw new Error("no floor gradient under the companion");
  // constraint 5: UI.callStage was NOT introduced
  if (typeof tt.UI.callStage !== "undefined") throw new Error("UI.callStage was introduced without justification");
});


check("MARZI-018 no-internet state stays distinct from the daily limit", () => {
  const L = tt.T.en;
  tt.S.lang = "en";
  const realNav = globalThis.navigator;
  const setOnline = (v) => { try { Object.defineProperty(globalThis, "navigator", { value: { ...realNav, onLine: v }, configurable: true }); } catch (e) {} };

  setOnline(false);
  tt.showOffline();
  if (!tt.offlineScreenOpen()) throw new Error("offline state did not open");
  const off = document.getElementById("offlineScreen").innerHTML;
  // names connectivity as the cause, never the allowance
  if (!off.includes(L.offlineTitle) || !off.includes(L.offlineMsg)) throw new Error("offline copy missing");
  if (off.includes(L.limitTitle)) throw new Error("the offline state must not claim minutes are exhausted");
  if (!off.includes(L.offRetry)) throw new Error("no retry action");
  if (off.includes(L.resetsIn)) throw new Error("a reset time belongs to the limit state, not offline");
  // recovery rows plus a safe exit
  if (!off.includes(L.planBuyNet) || !off.includes(L.premGet)) throw new Error("recovery rows missing");
  if (!off.includes(L.premLater)) throw new Error("no safe exit");
  // and it is a real, separate surface from the limit sheet
  if (tt.limitOpen()) throw new Error("offline must not open the limit sheet");
  tt.closeOffline();
  if (tt.offlineScreenOpen()) throw new Error("offline state not dismissible");

  // goCall routes the two refusals to two different screens
  const gc = String(src.match(/function goCall\(\)[\s\S]*?\n\}/)[0]);
  if (!/isOffline\(\)\) \{ renderNetBanner\(\); showOffline\(\); return; \}/.test(gc))
    throw new Error("an offline call must open the offline state");
  if (!/planUsedToday\(\) >= planLimitToday\(\)\) \{ showLimit\(\); return; \}/.test(gc))
    throw new Error("an exhausted allowance must still open the limit sheet");
  if (gc.indexOf("isOffline") > gc.indexOf("planUsedToday")) throw new Error("connectivity must be checked before the allowance");
  // the retry uses its own string, not the drill's "Again"
  if (L.offRetry === L.retry) throw new Error("connection retry must not reuse the drill string");
  setOnline(true);
  try { Object.defineProperty(globalThis, "navigator", { value: realNav, configurable: true }); } catch (e) {}
});


check("MARZI-018-R1: nothing may shadow the native History API", () => {
  // A top-level `function history()` became window.history and silently broke
  // back/pushState/replaceState, because every call site is try/catch-wrapped.
  // Verified in a clean top-level browser; this guards the whole class.
  const scriptSrc = src;
  // no global declaration may take a name the platform already owns on window
  const RESERVED = ["history", "location", "navigator", "document", "screen", "origin", "name", "length", "top", "parent", "self", "status"];
  // R2-TEST-02: only forms that actually OVERWRITE a window property.
  // `function`/`var`/`class` at column 0 create window properties; `let`/`const`
  // create script-scope bindings that do NOT overwrite window, so they are not
  // flagged (the old rule produced false positives for them).
  for (const word of RESERVED) {
    const decl = new RegExp("^(function|var|class)\\s+" + word + "\\b", "m");
    if (decl.test(scriptSrc)) throw new Error(`a top-level global named "${word}" overwrites a native window property`);
    const assign = new RegExp("(^|[^\\w.])(window|globalThis|self)\\." + word + "\\s*=[^=]", "m");
    if (assign.test(scriptSrc)) throw new Error(`a direct assignment overwrites window.${word}`);
    const define = new RegExp("defineProperty\\(\\s*(window|globalThis|self)\\s*,\\s*[\"']" + word + "[\"']", "m");
    if (define.test(scriptSrc)) throw new Error(`defineProperty collides with window.${word}`);
  }
  // the renamed helper still exists and still returns the legacy shape
  if (!/function legacyPromptHistory\(\)/.test(scriptSrc)) throw new Error("the legacy prompt-history helper was lost, not renamed");
  if (typeof tt.legacyPromptHistory !== "function") throw new Error("legacyPromptHistory is not callable");
  tt.S.turns = [{ me: true, text: "hallo" }, { me: false, text: "guten tag" }];
  const h = tt.legacyPromptHistory();
  if (!Array.isArray(h) || h[0].role !== "user" || h[0].content !== tt.TARGET.seed) throw new Error("legacy helper shape changed");
  if (h[1].role !== "user" || h[2].role !== "assistant") throw new Error("legacy helper role mapping changed");
  tt.S.turns = [];

  // every History API call site stays window-qualified, so a future global
  // cannot silently capture them again
  const calls = scriptSrc.match(/(?<![\w.])history\.(back|pushState|replaceState)/g) || [];
  if (calls.length) throw new Error("unqualified History API call(s): " + calls.join(","));
  for (const need of ["window.history.pushState({ marziSheet: true }", "window.history.back()"]) {
    if (!scriptSrc.includes(need)) throw new Error("navigation call site changed: " + need);
  }
  // the sheet flag must only be set when the push actually happened
  const open = String(scriptSrc.match(/window\.history\.pushState\(\{ marziSheet: true \}[^\n]*/)[0]);
  if (!/SHEET_HISTORY = true/.test(open)) throw new Error("sheet history flag no longer set at push time");
});

check("MARZI-062 staging preview: build identity, reserved regions, containment", () => {
  const styles = html.slice(html.indexOf("<style>"), html.indexOf("</style>"));
  // 1. the build identity is checked in, exact, uniquely marked and named
  const LABEL = "MARZI STAGING PREVIEW \u00b7 MARZI-062 \u00b7 BUILD MARZI-062-PREVIEW-1";
  if (!html.includes(LABEL)) throw new Error("the exact staging build label is missing");
  const markers = html.match(/data-marzi-build=/g) || [];
  if (markers.length !== 1) throw new Error("expected exactly one build marker, found " + markers.length);
  const bar = (html.match(/<div class="staging-bar"[^>]*>/) || [""])[0];
  if (!/aria-label="[^"]*MARZI-062-PREVIEW-1/.test(bar)) throw new Error("the staging marker has no accessible name");
  // 2. it can never intercept a control or truncate its own text
  const barRule = (styles.match(/\.staging-bar \{[^}]*\}/) || [""])[0];
  if (!/pointer-events: none/.test(barRule)) throw new Error("the staging marker can intercept controls");
  if (/text-overflow: ellipsis|white-space: nowrap/.test(barRule)) throw new Error("the staging marker truncates instead of wrapping");
  // 3. the marker's height comes out of the shell budget, so the page itself
  //    gains no scroll and the call layer never covers the marker
  for (const rule of ["min-height: calc(100dvh - var(--staging-bar, 0px))",
                      "height: calc(100dvh - 64px - var(--staging-bar, 0px))",
                      "inset: var(--staging-bar, 0px) 0 0 0"]) {
    if (!styles.includes(rule)) throw new Error("the staging marker is not in the layout budget: " + rule);
  }
  // 4. critical call elements occupy reserved regions that cannot overlap
  const mid = (styles.match(/\.call-mid \{[^}]*\}/) || [""])[0];
  if (!/display: grid/.test(mid)) throw new Error(".call-mid no longer reserves layout regions");
  for (const area of ["status", "alert", "char", "marzi", "hint"]) {
    if (!new RegExp("grid-area: " + area + "\\b").test(styles)) throw new Error("no reserved region for " + area);
  }
  // 5. a long compound noun is contained rather than clipped, and the
  //    character's line keeps a real reading budget at any text scale
  const bubble = (styles.match(/\.call-bubble \{[^}]*\}/) || [""])[0];
  if (!/overflow-wrap: break-word/.test(bubble)) throw new Error("bubbles no longer break long compound nouns");
  if (/\.call-bubble \{[^}]*overflow-wrap: anywhere/.test(styles))
    throw new Error("`anywhere` shrinks the bubble's intrinsic width and collapses the suggestion");
  const charBubble = (styles.match(/\.call-bubble\.char \{[^}]*\}/) || [""])[0];
  if (!/min-height: max\(var\(--touch-min\), 3lh\)/.test(charBubble))
    throw new Error("the character line lost its three-line reading budget");
  // 6. the preview is presentation only: no telemetry, no new storage key
  if (/sendBeacon|dataLayer\s*\.\s*push|gtag\s*\(/.test(src)) throw new Error("the preview added telemetry");
  const keys = new Set((src.match(/"marzi\.[a-z.]+v\d"/g) || []));
  if (!keys.has('"marzi.settings.v1"') || !keys.has('"marzi.stats.v1"')) throw new Error("a canonical storage key disappeared");
  // 7. the observer is bounded and detaches with the page
  if (!/new ResizeObserver\(publish\)/.test(src)) throw new Error("the staging marker height is not observed");
  if (!/ro\.disconnect\(\)/.test(src)) throw new Error("the staging observer is never disconnected");
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
