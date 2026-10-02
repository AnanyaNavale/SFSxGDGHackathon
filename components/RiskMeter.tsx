import type { RiskLevel } from "@/lib/types";

const LEVELS = {
  low: {
    label: "Looks okay",
    icon: "✓",
    bar: "w-1/3 bg-[#2f6b4f]",
    text: "text-[#1f4d43]",
  },
  caution: {
    label: "Be careful",
    icon: "!",
    bar: "w-2/3 bg-[#c9842a]",
    text: "text-[#8a4b12]",
  },
  high: {
    label: "Warning signs",
    icon: "⚠",
    bar: "w-full bg-[#c2410c]",
    text: "text-[#9a3412]",
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
      <div className="mt-3 h-4 w-full rounded-full bg-[#efeae2]" aria-hidden="true">
        <div
          className={`h-4 rounded-full motion-reduce:transition-none transition-all duration-700 ${info.bar}`}
        />
      </div>
    </div>
  );
}
