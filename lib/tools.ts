import type {
  GetPayoutStatusInput,
  GetPayoutStatusOutput,
  GetPayoutBreakdownInput,
  GetPayoutBreakdownOutput,
  EscalateToHumanInput,
  EscalateToHumanOutput,
  EscalateRoute,
} from "./types";
import { lookupPayout } from "./mock-data";

// Each tool returns a discriminated union. `found: false` is structurally
// distinct from any successful result — so the agent layer cannot accidentally
// destructure missing fields and produce a confident-but-wrong answer.

export async function getPayoutStatus(
  input: GetPayoutStatusInput
): Promise<GetPayoutStatusOutput> {
  const record = lookupPayout(input.payout_id);
  if (!record) {
    return { found: false, payout_id: input.payout_id };
  }
  return {
    found: true,
    payout_id: record.payout_id,
    status: record.status,
    gross_micros: record.gross_micros,
    currency: record.currency,
    expected_arrival_window: record.expected_arrival_window,
    hold_reason_code: record.hold_reason_code,
    error_code: record.error_code,
    last_event_ts: record.last_event_ts,
  };
}

export async function getPayoutBreakdown(
  input: GetPayoutBreakdownInput
): Promise<GetPayoutBreakdownOutput> {
  const record = lookupPayout(input.payout_id);
  if (!record) {
    return { found: false, payout_id: input.payout_id };
  }
  const deductions = record.deductions ?? [];
  const deductionsSum = deductions.reduce((acc, d) => acc + d.amount_micros, 0);
  const net_micros = record.gross_micros + deductionsSum; // deductions are negative
  return {
    found: true,
    payout_id: record.payout_id,
    gross_micros: record.gross_micros,
    deductions,
    net_micros,
    currency: record.currency,
  };
}

// Route is determined by escalation reason. In production this lookup would
// live in policy config, not hardcoded — but the contract shape is the same.
const ROUTE_BY_REASON: Record<EscalateToHumanInput["reason"], EscalateRoute> = {
  missing_record: "tier1_support",
  low_confidence: "tier1_support",
  compliance_hold: "compliance",
  bank_rejection: "payments_ops",
  user_requested: "tier1_support",
};

const WAIT_BY_ROUTE: Record<EscalateRoute, number> = {
  tier1_support: 4,
  payments_ops: 12,
  compliance: 30,
};

export async function escalateToHuman(
  input: EscalateToHumanInput
): Promise<EscalateToHumanOutput> {
  const route = ROUTE_BY_REASON[input.reason];
  // Deterministic-ish ticket id so the demo is reproducible.
  const ticket_id = `TKT-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  return {
    ticket_id,
    route,
    estimated_wait_minutes: WAIT_BY_ROUTE[route],
  };
}
