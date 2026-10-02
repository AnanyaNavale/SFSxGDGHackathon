export type AnalysisResult = {
  risk_level: "low" | "caution" | "high";
  red_flags: string[];
  plain_explanation: string;
  recommended_action: string;
  error?: boolean;
};

export type RiskLevel = AnalysisResult["risk_level"];

export type AudioChunk = {
  mimeType: string;
  data: string;
};

export const FALLBACK_RESULT: AnalysisResult = {
  risk_level: "caution",
  red_flags: [],
  plain_explanation:
    "We couldn't check this one. Please be careful and verify before acting.",
  recommended_action:
    "Don't send money or share codes. Contact the company using a number you already trust.",
  error: true,
};