import { GoogleGenAI } from "@google/genai";
import { GCP_LOCATION, GCP_PROJECT } from "./config";

let vertexClient: GoogleGenAI | undefined;
let geminiApiClient: GoogleGenAI | undefined;

export function getVertexClient(): GoogleGenAI {
  if (!vertexClient) {
    vertexClient = new GoogleGenAI({
      vertexai: true,
      project: GCP_PROJECT,
      location: GCP_LOCATION,
    });
  }
  return vertexClient;
}

export function getGeminiApiClient(): GoogleGenAI {
  if (!geminiApiClient) {
    geminiApiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }
  return geminiApiClient;
}
