import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { input } = await req.json();

  const prompt = `
You are an expert fact-checker. Your job is to analyze the following AI-generated text, break it down into individual factual claims, and assess the truthfulness of each claim.

For each claim, provide:
- "claim": The factual statement.
- "status": One of the following:
    - "likely true" (well-known, widely accepted, or easily verifiable)
    - "needs verification" (plausible but not easily confirmed, or requires a reputable source)
    - "probably false" (contradicts common knowledge or reliable sources)
- "notes": A brief explanation for your assessment.

Here are some examples:
[
  {
    "claim": "The sky is blue.",
    "status": "likely true",
    "notes": "Common knowledge, easily observable."
  },
  {
    "claim": "The Eiffel Tower is in Berlin.",
    "status": "probably false",
    "notes": "The Eiffel Tower is in Paris."
  },
  {
    "claim": "Bananas contain potassium.",
    "status": "likely true",
    "notes": "Well-known nutritional fact."
  },
  {
    "claim": "The average human can run 100 miles per hour.",
    "status": "probably false",
    "notes": "Far exceeds human capabilities."
  },
  {
    "claim": "The capital of Australia is Sydney.",
    "status": "probably false",
    "notes": "The capital is Canberra."
  }
]

Now, analyze the following text:

"""${input}"""

Respond in the same JSON format as above.
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
