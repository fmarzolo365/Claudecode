/* HARDENING-02 harness trust self-test.
   Proves the suite runner (test/run.js) actually reports failure for every
   escape class - a suite that can go silently green is a production risk.
   Each mode injects exactly one synthetic defect via MARZI_SUITE_SELFTEST.
   Run: node test/harness-selftest.js */
const { spawnSync } = require("child_process");
const path = require("path");

const run = (mode) => spawnSync(process.execPath, [path.join(__dirname, "run.js")], {
  env: { ...process.env, MARZI_SUITE_SELFTEST: mode },
  encoding: "utf8", timeout: 240000,
});

const cases = [
  // a clean run passes AND proves every registered check executed
  ["", (r) => r.status === 0 && /All checks passed \(\d+\/\d+ executed\)\./.test(r.stdout) &&
    /\((\d+)\/(\1) executed\)/.test(r.stdout)],
  // a synchronous throw fails the run
  ["sync-throw", (r) => r.status === 1 && r.stderr.includes("synthetic sync")],
  // a rejected async check fails the run
  ["async-reject", (r) => r.status === 1 && r.stderr.includes("synthetic async")],
  // a rejection ESCAPING a check (un-awaited promise) fails the run
  ["escaped-rejection", (r) => r.status === 1 && r.stderr.includes("synthetic escape")],
  // a hung check must not drain the event loop into a silent green exit
  ["hang", (r) => r.status !== 0 && r.stderr.includes("FATAL")],
];

let bad = 0;
for (const [mode, okFn] of cases) {
  const r = run(mode);
  const label = mode || "clean";
  if (r.error) { bad++; console.error("FAIL  harness " + label + " — " + r.error.message); continue; }
  if (okFn(r)) console.log("  ok  harness " + label);
  else {
    bad++;
    console.error("FAIL  harness " + label + " — exit " + r.status);
    console.error((r.stderr || "").split("\n").slice(-4).join("\n"));
  }
}
if (bad) { console.error("\n" + bad + " harness self-test(s) failed"); process.exit(1); }
console.log("\nHarness self-test passed.");
