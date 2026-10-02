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
    <section className="rounded-2xl border border-[#e4dfd6] bg-[#fbfaf7] p-6">
      <p className="text-xl font-semibold text-[#52606a]">Demo simulation</p>
      <p className="mt-3 text-xl leading-relaxed text-[#1c2430]">
        Text sent to Maria (daughter):
      </p>
      <p className="mt-3 rounded-2xl bg-white p-4 text-xl leading-relaxed text-[#1c2430]">
        {MESSAGES[level]}
      </p>
    </section>
  );
}
