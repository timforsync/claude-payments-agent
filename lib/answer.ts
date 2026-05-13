import type {
  PayoutAnswer,
  Intent,
  PayoutId,
  GetPayoutStatusOutput,
  GetPayoutBreakdownOutput,
} from "./types";
import { getPayoutStatus, getPayoutBreakdown } from "./tools";

// ──────────────────────────────────────────────────────────────────────────
// Domain answer layer. Responsibility: take an (intent, payout_id), call the
// right tools, and produce a PayoutAnswer — the *only* surface the LLM sees.
//
// The LLM never receives:
//   - the raw user message (already classified)
//   - raw tool output (typed through this layer)
//   - any field that wasn't explicitly placed in PayoutAnswer.facts
//
// "If it's not in the typed object, it's unknown — never absent."
// ──────────────────────────────────────────────────────────────────────────

export async function buildAnswer(
  intent: Intent,
  payout_id: PayoutId | null
): Promise<{
  facts: PayoutAnswer["facts"];
  raw_tool_calls: Array<{ tool: string; input: unknown; output: unknown; duration_ms: number }>;
}> {
  const tool_calls: Array<{ tool: string; input: unknown; output: unknown; duration_ms: number }> = [];

  if (!payout_id) {
    // No payout_id extracted — escalate with no facts. The intent classifier
    // already ran; if the user said "where's my money?" with no id, the agent
    // should ask or escalate, not guess.
    return { facts: { kind: "none" }, raw_tool_calls: tool_calls };
  }

  if (intent === "status" || intent === "escalation" || intent === "unknown") {
    const t0 = Date.now();
    const status = await getPayoutStatus({ payout_id });
    tool_calls.push({
      tool: "get_payout_status",
      input: { payout_id },
      output: status,
      duration_ms: Date.now() - t0,
    });
    if (!status.found) {
      return { facts: { kind: "missing", payout_id }, raw_tool_calls: tool_calls };
    }
    return { facts: { kind: "status", data: status }, raw_tool_calls: tool_calls };
  }

  if (intent === "breakdown") {
    const t0 = Date.now();
    const breakdown = await getPayoutBreakdown({ payout_id });
    tool_calls.push({
      tool: "get_payout_breakdown",
      input: { payout_id },
      output: breakdown,
      duration_ms: Date.now() - t0,
    });
    if (!breakdown.found) {
      return { facts: { kind: "missing", payout_id }, raw_tool_calls: tool_calls };
    }
    return { facts: { kind: "breakdown", data: breakdown }, raw_tool_calls: tool_calls };
  }

  return { facts: { kind: "none" }, raw_tool_calls: tool_calls };
}

export function confidenceFromFacts(facts: PayoutAnswer["facts"]): PayoutAnswer["confidence"] {
  if (facts.kind === "none") return "none";
  if (facts.kind === "missing") return "none";
  return "high";
}

// Helpers used by the template composer. Pure formatters — no opinion baked in.
export function formatMoney(micros: number, currency: string): string {
  const major = micros / 1_000_000;
  const sign = major < 0 ? "-" : "";
  return `${sign}${currency} ${Math.abs(major).toFixed(2)}`;
}
