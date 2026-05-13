# Demo Deck — Text-Only Plan

> 10 slides, ~10 minutes. Enterprise-customer framing. Each slide has the layout description, the visual elements (drawn as text), and the **READ-ALOUD ENGLISH SCRIPT** (verbatim).
>
> Slides authored as plain text so any tool (Slides, Keynote, PPTX, or even printed cards) can implement. Replace `[BOX]` / `[BADGE]` / `[ARROW]` with shapes when rendering.

---

## Slide 1 — Title

**Layout**: Centered. Big title top, subtitle below, brand color accent bar.

```
                Payments Support Agent
        Trusted answers. No hallucinations. Built-in escalation.

                  [accent bar in Rausch #FF385C]
```

**📖 SAY**:
> *"Today I want to walk you through how a payments support agent earns customer trust at scale. We'll meet a host named Maya, watch three things happen to her in one morning, and at the end I'll show you what makes this different from the chatbots you've seen before."*

---

## Slide 2 — The Cost of Getting Payments Support Wrong

**Layout**: 3 stat cards in a row, each with a big number + descriptor.

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│    70%+      │  │    $4.20     │  │   1 wrong    │
│              │  │              │  │   answer     │
│ of marketplace│  │ avg cost per │  │              │
│ support is   │  │ human-handled│  │ = a dispute, │
│ payment-     │  │ ticket       │  │   a regulator│
│ related      │  │              │  │   letter, or │
│              │  │ Volume × cost│  │   a brand-   │
│ — and rising │  │ = 9-figure   │  │   trust hit  │
│              │  │ opex line    │  │              │
└──────────────┘  └──────────────┘  └──────────────┘
   [red border]    [blue border]     [amber border]
```

**📖 SAY**:
> *"Three numbers worth holding in mind. Payments make up the majority of the support volume at any marketplace at scale. Every ticket has a real cost. And one wrong answer — a hallucinated tax rate, an invented arrival date — can cost more than a thousand right ones in trust and regulatory exposure. So the bar isn't 'mostly correct.' It's 'never invents.'"*

---

## Slide 3 — Meet Maya

**Layout**: Avatar circle (left) + persona text (right), pull-quote band below.

```
   ┌─────┐    Maya · marketplace host
   │  M  │    Runs three short-term rentals. Juggles cleaning crews,
   │     │    mortgage, daycare. Cash flow IS the thing. Checks payouts
   │ [red]│   at 7am on a Tuesday.
   └─────┘
              She is NOT a developer. She doesn't know what an ESCALATE
              policy is. She knows whether she trusts the answer she got.

  ┌──────────────────────────────────────────────────────────────────┐
  │ "I don't care HOW the agent works. I care whether I can trust   │
  │  the number it just gave me — enough to forward it to my        │
  │  accountant."                                                    │
  └──────────────────────────────────────────────────────────────────┘
```

**📖 SAY**:
> *"I'm going to show you the agent through one customer's morning. Her name is Maya. She runs three short-term rentals. She is not a developer — she's the person you're actually building this for. Three things happen to her between 7 and 7:10 in the morning. The same agent handles all three. Watch what she sees, and at the end I'll tell you what I think the differentiated signal is."*

---

## Slide 4 — Scenario 1: "Where's my payout?"

**Layout**: Two chat bubbles (Maya right / Agent left) + ALLOW badge + side callout.

```
                                          ┌──────────────────────────┐
                                          │ Where is my payout       │
                                          │ payout_001?              │ (blue, right)
                                          └──────────────────────────┘
  ┌────────────────────────────────────────┐
  │ Payout payout_001 ($50.00 USD) is      │
  │ processing. You can expect it to       │   (gray, left)
  │ arrive between 2026-05-13 and          │
  │ 2026-05-15.                            │
  └────────────────────────────────────────┘
  [ALLOW] (green badge)

                                  ──→ Why this works:
                                    ✓ Specific window, not "soon"
                                    ✓ Specificity is trust
                                    ✓ No upsell, no marketing
                                    ✓ Short because Maya is in a hurry
```

**📖 SAY**:
> *"First one is the easy case. Maya sees a payout that hasn't landed in her bank yet, and she just wants to know when. Two things I want her to feel here. One — specific window, not 'soon' or 'a few days.' Specificity is trust. Two — no upsell, no marketing, no 'is there anything else?' The agent is short because Maya is in a hurry."*

---

## Slide 5 — Scenario 2: "Why is it less than I expected?"

**Layout**: Chat bubbles + itemized breakdown table.

```
                                  ┌────────────────────────────────────┐
                                  │ Why is payout_002 less than        │
                                  │ I expected?                        │
                                  └────────────────────────────────────┘
  ┌──────────────────────────────────────────────────────────────────┐
  │ Payout payout_002 breakdown:                                     │
  │                                                                  │
  │   Gross:                              USD 100.00                 │
  │   Marketplace service fee (3%):       -USD 3.00                  │
  │   US tax withholding (7%):            -USD 7.00                  │
  │   ─────────────────────────────────────────────                  │
  │   Net:                                USD 90.00                  │
  └──────────────────────────────────────────────────────────────────┘
  [ALLOW] (green badge)

  CALLOUT: Labels — "Marketplace service fee (3%)", "US tax
  withholding (7%)" — came from the system of record, not the model.
