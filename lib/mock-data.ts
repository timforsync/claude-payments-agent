import type { PayoutId, PayoutStatus, Deduction, HoldReasonCode } from "./types";

// Production analog: this would be a payouts read-replica query, not in-memory.
// The shape of the record below intentionally mirrors what such a row carries
// so the tool layer doesn't have to translate.
type PayoutRecord = {
  payout_id: PayoutId;
  status: PayoutStatus;
  gross_micros: number;
  currency: string;
  expected_arrival_window?: { from: string; to: string };
  hold_reason_code?: HoldReasonCode;
  error_code?: string;
  last_event_ts: string;
  deductions?: Deduction[];
};

export const MOCK_PAYOUTS: Record<string, PayoutRecord> = {
  // Scenario 1 — Happy path: in-flight payout, ETA known
  payout_001: {
    payout_id: "payout_001",
    status: "processing",
    gross_micros: 50_000_000,
    currency: "USD",
    expected_arrival_window: { from: "2026-05-13", to: "2026-05-15" },
    last_event_ts: "2026-05-11T18:22:00Z",
  },

  // Scenario 2 — "Less than expected": paid, but with fees + tax withholding
  payout_002: {
    payout_id: "payout_002",
    status: "paid",
    gross_micros: 100_000_000,
    currency: "USD",
    last_event_ts: "2026-05-10T09:14:00Z",
    deductions: [
      { type: "service_fee", amount_micros: -3_000_000, label: "Marketplace service fee (3%)" },
      { type: "tax_withholding", amount_micros: -7_000_000, label: "US tax withholding (7%)" },
    ],
  },

  // Bonus: compliance hold — exercises the hold-aware policy branch
  payout_003: {
    payout_id: "payout_003",
    status: "on_hold",
    gross_micros: 200_000_000,
    currency: "USD",
    hold_reason_code: "COMPLIANCE_REVIEW",
    last_event_ts: "2026-05-09T14:00:00Z",
  },

  // Bonus: bank rejection — exercises the failure branch
  payout_005: {
    payout_id: "payout_005",
    status: "failed",
    gross_micros: 75_000_000,
    currency: "USD",
    error_code: "BANK_REJECTION",
    last_event_ts: "2026-05-08T22:11:00Z",
  },

  // Scenario 3 — payout_004 is intentionally absent below. It is the
  // missing-record case that drives the escalation demo.
};

export function lookupPayout(payout_id: string): PayoutRecord | undefined {
  return MOCK_PAYOUTS[payout_id];
}
