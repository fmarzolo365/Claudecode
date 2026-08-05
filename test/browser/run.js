/* Rendered-browser regression suite (Codex R2-TEST-01).
   Drives the real app in a real top-level browser page and measures rendered
   geometry, focus and events. Not part of the Node suite or CI: playwright is
   not a repo dependency (ADR-3), so this skips cleanly when unavailable. */
"use strict";
const BASE = process.env.MARZI_URL || "http://localhost:5173";
const ONLY = process.argv[2] || "all";
const EXEC = process.env.CHROMIUM || "/opt/pw-browsers/chromium";

/* playwright is a DEV tool, never a runtime dependency (ADR-3). Resolve it
   from wherever it happens to live - local, global, or MARZI_PLAYWRIGHT. */
let chromium;
{
  const candidates = [process.env.MARZI_PLAYWRIGHT, "playwright-core", "playwright",
    "/opt/node22/lib/node_modules/playwright-core", "/opt/node22/lib/node_modules/playwright"].filter(Boolean);
  for (const c of candidates) {
    try { ({ chromium } = require(c)); if (chromium) break; } catch (e) { /* try the next */ }
  }
  if (!chromium) {
    console.log("SKIP  no playwright available - see test/browser/README.md");
    process.exit(0);
  }
}

let pass = 0, fail = 0;
const results = [];
const ok = (cond, msg) => { if (cond) pass++; else { fail++; results.push("FAIL  " + msg); } return !!cond; };
const group = (n) => ONLY === "all" || ONLY === n;

/* one strict-JSON turn in the real /api/chat shape */
const TURN = { reply: "Guten Tag! Praxis Dr. Wagner, wie kann ich Ihnen helfen?",
  suggestion: "Ich möchte einen Termin reservieren.", speaker: "first", done: false };
const PNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFElEQVR4AWP8z8Dwn4GBgQnEBgAOEwIB1n1FZQAAAABJRU5ErkJggg==", "base64");
const FAKE_SR = () => { window.SpeechRecognition = function () { this.start = () => {}; this.stop = () => {}; this.abort = () => {}; }; };

async function ctxFor(b, { w, h, lang = "es", portrait = "ok", delay = 700, reduced = false, insets = null, xp = 1600, coins = 1250 }) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true,
    reducedMotion: reduced ? "reduce" : "no-preference" });
  await ctx.route("**/api/avatar/**", (r) => portrait === "ok"
    ? r.fulfill({ status: 200, contentType: "image/png", body: PNG })
    : r.fulfill({ status: 500, body: "" }));
  await ctx.route("**/api/tts**", (r) => r.fulfill({ status: 404, body: "" }));
  await ctx.route("**/api/chat", async (r) => {
    if (delay) await new Promise((res) => setTimeout(res, delay));
    /* MARZI-062: the tapped-word lookup posts a different system prompt and
       expects {"de","tr"}. Answering it with a role-play turn made the real
       translation path fail for a fixture reason rather than an app reason. */
    const post = r.request().postData() || "";
    const body = /dictionary form/.test(post) ? { de: "der Termin", tr: "appointment" } : TURN;
    r.fulfill({ status: 200, contentType: "application/json",
      body: JSON.stringify({ content: [{ type: "text", text: JSON.stringify(body) }] }) });
  });
  await ctx.addInitScript(FAKE_SR);
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(String(e.message)));
  await p.goto(BASE, { waitUntil: "domcontentloaded" });
  await p.evaluate(([lg, x, c]) => {
    localStorage.clear();
    localStorage.setItem("marzi.settings.v1", JSON.stringify({ lang: lg, targetLang: "de", scenario: "arzt", level: "A1", sound: false }));
    localStorage.setItem("marzi.onboarding.v1", JSON.stringify({ version: 1, done: true, goal: "daily", dailyMin: 10 }));
    localStorage.setItem("marzi.stats.v1", JSON.stringify({ days: {}, xp: x, calls: 4, seconds: 300, coins: c }));
  }, [lang, xp, coins]);
  await p.reload({ waitUntil: "domcontentloaded" });
  await p.waitForTimeout(600);
  if (insets) await p.addStyleTag({ content: `:root{--safe-top:${insets[0]}px !important;--safe-bottom:${insets[1]}px !important;}` });
  return { ctx, p, errs };
}
const enterCall = async (p, ms = 1600) => {
  await p.evaluate(() => showTab("talk")); await p.waitForTimeout(200);
  await p.evaluate(() => document.getElementById("callBtn").click());
  await p.waitForTimeout(ms);
};
/* rendered geometry: real boxes, plus any ::after hit region */
const GEO = () => {
  const vw = innerWidth;
  const small = [...document.querySelectorAll('button,[role="button"],a[href]')].filter((e) => {
    const r = e.getBoundingClientRect(); if (!r.width || !r.height) return false;
    const c = getComputedStyle(e); if (c.display === "none" || c.visibility === "hidden") return false;
    const a = getComputedStyle(e, "::after");
    return Math.max(r.height, parseFloat(a.height) || 0) < 47.5
        || Math.max(r.width, parseFloat(a.minWidth) || 0) < 47.5;
  }).map((e) => (e.id || e.className) + ":" + Math.round(e.getBoundingClientRect().width) + "x" + Math.round(e.getBoundingClientRect().height));
  const ids = [...document.querySelectorAll("[id]")].map((e) => e.id);
  return { docSW: document.documentElement.scrollWidth, vw, small,
    dup: [...new Set(ids.filter((v, i) => ids.indexOf(v) !== i))] };
};
/* optional narrowing so a slow group can be run in chunks:
   node test/browser/run.js stages 390 es   */
const ALL_VPS = [[390, 844], [360, 640]];
const VPS = process.argv[3] ? ALL_VPS.filter((v) => String(v[0]) === process.argv[3]) : ALL_VPS;
const LANGS = process.argv[4] ? [process.argv[4]] : ["es", "ar"];

