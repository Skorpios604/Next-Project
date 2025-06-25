import { NextRequest, NextResponse } from "next/server";

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

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3-70b-8192",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    }),
  });

  const data = await res.json();
  const reply = data.choices?.[0]?.message?.content;

  // Try to extract JSON from within the full reply
  const match = reply?.match(/\[\s*{[\s\S]*?}\s*]/); // Get the first [...] JSON block

  try {
    const parsed = match ? JSON.parse(match[0]) : [];
    return NextResponse.json(parsed);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to parse model response", raw: reply },
      { status: 500 }
    );
  }
}
