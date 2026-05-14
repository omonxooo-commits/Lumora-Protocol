import * as React from "react";
import { cn } from "../lib/utils";

export type RiskGrade = "AAA" | "AA" | "A" | "BBB" | "BB" | "B" | "CCC" | "D";

interface RiskBadgeProps {
  grade: RiskGrade;
  score?: number;
  showScore?: boolean;
  className?: string;
}

const gradeConfig: Record<
  RiskGrade,
  { label: string; color: string; bg: string; border: string }
> = {
  AAA: {
    label: "AAA",
    color: "text-emerald-300",
    bg: "bg-emerald-500/20",
    border: "border-emerald-500/40",
  },
  AA: {
    label: "AA",
    color: "text-emerald-400",
    bg: "bg-emerald-500/15",
    border: "border-emerald-500/30",
  },
  A: {
    label: "A",
    color: "text-green-400",
    bg: "bg-green-500/15",
    border: "border-green-500/30",
  },
  BBB: {
    label: "BBB",
    color: "text-blue-400",
    bg: "bg-blue-500/15",
    border: "border-blue-500/30",
  },
  BB: {
    label: "BB",
    color: "text-amber-400",
    bg: "bg-amber-500/15",
    border: "border-amber-500/30",
  },
  B: {
    label: "B",
    color: "text-orange-400",
    bg: "bg-orange-500/15",
    border: "border-orange-500/30",
  },
  CCC: {
    label: "CCC",
    color: "text-red-400",
    bg: "bg-red-500/15",
    border: "border-red-500/30",
  },
  D: {
    label: "D",
    color: "text-red-500",
    bg: "bg-red-500/20",
    border: "border-red-500/40",
  },
};

export function RiskBadge({
  grade,
  score,
  showScore = false,
  className,
}: RiskBadgeProps) {
  const config = gradeConfig[grade];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        config.bg,
        config.border,
        config.color,
        className
      )}
    >
      {config.label}
      {showScore && score !== undefined && (
        <span className="opacity-70">({score})</span>
      )}
    </span>
  );
}
