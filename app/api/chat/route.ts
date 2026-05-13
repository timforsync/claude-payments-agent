import { NextRequest, NextResponse } from "next/server";
import { runAgentTurn } from "@/lib/agent";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json({ error: "missing message" }, { status: 400 });
    }
    const trace = await runAgentTurn(message);
    return NextResponse.json({ trace });
  } catch (err) {
    console.error("agent turn failed:", err);
    return NextResponse.json({ error: "agent turn failed" }, { status: 500 });
  }
}
