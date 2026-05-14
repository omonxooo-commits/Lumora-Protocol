import * as React from "react";
import { cn, formatCurrency, formatPercent } from "../lib/utils";
import { Card, CardContent, CardFooter, CardHeader } from "./card";
import { Badge } from "./badge";
import { Progress } from "./progress";
import { RiskBadge, type RiskGrade } from "./risk-badge";
import { Button } from "./button";

export interface PoolCardProps {
  id: string;
  name: string;
  issuer: string;
  description: string;
  targetAmount: number;
  raisedAmount: number;
  roi: number;
  duration: string;
  riskGrade: RiskGrade;
  category: string;
  status: "active" | "funded" | "completed" | "paused";
  onInvest?: (id: string) => void;
  onView?: (id: string) => void;
  className?: string;
}

const statusConfig = {
  active: { label: "Active", variant: "success" as const },
  funded: { label: "Funded", variant: "info" as const },
  completed: { label: "Completed", variant: "secondary" as const },
  paused: { label: "Paused", variant: "warning" as const },
};

export function PoolCard({
  id,
  name,
  issuer,
  description,
  targetAmount,
  raisedAmount,
  roi,
  duration,
  riskGrade,
  category,
  status,
  onInvest,
  onView,
  className,
}: PoolCardProps) {
  const progress = Math.min((raisedAmount / targetAmount) * 100, 100);
  const statusCfg = statusConfig[status];

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate">{name}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{issuer}</p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <RiskBadge grade={riskGrade} />
            <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
          </div>
        </div>
        <p className="text-sm text-gray-400 line-clamp-2 mt-2">{description}</p>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-lg bg-white/5 p-2">
            <p className="text-xs text-gray-400">Target</p>
            <p className="text-sm font-semibold text-white">
              {formatCurrency(targetAmount)}
            </p>
          </div>
          <div className="rounded-lg bg-white/5 p-2">
            <p className="text-xs text-gray-400">ROI</p>
            <p className="text-sm font-semibold text-emerald-400">
              {formatPercent(roi)}
            </p>
          </div>
          <div className="rounded-lg bg-white/5 p-2">
            <p className="text-xs text-gray-400">Duration</p>
            <p className="text-sm font-semibold text-white">{duration}</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Raised: {formatCurrency(raisedAmount)}</span>
            <span>{progress.toFixed(1)}%</span>
          </div>
          <Progress value={progress} />
        </div>

        <Badge variant="outline" className="text-xs">
          {category}
        </Badge>
      </CardContent>

      <CardFooter className="gap-2 pt-4">
        {onView && (
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onView(id)}
          >
            View Details
          </Button>
        )}
        {onInvest && status === "active" && (
          <Button
            variant="lumora"
            size="sm"
            className="flex-1"
            onClick={() => onInvest(id)}
          >
            Invest
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
