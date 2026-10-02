import { getGeminiApiClient, getVertexClient } from "./clients";
import { GEMINI_MODEL, GEMMA_MODEL } from "./config";
import { parseModelJson } from "./parse";
import {
  ANALYSIS_PROMPT,
  AUDIO_ANALYSIS_PROMPT,
  AUDIO_CHUNKS_TEXT,
} from "./prompt";
import { FALLBACK_RESULT, type AnalysisResult, type AudioChunk } from "./types";

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
        text: `${ANALYSIS_PROMPT}\n\nMessage or caption:\n${input.text}`,
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

    return parseModelJson(response.text);
  } catch {
    return FALLBACK_RESULT;
  }
}

export async function analyzeAudio(
  chunks: AudioChunk[],
): Promise<AnalysisResult> {
  try {
    if (chunks.length === 0) {
      return FALLBACK_RESULT;
    }

    const parts: Array<
      { text: string } | { inlineData: { mimeType: string; data: string } }
    > = chunks.map((chunk) => ({
      inlineData: {
        mimeType: chunk.mimeType,
        data: chunk.data,
      },
    }));

    parts.push({
      text: `${AUDIO_ANALYSIS_PROMPT}\n\n${AUDIO_CHUNKS_TEXT}`,
    });

    const client = getVertexClient();
    const response = await client.models.generateContent({
      model: GEMINI_MODEL,
      contents: [{ role: "user", parts }],
      config: {
        responseMimeType: "application/json",
      },
    });

    return parseModelJson(response.text);
  } catch (error) {
    console.error(error instanceof Error ? error.message : "Unexpected error");
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

  const match = /^data:([^;]+);base64,([\s\S]+)$/.exec(imageBase64);
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
