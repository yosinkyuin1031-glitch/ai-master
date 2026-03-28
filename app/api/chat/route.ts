import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

// Vercel Serverless Function タイムアウト設定（秒）
export const maxDuration = 30;

export async function POST(request: Request) {
  const { messages, systemPrompt } = await request.json();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY が設定されていません" },
      { status: 500 }
    );
  }

  try {
    const client = new Anthropic({ apiKey });

    const anthropicMessages = messages.map(
      (m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })
    );

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system: systemPrompt,
      messages: anthropicMessages,
    });

    const content =
      response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({ content });
  } catch (e) {
    const errMsg = e instanceof Error ? e.message : "AI処理中にエラーが発生しました";
    return NextResponse.json(
      { error: errMsg },
      { status: 500 }
    );
  }
}
