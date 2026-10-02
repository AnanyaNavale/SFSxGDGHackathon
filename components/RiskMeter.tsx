import type { RiskLevel } from "@/lib/types";

const LEVELS = {
  low: {
    label: "Looks okay",
    icon: "✓",
    bar: "w-1/3 bg-green-700",
    text: "text-green-900",
  },
  caution: {
    label: "Be careful",
    icon: "!",
    bar: "w-2/3 bg-amber-600",
    text: "text-amber-950",
  },
  high: {
    label: "Warning signs",
    icon: "⚠",
    bar: "w-full bg-orange-800",
    text: "text-orange-950",
  },
} as const;

export default function RiskMeter({ level }: { level: RiskLevel }) {
  const info = LEVELS[level];

  return (
    <div aria-live="polite">
      <p className={`text-2xl font-semibold ${info.text}`}>
        <span aria-hidden="true">{info.icon} </span>
        {info.label}
      </p>
      <div className="mt-3 h-4 w-full rounded-full bg-stone-200" aria-hidden="true">
        <div
          className={`h-4 rounded-full motion-reduce:transition-none transition-all duration-700 ${info.bar}`}
        />
      </div>
    </div>
  );
}
