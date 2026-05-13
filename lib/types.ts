// ──────────────────────────────────────────────────────────────────────────
// Tool contracts. Discriminated unions everywhere — `found: false` is NEVER
// conflated with "tool failed" or "field missing". This is the single biggest
// hallucination prevention pattern: if it's not in the typed object, it's
// unknown, not absent.
// ──────────────────────────────────────────────────────────────────────────

export type PayoutId = string;

export type PayoutStatus = "processing" | "paid" | "on_hold" | "failed";

export type HoldReasonCode = "COMPLIANCE_REVIEW" | "BANK_VERIFICATION" | "TAX_FORM_MISSING";

export type GetPayoutStatusInput = { payout_id: PayoutId };

export type GetPayoutStatusOutput =
  | { found: false; payout_id: PayoutId }
  | {
      found: true;
      payout_id: PayoutId;
      status: PayoutStatus;
      gross_micros: number;
      currency: string;
      expected_arrival_window?: { from: string; to: string };
      hold_reason_code?: HoldReasonCode;
      error_code?: string;
      last_event_ts: string;
    };

export type Deduction = {
  type: "service_fee" | "tax_withholding" | "adjustment" | "chargeback";
  amount_micros: number; // negative
  label: string;
};

export type GetPayoutBreakdownInput = { payout_id: PayoutId };

export type GetPayoutBreakdownOutput =
  | { found: false; payout_id: PayoutId }
  | {
      found: true;
      payout_id: PayoutId;
      gross_micros: number;
      deductions: Deduction[];
      net_micros: number;
      currency: string;
    };

export type EscalateReason =
  | "missing_record"
  | "low_confidence"
  | "compliance_hold"
  | "bank_rejection"
  | "user_requested";

export type EscalateRoute = "tier1_support" | "payments_ops" | "compliance";

export type EscalateToHumanInput = {
  reason: EscalateReason;
  intent: string;
  structured_context: Record<string, unknown>;
};

export type EscalateToHumanOutput = {
  ticket_id: string;
  route: EscalateRoute;
  estimated_wait_minutes: number;
};

// ──────────────────────────────────────────────────────────────────────────
// PayoutAnswer is the *product surface*. It is the ONLY thing the LLM ever
// consumes. The LLM never sees raw tool output, raw DB rows, or user input
// without it passing through this layer first.
// ──────────────────────────────────────────────────────────────────────────

export type Intent = "status" | "breakdown" | "escalation" | "unknown";

export type Confidence = "high" | "low" | "none";

export type PolicyDecision = "ALLOW" | "REQUIRE_CONFIRM" | "ESCALATE";

export type PayoutAnswer = {
  intent: Intent;
  payout_id: PayoutId | null;
  facts:
    | { kind: "status"; data: Extract<GetPayoutStatusOutput, { found: true }> }
    | { kind: "breakdown"; data: Extract<GetPayoutBreakdownOutput, { found: true }> }
    | { kind: "missing"; payout_id: PayoutId }
    | { kind: "none" };
  confidence: Confidence;
  policy_decision: PolicyDecision;
  escalation?: EscalateToHumanOutput;
};

// ──────────────────────────────────────────────────────────────────────────
// Trace event. Every turn writes one of these. Same schema we'd persist in
// production for observability + eval replay.
// ──────────────────────────────────────────────────────────────────────────

export type ToolCallRecord = {
  tool: string;
  input: unknown;
  output: unknown;
  duration_ms: number;
};

export type TraceEvent = {
  turn_id: string;
  ts: string;
  user_message: string;
  intent: Intent;
  payout_id: PayoutId | null;
  tool_calls: ToolCallRecord[];
  policy_decision: PolicyDecision;
  confidence: Confidence;
  composer_mode: "llm" | "template";
  response: string;
  escalation?: EscalateToHumanOutput;
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  trace?: TraceEvent;
};
