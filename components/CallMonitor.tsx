"use client";

import FamilyAlertPanel from "@/components/FamilyAlertPanel";
import CalmAlert from "@/components/CalmAlert";
import ResultCard from "@/components/ResultCard";
import RiskMeter from "@/components/RiskMeter";
import { useCallMonitor } from "@/hooks/useCallMonitor";
import { useSmoothedRisk } from "@/hooks/useSmoothedRisk";

const buttonClass = "min-h-14 rounded-2xl px-6 text-xl font-semibold";

export default function CallMonitor() {
  const { status, latest, analyzing, start, stop } = useCallMonitor();
  const { displayed, lastCheckFailed, clear } = useSmoothedRisk(latest);

  if (status === "mic_error") {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-xl leading-relaxed text-stone-900">
          The microphone is blocked. In Chrome, click the lock icon next to the
          address, set Microphone to Allow, then try again.
        </p>
        <button type="button" onClick={() => void start()} className={`${buttonClass} bg-stone-900 text-white`}>
          Try again
        </button>
      </div>
    );
  }

  if (status === "idle") {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-xl leading-relaxed text-stone-900">
          Put the call on speaker, then press start. Use Chrome. For a demo,
          play the recording from a phone next to this laptop.
        </p>
        <button type="button" onClick={() => void start()} className={`${buttonClass} bg-stone-900 text-white`}>
          Start listening
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3 text-xl font-semibold text-green-900">
        <span aria-hidden="true" className="inline-block h-4 w-4 rounded-full bg-green-700" />
        Listening
      </div>
      {!displayed || displayed.risk_level === "low" ? (
        <p className="text-xl leading-relaxed text-green-900">
          Listening. Nothing worrying so far.
        </p>
      ) : null}
      {analyzing ? (
        <p className="text-xl text-stone-800" role="status">
          Checking the last few seconds.
        </p>
      ) : null}
      {lastCheckFailed ? (
        <p className="rounded-2xl bg-stone-200 px-4 py-3 text-xl text-stone-900" role="status">
          We couldn&apos;t check the last few seconds.
        </p>
      ) : null}
      {displayed ? <RiskMeter level={displayed.risk_level} /> : null}
      {displayed ? <CalmAlert result={displayed} /> : null}
      {displayed && displayed.risk_level !== "low" ? (
        <ResultCard result={displayed} />
      ) : null}
      {displayed?.risk_level === "caution" || displayed?.risk_level === "high" ? (
        <FamilyAlertPanel level={displayed.risk_level} />
      ) : null}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={stop} className={`${buttonClass} border-2 border-stone-400 bg-white text-stone-900`}>
          Stop listening
        </button>
        {displayed && displayed.risk_level !== "low" ? (
          <button type="button" onClick={clear} className={`${buttonClass} border-2 border-stone-400 bg-white text-stone-900`}>
            Clear alert
          </button>
        ) : null}
      </div>
    </div>
  );
}
