"use client";

import { useState } from "react";
import type { AnalysisResult } from "@/lib/types";
import {
  MOCK_HIGH,
  MOCK_LOW,
  NORMAL_SAMPLE,
  SCAM_SAMPLE,
} from "@/hooks/mockResults";
import CalmAlert from "./CalmAlert";
import ResultCard from "./ResultCard";
import RiskMeter from "./RiskMeter";

const useMock = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

export default function MessageChecker() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function checkMessage(message: string) {
    const trimmed = message.trim();
    if (!trimmed) return;

    setLoading(true);
    try {
      if (useMock) {
        const looksRisky = /gift card|jail|password|urgent|don't tell|dont tell/i.test(
          trimmed,
        );
        setResult(looksRisky ? MOCK_HIGH : MOCK_LOW);
        return;
      }

      const response = await fetch("/api/analyze-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed }),
      });
      setResult((await response.json()) as AnalysisResult);
    } catch {
      setResult({
        risk_level: "caution",
        red_flags: [],
        plain_explanation: "We couldn't check this one.",
        recommended_action:
          "Please be careful and verify before acting.",
        error: true,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <label htmlFor="message" className="text-xl font-semibold text-stone-900">
        Paste a text or email
      </label>
      <textarea
        id="message"
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={6}
        placeholder="Paste the message here"
        className="w-full rounded-2xl border-2 border-stone-400 bg-white p-4 text-xl leading-relaxed text-stone-900"
      />
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => checkMessage(text)}
          disabled={loading || text.trim().length === 0}
          aria-busy={loading}
          className="min-h-14 rounded-2xl bg-stone-900 px-6 text-xl font-semibold text-white disabled:bg-stone-300 disabled:text-stone-800"
        >
          {loading ? "Checking…" : "Check this message"}
        </button>
        <button
          type="button"
          onClick={() => {
            setText(SCAM_SAMPLE);
            void checkMessage(SCAM_SAMPLE);
          }}
          className="min-h-14 rounded-2xl border-2 border-stone-400 bg-white px-6 text-xl font-semibold text-stone-900"
        >
          Try a scam text
        </button>
        <button
          type="button"
          onClick={() => {
            setText(NORMAL_SAMPLE);
            void checkMessage(NORMAL_SAMPLE);
          }}
          className="min-h-14 rounded-2xl border-2 border-stone-400 bg-white px-6 text-xl font-semibold text-stone-900"
        >
          Try a normal text
        </button>
      </div>
      {result ? (
        <div className="flex flex-col gap-4">
          {result.error ? null : <RiskMeter level={result.risk_level} />}
          <CalmAlert result={result} subject="message" />
          <ResultCard result={result} />
        </div>
      ) : null}
    </div>
  );
}
