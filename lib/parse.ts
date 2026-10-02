import { FALLBACK_RESULT, type AnalysisResult } from "./types";

const RISK_LEVELS = new Set<AnalysisResult["risk_level"]>([
  "low",
  "caution",
  "high",
]);

export function extractJson(raw: string): string {
  const trimmed = raw.trim();
  const fenced = /^```(?:json)?\s*([\s\S]*?)\s*```$/i.exec(trimmed);
  return fenced ? fenced[1] : trimmed;
}

export function parseAnalysisResult(value: unknown): AnalysisResult {
  if (!value || typeof value !== "object") {
    throw new Error("Invalid analysis payload");
  }

  const record = value as Record<string, unknown>;
  const risk_level = record.risk_level;
  if (
    typeof risk_level !== "string" ||
    !RISK_LEVELS.has(risk_level as AnalysisResult["risk_level"])
  ) {
    throw new Error("Invalid risk_level");
  }

  if (!Array.isArray(record.red_flags)) {
    throw new Error("Invalid red_flags");
  }

  if (
    typeof record.plain_explanation !== "string" ||
    typeof record.recommended_action !== "string"
  ) {
    throw new Error("Invalid analysis fields");
  }

  return {
    risk_level: risk_level as AnalysisResult["risk_level"],
    red_flags: record.red_flags.filter(
      (flag): flag is string => typeof flag === "string",
    ),
    plain_explanation: record.plain_explanation,
    recommended_action: record.recommended_action,
  };
}

export function parseModelJson(raw: string | undefined): AnalysisResult {
  if (!raw) {
    return FALLBACK_RESULT;
  }

  return parseAnalysisResult(JSON.parse(extractJson(raw)));
}
