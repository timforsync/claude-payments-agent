"use client";

import { useState, useRef, useEffect } from "react";
import type { ChatMessage, TraceEvent, PolicyDecision } from "@/lib/types";

const SUGGESTED_PROMPTS = [
  { label: "1. Status (happy path)", text: "Where is my payout payout_001?" },
  { label: "2. Breakdown (less than expected)", text: "Why is payout_002 less than I expected?" },
  { label: "3. Escalation (missing record)", text: "I never got paid for payout_004." },
  { label: "Bonus: on hold", text: "Where is payout_003?" },
  { label: "Bonus: bank rejection", text: "What happened to payout_005?" },
];

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [selectedTrace, setSelectedTrace] = useState<TraceEvent | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || pending) return;
    setPending(true);
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = await res.json();
      if (data.trace) {
        const trace = data.trace as TraceEvent;
        setMessages((prev) => [...prev, { role: "assistant", content: trace.response, trace }]);
        setSelectedTrace(trace);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Error: ${data.error ?? "unknown"}` },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Request failed: ${String(err)}` },
      ]);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="h-screen flex flex-col bg-neutral-950 text-neutral-100">
      <header className="border-b border-neutral-800 px-6 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-sm font-medium">Payments Support Agent</h1>
          <p className="text-xs text-neutral-500">
            Domain-grounded · Tool-augmented · Policy-gated · Traceable
          </p>
        </div>
        <div className="text-xs text-neutral-500">
          {messages.length > 0 && `${messages.filter((m) => m.role === "user").length} turn(s)`}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <section className="w-1/2 flex flex-col border-r border-neutral-800">
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-neutral-500 text-sm space-y-3">
                <p>Try one of the scenarios →</p>
                <div className="space-y-1.5">
                  {SUGGESTED_PROMPTS.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => send(p.text)}
                      className="block w-full text-left px-3 py-2 rounded-md bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs"
                    >
                      <div className="text-neutral-400 font-medium">{p.label}</div>
                      <div className="text-neutral-500 mt-0.5">{p.text}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <MessageBubble
                key={i}
                message={m}
                onClick={() => m.trace && setSelectedTrace(m.trace)}
                isSelected={selectedTrace?.turn_id === m.trace?.turn_id}
              />
            ))}
            {pending && (
              <div className="text-neutral-500 text-xs italic">agent is thinking…</div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="border-t border-neutral-800 p-3 flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a payout… (e.g., 'Where is payout_001?')"
              disabled={pending}
              className="flex-1 px-3 py-2 rounded-md bg-neutral-900 border border-neutral-800 text-sm placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600"
            />
            <button
              type="submit"
              disabled={pending || !input.trim()}
              className="px-4 py-2 rounded-md bg-neutral-100 text-neutral-900 text-sm font-medium disabled:opacity-40"
            >
              Send
            </button>
          </form>
        </section>

        <aside className="w-1/2 flex flex-col bg-neutral-950">
          <div className="border-b border-neutral-800 px-6 py-3">
            <h2 className="text-sm font-medium">Trace</h2>
            <p className="text-xs text-neutral-500">
              Per-turn record. Same schema we&apos;d persist in production for eval + replay.
            </p>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {selectedTrace ? <TracePanel trace={selectedTrace} /> : (
              <div className="text-neutral-500 text-xs italic">
                Send a message — trace will render here.
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  onClick,
  isSelected,
}: {
  message: ChatMessage;
  onClick?: () => void;
  isSelected: boolean;
}) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <button
        onClick={onClick}
        disabled={!message.trace}
        className={`max-w-[85%] text-left rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
          isUser
            ? "bg-blue-600 text-white"
            : `bg-neutral-900 border ${isSelected ? "border-neutral-500" : "border-neutral-800"} hover:border-neutral-600`
        }`}
      >
        {message.content}
        {message.trace && (
          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-neutral-500 uppercase tracking-wide">
            <PolicyBadge decision={message.trace.policy_decision} />
            <span>· {message.trace.intent}</span>
            <span>· {message.trace.composer_mode}</span>
          </div>
        )}
      </button>
    </div>
  );
}

function PolicyBadge({ decision }: { decision: PolicyDecision }) {
  const color =
    decision === "ALLOW"
      ? "bg-green-900/50 text-green-300 border-green-800"
      : decision === "REQUIRE_CONFIRM"
        ? "bg-yellow-900/50 text-yellow-300 border-yellow-800"
        : "bg-red-900/50 text-red-300 border-red-800";
  return (
    <span className={`inline-block px-1.5 py-0.5 rounded border text-[10px] font-medium ${color}`}>
      {decision}
    </span>
  );
}

function TracePanel({ trace }: { trace: TraceEvent }) {
  return (
    <div className="space-y-4 text-xs font-mono">
      <Section title="Turn">
        <Row k="turn_id" v={trace.turn_id} />
        <Row k="ts" v={trace.ts} />
        <Row k="user_message" v={trace.user_message} />
      </Section>

      <Section title="Classification">
        <Row k="intent" v={trace.intent} />
        <Row k="payout_id" v={trace.payout_id ?? "—"} />
        <Row k="confidence" v={trace.confidence} />
      </Section>

      <Section title={`Tool calls (${trace.tool_calls.length})`}>
        {trace.tool_calls.length === 0 && (
          <div className="text-neutral-600">no tools invoked</div>
        )}
        {trace.tool_calls.map((tc, i) => (
          <div key={i} className="bg-neutral-900 border border-neutral-800 rounded p-2 mt-1">
            <div className="text-neutral-400 font-medium">
              {tc.tool} <span className="text-neutral-600">({tc.duration_ms}ms)</span>
            </div>
            <div className="text-neutral-500 mt-1">input:</div>
            <pre className="text-neutral-300 whitespace-pre-wrap">
              {JSON.stringify(tc.input, null, 2)}
            </pre>
            <div className="text-neutral-500 mt-1">output:</div>
            <pre className="text-neutral-300 whitespace-pre-wrap">
              {JSON.stringify(tc.output, null, 2)}
            </pre>
          </div>
        ))}
      </Section>

      <Section title="Policy gate">
        <div className="bg-neutral-900 border border-neutral-800 rounded p-2">
          <div className="flex items-center gap-2">
            <PolicyBadge decision={trace.policy_decision} />
          </div>
          <div className="mt-2 text-neutral-400">
            {trace.policy_decision === "ALLOW" && "Facts complete and intent-aligned. Composer ran."}
            {trace.policy_decision === "REQUIRE_CONFIRM" &&
              "Fact is knowable but next user step is escalation territory. Composer asked to confirm."}
            {trace.policy_decision === "ESCALATE" &&
              "Refused to compose a grounded answer. Escalation tool invoked."}
          </div>
        </div>
      </Section>

      {trace.escalation && (
        <Section title="Escalation">
          <Row k="ticket_id" v={trace.escalation.ticket_id} />
          <Row k="route" v={trace.escalation.route} />
          <Row k="wait_minutes" v={String(trace.escalation.estimated_wait_minutes)} />
        </Section>
      )}

      <Section title="Composer">
        <Row k="mode" v={trace.composer_mode} />
        <div className="text-neutral-500 mt-1">response:</div>
        <pre className="bg-neutral-900 border border-neutral-800 rounded p-2 mt-1 whitespace-pre-wrap text-neutral-300">
          {trace.response}
        </pre>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1.5">{title}</div>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-2">
      <span className="text-neutral-500 min-w-[100px]">{k}</span>
      <span className="text-neutral-300 break-all">{v}</span>
    </div>
  );
}
