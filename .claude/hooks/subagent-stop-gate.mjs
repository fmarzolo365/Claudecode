#!/usr/bin/env node
/* MARZI Engineering OS V3.2 - SubagentStop evidence-completeness gate.
   Enforces that specialist agents end with their required terminal
   markers. This checks evidence COMPLETENESS only, never semantic
   correctness (string presence cannot approve engineering work - the
   coordinator and release auditor own that). Lenient by design: if the
   hook input lacks the fields needed to judge, it allows the stop, and it
   always allows when stop_hook_active is set (no infinite loops). */
import { readFileSync } from "node:fs";

let input = {};
try { input = JSON.parse(readFileSync(0, "utf8")); } catch (e) { process.exit(0); }
if (input.stop_hook_active) process.exit(0);

const agent = String(input.agent_type || input.agentType || "").toLowerCase();
const text = String(input.last_assistant_message || input.lastAssistantMessage || input.final_message || "");
if (!agent || !text) process.exit(0); // cannot judge -> do not loop

const REQUIRED = {
  "marzi-architect": [["ARCHITECT_CONTRACT_COMPLETE", "ARCHITECT_BLOCKED", "PRODUCT_DECISION_REQUIRED"]],
  "marzi-test-red-team": [["RED_PROOF_AVAILABLE", "RED_TEAM_BASELINE_MISMATCH"], ["BASELINE"]],
  "marzi-implementer": [["red", "RED"], ["green", "GREEN"], ["gate", "GATE"]],
  "marzi-release-auditor": [["READY FOR EXTERNAL REVIEW", "CHANGES REQUIRED"]],
};
const groups = REQUIRED[agent];
if (!groups) process.exit(0);
const missing = groups.filter((alts) => !alts.some((m) => text.includes(m)));
if (missing.length) {
  process.stderr.write(
    "MARZI subagent-stop gate: report incomplete for " + agent +
    " - missing marker group(s): " + missing.map((g) => g.join("|")).join("; ") +
    ". Finish the report with the required evidence/terminal markers.\n");
  process.exit(2);
}
process.exit(0);
