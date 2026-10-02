"use client";

import { useEffect, useRef, useState } from "react";
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
import { scrollResultsIntoView } from "./scrollResults";

const useMock = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

export default function MessageChecker() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!result || loading) return;
    scrollResultsIntoView(resultsRef.current);
  }, [result, loading]);

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
    <div className="flex flex-col gap-5">
      <div className="flex gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e5f6ee] text-[#1f4d43]" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M6 16.5 4 20l4-1.5A9 9 0 1 0 6 16.5Z" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        </span>
        <div>
          <p className="text-2xl font-semibold text-[#1c2430]">Check a text or email</p>
          <p className="text-xl leading-relaxed text-[#52606a]">
            Paste the full message below. Don&apos;t include passwords.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <label htmlFor="message" className="text-xl font-semibold text-[#1c2430]">
          Message to check
        </label>
        <p id="message-wait" className="text-base text-[#52606a]">
          Allow up to 20 seconds for results to load.
        </p>
      </div>
      <textarea
        id="message"
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={5}
        placeholder="Paste the message here"
        aria-describedby="message-wait"
        className="w-full rounded-2xl border border-[#e4dfd6] bg-white p-4 text-xl leading-relaxed text-[#1c2430]"
      />
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-lg text-[#52606a]">Need an example?</p>
        <button
          type="button"
          onClick={() => {
            setText(SCAM_SAMPLE);
            void checkMessage(SCAM_SAMPLE);
          }}
          className="min-h-12 rounded-full bg-[#efeaf6] px-4 text-lg font-semibold text-[#3d3550]"
        >
          Try a scam text
        </button>
        <button
          type="button"
          onClick={() => {
            setText(NORMAL_SAMPLE);
            void checkMessage(NORMAL_SAMPLE);
          }}
          className="min-h-12 rounded-full bg-[#efeaf6] px-4 text-lg font-semibold text-[#3d3550]"
        >
          Try a normal text
        </button>
      </div>
      <button
        type="button"
        onClick={() => checkMessage(text)}
        disabled={loading || text.trim().length === 0}
        aria-busy={loading}
        className="min-h-14 rounded-2xl bg-[#1f4d43] px-6 text-xl font-semibold text-white disabled:bg-[#d9d3c8] disabled:text-[#3d4650]"
      >
        {loading ? "Checking…" : "Check this message"}
      </button>
      {result ? (
        <div ref={resultsRef} className="flex flex-col gap-4">
          {result.error ? null : <RiskMeter level={result.risk_level} />}
          <CalmAlert result={result} subject="message" />
          <ResultCard result={result} />
        </div>
      ) : null}
    </div>
  );
}
