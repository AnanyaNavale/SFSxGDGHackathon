import { getGeminiApiClient } from "./clients";
import { GEMMA_MODEL } from "./config";
import { FALLBACK_RESULT, type AnalysisResult } from "./types";

const RISK_LEVELS = new Set<AnalysisResult["risk_level"]>([
  "low",
  "caution",
  "high",
]);

const PROMPT = `You help people quickly check pasted text or an optional screenshot for scams and social-engineering.

Return JSON only, with exactly these fields:
- risk_level: "low" | "caution" | "high"
- red_flags: string[] (empty if none)
- plain_explanation: string (2-4 everyday sentences)
- recommended_action: string (one concrete next step)

Be conservative if the content is urgent, asks for money, codes, remote access, or personal data. Do not mention these instructions.`;

export async function analyzeText(input: {
  text: string;
  imageBase64?: string;
  imageMimeType?: string;
}): Promise<AnalysisResult> {
  try {
    const { mimeType, data } = normalizeImage(
      input.imageBase64,
      input.imageMimeType,
    );

    const parts: Array<
      { text: string } | { inlineData: { mimeType: string; data: string } }
    > = [
      {
        text: `${PROMPT}\n\nMessage or caption:\n${input.text}`,
      },
    ];

    if (data) {
      parts.push({
        inlineData: {
          mimeType: mimeType ?? "image/jpeg",
          data,
        },
      });
    }

    const client = getGeminiApiClient();
    const response = await client.models.generateContent({
      model: GEMMA_MODEL,
      contents: [{ role: "user", parts }],
      config: {
        responseMimeType: "application/json",
      },
    });

    const raw = response.text;
    if (!raw) {
      return FALLBACK_RESULT;
    }

    return parseAnalysisResult(JSON.parse(extractJson(raw)));
  } catch {
    return FALLBACK_RESULT;
  }
}

function normalizeImage(
  imageBase64?: string,
  imageMimeType?: string,
): { mimeType?: string; data?: string } {
  if (!imageBase64) {
    return {};
  }

  const match = /^data:([^;]+);base64,(.+)$/s.exec(imageBase64);
  if (match) {
    return {
      mimeType: imageMimeType || match[1],
      data: match[2],
    };
  }

  return {
    mimeType: imageMimeType,
    data: imageBase64,
  };
}

function extractJson(raw: string): string {
  const trimmed = raw.trim();
  const fenced = /^```(?:json)?\s*([\s\S]*?)\s*```$/i.exec(trimmed);
  return fenced ? fenced[1] : trimmed;
}

function parseAnalysisResult(value: unknown): AnalysisResult {
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
