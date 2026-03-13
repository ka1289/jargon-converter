import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { text } = await req.json();

  if (!text?.trim()) {
    return NextResponse.json({ error: "No text provided" }, { status: 400 });
  }

  const completion = await client.chat.completions.create({
    model: "gpt-5-nano",
    messages: [
      {
        role: "system",
        content: `You are a jargon translator. Convert business/product/corporate jargon and buzzwords into plain, simple English that anyone can understand.

Rules:
- Be direct and concise
- Replace each jargon phrase with clear, everyday language
- Keep the same meaning but make it accessible
- Format your response as:

**Original:** [the jargon phrase or sentence]
**Plain English:** [the simple translation]
**What it really means:** [1-2 sentence plain explanation]

If multiple jargon terms are present, address them together in one cohesive translation.`,
      },
      {
        role: "user",
        content: text,
      },
    ],
  });

  const result = completion.choices[0]?.message?.content ?? "";
  return NextResponse.json({ result });
}
