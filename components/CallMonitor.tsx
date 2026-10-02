"use client";

import FamilyAlertPanel from "@/components/FamilyAlertPanel";
import CalmAlert from "@/components/CalmAlert";
import ResultCard from "@/components/ResultCard";
import RiskMeter from "@/components/RiskMeter";
import { useCallMonitor } from "@/hooks/useCallMonitor";
import { useSmoothedRisk } from "@/hooks/useSmoothedRisk";
import { useEffect, useRef } from "react";
import { scrollResultsIntoView } from "./scrollResults";

const primaryButton =
  "min-h-14 w-full rounded-2xl bg-[#1f4d43] px-6 text-xl font-semibold text-white";
const quietButton =
  "min-h-14 rounded-2xl border-2 border-[#d9d3c8] bg-white px-6 text-xl font-semibold text-[#1c2430]";

export default function CallMonitor() {
  const { status, latest, analyzing, start, stop } = useCallMonitor();
  const { displayed, lastCheckFailed, clear } = useSmoothedRisk(latest);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!displayed) return;
    scrollResultsIntoView(resultsRef.current);
  }, [displayed?.risk_level]);

  if (status === "mic_error") {
    return (
      <div className="flex flex-col gap-4">
        <TaskHeading
          title="The microphone is blocked"
          detail="In Chrome, click the lock icon next to the address, set Microphone to Allow, then try again."
        />
        <button type="button" onClick={() => void start()} className={primaryButton}>
          Try again
        </button>
      </div>
    );
  }

  if (status === "idle") {
    return (
      <div className="flex flex-col gap-5">
        <TaskHeading
          title="Check a phone call"
          detail="Put your call on speaker and place the phone near this device."
        />
        <p className="rounded-2xl border border-[#e4dfd6] bg-[#fbfaf7] px-5 py-4 text-xl leading-relaxed text-[#3d4650]">
          Make sure your volume is up, then press the button below. Use Chrome.
        </p>
        <button type="button" onClick={() => void start()} className={primaryButton}>
          Start listening
        </button>
        <p className="text-center text-lg text-[#5c6570]">
          Audio is checked in short windows and is never saved.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <TaskHeading title="Listening" detail="Keep the call on speaker, near this device." />
      {!displayed || displayed.risk_level === "low" ? (
        <p className="text-xl leading-relaxed text-[#1f4d43]">
          Listening. Nothing worrying so far.
        </p>
      ) : null}
      {analyzing ? (
        <p className="text-xl text-[#3d4650]" role="status">
          Checking the last few seconds.
        </p>
      ) : null}
      {lastCheckFailed ? (
        <p className="rounded-2xl bg-[#f3f0e8] px-4 py-3 text-xl text-[#1c2430]" role="status">
          We couldn&apos;t check the last few seconds.
        </p>
      ) : null}
      {displayed ? (
        <div ref={resultsRef}>
          <RiskMeter level={displayed.risk_level} />
        </div>
      ) : null}
      {displayed ? <CalmAlert result={displayed} /> : null}
      {displayed && displayed.risk_level !== "low" ? (
        <ResultCard result={displayed} />
      ) : null}
      {displayed?.risk_level === "caution" || displayed?.risk_level === "high" ? (
        <FamilyAlertPanel level={displayed.risk_level} />
      ) : null}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={stop} className={quietButton}>
          Stop listening
        </button>
        {displayed && displayed.risk_level !== "low" ? (
          <button type="button" onClick={clear} className={quietButton}>
            Clear alert
          </button>
        ) : null}
      </div>
    </div>
  );
}

function TaskHeading({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="flex gap-3">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e5f6ee] text-[#1f4d43]" aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 14a3 3 0 0 0 3-3V7a3 3 0 1 0-6 0v4a3 3 0 0 0 3 3Z" stroke="currentColor" strokeWidth="1.8" />
          <path d="M7 11a5 5 0 0 0 10 0M12 16v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </span>
      <div>
        <p className="text-2xl font-semibold text-[#1c2430]">{title}</p>
        <p className="text-xl leading-relaxed text-[#52606a]">{detail}</p>
      </div>
    </div>
  );
}
