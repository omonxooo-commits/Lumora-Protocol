"use client";

import {
  Card,
  CardContent,
  Badge,
  Button,
  Progress,
  RiskBadge,
} from "@lumora/ui";
import { formatCurrency, formatPercent } from "@lumora/ui";
import { Eye, MoreHorizontal } from "lucide-react";
import Link from "next/link";

const MOCK_POOLS = [
  {
    id: "pool-001",
    name: "AgriFinance Kenya Q3",
    category: "Agricultural Finance",
    target: 500_000,
    raised: 387_500,
    roi: 14.5,
    riskGrade: "A" as const,
    status: "active" as const,
    investors: 142,
    milestones: "2/4",
  },
  {
    id: "pool-002",
    name: "Solar Microgrid Lagos",
    category: "Community Infrastructure",
    target: 1_200_000,
    raised: 1_200_000,
    roi: 11.2,
    riskGrade: "BBB" as const,
    status: "funded" as const,
    investors: 389,
    milestones: "1/6",
  },
  {
    id: "pool-003",
    name: "Creator Revenue Pool",
    category: "Creator Economy",
    target: 250_000,
    raised: 98_000,
    roi: 22.0,
    riskGrade: "BB" as const,
    status: "active" as const,
    investors: 67,
    milestones: "0/3",
  },
];

const statusVariant = {
  active: "success" as const,
  funded: "info" as const,
  completed: "secondary" as const,
  paused: "warning" as const,
};

export function PoolsTable() {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Pool
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  ROI
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Risk
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Investors
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Milestones
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {MOCK_POOLS.map((pool) => {
                const progress = (pool.raised / pool.target) * 100;
                return (
                  <tr key={pool.id} className="hover:bg-white/2 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-white">{pool.name}</p>
                        <p className="text-xs text-gray-500">{pool.category}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-32 space-y-1">
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>{formatCurrency(pool.raised)}</span>
                          <span>{progress.toFixed(0)}%</span>
                        </div>
                        <Progress value={progress} className="h-1.5" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-emerald-400">
                        {formatPercent(pool.roi)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <RiskBadge grade={pool.riskGrade} />
                    </td>
                    <td className="px-6 py-4 text-gray-300">{pool.investors}</td>
                    <td className="px-6 py-4 text-gray-300">{pool.milestones}</td>
                    <td className="px-6 py-4">
                      <Badge variant={statusVariant[pool.status]}>
                        {pool.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/pools/${pool.id}`}>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
