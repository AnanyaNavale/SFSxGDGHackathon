import type { RiskLevel } from "@/lib/types";

const MESSAGES = {
  caution:
    "Mom may be on a call with some warning signs. Please check in when you can.",
  high: "Mom may be on a suspicious call right now. It has several scam warning signs. Please check in.",
} as const;

export default function FamilyAlertPanel({
  level,
}: {
  level: Extract<RiskLevel, "caution" | "high">;
}) {
  return (
    <section className="rounded-2xl border-2 border-stone-300 bg-white p-6">
      <p className="text-xl font-semibold text-stone-800">Demo simulation</p>
      <p className="mt-3 text-xl leading-relaxed text-stone-900">
        Text sent to Maria (daughter):
      </p>
      <p className="mt-3 rounded-2xl bg-stone-100 p-4 text-xl leading-relaxed text-stone-900">
        {MESSAGES[level]}
      </p>
    </section>
  );
}
