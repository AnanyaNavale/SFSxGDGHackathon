import { analyzeText } from "@/lib/analyze";
import { MAX_IMAGE_BYTES, MAX_TEXT_CHARS } from "@/lib/config";
import { FALLBACK_RESULT } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const { text, imageBase64, imageMimeType } = parseBody(body);

    if (text.length > MAX_TEXT_CHARS) {
      throw new Error("Text too long");
    }

    if (imageBase64 && decodedBase64Bytes(imageBase64) > MAX_IMAGE_BYTES) {
      throw new Error("Image too large");
    }

    const result = await analyzeText({
      text,
      imageBase64,
      imageMimeType,
    });

    return Response.json(result);
  } catch {
    return Response.json(FALLBACK_RESULT);
  }
}

function parseBody(body: unknown): {
  text: string;
  imageBase64?: string;
  imageMimeType?: string;
} {
  if (!body || typeof body !== "object") {
    throw new Error("Invalid JSON");
  }

  const record = body as Record<string, unknown>;
  if (typeof record.text !== "string" || record.text.trim().length === 0) {
    throw new Error("Missing text");
  }

  const imageBase64 =
    record.imageBase64 === undefined
      ? undefined
      : typeof record.imageBase64 === "string"
        ? record.imageBase64
        : invalid("imageBase64");

  const imageMimeType =
    record.imageMimeType === undefined
      ? undefined
      : typeof record.imageMimeType === "string"
        ? record.imageMimeType
        : invalid("imageMimeType");

  return {
    text: record.text,
    imageBase64,
    imageMimeType,
  };
}

function invalid(field: string): never {
  throw new Error(`Invalid ${field}`);
}

function decodedBase64Bytes(value: string): number {
  const payload = value.includes(",") ? value.slice(value.indexOf(",") + 1) : value;
  const compact = payload.replace(/\s/g, "");
  const padding = compact.endsWith("==") ? 2 : compact.endsWith("=") ? 1 : 0;
  return Math.max(0, Math.floor((compact.length * 3) / 4) - padding);
}
