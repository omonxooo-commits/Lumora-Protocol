"use client";

import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Progress, StatCard } from "@lumora/ui";
import { Vote, Coins } from "lucide-react";

const PROPOSALS = [
  {
    id: "prop-001",
    title: "Adjust Risk Oracle Weights for Agricultural Pools",
    type: "risk_params",
    status: "active",
    votesFor: 145_000,
    votesAgainst: 32_000,
    quorum: 200_000,
    endDate: "Jun 20, 2026",
    myVote: null as "for" | "against" | null,
  },
  {
    id: "prop-002",
    title: "Freeze Escrow — Pool #003 Dispute",
    type: "milestone_dispute",
    status: "active",
    votesFor: 89_000,
    votesAgainst: 12_000,
    quorum: 100_000,
    endDate: "Jun 16, 2026",
    myVote: "for" as "for" | "against" | null,
  },
];

export function InvestorGovernance() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          title="Voting Power"
          value="2,500 LMR"
          subtitle="Based on staked balance"
          icon={<Vote className="h-5 w-5" />}
          accentColor="violet"
        />
        <StatCard
          title="Proposals Voted"
          value="7"
          subtitle="Out of 12 active"
          icon={<Coins className="h-5 w-5" />}
          accentColor="emerald"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Active Proposals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {PROPOSALS.map((p) => {
            const total = p.votesFor + p.votesAgainst;
            const forPct = total > 0 ? (p.votesFor / total) * 100 : 0;
            const quorumPct = Math.min((total / p.quorum) * 100, 100);
            return (
              <div key={p.id} className="rounded-lg border border-white/5 p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{p.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Ends: {p.endDate}</p>
                  </div>
                  {p.myVote && (
                    <Badge variant={p.myVote === "for" ? "success" : "destructive"}>
                      Voted {p.myVote}
                    </Badge>
                  )}
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>For: {(p.votesFor / 1000).toFixed(0)}K ({forPct.toFixed(1)}%)</span>
                    <span>Against: {(p.votesAgainst / 1000).toFixed(0)}K</span>
                  </div>
                  <Progress value={forPct} />
                  <p className="text-[10px] text-gray-500">
                    Quorum: {quorumPct.toFixed(0)}% reached
                  </p>
                </div>
                {!p.myVote && (
                  <div className="flex gap-2">
                    <Button variant="lumora" size="sm">
                      <Vote className="h-3.5 w-3.5 mr-1.5" />
                      Vote For
                    </Button>
                    <Button variant="outline" size="sm">Vote Against</Button>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
