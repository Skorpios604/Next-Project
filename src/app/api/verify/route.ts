import { OpenAI } from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { input } = await req.json();

  const prompt = `
You are a hallucination detector. Given this AI-generated answer, break it into factual claims. For each claim, say if it's likely to be true or needs citation.

Text:
"""${input}"""

Respond in JSON:
[
  {
    "claim": "...",
    "status": "likely true" | "needs verification" | "probably false",
    "notes": "short explanation"
  },
  ...
]
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
  });

  const responseText = completion.choices[0].message?.content || "";
  return NextResponse.json(JSON.parse(responseText));
}
