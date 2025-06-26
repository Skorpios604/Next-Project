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
        <div className="mt-6 space-y-4">
          <h2 className="text-xl font-semibold mb-2">Results:</h2>
          {results.map((item: any, index: number) => (
            <div
              key={index}
              className={`border-l-4 p-4 rounded shadow-md ${
                item.status === "likely true"
                  ? "border-green-600 bg-green-50"
                  : item.status === "probably false"
                  ? "border-red-600 bg-red-50"
                  : "border-yellow-500 bg-yellow-50"
              }`}
            >
              <p className="text-lg font-medium mb-1">🧠 Claim: {item.claim}</p>
              <p className="font-semibold">
                📊 Status:{" "}
                <span
                  className={`${
                    item.status === "likely true"
                      ? "text-green-700"
                      : item.status === "probably false"
                      ? "text-red-700"
                      : "text-yellow-700"
                  }`}
                >
                  {item.status}
                </span>
              </p>
              <p className="mt-1 text-gray-700">📝 Notes: {item.notes}</p>
            </div>
          ))}
        </div>
      )}

    </main>
  );
}
