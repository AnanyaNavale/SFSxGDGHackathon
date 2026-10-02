import type { AnalysisResult } from "@/lib/types";

export default function CalmAlert({
  result,
  subject = "call",
}: {
  result: AnalysisResult;
  subject?: "call" | "message";
}) {
  if (result.error || result.risk_level !== "high") return null;

  return (
    <section
      role="alert"
      className="rounded-2xl border border-[#e7c9a4] bg-[#fbf6ee] p-6 text-[#6b3a12]"
    >
      <p className="text-xl font-semibold">This {subject} has warning signs</p>
      <p className="mt-3 text-3xl font-bold leading-snug">
        {result.recommended_action}
      </p>
      <p className="mt-3 text-xl leading-relaxed">{result.plain_explanation}</p>
    </section>
  );
}
