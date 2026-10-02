"use client";

import { useEffect, useRef, useState } from "react";
import type { AnalysisResult } from "@/lib/types";

const RANK = { low: 0, caution: 1, high: 2 } as const;

export function useSmoothedRisk(latest: AnalysisResult | null) {
  const [displayed, setDisplayed] = useState<AnalysisResult | null>(null);
  const [lastCheckFailed, setLastCheckFailed] = useState(false);
  const lowerCount = useRef(0);

  useEffect(() => {
    if (!latest) {
      setDisplayed(null);
      setLastCheckFailed(false);
      lowerCount.current = 0;
      return;
    }
    if (latest.error) {
      setLastCheckFailed(true);
      return;
    }
    setLastCheckFailed(false);
    setDisplayed((current) => {
      if (!current) return latest;
      const diff = RANK[latest.risk_level] - RANK[current.risk_level];
      if (diff >= 0) {
        lowerCount.current = 0;
        return latest;
      }
      lowerCount.current += 1;
      return lowerCount.current >= 2 ? latest : current;
    });
  }, [latest]);

  const clear = () => {
    setDisplayed(null);
    lowerCount.current = 0;
  };

  return { displayed, lastCheckFailed, clear };
}
