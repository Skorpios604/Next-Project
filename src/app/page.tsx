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
          <h2 className="text-xl font-semibold mb-2 text-white">Results:</h2>
          {results.map((item: any, index: number) => {
            const baseClasses = "rounded-lg p-4 border shadow transition";
            const themeClasses =
              item.status === "likely true"
                ? "bg-green-900/30 border-green-500 text-green-300"
                : item.status === "probably false"
                ? "bg-red-900/30 border-red-500 text-red-300"
                : "bg-yellow-900/30 border-yellow-500 text-yellow-300";

            return (
              <div key={index} className={`${baseClasses} ${themeClasses}`}>
                <p className="text-lg font-semibold">🧠 Claim: {item.claim}</p>
                <p className="mt-1 font-medium">
                  📊 Status: <span className="uppercase">{item.status}</span>
                </p>
                <p className="mt-1 text-sm text-white/80">📝 Notes: {item.notes}</p>
              </div>
            );
          })}
        </div>
      )}


    </main>
  );
}
