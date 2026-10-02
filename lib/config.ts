export const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
export const GEMMA_MODEL = process.env.GEMMA_MODEL ?? "gemma-4-26b-a4b-it";
export const GCP_PROJECT = process.env.GOOGLE_CLOUD_PROJECT ?? "";
export const GCP_LOCATION = process.env.GOOGLE_CLOUD_LOCATION ?? "us-central1";
export const MAX_AUDIO_CHUNKS = 4;
export const MAX_AUDIO_BYTES = 2_000_000;
export const MAX_TEXT_CHARS = 8_000;
export const MAX_IMAGE_BYTES = 4_000_000;
