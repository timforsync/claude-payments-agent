# Payments Support Agent

> **A 2-hour AI-native build round project.** Domain-grounded, tool-augmented, policy-gated, traceable.
>
> Built as preparation for Sierra's AI-Native Interview (Round 4). The prompt was open: *"Build an AI agent for a use case you care about. Something with tool use, where correctness matters."*

## What this is

A small payments-support agent that handles three scenarios end-to-end:

1. **"Where's my payout?"** — happy path. Specific arrival window, grounded in the system of record.
2. **"Why is it less than I expected?"** — itemized breakdown of fees and tax withholding. Labels come from the typed tool output, not the model.
3. **"I never got paid for payout X"** — the differentiated case. When the record is missing, the agent **refuses to compose** and escalates with full context. **The agent is willing not to answer.**

A trace panel renders every turn's reasoning live: classified intent, tool calls, policy decision, composer mode, and the response. Same schema we'd persist in production for eval and replay.

## Why it's interesting

Four invariants the system holds:

| # | Invariant | Where it lives |
|---|---|---|
| 1 | **The LLM never sees raw tool output.** It consumes a typed `PayoutAnswer` only. | [lib/types.ts:79-93](lib/types.ts) |
| 2 | **`found: false` ≠ missing field.** Every tool returns a discriminated union. | [lib/types.ts:23-34](lib/types.ts) |
| 3 | **Policy is a pure function** `(intent, facts) → decision`. Versionable. | [lib/policy.ts:14-58](lib/policy.ts) |
| 4 | **Every turn produces a stable-schema `TraceEvent`.** No transformation needed for production persistence. | [lib/types.ts:122-138](lib/types.ts) |

The policy gate is **intent-aware** rather than status-aware. `on_hold` does not blanket-escalate — a host asking for a breakdown on a held payout should still see the breakdown, because the funds are knowable even if not disbursed. See [lib/policy.ts:38-50](lib/policy.ts).

## Architecture

```
                                trace events (one per turn)
                                          │
                                          ▼
   ┌─ ChatUI ─┐   ┌─────── runAgentTurn ────────────────┐
   │ page.tsx │→ │ 1. classifyIntent   (intent.ts)     │
   └──────────┘  │ 2. buildAnswer      (answer.ts)     │ → Tools
                 │    ├─ get_payout_status              │   (tools.ts)
                 │    └─ get_payout_breakdown           │   ↓
                 │ 3. decidePolicy     (policy.ts)     │   mock-data.ts
                 │ 4. escalate_to_human (if ESCALATE)  │
                 │ 5. composeWithLLM   (composer.ts)   │ → OpenAI
                 └──────────────────────────────────────┘
                                          │
                                          ▼
                              TraceEvent → /api/chat → UI
```

## Running it

```bash
npm install
npm run dev
```

Open http://localhost:3000. The five suggested prompts on the empty state exercise all branches of the policy gate. Click any chat bubble to inspect that turn's trace on the right.

**Optional LLM mode** — create `.env.local` with `OPENAI_API_KEY=sk-…` and restart. Without it, the composer falls back to a deterministic template (the demo runs either way).

## Documentation

- [docs/MOCK_INTERVIEW.md](docs/MOCK_INTERVIEW.md) — Bilingual (中英) Sierra-round prep pack: setup-hour dialogue, build-hour plan, architecture walkthrough, customer-framed demo script, Q&A handles, anti-patterns, strong-signal rubric.

## File map

| File | Role |
|---|---|
| [lib/types.ts](lib/types.ts) | All types — tool contracts, PayoutAnswer, TraceEvent |
| [lib/intent.ts](lib/intent.ts) | Keyword intent classifier (deliberately rule-based) |
| [lib/tools.ts](lib/tools.ts) | 3 tool implementations over discriminated unions |
| [lib/mock-data.ts](lib/mock-data.ts) | 5 fake payouts (one intentionally absent) |
| [lib/answer.ts](lib/answer.ts) | Domain answer layer — the LLM firewall |
| [lib/policy.ts](lib/policy.ts) | Pure-function policy gate (intent-aware) |
| [lib/composer.ts](lib/composer.ts) | Single LLM call + deterministic template fallback |
| [lib/agent.ts](lib/agent.ts) | 5-step agent loop, writes the trace |
| [app/api/chat/route.ts](app/api/chat/route.ts) | POST `/api/chat` |
| [app/page.tsx](app/page.tsx) | Two-pane UI: chat left, trace right |

## What was cut, named

- Auth, persistence, multi-tenant routing
- Real eval harness, real rollout machinery
- Session tracking (needed for policy-version pinning during in-flight rollouts)
- LLM-based intent router (keyword classifier stands in)

## What's next, in impact order

1. **Eval harness with response-vs-facts diff.** Any number/date/status in the response not in `PayoutAnswer.facts` is a hallucination, by definition. Mechanical, cheap, catches what the type system can't.
2. **Trace persistence + flagging UI.** Support agents flag traces that look right but are subtly wrong; flags become regression cases.
3. **Policy versioning + per-session pinning** — so a rollout never reaches an in-flight conversation.
4. **Multi-tenant adapter.** A `CustomerAgent` interface; each customer ships a package with intents, tools, policy branches, prompt, and eval set. Platform owns loop, trace schema, eval harness, rollout flags.
5. **Confirmation flow** — wire `REQUIRE_CONFIRM` to a deterministic confirm/escalate handoff instead of a polite question to the user.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind · OpenAI SDK (`gpt-4o-mini`, optional)
