import type { PayoutAnswer } from "./types";
import { formatMoney } from "./answer";

// ──────────────────────────────────────────────────────────────────────────
// Composer. Single LLM call per turn, consuming a typed PayoutAnswer. If no
// API key is set, falls back to a deterministic template composer so the
// demo still runs. The fallback uses the same PayoutAnswer object the LLM
// would have — proving the contract is what carries the product, not the LLM.
// ──────────────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a marketplace payments support agent.

You MUST follow these rules without exception:
1. You will receive a PayoutAnswer JSON object. This is the ONLY source of truth.
2. Do NOT invent any number, date, status, or fee not present in the object.
3. If policy_decision is ESCALATE, do not attempt to answer the user's question.
   Briefly explain the agent has handed off, mention the ticket id and route,
   and stop. Do not speculate about what the resolution might be.
4. If policy_decision is REQUIRE_CONFIRM, state the known fact and ask the user
   if they would like you to escalate for next steps.
5. If policy_decision is ALLOW, answer the user's question grounded in facts only.
   Format money as "$X.XX USD". Be concise: 2-4 sentences.
6. Never apologize generically. If something went wrong, state what.`;

export async function composeWithLLM(
  user_message: string,
  answer: PayoutAnswer
): Promise<{ text: string; mode: "llm" | "template" }> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { text: templateCompose(answer), mode: "template" };
  }
  try {
    const { default: OpenAI } = await import("openai");
    const client = new OpenAI({ apiKey });
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `User asked: "${user_message}"\n\nPayoutAnswer:\n${JSON.stringify(answer, null, 2)}`,
        },
      ],
    });
    const text = completion.choices[0]?.message?.content?.trim() ?? templateCompose(answer);
    return { text, mode: "llm" };
  } catch (err) {
    console.error("LLM compose failed, falling back to template:", err);
    return { text: templateCompose(answer), mode: "template" };
  }
}

// ──────────────────────────────────────────────────────────────────────────
// Deterministic template composer. Consumes the same PayoutAnswer the LLM
// would. Useful for: offline demo, eval baseline, regression testing.
// ──────────────────────────────────────────────────────────────────────────

export function templateCompose(answer: PayoutAnswer): string {
  if (answer.policy_decision === "ESCALATE") {
    if (answer.facts.kind === "missing") {
      return `I couldn't find payout ${answer.facts.payout_id} in our records. I've opened ticket ${answer.escalation?.ticket_id} with our ${answer.escalation?.route} team — estimated response in ${answer.escalation?.estimated_wait_minutes} minutes. They have the full context of this conversation.`;
    }
    if (answer.facts.kind === "status" && answer.facts.data.status === "failed") {
      return `Payout ${answer.facts.data.payout_id} was rejected by your bank (code ${answer.facts.data.error_code ?? "unknown"}). I've opened ticket ${answer.escalation?.ticket_id} with our ${answer.escalation?.route} team to investigate and reissue if appropriate.`;
    }
    return `I'm handing this off to a human teammate. Ticket ${answer.escalation?.ticket_id} is queued with our ${answer.escalation?.route} team.`;
  }

  if (answer.policy_decision === "REQUIRE_CONFIRM") {
    if (answer.facts.kind === "status" && answer.facts.data.status === "on_hold") {
      return `Payout ${answer.facts.data.payout_id} is currently on hold (reason: ${answer.facts.data.hold_reason_code}). I can connect you with our compliance team for next steps — would you like me to do that?`;
    }
    return `I can answer this but want to confirm the next step with you first.`;
  }

  // ALLOW path
  if (answer.facts.kind === "status") {
    const s = answer.facts.data;
    if (s.status === "processing" && s.expected_arrival_window) {
      return `Payout ${s.payout_id} (${formatMoney(s.gross_micros, s.currency)}) is processing. You can expect it to arrive between ${s.expected_arrival_window.from} and ${s.expected_arrival_window.to}.`;
    }
    if (s.status === "paid") {
      return `Payout ${s.payout_id} (${formatMoney(s.gross_micros, s.currency)}) has been paid as of ${s.last_event_ts}.`;
    }
    return `Payout ${s.payout_id} is currently ${s.status}.`;
  }
  if (answer.facts.kind === "breakdown") {
    const b = answer.facts.data;
    const lines = [
      `Payout ${b.payout_id} breakdown:`,
      `  Gross: ${formatMoney(b.gross_micros, b.currency)}`,
      ...b.deductions.map((d) => `  ${d.label}: ${formatMoney(d.amount_micros, b.currency)}`),
      `  Net: ${formatMoney(b.net_micros, b.currency)}`,
    ];
    return lines.join("\n");
  }
  return "I don't have a grounded answer for that.";
}
