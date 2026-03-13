"use client";

import { useState } from "react";

const EXAMPLES = [
  "Let's synergize our core competencies to leverage the low-hanging fruit.",
  "We need to move the needle on our KPIs by EOD to align stakeholders.",
  "Let's circle back offline to ideate around our go-to-market strategy.",
  "We should boil the ocean to ensure we're not leaving any runway on the table.",
  "Let's take this 30,000-foot view and drill down on the actionable deliverables.",
];

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleConvert() {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setResult(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function formatResult(text: string) {
    return text.split("\n").map((line, i) => {
      if (line.startsWith("**") && line.includes(":**")) {
        const colonIdx = line.indexOf(":**");
        const label = line.slice(2, colonIdx);
        const value = line.slice(colonIdx + 3).trim();
        const colors: Record<string, string> = {
          Original: "text-slate-400",
          "Plain English": "text-emerald-400",
          "What it really means": "text-blue-400",
        };
        return (
          <p key={i} className="mb-1">
            <span className={`font-semibold ${colors[label] ?? "text-slate-300"}`}>
              {label}:{" "}
            </span>
            <span className="text-slate-200">{value}</span>
          </p>
        );
      }
      return line ? (
        <p key={i} className="text-slate-200 mb-1">
          {line}
        </p>
      ) : (
        <br key={i} />
      );
    });
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-2xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 mb-6 text-2xl">
            🔄
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            Jargon Decoder
          </h1>
          <p className="text-slate-400 text-lg">
            Paste corporate buzzwords. Get plain English back.
          </p>
        </div>

        {/* Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Business / Product Jargon
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. Let's synergize our core competencies to leverage the low-hanging fruit..."
            rows={4}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>

        {/* Examples */}
        <div className="mb-6">
          <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">
            Try an example
          </p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex, i) => (
              <button
                key={i}
                onClick={() => setInput(ex)}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 rounded-lg px-3 py-1.5 transition truncate max-w-[260px]"
                title={ex}
              >
                {ex.length > 40 ? ex.slice(0, 40) + "…" : ex}
              </button>
            ))}
          </div>
        </div>

        {/* Convert Button */}
        <button
          onClick={handleConvert}
          disabled={loading || !input.trim()}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Translating…
            </>
          ) : (
            "Decode Jargon"
          )}
        </button>

        {/* Error */}
        {error && (
          <div className="mt-6 p-4 bg-red-950 border border-red-800 rounded-xl text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="mt-6 p-5 bg-slate-900 border border-slate-700 rounded-xl">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-4">
              Plain English Translation
            </p>
            <div className="space-y-1 leading-relaxed">{formatResult(result)}</div>
          </div>
        )}

        <p className="text-center text-slate-700 text-xs mt-12">
          Powered by GPT-4o · No jargon was harmed in the making of this app
        </p>
      </div>
    </main>
  );
}
