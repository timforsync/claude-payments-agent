# Sierra AI Build Round — Mock Interview Bilingual Pack

> Sierra AI 原生面试 (AI-Native Interview) 第 4 轮的完整 mock 资料。
> Complete mock-interview pack for Sierra's AI-Native Interview (Round 4).
>
> **Context / 背景**: Sierra 的 4 小时差异化面试 — 1hr ideation + 2hr build + 1hr walkthrough/review.
> This is the 4-hour differentiated round at Sierra — 1hr ideation, 2hr build, 1hr walkthrough/review.
>
> **Project / 项目**: Payments Support Agent — domain-grounded, tool-augmented, policy-gated, traceable.
>
> **Date / 日期**: 2026-05-13

---

## Table of Contents / 目录

1. [Round overview / 轮次结构](#1-round-overview--轮次结构)
2. [Setup-hour mock dialogue / Setup Hour 对话](#2-setup-hour-mock-dialogue--setup-hour-对话)
3. [Build-hour plan / Build Hour 计划](#3-build-hour-plan--build-hour-计划)
4. [Architecture walkthrough / 架构讲解](#4-architecture-walkthrough--架构讲解)
5. [Customer-framed demo script / 面向客户的 Demo 脚本](#5-customer-framed-demo-script--面向客户的-demo-脚本)
6. [Q&A handling / Q&A 应对](#6-qa-handling--qa-应对)
7. [Strong-signal rubric / 强信号 Rubric](#7-strong-signal-rubric--强信号-rubric)
8. [Anti-patterns / 反模式](#8-anti-patterns--反模式)

---

## 1. Round overview / 轮次结构

### English

The AI-Native Interview is Sierra's differentiator round. Per Sierra's official blog and recruiter intel:

| Phase | Duration | Format | What Sierra is testing |
|---|---|---|---|
| Setup | 60 min | With engineer | Scope framing, tradeoff articulation, drive |
| Build | 2 hr | Alone, AI tools allowed | Tool use, depth-over-breadth, technical craft |
| Demo | 10 min | Engineer returns | Customer journey, working software |
| Review | 45 min | Engineer + you | Code quality, abstractions, path to production |
| Wrap | 5 min | Q&A | Your questions about Sierra |

**Key principle / 关键原则**: depth over breadth. 切深度,不切广度。

### 中文

AI 原生面试是 Sierra 的差异化轮次。根据官方 blog 和招聘方资料:

| 阶段 | 时长 | 形式 | Sierra 在测什么 |
|---|---|---|---|
| Setup | 60 min | 跟 engineer 一起 | Scope framing、tradeoff articulation、drive |
| Build | 2 hr | 一个人,允许用 AI 工具 | Tool use、depth-over-breadth、technical craft |
| Demo | 10 min | Engineer 回来 | Customer journey、可工作的软件 |
| Review | 45 min | Engineer + 你 | Code quality、抽象、Path to Production |
| Wrap | 5 min | Q&A | 你对 Sierra 的提问 |

---

## 2. Setup-hour mock dialogue / Setup Hour 对话

### Prompt given by interviewer / 面试官给的 prompt:

> *"Build an AI agent for a use case you care about. Something with tool use, where correctness matters."*

### Your 60-second domain reframe / 你 60 秒的 domain reframe

#### English

> *"I want to frame this as a domain-grounded support agent, not a generic chatbot. I'd build three flows for a payments use case — payout status, payout breakdown, delayed-payout escalation. I'll skip auth, persistence, and UI polish, and spend the two hours on the parts that show production judgment: typed tool contracts, a domain answer layer that consumes verified facts not raw state, a policy gate, and a trace panel so we can review the agent's reasoning together. The success bar I want to hold myself to: every answer is grounded, traceable, and either confident or escalated."*
>
> *"Does that scoping work for you, or would you rather a different domain?"*

#### 中文

> *"我想把这个 frame 成 domain-grounded 的 support agent,不是 generic chatbot。我会 build 三个 flow 围绕 payments use case — payout status、payout breakdown、delayed-payout escalation。我会 skip auth、persistence、UI polish,把两小时花在能 show production judgment 的地方:typed tool contract、domain answer layer 只 consume verified fact 不是 raw state、policy gate、还有 trace panel 让我们一起 review agent 的 reasoning。我想守的 success bar 是:每个答案都是 grounded、traceable,要么 confident 要么 escalated。"*
>
> *"这个 scope 你 ok 吗?还是你想换个 domain?"*

🎭 *Drive — 不要等 interviewer 主动认可,问完直接推进。*

---

### Anticipated pushbacks / 预期的 pushback

#### Pushback 1: "Why payments specifically?"

**English**:
> *"Two reasons. First, these three intents span the spectrum I care about — clear answer, partial answer, refuse-to-answer. If the agent handles all three correctly, the framework generalizes. Second, I've shipped a payments support agent in production at scale, so I can talk about where this breaks in real systems, not just the prototype."*

**中文**:
> *"两个原因。第一,这三个 intent 覆盖了我 care 的 spectrum — 清晰回答、部分回答、refuse-to-answer。Agent 能处理好这三个,framework 就能 generalize。第二,我在 prod 上线过 payments support agent,所以我能聊真实系统里这玩意儿在哪儿会坏,而不是只聊 prototype。"*

#### Pushback 2: "Two hours is tight. What do you cut if behind at 90 min?"

**English**:
> *"My target is 90 minutes of build, 30 minutes of buffer. Cut order if behind: first I drop the LLM call and use a deterministic template — the typed PayoutAnswer object is what's interesting, not the prose. Second, I drop scenario 2 — happy path plus escalation already shows the spectrum. The trace panel and scenario 3 are the last things to go. Those are the differentiated signal."*

**中文**:
> *"我的 target 是 90 min build,30 min buffer。落后了的 cut 顺序:第一,先 drop LLM call 用 deterministic template — typed PayoutAnswer object 才是 interesting 的,不是文字。第二,drop scenario 2 — happy path 加 escalation 就够 show spectrum 了。Trace panel 和 scenario 3 是最后才 cut 的,那是 differentiated signal。"*

---

## 3. Build-hour plan / Build Hour 计划

### 90-min build budget / 90 分钟 build 预算

| Min | Activity (EN) | 活动 (中) | AI does | You write |
|---|---|---|---|---|
| 0-8 | Scaffold + install | 脚手架 + 装包 | Full scaffold | Verify boot |
| 8-18 | `types.ts` + `mock-data.ts` | 类型 + mock 数据 | Mock fixtures | **Every type by hand** |
| 18-28 | `tools.ts` | 工具实现 | Boilerplate | Discriminated union logic |
| 28-48 | `agent.ts` + `policy.ts` + `answer.ts` | 主 loop + 策略 + 答案层 | — | **All control flow** |
| 48-60 | Chat UI + trace panel | 聊天 UI + trace 面板 | UI scaffolding | Trace formatter |
| 60-72 | `/api/chat` + OpenAI + fallback | API 路由 + LLM + 兜底 | API route | Composer prompt |
| 72-82 | Run 3 scenarios, fix bugs | 跑 3 个场景,修 bug | Bug help | Read every change |
| 82-88 | Demo dry run | Demo 排练 | — | — |
| 88-90 | Buffer | 缓冲 | — | — |

### Cut order if behind / 落后的 cut 顺序

1. **At 65 min** if LLM flaky → drop OpenAI, use template composer
2. **At 75 min** if UI broken → strip trace panel to `<pre>{JSON.stringify}</pre>`
3. **At 80 min** if scenario 2 broken → drop breakdown, keep happy path + escalation
4. **Never cut**: scenario 3 escalation, trace panel in any form, typed PayoutAnswer

---

## 4. Architecture walkthrough / 架构讲解

### 4.1 Opening / 开场

#### English
Fifteen minutes. I'll walk the four-layer architecture, the invariants I held, and the platform/customer split — then we'll do the demo. The thing I'd ask you to evaluate me on isn't whether the demo works — it does. It's whether the boundaries I drew between platform and customer are the right ones, and whether the policy gate is something a customer could author without breaking correctness.

Three things to keep in mind:
1. The LLM is a small, late call. Everything before it is deterministic typescript.
2. Failures are designed to over-escalate, not hallucinate.
3. The trace is the eval substrate.

#### 中文
15 分钟。我会过四层 architecture、我守的几个 invariant、还有 platform 跟 customer 的边界 — 讲完了我们做 demo。我希望你评估我的不是 demo 能不能跑 — 能跑。是我画的 platform 和 customer agent 之间的边界对不对,以及 policy gate 能不能交给 customer 自己 author 而不破坏 correctness。

讲之前先 set 三件事:
1. LLM 是一个很小、很晚的 call。它之前的每一步都是 deterministic typescript。
2. Failure mode 是 over-escalate,不是 hallucinate。
3. Trace 是 eval substrate。

### 4.2 Code structure / 代码结构

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

| File / 文件 | Role (EN) | 作用 (中) |
|---|---|---|
| `lib/types.ts` | All types in the system | 系统所有 type |
| `lib/intent.ts` | Keyword classifier | 关键词分类器 |
| `lib/tools.ts` | 3 tool implementations | 3 个工具实现 |
| `lib/mock-data.ts` | 5 fake payouts (one absent) | 5 个 fake payout (一个故意缺失) |
| `lib/answer.ts` | Domain answer layer (LLM firewall) | Domain answer 层 (LLM 防火墙) |
| `lib/policy.ts` | Policy gate | 策略门 |
| `lib/composer.ts` | Single LLM call + template fallback | 唯一一次 LLM + 模板兜底 |
| `lib/agent.ts` | Main loop | 主 loop |
| `app/api/chat/route.ts` | POST endpoint | POST 端点 |
| `app/page.tsx` | Chat + trace panel UI | 聊天 + trace 面板 UI |

### 4.3 The four invariants / 四个 Invariant

#### Invariant 1: LLM never sees raw tool output / LLM 永远看不到 raw tool output

**English**: The model consumes a typed `PayoutAnswer` object that the agent has already validated. Never the raw DB row. Never the raw tool response. If I want to add a field the model is allowed to ground in, I have to put it in `PayoutAnswer` first.

**中文**: Model 消费的是 typed `PayoutAnswer`,agent 已经 validate 过了。永远拿不到 raw DB row,永远拿不到 raw tool response。想给 model 加一个能 ground 的 field,必须先放进 `PayoutAnswer`。这条架构上的硬规则让 model 的 input surface 是 auditable 的。

```typescript
// lib/types.ts:79-93
export type PayoutAnswer = {
  intent: Intent;
  payout_id: PayoutId | null;
  facts:
    | { kind: "status";    data: Extract<GetPayoutStatusOutput,    { found: true }> }
    | { kind: "breakdown"; data: Extract<GetPayoutBreakdownOutput, { found: true }> }
    | { kind: "missing";   payout_id: PayoutId }
    | { kind: "none" };
  confidence: Confidence;
  policy_decision: PolicyDecision;
  escalation?: EscalateToHumanOutput;
};
```

#### Invariant 2: `found: false` ≠ missing fields / `found: false` 跟 missing field 结构上完全分开

**English**: Every tool returns a discriminated union. The model cannot accidentally destructure a missing record because there are no blanks to fill — the type system prevents it. This prevents the canonical hallucination class where `null` is conflated with "still processing."

**中文**: 每个 tool 都 return discriminated union。Model 不可能不小心 destructure 一个 missing record — 根本没 blank 给它 fill,type system 不让。Prevent 的 bug class 是:tool return `null` → agent 当作 "还没 status,probably processing" → composer 编故事。这是 payment agent 最经典的 hallucination class,在 type 层面被消掉了。

```typescript
// lib/types.ts:23-34
export type GetPayoutStatusOutput =
  | { found: false; payout_id: PayoutId }
  | { found: true;  payout_id: PayoutId; status: PayoutStatus; ... };
```

#### Invariant 3: Policy is a pure function / Policy 是 pure function

**English**: `decidePolicy(intent, facts) → {decision, reason}`. No I/O, no state, no globals. Versionable, testable in isolation, rollback-able.

**中文**: `decidePolicy(intent, facts) → {decision, reason}`。没有 I/O、没有 state、没有 global。可 version、可单独 test、可 rollback。

#### Invariant 4: Every turn → stable-schema `TraceEvent` / 每个 turn 产生 schema 稳定的 `TraceEvent`

**English**: Today's schema is tomorrow's persistence schema. No transformation step.

**中文**: 今天的 schema 就是明天 prod 要 persist 的 schema。中间不需要 transform。

```typescript
// lib/types.ts:122-138
export type TraceEvent = {
  turn_id: string; ts: string; user_message: string;
  intent: Intent; payout_id: PayoutId | null;
  tool_calls: ToolCallRecord[];
  policy_decision: PolicyDecision; confidence: Confidence;
  composer_mode: "llm" | "template";
  response: string; escalation?: EscalateToHumanOutput;
};
```

### 4.4 Layer-by-layer / 逐层讲解

#### Intent classifier / 意图分类器

**EN**: Rule-based. Three keyword lists, ordered. Reasons: debuggable, free, eval-friendly. In prod the first thing I'd swap to LLM, but only after measuring routing-error rate on a golden set.

**中**: 基于规则。三个 keyword list,有顺序。原因:debuggable、free、eval-friendly。Prod 里第一个会换成 LLM router,但**只在 golden set 上测过 routing-error rate 之后**。

#### Tools

**EN**: Three tools. Each returns a discriminated union. `escalate_to_human` is a tool, not a flag — routing (tier1 / payments_ops / compliance) is customer-configurable, belongs in tool surface.

**中**: 三个 tool。每个 return discriminated union。`escalate_to_human` 是 tool 不是 flag — routing (tier1 / payments_ops / compliance) 是 customer 可配置的,属于 tool surface。

#### Domain answer layer / Domain Answer 层

**EN**: The firewall between tools and the model. The only place tool-output-to-model-input lives. Anyone changing what the model sees must change this file. Centralized, reviewable, testable.

**中**: Tool 和 model 之间的防火墙。整个系统**唯一一处** tool output → model input 的桥。任何人想改 model 看到啥,必须改这个文件。Centralized、reviewable、testable。

#### Policy gate / 策略门

**EN**: 55 lines. Three rules:
1. No facts retrieved → ESCALATE
2. Missing record → ESCALATE, never speculate
3. Otherwise **intent-aware**:
   - status + on_hold → REQUIRE_CONFIRM
   - status + failed → ESCALATE via payments_ops
   - breakdown + held payout → **ALLOW** (funds are knowable even if not disbursed)

**中**: 55 行。三条规则:
1. 没 retrieve 到 fact → ESCALATE
2. Record missing → ESCALATE,**永远不 speculate**
3. 否则 **intent-aware**:
   - status + on_hold → REQUIRE_CONFIRM
   - status + failed → ESCALATE 走 payments_ops
   - breakdown + held payout → **ALLOW** (钱被 hold,但 breakdown 是 knowable 的)

**The differentiated branch / 差异化的 branch**: `breakdown` on held payout → ALLOW.
Most implementations blanket-escalate on `on_hold`. That's wrong — `on_hold` is a status fact, not an answer veto.

大多数实现在 `on_hold` 时一刀切 escalate。**那是错的** — `on_hold` 是 status fact,不是 answer veto。

#### Composer

**EN**: Single LLM call (`gpt-4o-mini`, T=0.2) with deterministic template fallback. Template is functionally complete — if LLM is down, demo still runs.

**中**: 一次 LLM call (`gpt-4o-mini`,温度 0.2),带 deterministic template fallback。Template 功能完整 — LLM 挂了 demo 还能跑。

### 4.5 Platform vs customer split / Platform 与 Customer 边界

| Owner | Owns / 拥有 |
|---|---|
| **Platform** | Agent loop · Trace schema · Policy framework · Composer harness · Eval harness · Rollout machinery |
| **Customer** | Intent enum + classifier · Tool implementations · Policy branches · Composer prompt · Eval golden set |

**EN**: Currently single-tree, single-tenant — boundary not enforced. In prod, each customer has its own package implementing a `CustomerAgent` interface; platform instantiates inside shared loop.

**中**: 现在是单 tree、单租户,边界没 enforce。Prod 里每个 customer 有自己的 package,实现 `CustomerAgent` interface,platform 在 shared loop 里 instantiate。

### 4.6 What was cut + what's next / Cut 了什么 + Next

**Cut, named / Cut 掉的,都 named 过**:
- Auth · persistence · multi-tenant routing
- Real eval · real rollout
- Session tracking (needed for policy-version pinning / 需要给 policy-version pinning)
- LLM-based intent router (keyword is stand-in / keyword 是 stand-in)

**Next, in impact order / 按 impact 排**:
1. **Eval harness with response-vs-facts diff** — highest impact. Mechanical, cheap, catches what type system can't.
   评估 harness 加 response-vs-facts diff — impact 最高,机械便宜,catch 住 type system 自己 catch 不到的。
2. **Trace persistence + flagging UI** — support agents flag bad traces → regression cases.
   Trace 持久化 + flagging UI — support agent flag 不对的 trace → regression case。
3. **Policy versioning + per-session pinning**
4. **Multi-tenant adapter** — `CustomerAgent` interface
5. **Confirmation flow** wired to deterministic confirm/escalate handoff

---

## 5. Customer-framed demo script / 面向客户的 Demo 脚本

### 5.1 Persona setup / 角色设定

**English**: Maya — runs three short-term rentals on a marketplace. Cash flow matters. She's checking her payouts at 7am on a Tuesday. She is not a developer. She doesn't know what an ESCALATE policy is. She knows whether she trusts the answer she got.

**中文**: Maya — 在 marketplace 上经营三套短租房。Cash flow 很重要。周二早上 7 点在 app 上看 payout。她不是开发者,不知道什么是 ESCALATE policy。她只知道刚才那个回答她信不信。

### 5.2 The 10-min demo script / 10 分钟 demo 脚本

#### Min 0-1 — Opening (read aloud cold / 背下来直接念)

**EN**:
> *"I want to demo this as a customer journey, not a code walkthrough. I'm going to play Maya — she runs three rentals on a marketplace, cash flow matters, she's checking her payouts at 7am on a Tuesday. I'll walk you through three things that happen to her in one morning. Same agent handles all three. After the third one I'll stop and tell you what I think the differentiated signal is."*

**中**:
> *"我想把这个 demo 讲成一段 customer journey,不是 code walkthrough。我会扮演 Maya — 她在 marketplace 上有三套租房,cash flow 重要,周二早上 7 点查 payout。我带你过她一个早上发生的三件事。同一个 agent 处理这三件。讲完第三个我会停下来,告诉你我觉得 differentiated signal 是什么。"*

#### Min 1-3 — Scenario 1: "Where's my money?" (calm case)

**EN**:
> *"First one is the easy case. Maya sees a payout that hasn't landed in her bank yet, and she just wants to know when."*
>
> [Click suggested prompt 1]
>
> **Customer sees**: *"Payout payout_001 ($50.00 USD) is processing. You can expect it to arrive between 2026-05-13 and 2026-05-15."*
>
> *"Two things I want Maya to feel here. One — specific window, not 'soon.' Specificity is trust. Two — no upsell, no marketing, no 'is there anything else?' The agent is short because Maya is in a hurry."*

**中**:
> *"第一个是 easy case。Maya 看到 payout 还没到账,她就想知道什么时候到。"*
>
> [点 suggested prompt 1]
>
> **客户看到**: *"Payout payout_001 ($50.00 USD) is processing. You can expect it to arrive between 2026-05-13 and 2026-05-15."*
>
> *"两件事想让 Maya 感受到。第一,具体的时间窗口,不是 'soon' 或 '几天内'。具体性就是信任。第二,没有 upsell、没有 marketing、没有 'is there anything else?'。Agent 简短,因为 Maya 时间紧。"*

#### Min 3-5 — Scenario 2: "Why is it less?" (explain case)

**EN**:
> *"Second one. Maya got paid, but it's less than expected. This is the case where a bad agent invents a tax rate."*
>
> [Click suggested prompt 2]
>
> **Customer sees**:
> ```
> Payout payout_002 breakdown:
>   Gross: USD 100.00
>   Marketplace service fee (3%): -USD 3.00
>   US tax withholding (7%): -USD 7.00
>   Net: USD 90.00
> ```
>
> *"What I'm proud of isn't that the agent itemized the fees. It's that the labels — 'Marketplace service fee (3%)', 'US tax withholding (7%)' — came from the system of record, not the model. Maya could screenshot this, forward it to her accountant, and not get burned."*

**中**:
> *"第二个。Maya 收到钱了,但比预期少。这是 bad agent 会编一个税率出来的场景。"*
>
> [点 suggested prompt 2]
>
> **客户看到**: (同上 breakdown)
>
> *"我 proud 的不是 agent 把 fee 列出来了。是这些 label — 'Marketplace service fee (3%)'、'US tax withholding (7%)' — 来自 system of record,不是 model 编的。Maya 可以截图发给她会计,不会出岔子。"*

#### Min 5-8 — Scenario 3: "I never got paid" (THE MOMENT / 关键时刻)

**EN**:
> *"Third one. This is the case I care most about. Maya's looking at a stay from last week. She knows the guest checked in. She knows the booking cleared. And there's no payout. She's anxious."*
>
> [Pause. Eye contact with interviewer.]
>
> [Click suggested prompt 3]
>
> **Customer sees**: *"I couldn't find payout payout_004 in our records. I've opened ticket TKT-… with our tier1_support team — estimated response in 4 minutes. They have the full context of this conversation."*
>
> [Pause. Don't rush.]
>
> *"Three things to notice. First — the agent said it couldn't find it. That's a refusal. Most support agents in production today would have said 'Let me check on that for you' and either made up a status or hand-waved. This one did neither. Second — there's a ticket number and a team. Maya isn't dropped into the void. The agent didn't just give up; it routed her to the right human with full context attached. Third — the wait estimate is concrete. Four minutes."*
>
> [Now flip frame — point at trace panel.]
>
> *"Now I'll break character for a second. On the right is the trace. Look at this row" — [point to `policy_decision: ESCALATE`] — "this is the agent refusing to compose a grounded answer. Everything before it said 'we don't have facts.' The framework made it impossible for the model to hallucinate something to fill the silence. **That's the work.**"*

**中**:
> *"第三个。我最 care 的 case。Maya 看上周一个入住记录。她知道客人 check-in 过了,知道订单结算了,但没有 payout。她着急。"*
>
> [停。看着面试官。]
>
> [点 suggested prompt 3]
>
> **客户看到**: *"我在记录里找不到 payout_004。已经开了 ticket TKT-… 给 tier1_support team — 预计 4 分钟回复。他们有完整对话上下文。"*
>
> [停。别赶。]
>
> *"三件事注意。第一,agent 说找不到。这是 refusal。今天 prod 上大多数 support agent 会说 'Let me check on that' 然后要么编个 status 要么打太极。这个 agent 两个都没干。第二,有 ticket 号有 team。Maya 不是被丢进虚空。Agent 不是放弃,是带着完整 context 路由给对的人。第三,等待时间是具体的。4 分钟。"*
>
> [切换 frame — 指 trace panel。]
>
> *"我现在切换一下角色。右边是 trace。看这一行" — [指 `policy_decision: ESCALATE`] — "这是 agent 拒绝 compose 一个 grounded answer。它之前的每一步都说 'we don't have facts'。Framework 让 model 没法编一个 fact 来 fill silence。**这才是 the work**。"*

#### Min 8-10 — Closing (the punchline / 收尾)

**EN**:
> *"I want to close on what's NOT in the demo, because that's where the production-grade signal lives. Maya never saw a made-up date. Maya never saw a guessed fee rate. Maya never saw 'I think your payout might be…'. The agent has three modes — answer, ask, escalate — and 'speculate' is not one of them. The chat is the surface. The contract between the domain and the model — and the policy gate that decides whether to compose at all — that's the product. **The chat is the easy part.**"*

**中**:
> *"我想用 demo 里**没出现**的东西收尾,因为 production-grade signal 就在那儿。Maya 从来没看到编造的日期。Maya 从来没看到瞎猜的费率。Maya 从来没看到 'I think your payout might be…'。Agent 有三个 mode — answer、ask、escalate — '推测' 不是其中之一。Chat 是表层。Domain 跟 model 的 contract、决定是否 compose 的 policy gate — 那才是产品。**Chat 是最容易的部分**。"*

### 5.3 Eng vocab kill-list / Eng 行话黑名单 (demo 时绝对不说)

| ❌ Don't say / 别说 | ✅ Say instead / 改说 |
|---|---|
| "tool call" / "function call" | "agent looked up…" / "agent 查了…" |
| "policy gate fires" / "ESCALATE branch" | "agent decided not to answer" / "agent 决定不回答" |
| "intent classification" | "agent figured out what they were asking" / "agent 搞清用户问什么" |
| "API response" / "endpoint" | "system of record returned" / "记录系统返回" |
| "discriminated union" / "typed contract" | (save for review hour / 留到 review hour) |
| "the LLM" | "the model" / "the agent" / "模型" / "智能体" |
| "Let me show you the code" | (never in demo / demo 期间永远不说) |

---

## 6. Q&A handling / Q&A 应对

### Production-readiness probes / 生产就绪类问题

| Q (EN) | A (EN) | A (中) |
|---|---|---|
| "How do you handle hallucination?" | "Domain answer layer + typed PayoutAnswer. LLM never sees raw tool output. Eval is response-vs-facts diff — any number/date/status in response not in facts = hallucination by definition." | Domain answer 层 + typed PayoutAnswer。LLM 永远看不到 raw tool output。Eval 是 response-vs-facts diff — response 里出现但 facts 里没有的 number/date/status,by definition 就是 hallucination。 |
| "How do you scale to multi-tenant?" | "One agent per customer. Customer owns intent + tools + policy branches + prompt + eval set. Platform owns loop, trace schema, policy framework, eval harness, rollout machinery." | 每个 customer 一个 agent。Customer 拥有 intent + tools + policy branch + prompt + eval。Platform 拥有 loop、trace schema、policy framework、eval harness、rollout machinery。 |
| "How do you eval?" | "Two layers. Golden set (~50 turns, verbatim checks). Response-vs-facts diff (mechanical, catches what golden misses)." | 两层。Golden set (~50 turn,verbatim 对照)。Response-vs-facts diff (机械的,catch 住 golden 漏掉的)。 |
| "How do you roll out?" | "Six stages: shadow → read-only explanations behind flag → human-reviewed escalation suggestions → confidence-gated user rollout → guided workflows → transactional actions only after eval bar holds." | 六阶段:shadow → flag 后的 read-only explanation → 人工 review 过的 escalation 建议 → 置信度门控的用户 rollout → guided workflow → transactional action,在 eval bar 保持之后才上。 |
| "What if model still hallucinates in composer?" | "Composer only sees typed PayoutAnswer, no raw tool output, no user_message. Surface area limited to format not facts. If number invented, it's in prompt + eval catches." | Composer 只看 typed PayoutAnswer,没 raw tool output,没 user_message。Surface 限制在 format 不是 fact。如果编数字,prompt 里能看出来,eval 能 catch。 |

### Bar-raiser cold-question handles / Bar Raiser 冷问题应对

| Q (EN) | A (EN — short) | A (中 — 短) |
|---|---|---|
| "What's the next bug?" | "Intent classifier — keyword-based, will misroute. Failure mode is over-escalate, not hallucinate. System fails safe." | 意图分类器,keyword-based,会 misroute。Failure mode 是 over-escalate 不是 hallucinate。系统朝安全方向 fail。 |
| "What's the worst thing about your code?" | "Single-tenant. Platform/customer boundary not enforced — file-level only. In prod each customer needs its own package implementing CustomerAgent interface." | 单租户。Platform/customer 边界没 enforce — 只在文件级别。Prod 里每个 customer 需要自己的 package 实现 CustomerAgent interface。 |
| "What did you cut that you regret?" | "Session tracking. Needed for policy-version pinning during in-flight rollouts. Wasn't worth two hours but is needed Day-1 prod." | Session tracking。给 policy version pinning 用,in-flight rollout 时需要。两小时 build 不值得做,但 prod day-1 需要。 |
| "What would you change about your architecture?" | "Strip user_message from composer prompt entirely. Currently included for tone, but it's a surface area I'd A/B against intent+facts-only variant." | 把 user_message 完全从 composer prompt 里 strip 掉。现在保留用于 tone,但这是个 surface,会 A/B 一个 intent+facts-only 的 variant。 |

---

## 7. Strong-signal rubric / 强信号 Rubric

The 12 items Sierra calibrates on / Sierra 校准的 12 个信号:

- [x] **Domain reframe** — not generic chatbot / 不是 generic chatbot
- [x] **Scope cuts named out loud** / 大声 name 出 cut 掉什么
- [x] **Tool contracts on screen FIRST** / Tool contract 先上屏
- [x] **Trace panel built** / Trace 面板做出来
- [x] **3 scenarios end-to-end** / 三个场景端到端
- [x] **Scenario 3 (escalation) emphasized** / 第三个场景 (escalation) 重点强调
- [x] **AI tool usage division verbalized** — AI scaffolds plumbing, you write logic / AI 搭脚手架,你写逻辑
- [x] **At least one AI-output fix narrated** / 至少叙述一次 fix AI 输出
- [x] **Demo opening memorized cold** / Demo 开场背熟
- [x] **"What I'd do next" covers evals + observability + rollout** / "下一步" 包括 evals + observability + rollout
- [x] **Closing line connects to Sierra abstraction** / 收尾连接到 Sierra 抽象
- [x] **Production readiness answered with metrics not adjectives** / 生产就绪用 metric 回答,不是形容词

---

## 8. Anti-patterns / 反模式

| Anti-pattern (EN) | 反模式 (中) | Why it hurts / 为什么不好 | Do instead / 改这样做 |
|---|---|---|---|
| Going silent during build | Build 时沉默 | Sierra tests reasoning not typing | Narrate every 2-3 min / 每 2-3 分钟说一次 |
| Pasting 200 lines of AI output unread | 粘贴 200 行 AI 输出不读 | Visible loss of judgment | Read every line briefly / 简短读每行 |
| Building auth / dashboards | Build auth / dashboard | Wastes time on non-signal | Skip explicitly, name cut |
| 5+ min on CSS | 在 CSS 上花 5 分钟以上 | Visual polish ≠ product signal | Two columns + one button enough |
| Trace panel as optional | Trace 面板可有可无 | Single biggest visual differentiator | Build it first or last but build it |
| All 3 scenarios simultaneously | 同时搞三个场景 | Half-working everything = no demo | Scenario 1 fully working before 2 |
| Asking permission too often | 老是请示 | Sierra silence is the test | Make the call, name the switch trigger |
| Apologizing | 道歉 | "Sorry I'm not sure" = downgrade | "Give me a beat…" / "稍等一下" |
| Demoing by walking files | 通过翻文件 demo | Death | "Let me walk you through three customer journeys" |
| Mentioning Meta/Databricks vocab (TAO, Photon) | 提 Meta/Databricks 行话 | Wrong-company contamination | Use generic terms |

---

## Closing line / 收尾金句

**EN**: *"If there's one thing to take away — the differentiated work for production agents isn't the chatbot. It's the contract between the domain and the model, the policy gate, and the eval. That's where I've spent the last few years."*

**中**: *"如果只记一件事 — production agent 的 differentiated 工作不是 chatbot。是 domain 跟 model 的 contract、policy gate、还有 eval。这是我过去几年花时间的地方。"*

---

> *Generated as part of Sierra round preparation, 2026-05-13.*
> *Project: claude-payments-agent.*
