"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Progress,
  RiskBadge,
} from "@lumora/ui";
import { formatCurrency, formatPercent } from "@lumora/ui";
import { ArrowUpRight } from "lucide-react";

const POSITIONS = [
  {
    id: "pool-001",
    name: "AgriFinance Kenya Q3",
    invested: 5_000,
    currentValue: 5_620,
    pendingYield: 180,
    roi: 12.4,
    riskGrade: "A" as const,
    status: "active" as const,
    progress: 77.5,
    maturity: "Dec 2026",
  },
  {
    id: "pool-002",
    name: "Solar Microgrid Lagos",
    invested: 10_000,
    currentValue: 11_120,
    pendingYield: 232,
    roi: 11.2,
    riskGrade: "BBB" as const,
    status: "funded" as const,
    progress: 100,
    maturity: "Jun 2028",
  },
  {
    id: "pool-003",
    name: "Creator Revenue Pool",
    invested: 2_500,
    currentValue: 2_618,
    pendingYield: 0,
    roi: 4.7,
    riskGrade: "BB" as const,
    status: "active" as const,
    progress: 39.2,
    maturity: "Jun 2027",
  },
  {
    id: "pool-004",
    name: "SME Invoice Finance — Nairobi",
    invested: 7_000,
    currentValue: 7_980,
    pendingYield: 0,
    roi: 14.0,
    riskGrade: "A" as const,
    status: "active" as const,
    progress: 65,
    maturity: "Sep 2026",
  },
];

const statusVariant = {
  active: "success" as const,
  funded: "info" as const,
  completed: "secondary" as const,
  paused: "warning" as const,
};

export function PortfolioPositions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">My Positions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {POSITIONS.map((pos) => (
          <div
            key={pos.id}
            className="rounded-lg border border-white/5 bg-white/3 p-4 space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-white text-sm">{pos.name}</p>
                  <RiskBadge grade={pos.riskGrade} />
                  <Badge variant={statusVariant[pos.status]}>{pos.status}</Badge>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">Matures: {pos.maturity}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center">
              <div>
                <p className="text-[10px] text-gray-500">Invested</p>
                <p className="text-xs font-semibold text-white">{formatCurrency(pos.invested)}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500">Value</p>
                <p className="text-xs font-semibold text-white">{formatCurrency(pos.currentValue)}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500">ROI</p>
                <p className="text-xs font-semibold text-emerald-400">{formatPercent(pos.roi)}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500">Pending</p>
                <p className={`text-xs font-semibold ${pos.pendingYield > 0 ? "text-amber-400" : "text-gray-500"}`}>
                  {pos.pendingYield > 0 ? formatCurrency(pos.pendingYield) : "—"}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-gray-500">
                <span>Pool funding progress</span>
                <span>{pos.progress}%</span>
              </div>
              <Progress value={pos.progress} className="h-1" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
