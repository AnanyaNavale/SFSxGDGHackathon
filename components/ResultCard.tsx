import type { AnalysisResult } from "@/lib/types";

export default function ResultCard({ result }: { result: AnalysisResult }) {
  if (result.error) {
    return (
      <section
        role="status"
        className="rounded-2xl border-2 border-stone-300 bg-stone-100 p-6 text-stone-900"
      >
        <p className="text-2xl font-semibold">We couldn&apos;t check this one</p>
        <p className="mt-3 text-xl leading-relaxed">
          Please be careful and verify before acting. Don&apos;t send money or
          share codes.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border-2 border-stone-300 bg-white p-6">
      {result.red_flags.length > 0 ? (
        <>
          <h2 className="text-2xl font-semibold text-stone-900">
            What stood out
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-xl leading-relaxed text-stone-800">
            {result.red_flags.map((flag) => (
              <li key={flag}>{flag}</li>
            ))}
          </ul>
          {result.risk_level !== "high" ? (
            <p className="mt-4 text-xl leading-relaxed text-stone-800">
              {result.plain_explanation}
            </p>
          ) : null}
        </>
      ) : (
        <p className="text-xl leading-relaxed text-stone-800">
          {result.plain_explanation}
        </p>
      )}
      {result.risk_level !== "high" ? (
        <p className="mt-4 text-xl leading-relaxed text-stone-900">
          {result.recommended_action}
        </p>
      ) : null}
    </section>
  );
}
