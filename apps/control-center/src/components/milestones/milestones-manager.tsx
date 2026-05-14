"use client";

import {
  Card,
  CardContent,
  Badge,
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@lumora/ui";
import { CheckCircle, XCircle, Clock, FileText } from "lucide-react";

const MOCK_MILESTONES = [
  {
    id: "m-001",
    poolId: "pool-001",
    poolName: "AgriFinance Kenya Q3",
    title: "Seed Distribution Complete",
    description: "200 farmers received certified seeds. Verified by field agent.",
    releasePercent: 25,
    releaseAmount: 125_000,
    status: "submitted",
    submittedAt: "Jun 12, 2026",
    evidence: "ipfs://QmXxx...evidence",
    verifier: null,
  },
  {
    id: "m-002",
    poolId: "pool-002",
    poolName: "Solar Microgrid Lagos",
    title: "Site Survey & Permits",
    description: "Environmental survey completed. Building permits obtained from Lagos State.",
    releasePercent: 15,
    releaseAmount: 180_000,
    status: "approved",
    submittedAt: "Jun 8, 2026",
    evidence: "ipfs://QmYyy...permits",
    verifier: "GBVERIFIER...XYZ",
  },
  {
    id: "m-003",
    poolId: "pool-003",
    poolName: "Creator Revenue Pool",
    title: "Album Release Verified",
    description: "Streaming data from Spotify/Apple Music confirms release.",
    releasePercent: 30,
    releaseAmount: 75_000,
    status: "pending",
    submittedAt: null,
    evidence: null,
    verifier: null,
  },
];

export function MilestonesManager() {
  const submitted = MOCK_MILESTONES.filter((m) => m.status === "submitted");
  const approved = MOCK_MILESTONES.filter((m) => m.status === "approved");
  const pending = MOCK_MILESTONES.filter((m) => m.status === "pending");

  return (
    <Tabs defaultValue="submitted">
      <TabsList>
        <TabsTrigger value="submitted">
          Awaiting Review ({submitted.length})
        </TabsTrigger>
        <TabsTrigger value="approved">Approved ({approved.length})</TabsTrigger>
        <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="submitted" className="mt-4 space-y-4">
        {submitted.map((m) => (
          <MilestoneCard key={m.id} milestone={m} showActions />
        ))}
      </TabsContent>

      <TabsContent value="approved" className="mt-4 space-y-4">
        {approved.map((m) => (
          <MilestoneCard key={m.id} milestone={m} />
        ))}
      </TabsContent>

      <TabsContent value="pending" className="mt-4 space-y-4">
        {pending.map((m) => (
          <MilestoneCard key={m.id} milestone={m} />
        ))}
      </TabsContent>
    </Tabs>
  );
}

function MilestoneCard({
  milestone,
  showActions = false,
}: {
  milestone: (typeof MOCK_MILESTONES)[0];
  showActions?: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white">{milestone.title}</h3>
              <Badge
                variant={
                  milestone.status === "approved"
                    ? "success"
                    : milestone.status === "submitted"
                    ? "warning"
                    : "secondary"
                }
              >
                {milestone.status}
              </Badge>
            </div>
            <p className="text-sm text-gray-400">{milestone.description}</p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>Pool: {milestone.poolName}</span>
              <span>
                Release: {milestone.releasePercent}% ($
                {milestone.releaseAmount.toLocaleString()})
              </span>
              {milestone.submittedAt && (
                <span>Submitted: {milestone.submittedAt}</span>
              )}
            </div>
            {milestone.evidence && (
              <a
                href={milestone.evidence}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300"
              >
                <FileText className="h-3 w-3" />
                View Evidence
              </a>
            )}
          </div>

          {showActions && (
            <div className="flex gap-2 shrink-0">
              <Button variant="lumora" size="sm">
                <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                Approve & Release
              </Button>
              <Button variant="outline" size="sm">
                <XCircle className="h-3.5 w-3.5 mr-1.5" />
                Reject
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
