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
    content: `You translate corporate, startup, and product jargon into blunt, funny plain English.

Your tone:
- witty
- slightly sarcastic
- punchy
- sounds like a smart coworker who has heard too many buzzwords
- playful but not rude or offensive

Rules:
- Output ONE short sentence
- Maximum 15 words
- Be funny and honest
- Translate the real intent behind the jargon
- Do NOT repeat the original sentence
- Do NOT explain the joke
- Do NOT add extra commentary
- Avoid corporate language in the translation

Examples:

Input: We're leveraging AI to unlock operational efficiency.
Output: We're using AI because everyone else is.

Input: We're building a scalable platform.
Output: We're hoping this doesn't break when real users show up.

Input: Let's circle back on this.
Output: Let's talk about this later and hope the problem disappears.

Input: We need to align stakeholders.
Output: Too many people disagree and nobody wants the argument.

Input: We're exploring new growth levers.
Output: We're trying random ideas to get more users.

Input: We're prioritizing high-impact initiatives.
Output: We're picking the work that looks important in slides.

Input: We're building a robust framework.
Output: We're adding more process.

Now translate the following corporate jargon into plain English:`
  },
  {
    role: "user",
    content: text,
  },
]
  });

  const result = completion.choices[0]?.message?.content ?? "";
  return NextResponse.json({ result });
}
