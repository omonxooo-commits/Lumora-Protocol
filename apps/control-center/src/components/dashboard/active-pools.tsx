"use client";

import { Card, CardContent, CardHeader, CardTitle, PoolCard } from "@lumora/ui";
import type { PoolCardProps } from "@lumora/ui";

const MOCK_POOLS: PoolCardProps[] = [
  {
    id: "pool-001",
    name: "AgriFinance Kenya Q3",
    issuer: "GreenHarvest Cooperative",
    description: "Tokenized crop financing for 200 smallholder farmers in Rift Valley. Funds cover seeds, fertilizer, and logistics.",
    targetAmount: 500_000,
    raisedAmount: 387_500,
    roi: 14.5,
    duration: "6 months",
    riskGrade: "A",
    category: "Agricultural Finance",
    status: "active",
  },
  {
    id: "pool-002",
    name: "Solar Microgrid Lagos",
    issuer: "SunBridge Energy",
    description: "Community solar infrastructure for 3 underserved neighborhoods. Revenue from energy sales distributed to investors.",
    targetAmount: 1_200_000,
    raisedAmount: 1_200_000,
    roi: 11.2,
    duration: "24 months",
    riskGrade: "BBB",
    category: "Community Infrastructure",
    status: "funded",
  },
  {
    id: "pool-003",
    name: "Creator Revenue Pool — Afrobeats",
    issuer: "Rhythm DAO",
    description: "Tokenized streaming revenue from 12 independent artists. Fans invest early and receive proportional yield.",
    targetAmount: 250_000,
    raisedAmount: 98_000,
    roi: 22.0,
    duration: "12 months",
    riskGrade: "BB",
    category: "Creator Economy",
    status: "active",
  },
];

export function ActivePools() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Active Pools</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_POOLS.map((pool) => (
            <PoolCard
              key={pool.id}
              {...pool}
              onView={(id) => console.log("view", id)}
              onInvest={(id) => console.log("invest", id)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
