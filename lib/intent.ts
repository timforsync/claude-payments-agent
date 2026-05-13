import type { Intent, PayoutId } from "./types";

// Deterministic keyword classifier. We could swap an LLM here, but for the
// prototype this is intentionally rule-based:
//   - debuggable (every classification is explainable from the input)
//   - free (no token spend on a step that doesn't need it)
//   - eval-friendly (golden-set inputs map to deterministic intents)
//
// In production we'd evaluate this against an LLM classifier on grounded
// correctness and prefer whichever has the lower error rate at the routing
// boundary. Routing errors are the costliest class — they leak ungated
// queries into the wrong tool path.

const STATUS_TERMS = ["where", "status", "when", "arrive", "received", "pending", "show up"];
const BREAKDOWN_TERMS = ["less", "lower", "expected", "fee", "deduction", "tax", "why", "breakdown", "missing money"];
const ESCALATION_TERMS = ["never got", "didn't get", "did not get", "wasn't paid", "was not paid", "agent", "human", "support"];

const PAYOUT_ID_RE = /payout_[0-9]{3,}/i;

export function classifyIntent(message: string): { intent: Intent; payout_id: PayoutId | null } {
  const lower = message.toLowerCase();
  const id_match = message.match(PAYOUT_ID_RE);
  const payout_id = id_match ? id_match[0].toLowerCase() : null;

  // Order matters: escalation phrases dominate when present.
  if (ESCALATION_TERMS.some((t) => lower.includes(t))) {
    return { intent: "escalation", payout_id };
  }
  if (BREAKDOWN_TERMS.some((t) => lower.includes(t))) {
    return { intent: "breakdown", payout_id };
  }
  if (STATUS_TERMS.some((t) => lower.includes(t))) {
    return { intent: "status", payout_id };
  }
  return { intent: "unknown", payout_id };
}
