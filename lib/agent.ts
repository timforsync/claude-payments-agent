import type { PayoutAnswer, TraceEvent, EscalateReason } from "./types";
import { classifyIntent } from "./intent";
import { buildAnswer, confidenceFromFacts } from "./answer";
import { decidePolicy } from "./policy";
import { composeWithLLM } from "./composer";
import { escalateToHuman } from "./tools";

// ──────────────────────────────────────────────────────────────────────────
// The agent loop. Five steps. Every step writes into the trace so the entire
// turn is reconstructable for eval and post-hoc review.
//
//   1. Classify intent + extract payout_id
//   2. Build PayoutAnswer (domain answer layer calls tools)
//   3. Run policy gate
//   4. If ESCALATE → call escalate_to_human tool, attach output to answer
//   5. Compose response from the typed PayoutAnswer
// ──────────────────────────────────────────────────────────────────────────

export async function runAgentTurn(user_message: string): Promise<TraceEvent> {
  const turn_id = `t_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
  const ts = new Date().toISOString();

  // Step 1: intent + entity extraction
  const { intent, payout_id } = classifyIntent(user_message);

  // Step 2: build typed answer (this is where tools run)
  const { facts, raw_tool_calls } = await buildAnswer(intent, payout_id);

  // Step 3: policy gate
  const { decision, reason: policy_reason } = decidePolicy(intent, facts);

  // Step 4: escalate if policy says so
  let escalation: PayoutAnswer["escalation"];
  if (decision === "ESCALATE") {
    const escalate_reason: EscalateReason =
      facts.kind === "missing"
        ? "missing_record"
        : facts.kind === "status" && facts.data.status === "failed"
          ? "bank_rejection"
          : intent === "escalation"
            ? "user_requested"
            : "low_confidence";

    const t0 = Date.now();
    escalation = await escalateToHuman({
      reason: escalate_reason,
      intent,
      structured_context: {
        user_message,
        payout_id,
        policy_reason,
        facts,
      },
    });
    raw_tool_calls.push({
      tool: "escalate_to_human",
      input: { reason: escalate_reason, intent },
      output: escalation,
      duration_ms: Date.now() - t0,
    });
  }

  // Assemble the typed answer the composer will consume
  const answer: PayoutAnswer = {
    intent,
    payout_id,
    facts,
    confidence: confidenceFromFacts(facts),
    policy_decision: decision,
    escalation,
  };

  // Step 5: compose response (LLM with template fallback)
  const { text: response, mode: composer_mode } = await composeWithLLM(user_message, answer);

  const trace: TraceEvent = {
    turn_id,
    ts,
    user_message,
    intent,
    payout_id,
    tool_calls: raw_tool_calls,
    policy_decision: decision,
    confidence: answer.confidence,
    composer_mode,
    response,
    escalation,
  };

  return trace;
}
