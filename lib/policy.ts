import type { PayoutAnswer, PolicyDecision, Intent } from "./types";

// ──────────────────────────────────────────────────────────────────────────
// Policy gate. This is intentionally a pure function: (intent, facts) → decision.
// Properties we hold:
//   - INTENT-AWARE, not just status-aware. A held payout can still answer a
//     breakdown query — the held funds are knowable. So we don't blanket-escalate
//     on `on_hold`; we escalate when the held status is *the answer the user
//     is asking for*.
//   - NEVER speculates. `facts.kind === "missing"` always escalates. `kind: "none"`
//     (no facts retrieved) always escalates.
//   - Versionable. In production this function is the unit of rollout. New
//     policy version = new file, A/B'd behind a flag, eval-gated.
// ──────────────────────────────────────────────────────────────────────────

export function decidePolicy(
  intent: Intent,
  facts: PayoutAnswer["facts"]
): { decision: PolicyDecision; reason: string } {
  // No facts means the agent could not retrieve grounded data. Never compose.
  if (facts.kind === "none") {
    return { decision: "ESCALATE", reason: "no_facts_retrieved" };
  }

  // Missing record. The data layer authoritatively said the payout does not
  // exist. We do not speculate "maybe it's still being created" — that's the
  // exact hallucination class this gate exists to prevent.
  if (facts.kind === "missing") {
    return { decision: "ESCALATE", reason: "missing_record" };
  }

  // Status intent on a payout that's on hold or failed: the answer is the
  // hold/failure itself, but we want a confirmation step because the next
  // user action is usually "what do I do" — which is escalation territory.
  if (intent === "status" && facts.kind === "status") {
    if (facts.data.status === "on_hold") {
      return { decision: "REQUIRE_CONFIRM", reason: "on_hold_explanation_needed" };
    }
    if (facts.data.status === "failed") {
      return { decision: "ESCALATE", reason: "bank_rejection" };
    }
    return { decision: "ALLOW", reason: "status_known" };
  }

  // Breakdown intent: as long as we have a record, we can show the breakdown
  // even if the payout is held (the funds are knowable even if not disbursed).
  if (intent === "breakdown" && facts.kind === "breakdown") {
    return { decision: "ALLOW", reason: "breakdown_grounded" };
  }

  // User explicitly asked for a human, or the intent is unknown after
  // classification — escalate rather than guess.
  if (intent === "escalation" || intent === "unknown") {
    return { decision: "ESCALATE", reason: "user_requested_or_unknown" };
  }

  // Fallback: facts don't match the intent shape (shouldn't happen with a
  // correctly wired agent loop, but the gate refuses to compose if so).
  return { decision: "ESCALATE", reason: "intent_facts_mismatch" };
}
