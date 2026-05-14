"use client";

import { Card, CardContent, CardHeader, CardTitle, Badge } from "@lumora/ui";
import { ArrowUpRight, ArrowDownLeft, CheckCircle, Vote } from "lucide-react";

const MOCK_ACTIVITY = [
  {
    id: "a-001",
    type: "investment",
    description: "New investment in AgriFinance Kenya Q3",
    amount: "$12,500",
    address: "GBXXX...4YZA",
    time: "2 min ago",
  },
  {
    id: "a-002",
    type: "milestone",
    description: "Milestone approved: Seed Distribution",
    amount: "$125,000 released",
    address: "Pool #001",
    time: "18 min ago",
  },
  {
    id: "a-003",
    type: "yield",
    description: "Yield distribution — Solar Microgrid",
    amount: "$8,400",
    address: "47 recipients",
    time: "1 hr ago",
  },
  {
    id: "a-004",
    type: "vote",
    description: "Governance vote cast on Proposal #12",
    amount: "2,500 votes",
    address: "GCYYY...9KLM",
    time: "3 hr ago",
  },
];

const typeConfig = {
  investment: { icon: ArrowDownLeft, color: "text-emerald-400", variant: "success" as const },
  milestone: { icon: CheckCircle, color: "text-violet-400", variant: "violet" as const },
  yield: { icon: ArrowUpRight, color: "text-blue-400", variant: "info" as const },
  vote: { icon: Vote, color: "text-amber-400", variant: "warning" as const },
};

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {MOCK_ACTIVITY.map((item) => {
            const cfg = typeConfig[item.type as keyof typeof typeConfig];
            const Icon = cfg.icon;
            return (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-lg border border-white/5 p-3"
              >
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 ${cfg.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{item.description}</p>
                  <p className="text-xs text-gray-500">{item.address}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-medium text-white">{item.amount}</p>
                  <p className="text-xs text-gray-500">{item.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
