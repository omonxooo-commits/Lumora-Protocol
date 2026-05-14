"use client";

import {
  Card,
  CardContent,
  Badge,
  Button,
  Progress,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@lumora/ui";
import { Vote, Clock, CheckCircle } from "lucide-react";

const MOCK_PROPOSALS = [
  {
    id: "prop-001",
    title: "Adjust Risk Oracle Weights for Agricultural Pools",
    description:
      "Proposal to increase the weight of on-chain repayment history from 20% to 35% in the risk scoring model.",
    type: "risk_params",
    status: "active",
    votesFor: 145_000,
    votesAgainst: 32_000,
    quorum: 200_000,
    endDate: "Jun 20, 2026",
    proposer: "GBPROP...XYZ",
  },
  {
    id: "prop-002",
    title: "Freeze Escrow — Pool #003 Dispute",
    description:
      "Emergency freeze request for Creator Revenue Pool due to unresolved milestone evidence dispute.",
    type: "milestone_dispute",
    status: "active",
    votesFor: 89_000,
    votesAgainst: 12_000,
    quorum: 100_000,
    endDate: "Jun 16, 2026",
    proposer: "GBINV...ABC",
  },
  {
    id: "prop-003",
    title: "Reduce Protocol Fee from 1.5% to 1.0%",
    description:
      "Community proposal to reduce the protocol fee to improve competitiveness with traditional DeFi platforms.",
    type: "fee_structure",
    status: "passed",
    votesFor: 312_000,
    votesAgainst: 45_000,
    quorum: 200_000,
    endDate: "Jun 5, 2026",
    proposer: "GBDAO...MNO",
  },
];

const typeLabels: Record<string, string> = {
  risk_params: "Risk Params",
  milestone_dispute: "Dispute",
  fee_structure: "Fee Structure",
  treasury_allocation: "Treasury",
  pool_upgrade: "Pool Upgrade",
  emergency: "Emergency",
};

export function ProposalsList() {
  const active = MOCK_PROPOSALS.filter((p) => p.status === "active");
  const closed = MOCK_PROPOSALS.filter((p) => p.status !== "active");

  return (
    <Tabs defaultValue="active">
      <TabsList>
        <TabsTrigger value="active">Active ({active.length})</TabsTrigger>
        <TabsTrigger value="closed">Closed ({closed.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="active" className="mt-4 space-y-4">
        {active.map((p) => (
          <ProposalCard key={p.id} proposal={p} />
        ))}
      </TabsContent>

      <TabsContent value="closed" className="mt-4 space-y-4">
        {closed.map((p) => (
          <ProposalCard key={p.id} proposal={p} />
        ))}
      </TabsContent>
    </Tabs>
  );
}

function ProposalCard({ proposal }: { proposal: (typeof MOCK_PROPOSALS)[0] }) {
  const totalVotes = proposal.votesFor + proposal.votesAgainst;
  const forPercent = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;
  const quorumPercent = Math.min(
    (totalVotes / proposal.quorum) * 100,
    100
  );

  return (
    <Card>
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-white">{proposal.title}</h3>
              <Badge variant="outline" className="text-xs">
                {typeLabels[proposal.type] ?? proposal.type}
              </Badge>
              <Badge
                variant={proposal.status === "active" ? "info" : "success"}
              >
                {proposal.status}
              </Badge>
            </div>
            <p className="text-sm text-gray-400">{proposal.description}</p>
            <p className="text-xs text-gray-500">
              Proposer: {proposal.proposer} · Ends: {proposal.endDate}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-400">
            <span>
              For: {(proposal.votesFor / 1000).toFixed(0)}K (
              {forPercent.toFixed(1)}%)
            </span>
            <span>
              Against: {(proposal.votesAgainst / 1000).toFixed(0)}K
            </span>
          </div>
          <Progress value={forPercent} />
          <div className="flex justify-between text-xs text-gray-500">
            <span>
              Quorum: {(totalVotes / 1000).toFixed(0)}K /{" "}
              {(proposal.quorum / 1000).toFixed(0)}K ({quorumPercent.toFixed(0)}
              %)
            </span>
          </div>
        </div>

        {proposal.status === "active" && (
          <div className="flex gap-2">
            <Button variant="lumora" size="sm">
              <Vote className="h-3.5 w-3.5 mr-1.5" />
              Vote For
            </Button>
            <Button variant="outline" size="sm">
              Vote Against
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
