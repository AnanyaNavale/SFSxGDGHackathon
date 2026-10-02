"use client";

import { useState } from "react";
import CalmAlert from "@/components/CalmAlert";
import MessageChecker from "@/components/MessageChecker";
import PrivacyNote from "@/components/PrivacyNote";
import ResultCard from "@/components/ResultCard";
import RiskMeter from "@/components/RiskMeter";
import { MOCK_CAUTION, MOCK_HIGH, MOCK_LOW } from "@/hooks/mockResults";
import type { AnalysisResult } from "@/lib/types";

const PREVIEWS: { label: string; result: AnalysisResult }[] = [
  { label: "Example: looks okay", result: MOCK_LOW },
  { label: "Example: be careful", result: MOCK_CAUTION },
  { label: "Example: warning signs", result: MOCK_HIGH },
];

type Tab = "call" | "message";

export default function Home() {
  const [tab, setTab] = useState<Tab>("call");
  const [preview, setPreview] = useState<AnalysisResult | null>(null);

  return (
    <div className="min-h-full bg-stone-50 text-stone-900">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-5 py-8">
        <header>
          <h1 className="text-4xl font-bold tracking-tight">Scam Shield</h1>
          <p className="mt-3 text-xl leading-relaxed text-stone-800">
            A calm second look at a phone call or a message, so you can slow
            down before you act.
          </p>
        </header>

        <div role="tablist" aria-label="What to check" className="grid grid-cols-2 gap-3">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "call"}
            onClick={() => setTab("call")}
            className={`min-h-14 rounded-2xl px-4 text-xl font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900 ${
              tab === "call"
                ? "bg-stone-900 text-white"
                : "border-2 border-stone-400 bg-white text-stone-900"
            }`}
          >
            Listen to a call
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "message"}
            onClick={() => setTab("message")}
            className={`min-h-14 rounded-2xl px-4 text-xl font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900 ${
              tab === "message"
                ? "bg-stone-900 text-white"
                : "border-2 border-stone-400 bg-white text-stone-900"
            }`}
          >
            Check a message
          </button>
        </div>

        {tab === "call" ? (
          <section role="tabpanel" className="flex flex-col gap-6">
            <p className="text-xl leading-relaxed">
              Put the call on speaker, then press start. The microphone comes
              in the next step. For now, look at an example of each result.
            </p>
            <div className="flex flex-col gap-3">
              {PREVIEWS.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setPreview(item.result)}
                  className="min-h-14 rounded-2xl border-2 border-stone-400 bg-white px-6 text-left text-xl font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
                >
                  {item.label}
                </button>
              ))}
            </div>
            {preview ? (
              <div className="flex flex-col gap-4">
                <RiskMeter level={preview.risk_level} />
                <CalmAlert result={preview} />
                <ResultCard result={preview} />
              </div>
            ) : null}
          </section>
        ) : (
          <section role="tabpanel">
            <MessageChecker />
          </section>
        )}

        <footer className="border-t border-stone-300 pt-6">
          <PrivacyNote />
        </footer>
      </main>
    </div>
  );
}