(async () => {
  let b;
  try { b = await chromium.launch({ executablePath: EXEC }); }
  catch (e) { console.log("SKIP  no Chromium at " + EXEC + " - see test/browser/README.md"); process.exit(0); }

  for (const [w, h] of VPS) for (const lang of LANGS) {
    const tag = `${w}x${h}/${lang}`;

    if (group("history")) {
      const { ctx, p, errs } = await ctxFor(b, { w, h, lang, delay: 500 });
      const api = await p.evaluate(() => ({ top: window === window.top, b: typeof history.back,
        ps: typeof history.pushState, rs: typeof history.replaceState }));
      ok(api.top && api.b === "function" && api.ps === "function" && api.rs === "function", `${tag} native History callable`);
      for (const t of ["talk", "store", "talk"]) { await p.evaluate((x) => showTab(x), t); await p.waitForTimeout(180); }
      await enterCall(p, 1400);
      const pre = await p.evaluate(() => history.length);
      await p.evaluate(() => document.getElementById("sheetBtn").click()); await p.waitForTimeout(400);
      const opened = await p.evaluate(() => ({ len: history.length, marker: !!(history.state && history.state.marziSheet) }));
      ok(opened.len === pre + 1 && opened.marker, `${tag} transcript pushes a real history entry`);
      await p.goBack(); await p.waitForTimeout(420);
      const back = await p.evaluate(() => ({ sheet: !document.getElementById("callSheet").classList.contains("hidden"),
        call: getComputedStyle(document.getElementById("call")).display !== "none" }));
      ok(!back.sheet && back.call, `${tag} Back closes transcript first, call stays active`);
      ok(errs.length === 0, `${tag} history group: no page errors ${JSON.stringify(errs.slice(0, 2))}`);
      await ctx.close();
    }

    if (group("async")) {
      const { ctx, p } = await ctxFor(b, { w, h, lang, delay: 1500 });
      await enterCall(p, 2200);
      const first = await p.evaluate(() => document.getElementById("vcSay").textContent);
      ok(first && first.length > 0, `${tag} character line present before the next turn`);
      await p.evaluate(() => { try { send("Ich hätte gern einen Termin."); } catch (e) {} });
      await p.waitForTimeout(500);
      const mid = await p.evaluate(() => ({ st: document.getElementById("callStatus").dataset.state,
        say: document.getElementById("vcSay").textContent,
        hidden: document.getElementById("vcSay").classList.contains("hidden") }));
      ok(mid.st === "processing", `${tag} observed a real processing transition (${mid.st})`);
      ok(!mid.hidden && mid.say === first, `${tag} latest utterance retained through async thinking`);
      await ctx.close();
    }

    if (group("stages")) {
      const XP = { 1: 0, 2: 150, 3: 400, 4: 800, 5: 1500, 6: 2600 };
      for (const st of [1, 2, 3, 4, 5, 6]) {
        const { ctx, p } = await ctxFor(b, { w, h, lang, xp: XP[st], delay: 500 });
        await enterCall(p, 1200);
        const m = await p.evaluate(() => { const e = document.getElementById("vcMarzi");
          const art = e.querySelector(".vc-marzi-art"); const r = art.getBoundingClientRect();
          const cs = getComputedStyle(art);
          return { stage: e.dataset.stage, w: +(r.width / innerWidth * 100).toFixed(1),
            h: +(r.height / innerHeight * 100).toFixed(1), art: !!art.querySelector("svg,img"),
            radius: cs.borderRadius, border: cs.borderTopWidth }; });
        ok(m.stage === String(st), `${tag} stage ${st}: earned stage selected (${m.stage})`);
        ok(m.art, `${tag} stage ${st}: artwork rendered`);
        // R2-APP-01: measure the ARTWORK, and prove no badge/chip treatment.
        // Redesign: the call screen now composes five bands - character card,
        // status, the character's line, Marzi, controls - instead of standing
        // Marzi on a full-bleed portrait. On a tall phone she keeps the full
        // 24% share. On a 640px-tall screen the five bands and a 24% companion
        // do not both fit: header, controls and the conversation alone claim
        // ~300px of ~585px usable. She scales there instead of pushing the
        // controls off-screen, and the floor below keeps her a substantial
        // character - the badge/chip treatment this contract exists to prevent
        // is still refused outright, at every size, by the checks that follow.
        const minH = h >= 700 ? 24 : 18;
        ok(m.w >= 30, `${tag} stage ${st}: artwork width ${m.w}% >= 30%`);
        ok(m.h >= minH, `${tag} stage ${st}: artwork height ${m.h}% >= ${minH}%`);
        ok(parseFloat(m.border) === 0, `${tag} stage ${st}: no badge border (${m.border})`);
        await ctx.close();
      }
    }

    if (group("portrait")) {
      for (const outcome of ["ok", "fail"]) {
        const { ctx, p } = await ctxFor(b, { w, h, lang, portrait: outcome, delay: 500 });
        await enterCall(p, 1600);
        const e = await p.evaluate(() => { const x = document.getElementById("vcEmoji");
          return { disp: getComputedStyle(x).display, role: x.getAttribute("role"),
            label: x.getAttribute("aria-label"), hidden: x.getAttribute("aria-hidden"),
            count: document.querySelectorAll("#call .call-emoji").length,
            portraitOk: document.getElementById("vcImg").classList.contains("ok") }; });
        if (outcome === "ok") ok(e.portraitOk && e.disp === "none" && e.hidden === "true", `${tag} portrait success hides the fallback`);
        else ok(!e.portraitOk && e.disp !== "none" && e.role === "img" && !!e.label && e.hidden === null,
          `${tag} portrait failure announces the fallback`);
        ok(e.count === 1, `${tag} portrait ${outcome}: fallback not duplicated`);
        await ctx.close();
      }
    }

    if (group("overlays")) {
      const { ctx, p } = await ctxFor(b, { w, h, lang, delay: 500 });
      // transcript
      await enterCall(p, 1400);
      await p.evaluate(() => { document.getElementById("sheetBtn").focus(); document.getElementById("sheetBtn").click(); });
      await p.waitForTimeout(400);
      const t1 = await p.evaluate(() => { const d = document.getElementById("callSheet");
        return { role: d.getAttribute("role"), modal: d.getAttribute("aria-modal"),
          named: !!(d.getAttribute("aria-label") || d.getAttribute("aria-labelledby")),
          inside: d.contains(document.activeElement) }; });
      ok(t1.role === "dialog" && t1.modal === "true" && t1.named, `${tag} transcript: named modal dialog`);
      ok(t1.inside, `${tag} transcript: focus enters`);
      // R2-APP-03 containment, both directions
      for (const keys of ["Shift+Tab", "Tab"]) {
        for (let i = 0; i < 12; i++) await p.keyboard.press(keys);
        const held = await p.evaluate(() => document.getElementById("callSheet").contains(document.activeElement));
        ok(held, `${tag} transcript: focus contained under repeated ${keys}`);
      }
      // background = siblings outside the dialog. `main` is an ANCESTOR of the
      // transcript, so it must stay reachable; its other children must not.
      const inert = await p.evaluate(() => {
        const off = (id) => { const e = document.getElementById(id);
          return !!e && (e.hasAttribute("inert") || e.getAttribute("aria-hidden") === "true"); };
        return { learn: off("learn"), nav: off("bottomnav"), bar: off("topbar"),
          mainStays: !document.querySelector("main").hasAttribute("inert"),
          dialogReachable: !document.getElementById("callSheet").hasAttribute("inert") };
      });
      ok(inert.learn && inert.nav && inert.bar, `${tag} transcript: background is inert ${JSON.stringify(inert)}`);
      ok(inert.mainStays && inert.dialogReachable, `${tag} transcript: the dialog itself stays reachable`);
      await p.goBack(); await p.waitForTimeout(400);
      const restored = await p.evaluate(() => ({ id: document.activeElement && document.activeElement.id,
        inertGone: document.querySelectorAll("[data-marzi-inert]").length === 0 }));
      ok(restored.id === "sheetBtn", `${tag} transcript: focus restored to opener (${restored.id})`);
      ok(restored.inertGone, `${tag} transcript: background restored`);
      await p.evaluate(() => { try { endCall(); } catch (e) {} }); await p.waitForTimeout(300);
      // plan / premium / offline
      for (const [open, host, isOpen] of [["openPlanScreen", "planScreen", "planScreenOpen"],
        ["openPremiumScreen", "premScreen", "premiumScreenOpen"], ["showOffline", "offlineScreen", "offlineScreenOpen"]]) {
        await p.evaluate(() => { showTab("learn"); }); await p.waitForTimeout(200);
        await p.evaluate(() => document.getElementById("practiceBtn").focus());
        await p.evaluate((f) => window[f](), open); await p.waitForTimeout(350);
        const d = await p.evaluate((id) => { const el = document.getElementById(id);
          return { role: el.getAttribute("role"), modal: el.getAttribute("aria-modal"),
            name: el.getAttribute("aria-label") || el.getAttribute("aria-labelledby"),
            inside: el.contains(document.activeElement) }; }, host);
        ok(d.role === "dialog" && d.modal === "true", `${tag} ${host}: modal dialog semantics`);
        ok(!!d.name, `${tag} ${host}: has an accessible name (${d.name})`);
        ok(d.inside, `${tag} ${host}: focus enters`);
        for (let i = 0; i < 10; i++) await p.keyboard.press("Shift+Tab");
        ok(await p.evaluate((id) => document.getElementById(id).contains(document.activeElement), host),
          `${tag} ${host}: focus contained under Shift+Tab`);
        for (let i = 0; i < 10; i++) await p.keyboard.press("Tab");
        ok(await p.evaluate((id) => document.getElementById(id).contains(document.activeElement), host),
          `${tag} ${host}: focus contained under Tab`);
        await p.keyboard.press("Escape"); await p.waitForTimeout(320);
        ok(await p.evaluate((f) => !window[f](), isOpen), `${tag} ${host}: Escape dismisses`);
        ok(await p.evaluate(() => document.activeElement && document.activeElement.id) === "practiceBtn",
          `${tag} ${host}: focus restored to opener`);
      }
      await ctx.close();
    }

    if (group("targets")) {
      const { ctx, p } = await ctxFor(b, { w, h, lang, delay: 500 });
      await enterCall(p, 2000);
      // R2-APP-02: the character bubble promises replay - prove it delivers it,
      // once, by mouse and by keyboard
      const replayProbe = () => p.evaluate(() => { window.__spoke = 0;
        const v = ENGINE.get("voice"); const real = v.speak.bind(v);
        v.speak = (a) => { window.__spoke++; return real(a); }; });
      await replayProbe();
      await p.evaluate(() => document.getElementById("vcSay").click()); await p.waitForTimeout(250);
      ok(await p.evaluate(() => window.__spoke) === 1, `${tag} #vcSay click triggers exactly one replay`);
      await p.evaluate(() => { window.__spoke = 0; document.getElementById("vcSay").focus(); });
      await p.keyboard.press("Enter"); await p.waitForTimeout(250);
      ok(await p.evaluate(() => window.__spoke) === 1, `${tag} #vcSay Enter triggers exactly one replay`);
      await p.evaluate(() => { window.__spoke = 0; document.getElementById("vcSay").focus(); });
      await p.keyboard.press("Space"); await p.waitForTimeout(250);
      ok(await p.evaluate(() => window.__spoke) === 1, `${tag} #vcSay Space triggers exactly one replay`);
      // R2-APP-05: transcript controls and words
      await p.evaluate(() => document.getElementById("sheetBtn").click()); await p.waitForTimeout(400);
      const tr = await p.evaluate(() => {
        // rendered controls only - a hidden .mini has no measurable target
        const mini = [...document.querySelectorAll("#callSheet .mini, #log .mini")]
          .filter((e) => e.getBoundingClientRect().width > 0 && getComputedStyle(e).display !== "none")
          .map((e) => { const r = e.getBoundingClientRect(); return { w: +r.width.toFixed(1), h: +r.height.toFixed(1) }; });
        const words = [...document.querySelectorAll("#log .w")].map((e) => {
          const r = e.getBoundingClientRect(); const a = getComputedStyle(e, "::after");
          return { tag: e.tagName, w: Math.max(r.width, parseFloat(a.minWidth) || 0),
            h: Math.max(r.height, parseFloat(a.height) || 0), tabbable: e.tabIndex >= 0 }; });
        return { mini, words };
      });
          ok(tr.mini.length > 0, `${tag} transcript exposes at least one rendered control`);
      ok(tr.mini.every((m) => m.w >= 47.5 && m.h >= 47.5), `${tag} transcript replay >= 48x48 ${JSON.stringify(tr.mini)}`);
      ok(tr.words.every((x) => x.tag === "BUTTON"), `${tag} transcript words are native buttons`);
      ok(tr.words.every((x) => x.tabbable), `${tag} transcript words are keyboard reachable`);
      ok(tr.words.every((x) => x.w >= 47.5 && x.h >= 47.5), `${tag} transcript words have a 48x48 hit region`);
      const g = await p.evaluate(GEO);
      ok(g.small.length === 0, `${tag} no undersized targets ${JSON.stringify(g.small)}`);
      await ctx.close();
    }

    if (group("layout")) {
      for (const reduced of [false, true]) {
        const { ctx, p, errs } = await ctxFor(b, { w, h, lang, reduced, delay: 500 });
        await enterCall(p, 1400);
        const g = await p.evaluate(GEO);
        ok(g.docSW === g.vw, `${tag}${reduced ? "/reduced" : ""} no horizontal overflow (${g.docSW}/${g.vw})`);
        ok(g.dup.length === 0, `${tag}${reduced ? "/reduced" : ""} no duplicate ids ${JSON.stringify(g.dup)}`);
        await p.mouse.wheel(0, 600); await p.mouse.wheel(600, 0); await p.waitForTimeout(120);
        const sc = await p.evaluate(() => ({ x: scrollX, y: scrollY }));
        ok(sc.x === 0 && sc.y === 0, `${tag}${reduced ? "/reduced" : ""} no background scrolling ${JSON.stringify(sc)}`);
        const dir = await p.evaluate(() => document.documentElement.dir);
        ok(dir === (lang === "ar" ? "rtl" : "ltr"), `${tag} document direction ${dir}`);
        if (reduced) {
          const anim = await p.evaluate(() => getComputedStyle(document.getElementById("micBtn")).animationDuration);
          ok(parseFloat(anim) < 0.01, `${tag} reduced motion disables animation (${anim})`);
        }
        ok(errs.length === 0, `${tag}${reduced ? "/reduced" : ""} no page errors ${JSON.stringify(errs.slice(0, 2))}`);
        await ctx.close();
      }
    }


    if (group("r4")) {
      const { ctx, p } = await ctxFor(b, { w, h, lang, delay: 500 });
      await enterCall(p, 2000);
      await p.evaluate(() => document.getElementById("sheetBtn").click());
      await p.waitForTimeout(450);

      // R4-1: adjacent word hit regions must NOT overlap, or a tap near a
      // boundary runs the wrong word's action.
      const words = await p.evaluate(() => [...document.querySelectorAll("#log .w")].map((e, i) => {
        const r = e.getBoundingClientRect(); const a = getComputedStyle(e, "::after");
        const extraW = Math.max(0, (parseFloat(a.minWidth) || 0) - r.width);
        return { i, word: e.dataset.w, left: r.left - extraW / 2, right: r.right + extraW / 2,
          top: r.top, bottom: r.bottom, w: Math.max(r.width, parseFloat(a.minWidth) || 0),
          h: Math.max(r.height, parseFloat(a.height) || 0) };
      }));
      ok(words.length > 1, `${tag} R4-1: transcript exposes multiple tappable words (${words.length})`);
      let overlaps = 0;
      for (let i = 0; i < words.length; i++) for (let j = i + 1; j < words.length; j++) {
        const a = words[i], c = words[j];
        const ox = Math.min(a.right, c.right) - Math.max(a.left, c.left);
        const oy = Math.min(a.bottom, c.bottom) - Math.max(a.top, c.top);
        if (ox > 0.5 && oy > 0.5) overlaps++;
      }
      ok(overlaps === 0, `${tag} R4-1: no overlapping word hit regions (${overlaps} overlapping pairs)`);
      ok(words.every((x) => x.w >= 47.5 && x.h >= 47.5), `${tag} R4-1: words still meet 48x48`);

      // and the tap actually runs the word under the finger
      const hit = await p.evaluate(async () => {
        const list = [...document.querySelectorAll("#log .w")];
        const target = list[Math.min(1, list.length - 1)];
        window.__word = null;
        const r = target.getBoundingClientRect();
        const el = document.elementFromPoint(Math.round(r.left + r.width / 2), Math.round(r.top + r.height / 2));
        return { expected: target.dataset.w, gotEl: el && el.dataset ? el.dataset.w : null,
          same: el === target || target.contains(el) };
      });
      ok(hit.same, `${tag} R4-1: the point over a word resolves to that word (${hit.expected} vs ${hit.gotEl})`);
      await p.evaluate(() => { try { closeCallSheet(); } catch (e) {} });
      await p.evaluate(() => { try { endCall(); } catch (e) {} });
      await p.waitForTimeout(300);

      // R4-2: the exhausted-minutes dialog must contain focus and inert the
      // obscured background, like every other modal.
      await p.evaluate(() => { showTab("learn"); }); await p.waitForTimeout(200);
      await p.evaluate(() => document.getElementById("practiceBtn").focus());
      await p.evaluate(() => showLimit()); await p.waitForTimeout(350);
      const lim = await p.evaluate(() => { const d = document.getElementById("limitBox");
        return { inside: d.contains(document.activeElement),
          role: d.getAttribute("role"), modal: d.getAttribute("aria-modal"),
          named: !!(d.getAttribute("aria-label") || d.getAttribute("aria-labelledby")),
          bgInert: !!document.getElementById("learn").closest("[data-marzi-inert]") }; });
      ok(lim.role === "dialog" && lim.modal === "true" && lim.named, `${tag} R4-2: limit is a named modal dialog`);
      ok(lim.inside, `${tag} R4-2: focus enters the limit dialog`);
      ok(lim.bgInert, `${tag} R4-2: obscured background is inert`);
      for (const keys of ["Shift+Tab", "Tab"]) {
        for (let i = 0; i < 12; i++) await p.keyboard.press(keys);
        ok(await p.evaluate(() => document.getElementById("limitBox").contains(document.activeElement)),
          `${tag} R4-2: focus contained under repeated ${keys}`);
      }

      // R4-3: limit -> plan must not lose the return target. Closing the limit
      // blurs to <body>; the plan screen must inherit the original opener.
      await p.evaluate(() => document.getElementById("limitStore").click());
      await p.waitForTimeout(400);
      const chained = await p.evaluate(() => ({ planOpen: planScreenOpen(), limitOpen: limitOpen(),
        inside: document.getElementById("planScreen").contains(document.activeElement) }));
      ok(chained.planOpen && !chained.limitOpen, `${tag} R4-3: limit hands off to the plan screen`);
      ok(chained.inside, `${tag} R4-3: focus enters the plan screen`);
      await p.keyboard.press("Escape"); await p.waitForTimeout(350);
      const restored = await p.evaluate(() => ({ id: document.activeElement && document.activeElement.id,
        inertGone: document.querySelectorAll("[data-marzi-inert]").length === 0 }));
      ok(restored.id === "practiceBtn", `${tag} R4-3: focus returns to the original opener (${restored.id})`);
      ok(restored.inertGone, `${tag} R4-3: background restored after the chain`);

      // R4A: the return-target guard is load-bearing. Re-opening an already
      // open overlay (double activation) would otherwise capture a control
      // INSIDE the dialog as the return target; that control is hidden on
      // close, so focus is lost. Verified against a mutated build: without the
      // guard this returns "" instead of the opener.
      await p.evaluate(() => { showTab("learn"); }); await p.waitForTimeout(200);
      await p.evaluate(() => document.getElementById("practiceBtn").focus());
      await p.evaluate(() => openPlanScreen()); await p.waitForTimeout(250);
      const insideFirst = await p.evaluate(() =>
        document.getElementById("planScreen").contains(document.activeElement));
      ok(insideFirst, `${tag} R4A: focus is inside the overlay before the second open`);
      await p.evaluate(() => openPlanScreen()); await p.waitForTimeout(250);
      await p.keyboard.press("Escape"); await p.waitForTimeout(320);
      const reentrant = await p.evaluate(() => document.activeElement && document.activeElement.id);
      ok(reentrant === "practiceBtn",
        `${tag} R4A: re-entrant open still restores the original opener (${reentrant || "<lost>"})`);
      await ctx.close();
    }

    if (group("safearea")) {
      const { ctx, p } = await ctxFor(b, { w, h, lang, insets: [44, 34], delay: 500 });
      await enterCall(p, 1500);
      const sa = await p.evaluate(() => {
        const cs = getComputedStyle(document.querySelector(".callscreen"));
        const top = getComputedStyle(document.querySelector(".call-top"));
        const stack = getComputedStyle(document.querySelector(".call-stack"));
        const box = (s) => { const e = document.querySelector(s); const r = e.getBoundingClientRect();
          return { top: Math.round(r.top), bottom: Math.round(r.bottom), left: Math.round(r.left), right: Math.round(r.right) }; };
        const overlap = (a, c) => Math.max(0, Math.min(a.bottom, c.bottom) - Math.max(a.top, c.top))
                               * Math.max(0, Math.min(a.right, c.right) - Math.max(a.left, c.left));
        const marzi = box("#vcMarzi"), say = box("#vcSay");
        return { screenTop: parseFloat(cs.paddingTop), screenBot: parseFloat(cs.paddingBottom),
          innerTop: parseFloat(top.paddingTop), innerBot: parseFloat(stack.paddingBottom),
          idTop: box("#callId").top, stackBottom: box(".call-stack").bottom,
          collide: overlap(marzi, say), vh: innerHeight };
      });
      // exactly one owner: the outer screen reserves the inset, inner chrome does not
      ok(sa.screenTop >= 44, `${tag} non-zero TOP inset applied by .callscreen (${sa.screenTop})`);
      ok(sa.screenBot >= 34, `${tag} non-zero BOTTOM inset applied by .callscreen (${sa.screenBot})`);
      ok(sa.innerTop < 44, `${tag} top inset NOT re-applied by .call-top (${sa.innerTop})`);
      ok(sa.innerBot < 34, `${tag} bottom inset NOT re-applied by .call-stack (${sa.innerBot})`);
      ok(sa.idTop >= 44, `${tag} identity clears the top cutout (${sa.idTop})`);
      ok(sa.stackBottom <= sa.vh - 34, `${tag} controls clear the gesture area (${sa.stackBottom} <= ${sa.vh - 34})`);
      ok(sa.collide === 0, `${tag} Marzi and the character bubble do not overlap (${sa.collide}px2)`);
      await ctx.close();
    }
  }

  if (group("topbar")) {
    const { ctx, p } = await ctxFor(b, { w: 390, h: 800, lang: "es", delay: 300 });
    const rows = [];
    for (const coins of [0, 9, 99, 999, 9999]) {
      await p.evaluate((c) => { const s = JSON.parse(localStorage.getItem("marzi.stats.v1")); s.coins = c;
        localStorage.setItem("marzi.stats.v1", JSON.stringify(s)); }, coins);
      await p.reload({ waitUntil: "domcontentloaded" }); await p.waitForTimeout(280);
      for (const width of [379, 380, 390, 399, 400, 401, 404, 408, 410, 419, 420, 421]) {
        await p.setViewportSize({ width, height: 800 }); await p.waitForTimeout(80);
        await p.evaluate(() => { try { updateTopbar(); } catch (e) {} }); await p.waitForTimeout(50);
        const m = await p.evaluate(() => { const row = document.querySelector(".topbar-in");
          const last = [...row.children].filter((e) => getComputedStyle(e).display !== "none").pop();
          return { rightmost: Math.round(last.getBoundingClientRect().right), vw: innerWidth,
            docSW: document.documentElement.scrollWidth,
            rowSW: row.scrollWidth, rowCW: row.clientWidth,
            label: document.getElementById("tbCoins").getAttribute("aria-label") }; });
        const clean = m.docSW === m.vw && m.rowSW <= m.rowCW && m.rightmost <= m.vw;
        rows.push(`      ${String(width).padStart(3)}px coins=${String(coins).padStart(4)}  rightmost=${m.rightmost}  overflow=${m.docSW - m.vw}`);
        ok(clean, `topbar ${width}px coins=${coins} rightmost=${m.rightmost} overflow=${m.docSW - m.vw}`);
        ok(/\d/.test(String(m.label)), `topbar ${width}px coins=${coins} exact value in aria-label`);
      }
    }
    console.log("   top-bar measured rightmost edge / overflow:");
    rows.forEach((r) => console.log(r));
    await ctx.close();
  }

  /* MARZI-062: the family visual staging preview. Every criterion here is a
     RENDERED measurement — the package's source validator deliberately asserts
     none of it. Runs its own viewport/language/text-scale matrix rather than
     the shared one, because the regression it guards is specific to 200% text
     at a small viewport. */
  if (group("marzi062")) {
    const SCALE = ":root{--text-xs:22px;--text-sm:26px;--text-md:30px;--text-lg:38px;--text-xl:52px;" +
      "--text-f8:16px;--text-f9:18px;--text-f10:20px;--text-f10-5:21px;--text-f11:22px;--text-f11-5:23px;" +
      "--text-f12:24px;--text-f12-5:25px;--text-f13:26px;--text-f13-5:27px;--text-f14:28px;--text-f15-5:31px;" +
      "--text-f16:32px;--text-f17:34px;--text-f18:36px;--text-f20:40px;--text-f21:42px;--text-f24:48px;" +
      "--text-f27:54px;--text-f64:128px}html{font-size:200%}";
    const CASES = [
      { id: "V01", w: 390, h: 844, lang: "en", scale: 1 },
      { id: "V04", w: 390, h: 844, lang: "ar", scale: 1 },
      { id: "V05", w: 320, h: 568, lang: "en", scale: 1 },
      { id: "V06", w: 320, h: 568, lang: "ar", scale: 1 },
      { id: "V07", w: 320, h: 568, lang: "ar", scale: 2 },
      { id: "V08", w: 320, h: 568, lang: "en", scale: 2 },
      { id: "V09", w: 390, h: 844, lang: "en", scale: 2 }
    ];
    for (const c of CASES) {
      const { ctx, p, errs } = await ctxFor(b, { w: c.w, h: c.h, lang: c.lang, delay: 400 });
      if (c.scale === 2) await p.addStyleTag({ content: SCALE });
      await enterCall(p, 1600);
      const m = await p.evaluate(() => {
        const de = document.documentElement;
        const vw = de.clientWidth, vh = de.clientHeight;
        const box = (sel) => {
          const e = document.querySelector(sel);
          if (!e) return null;
          const cs = getComputedStyle(e);
          if (cs.display === "none" || cs.visibility === "hidden" || e.classList.contains("hidden")) return null;
          const r = e.getBoundingClientRect();
          return r.width && r.height ? { x: r.x, y: r.y, right: r.right, bottom: r.bottom } : null;
        };
        const over = (a, z) => {
          if (!a || !z) return 0;
          const w = Math.min(a.right, z.right) - Math.max(a.x, z.x);
          const h = Math.min(a.bottom, z.bottom) - Math.max(a.y, z.y);
          return w > 0 && h > 0 ? Math.round(w * h) : 0;
        };
        /* Obscuring is caused by rendered pixels. #vcMarzi is a transparent,
           pointer-events:none layout container that stretches to its grid row;
           what is actually drawn is the artwork and the stage caption. The
           union of those two is therefore what can obscure anything, and the
           container box is reported alongside it for transparency. */
        const union = (...bs) => { const v = bs.filter(Boolean); if (!v.length) return null;
          return { x: Math.min(...v.map((z) => z.x)), y: Math.min(...v.map((z) => z.y)),
            right: Math.max(...v.map((z) => z.right)), bottom: Math.max(...v.map((z) => z.bottom)) }; };
        const B = { marzi: union(box(".call-marzi .vc-marzi-art"), box(".call-marzi .vc-marzi-cap")),
          id: box("#callId"), state: box("#callStatus"),
          say: box("#vcSay"), ctrl: box("#callControls"), portrait: box(".call-portrait.ok") };
        const marziContainer = box("#vcMarzi");
        /* Where is the character's face? The shell already answers that: the
           portrait is cover-fit at `object-position: 50% 22%` and its emoji
           FALLBACK — the stand-in for the face — is placed at `top: 30%`. The
           face region is therefore the top 30% of the portrait, taken from the
           app's own geometry rather than from a guess. A wider 45% band is
           also measured and reported, but is not the assertion: Marzi standing
           in front of the lower portrait is the established design (MARZI-018
           M-02/M-10), so only the face is protected. */
        const band = (f) => B.portrait ? { x: B.portrait.x, y: B.portrait.y, right: B.portrait.right,
          bottom: B.portrait.y + (B.portrait.bottom - B.portrait.y) * f } : null;
        const face = band(0.30), wideBand = band(0.45);
        /* past the viewport edge is only unreachable when no ancestor can
           scroll to it; inside a scroll container it is reachable */
        const SEL = { marzi: ".call-marzi .vc-marzi-art", id: "#callId", state: "#callStatus", say: "#vcSay",
          ctrl: "#callControls", portrait: ".call-portrait.ok" };
        const reachable = (sel) => {
          let e = document.querySelector(sel);
          while (e && e !== document.body) {
            const cs = getComputedStyle(e);
            if (/auto|scroll/.test(cs.overflowY) && e.scrollHeight > e.clientHeight + 1) return true;
            e = e.parentElement;
          }
          return false;
        };
        const inView = Object.entries(B).filter(([, v]) => v)
          .filter(([, v]) => v.x < -1 || v.y < -1 || v.right > vw + 1 || v.bottom > vh + 1)
          .filter(([k]) => !reachable(SEL[k]))
          .map(([k]) => k);
        const small = [...document.querySelectorAll('button,[role="button"],a[href]')].filter((e) => {
          const cs = getComputedStyle(e);
          if (cs.display === "none" || cs.visibility === "hidden") return false;
          const r = e.getBoundingClientRect();
          if (!r.width || !r.height || r.bottom <= 0 || r.top >= vh) return false;
          const af = getComputedStyle(e, "::after");
          return Math.max(r.height, parseFloat(af.height) || 0) < 47.5
              || Math.max(r.width, parseFloat(af.width) || 0, parseFloat(af.minWidth) || 0) < 47.5;
        }).map((e) => (e.id || e.className) + ":" + Math.round(e.getBoundingClientRect().width) + "x" + Math.round(e.getBoundingClientRect().height));
        /* content past the edge of a box the user can scroll is reachable;
           content past a box that cannot scroll is truncated */
        const truncated = [];
        for (const sel of ["#callId", "#callId .call-id-name", "#callId .call-id-place", "#vcSay"]) {
          const e = document.querySelector(sel);
          if (!e) continue;
          const overY = e.scrollHeight > e.clientHeight + 1, overX = e.scrollWidth > e.clientWidth + 1;
          /* sideways overflow is never acceptable for text that should wrap,
             scrollable or not — a name must never need horizontal scrolling */
          if (overX) { truncated.push(sel + " overflows horizontally"); continue; }
          if (!overY) continue;
          if (!/auto|scroll/.test(getComputedStyle(e).overflowY)) truncated.push(sel + " is vertically clipped");
        }
        /* the suggestion must stay wide enough to read, not a one-word strip */
        const hint = document.getElementById("vcBubble");
        const hintW = hint && !hint.classList.contains("hidden") ? hint.getBoundingClientRect().width : null;
        const bar = document.getElementById("stagingBar");
        return {
          overflow: de.scrollWidth - vw, pageScroll: de.scrollHeight - vh,
          outside: inView, small,
          marziSay: over(B.marzi, B.say), marziId: over(B.marzi, B.id),
          marziCtrl: over(B.marzi, B.ctrl), stateSay: over(B.state, B.say),
          marziFace: over(B.marzi, face), marziUpper45: over(B.marzi, wideBand), truncated,
          marziContainerFace: over(marziContainer, face),
          hintW, vw,
          label: bar ? bar.textContent.trim() : null,
          labelNamed: bar ? !!bar.getAttribute("aria-label") : false,
          labelPointer: bar ? getComputedStyle(bar).pointerEvents : null,
          labelVisible: bar ? bar.getBoundingClientRect().height > 0 && bar.getBoundingClientRect().top < vh : false,
          barCoversCall: over(bar ? bar.getBoundingClientRect() : null, B.ctrl) + over(bar ? bar.getBoundingClientRect() : null, B.id),
          rootFont: getComputedStyle(de).fontSize,
          krank: document.body.innerHTML.includes("Krankschreibung")
        };
      });
      const tagc = `marzi062 ${c.id} ${c.w}x${c.h}/${c.lang}@${c.scale * 100}%`;
      ok(m.overflow <= 1, `${tagc} no horizontal document overflow (${m.overflow})`);
      ok(m.pageScroll <= 1, `${tagc} the page itself does not scroll (${m.pageScroll})`);
      ok(m.outside.length === 0, `${tagc} every critical box is inside the viewport (${m.outside.join(",")})`);
      ok(m.small.length === 0, `${tagc} every visible target is at least 48x48 (${m.small.slice(0, 3).join(", ")})`);
      ok(m.marziSay === 0 && m.marziId === 0 && m.marziCtrl === 0,
        `${tagc} Marzi obscures no critical box (say=${m.marziSay} id=${m.marziId} ctrl=${m.marziCtrl})`);
      ok(m.marziFace === 0, `${tagc} Marzi stays out of the portrait's face region (${m.marziFace})`);
      ok(m.stateSay === 0, `${tagc} the state chip and the character line do not overlap (${m.stateSay})`);
      ok(m.truncated.length === 0, `${tagc} no truncated or sideways-overflowing text (${m.truncated.join("; ")})`);
      ok(m.hintW === null || m.hintW >= Math.min(140, m.vw * 0.34),
        `${tagc} the suggestion keeps a readable width (${m.hintW === null ? "hidden" : Math.round(m.hintW)}px of ${m.vw})`);
      ok(m.label === "MARZI STAGING PREVIEW \u00b7 MARZI-062 \u00b7 BUILD MARZI-062-PREVIEW-1",
        `${tagc} the exact build label is rendered`);
      ok(m.labelVisible && m.labelNamed && m.labelPointer === "none" && m.barCoversCall === 0,
        `${tagc} the build label is visible, named, non-intercepting and covers nothing`);
      ok(errs.length === 0, `${tagc} no page errors ${JSON.stringify(errs.slice(0, 2))}`);
      console.log(`   ${tagc} rootFont=${m.rootFont} overflow=${m.overflow} pageScroll=${m.pageScroll} ` +
        `targets<48=${m.small.length} marzi-art/face30=${m.marziFace} marzi-art/upper45=${m.marziUpper45} ` +
        `(transparent container/face30=${m.marziContainerFace}) krankschreibung=${m.krank}`);
      await ctx.close();
    }

    /* the five conversation states, driven through the real state machine */
    {
      const { ctx, p } = await ctxFor(b, { w: 390, h: 844, lang: "en", delay: 1200 });
      await enterCall(p, 2000);
      await p.evaluate(() => { S.handsFree = false; alertMsg(null); renderCallStatus(); });
      const readState = () => p.evaluate(() => {
        const c = document.getElementById("callStatus");
        return { state: c.dataset.state, text: c.textContent.trim(), icon: !!c.querySelector("svg"),
          live: document.getElementById("callStatusLive").textContent };
      });
      const drive = {
        listening: () => p.evaluate(() => { S.listening = true; renderCallStatus(); }),
        processing: () => p.evaluate(() => { S.listening = false; S.busy = true; renderCallStatus(); }),
        speaking: () => p.evaluate(() => { S.busy = false; S.speaking = true; renderCallStatus(); }),
        error: () => p.evaluate(() => { S.speaking = false; alertMsg("boom"); }),
        disconnected: () => p.evaluate(() => { alertMsg(null); S.session.end(); renderCallStatus(); })
      };
      for (const [want, go] of Object.entries(drive)) {
        await go();
        await p.waitForTimeout(120);
        const m = await readState();
        ok(m.state === want, `marzi062 state ${want} is presented (${m.state})`);
        ok(m.icon && m.text.length > 0, `marzi062 state ${want} has an icon and a text label`);
        ok(m.live === m.text, `marzi062 state ${want} reaches the live region`);
      }
      await ctx.close();
    }

    /* the preserved interaction paths, observed rather than assumed */
    {
      const { ctx, p } = await ctxFor(b, { w: 390, h: 844, lang: "en", delay: 400 });
      await enterCall(p, 1800);
      const r = await p.evaluate(async () => {
        const out = {};
        const voiceCalls = [], slowCalls = [];
        const real = ENGINE.get.bind(ENGINE);
        const patched = Object.create(ENGINE.get("voice"));
        patched.speak = (a) => { voiceCalls.push(a); return Promise.resolve(); };
        ENGINE.get = (k) => (k === "voice" ? patched : real(k));
        out.replay = replayLastCharacterLine() && voiceCalls.length === 1 && !voiceCalls[0].slow;
        ENGINE.get = real;
        const origSpeak = window.speak;
        window.speak = (text, slow) => { slowCalls.push({ text, slow: !!slow }); };
        document.getElementById("repeatBtn").click();
        window.speak = origSpeak;
        out.slow = slowCalls.length === 1 && slowCalls[0].slow === true;
        document.getElementById("sheetBtn").click();
        await new Promise((z) => setTimeout(z, 350));
        const turns = [...document.querySelectorAll("#log .turn")];
        out.turns = turns.length;
        out.charFirst = turns.length > 0 && !turns[0].classList.contains("me");
        out.words = document.querySelectorAll("#log .w").length;
        out.wordIsButton = document.querySelector("#log .w") ? document.querySelector("#log .w").tagName === "BUTTON" : false;
        out.safe = !/<script|onerror=/i.test(document.getElementById("log").innerHTML);
        out.timer = document.getElementById("timer").textContent;
        out.plan = document.getElementById("vcLeft").textContent;
        return out;
      });
      ok(r.replay, "marzi062 replay goes through the existing voice provider, not slow");
      ok(r.slow, "marzi062 slow repeat goes through the existing speak path with slow=true");
      ok(r.turns > 0 && r.charFirst, `marzi062 transcript keeps canonical order, character first (${r.turns} turns)`);
      ok(r.words > 0 && r.wordIsButton, `marzi062 transcript words are real buttons (${r.words})`);
      ok(r.safe, "marzi062 transcript is text-rendered, not injected as HTML");
      ok(/\d\d:\d\d/.test(r.timer), `marzi062 the timer still counts (${r.timer})`);
      ok(/\d/.test(r.plan), `marzi062 the plan allowance is still shown (${r.plan})`);
      /* word tap opens the existing translation path */
      await p.evaluate(() => { const w = document.querySelector("#log .w"); if (w) w.click(); });
      await p.waitForTimeout(700);
      const tapped = await p.evaluate(() => !!document.querySelector("#log .wsave"));
      ok(tapped, "marzi062 tapping a word opens the existing translation behaviour");
      await ctx.close();
    }
  }

  results.forEach((r) => console.log("   " + r));
  console.log(`\n${pass + fail} browser assertions · ${pass} passed · ${fail} failed`);
  await b.close();
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error("ERR " + e.message); process.exit(1); });