```

**📖 SAY**:
> *"Second one. Maya got paid, but it's less than expected. This is the case where a bad agent invents a tax rate. What I'm proud of isn't that the agent itemized the fees. It's that the labels — 'Marketplace service fee 3%', 'US tax withholding 7%' — came from the system of record, not the model. Maya could screenshot this, forward it to her accountant, and not get burned."*

---

## Slide 6 — Scenario 3: "I never got paid" (THE MOMENT)

**Layout**: Chat bubbles + BIG ESCALATE badge + ticket info + trace highlight.

```
                                          ┌────────────────────────────┐
                                          │ I never got paid for       │
                                          │ payout_004.                │
                                          └────────────────────────────┘
  ┌────────────────────────────────────────────────────────────────────┐
  │ I couldn't find payout payout_004 in our records. I've opened     │
  │ ticket TKT-3J8SYM with our tier1_support team — estimated         │
  │ response in 4 minutes. They have the full context of this         │
  │ conversation.                                                      │
  └────────────────────────────────────────────────────────────────────┘
  ┌─────────────────┐
  │    ESCALATE     │  (RED — Rausch #FF385C, BIG)
  └─────────────────┘

  ┌──────────────────── TRACE ───────────────────────────────────────┐
  │  intent:          escalation                                     │
  │  payout_id:       payout_004                                     │
  │  tools_called:    get_payout_status → found: false               │
  │                   escalate_to_human → ticket TKT-3J8SYM          │
  │  policy_decision: ESCALATE  ← refused to compose                 │
  │  confidence:      none                                           │
  └──────────────────────────────────────────────────────────────────┘
```

**📖 SAY**:
> *"Third one. This is the case I care most about. Maya's looking at a stay from last week. She knows the guest checked in, she knows the booking cleared, and there's no payout. She's anxious.*
>
> *[Pause.]*
>
> *Three things to notice. First — the agent said it couldn't find it. That's a refusal. Most support agents in production today would have said 'Let me check on that for you' and either made up a status or hand-waved. This one did neither. Second — there's a ticket number and a team. Maya isn't dropped into the void. Third — the wait estimate is concrete. Four minutes.*
>
> *Now I'll break character. On the right is the trace. Look at the line that says **policy_decision: ESCALATE** — this is the agent refusing to compose a grounded answer. The framework made it impossible for the model to hallucinate something to fill the silence. **That's the work.**"*

---

## Slide 7 — What You DIDN'T See

**Layout**: 3 columns with checkmarks.

```
   ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
   │  ❌ Didn't       │   │  ❌ Didn't       │   │  ❌ Didn't       │
   │     speculate    │   │     hand-wave    │   │     lose the     │
   │                  │   │                  │   │     customer     │
   │  No made-up      │   │  No "let me      │   │                  │
   │  dates. No       │   │  check on that"  │   │  Refusal +       │
   │  guessed fees.   │   │  with no         │   │  ticket + ETA    │
   │  No "I think     │   │  follow-up.      │   │  = path forward, │
   │  your payout     │   │                  │   │  not dead end.   │
   │  might be…"      │   │                  │   │                  │
   └─────────────────┘   └─────────────────┘   └─────────────────┘

      Agent has three modes: ANSWER · ASK · ESCALATE
              "SPECULATE" is not one of them.
```

**📖 SAY**:
> *"I want to close on what's NOT in the demo, because that's where the production-grade signal lives. Maya never saw a made-up date. Maya never saw a guessed fee rate. Maya never saw 'I think your payout might be…'. The agent has three modes — answer, ask, escalate — and 'speculate' is not one of them."*

---

## Slide 8 — How Trust Is Built (Architecture)

**Layout**: Boxes + arrows showing the pipeline.

```
                              [trace events — per turn]
                                         │
                                         ▼
    ┌─ ChatUI ─┐    ┌─────── runAgentTurn ─────────────────────┐
    │ page.tsx │ →  │ 1. classifyIntent       (intent.ts)      │
    └──────────┘    │ 2. buildAnswer          (answer.ts)      │ → Tools
                    │    ├─ get_payout_status                  │   (tools.ts)
                    │    └─ get_payout_breakdown               │
                    │ 3. decidePolicy         (policy.ts)      │
                    │ 4. escalate_to_human    (if ESCALATE)    │
                    │ 5. composeWithLLM       (composer.ts)    │ → OpenAI
                    └──────────────────────────────────────────┘
                                         │
                                         ▼
                          TraceEvent → /api/chat → UI

   FOUR INVARIANTS:
   ① LLM never sees raw tool output (consumes typed PayoutAnswer)
   ② `found: false` ≠ missing field (discriminated unions)
   ③ Policy is a pure function — versionable, rollback-able
   ④ Every turn → stable-schema TraceEvent (eval substrate)
```

**📖 SAY**:
> *"The chat is the surface. The contract between the domain and the model — and the policy gate that decides whether to compose at all — that's the product. Four invariants hold the system together. The LLM never sees raw tool output. `found: false` is structurally distinct from a missing field. Policy is a pure function we can version and roll back. Every turn produces a stable-schema trace that doubles as our eval substrate. **The chat is the easy part.**"*

---

## Slide 9 — What We'd Measure (KPIs)

**Layout**: Comparison table — typical chatbot vs our agent.

```
   ┌───────────────────────────┬──────────────────┬──────────────────┐
   │ Metric                    │ Typical chatbot  │ This agent       │
   ├───────────────────────────┼──────────────────┼──────────────────┤
   │ Hallucination rate        │ 5–15% (modeled)  │ Target: 0        │
   │ Safe self-resolution rate │ Not measured     │ Primary KPI      │
   │ Override rate (CS agent)  │ Hidden           │ Tracked per turn │
   │ Repeat-contact rate       │ Hidden           │ Tracked          │
   │ Cost per resolved turn    │ $0.003 (LLM)     │ $0.003 (LLM)     │
   │ Escalation route accuracy │ N/A              │ Tracked          │
   └───────────────────────────┴──────────────────┴──────────────────┘

   PRIMARY KPI: safe self-resolution rate — NOT deflection.
   (Deflection counts users who gave up confused.)
```

**📖 SAY**:
> *"The metric I'd optimize is safe self-resolution rate, not deflection. Deflection counts users who gave up confused. That's not a win. The hallucination target is zero — and the response-vs-facts diff makes it mechanically checkable: any number, date, or status in the response that's not in the typed answer object is a hallucination by definition."*

---

## Slide 10 — Path to Production (Rollout)

**Layout**: 4-stage timeline with arrows + gates.

```
   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
   │ Shadow   │ → │ Read-    │ → │ Guided   │ → │ Trans-   │
   │ mode     │   │ only     │   │ workflow │   │ actional │
   │          │   │ behind   │   │ (rever-  │   │ actions  │
   │          │   │ flag     │   │ sible)   │   │          │
   └──────────┘   └──────────┘   └──────────┘   └──────────┘
        ▲             ▲              ▲                ▲
        │             │              │                │
       eval         eval           eval            eval bar
       gate         gate           gate            MUST hold

   What I'd build first (in impact order):
   1. Eval harness w/ response-vs-facts diff
   2. Trace persistence + flagging UI
   3. Policy versioning + per-session pinning
   4. Multi-tenant adapter (CustomerAgent interface)
```

**📖 SAY**:
> *"Path to production has four gates, each one with an eval bar. Shadow mode first — agent runs alongside humans, we score it. Then read-only explanations behind a feature flag. Then guided workflows for reversible actions. Transactional actions only after the eval bar holds. The chat is the easy part — the eval, the trace, and the policy gate are where the production work lives. **Trust is built one gate at a time.**"*

---

## Deck principles

- **Customer-framed throughout**: "Maya" is the protagonist, not "the user"
- **No eng vocab in the demo lines**: see kill-list in `MOCK_INTERVIEW.md`
- **Pause on scenario 3**: 2–3 second silence before the trace reveal
- **Two audiences**: chat (end customer) + trace (CS agent / admin) — explicitly named on slide 6
- **Close on what they DIDN'T see**: slide 7 is the punchline, slide 10 is the path

## Rendering as actual slides

Each block above maps to one slide. Layout hints in brackets. Suggested colors:
- Rausch `#FF385C` — brand accent, ESCALATE badge
- Mykonou `#428BFF` — info, ALLOW positive frame
- Foggy `#6A6A6A` — secondary text, descriptors
- Hof `#222222` — primary text
- Light backgrounds: `#FFF7F0` (warm), `#EDF3FF` (cool), `#FFF9EE` (caution)

Font: Airbnb Cereal App (or Inter as fallback). Title 26–32pt bold; body 14–16pt; script footer 11pt.
