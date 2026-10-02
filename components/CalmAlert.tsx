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
      className="rounded-2xl border-2 border-orange-800 bg-orange-50 p-6 text-orange-950"
    >
      <p className="text-xl font-semibold">This {subject} has warning signs</p>
      <p className="mt-3 text-3xl font-bold leading-snug">
        {result.recommended_action}
      </p>
      <p className="mt-3 text-xl leading-relaxed">{result.plain_explanation}</p>
    </section>
  );
}
