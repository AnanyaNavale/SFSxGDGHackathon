import { analyzeAudio } from "@/lib/analyze";
import { MAX_AUDIO_BYTES, MAX_AUDIO_CHUNKS } from "@/lib/config";
import { FALLBACK_RESULT, type AudioChunk } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const entries = formData.getAll("audio");

    if (entries.length === 0 || entries.length > MAX_AUDIO_CHUNKS) {
      return Response.json(FALLBACK_RESULT);
    }

    const chunks: AudioChunk[] = [];

    for (const entry of entries) {
      if (!(entry instanceof File) || entry.size === 0) {
        return Response.json(FALLBACK_RESULT);
      }

      if (entry.size > MAX_AUDIO_BYTES) {
        return Response.json(FALLBACK_RESULT);
      }

      const buffer = Buffer.from(await entry.arrayBuffer());
      if (buffer.byteLength > MAX_AUDIO_BYTES) {
        return Response.json(FALLBACK_RESULT);
      }

      chunks.push({
        mimeType: stripMimeParameters(entry.type),
        data: buffer.toString("base64"),
      });
    }

    const result = await analyzeAudio(chunks);
    return Response.json(result);
  } catch (error) {
    console.error(error instanceof Error ? error.message : "Unexpected error");
    return Response.json(FALLBACK_RESULT);
  }
}

function stripMimeParameters(mimeType: string): string {
  const base = mimeType.split(";")[0]?.trim();
  return base || "audio/webm";
}
