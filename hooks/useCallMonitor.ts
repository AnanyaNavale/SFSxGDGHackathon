"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AnalysisResult } from "@/lib/types";

const CHUNK_MS = 7000;
const WINDOW = 3;

type Status = "idle" | "listening" | "mic_error";

const COULDNT_CHECK: AnalysisResult = {
  risk_level: "caution",
  red_flags: [],
  plain_explanation: "We couldn't check this one.",
  recommended_action: "Please be careful and verify before acting.",
  error: true,
};

function pickMime(): string {
  const options = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
  return options.find((mime) => MediaRecorder.isTypeSupported(mime)) ?? "";
}

export function useCallMonitor() {
  const [status, setStatus] = useState<Status>("idle");
  const [latest, setLatest] = useState<AnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const runningRef = useRef(false);
  const bufferRef = useRef<Blob[]>([]);
  const inFlightRef = useRef(false);
  const recordChunkRef = useRef<() => void>(() => {});

  const sendWindow = useCallback(async () => {
    if (inFlightRef.current || bufferRef.current.length === 0) return;
    inFlightRef.current = true;
    setAnalyzing(true);
    try {
      const form = new FormData();
      bufferRef.current.forEach((blob, index) => {
        const ext = blob.type.includes("mp4") ? "mp4" : "webm";
        form.append("audio", blob, `chunk${index}.${ext}`);
      });
      const response = await fetch("/api/analyze-audio", {
        method: "POST",
        body: form,
      });
      if (!response.ok) {
        setLatest(COULDNT_CHECK);
        return;
      }
      setLatest((await response.json()) as AnalysisResult);
    } catch {
      setLatest(COULDNT_CHECK);
    } finally {
      inFlightRef.current = false;
      setAnalyzing(false);
    }
  }, []);

  const recordChunk = useCallback(() => {
    if (!runningRef.current || !streamRef.current) return;
    const mime = pickMime();
    const recorder = new MediaRecorder(
      streamRef.current,
      mime ? { mimeType: mime } : undefined,
    );
    recorderRef.current = recorder;
    const parts: Blob[] = [];

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) parts.push(event.data);
    };
    recorder.onstop = () => {
      if (!runningRef.current) return;
      const blob = new Blob(parts, { type: recorder.mimeType });
      bufferRef.current = [...bufferRef.current, blob].slice(-WINDOW);
      void sendWindow();
      recordChunkRef.current();
    };

    recorder.start();
    window.setTimeout(() => {
      if (recorder.state === "recording") recorder.stop();
    }, CHUNK_MS);
  }, [sendWindow]);

  recordChunkRef.current = recordChunk;

  const stop = useCallback(() => {
    runningRef.current = false;
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    bufferRef.current = [];
    setAnalyzing(false);
    setStatus("idle");
  }, []);

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;
      runningRef.current = true;
      bufferRef.current = [];
      setLatest(null);
      setStatus("listening");
      recordChunkRef.current();
    } catch {
      setStatus("mic_error");
    }
  }, []);

  useEffect(() => stop, [stop]);

  return { status, latest, analyzing, start, stop };
}
