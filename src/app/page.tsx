'use client';

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    setLoading(true);
    const res = await fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
    });
    const data = await res.json();
    setResults(data);
    setLoading(false);
  };

  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">AI Hallucination Checker</h1>
      <textarea
        className="w-full h-48 p-2 border rounded mb-4"
        placeholder="Paste AI response here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        onClick={handleCheck}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Checking..." : "Check for Hallucinations"}
      </button>

      {results && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Results:</h2>
          <pre className="whitespace-pre-wrap mt-2 bg-gray-100 p-4 rounded">
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      )}
    </main>
  );
}
