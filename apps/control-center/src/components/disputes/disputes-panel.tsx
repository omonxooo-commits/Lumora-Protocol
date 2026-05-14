"use client";

import { Card, CardContent, Badge, Button } from "@lumora/ui";
import { AlertTriangle, Lock, Unlock } from "lucide-react";

const MOCK_DISPUTES = [
  {
    id: "d-001",
    poolId: "pool-003",
    poolName: "Creator Revenue Pool",
    milestoneTitle: "Album Release Verified",
    reason: "Streaming data provided does not match claimed release date. Evidence appears fabricated.",
    raisedBy: "GBINV...ABC",
    status: "open",
    escrowFrozen: true,
    raisedAt: "Jun 11, 2026",
  },
];

export function DisputesPanel() {
  if (MOCK_DISPUTES.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <AlertTriangle className="h-10 w-10 text-gray-600 mb-3" />
          <p className="text-gray-400">No active disputes</p>
          <p className="text-sm text-gray-600 mt-1">
            All milestone verifications are proceeding normally
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {MOCK_DISPUTES.map((d) => (
        <Card key={d.id} className="border-red-500/20">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <h3 className="font-semibold text-white">
                    {d.milestoneTitle}
                  </h3>
                  <Badge variant="destructive">Disputed</Badge>
                  {d.escrowFrozen && (
                    <Badge variant="warning" className="flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      Escrow Frozen
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-400">Pool: {d.poolName}</p>
                <p className="text-sm text-gray-300 mt-2">{d.reason}</p>
                <p className="text-xs text-gray-500">
                  Raised by: {d.raisedBy} · {d.raisedAt}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="lumora" size="sm">
                <Unlock className="h-3.5 w-3.5 mr-1.5" />
                Resolve & Release
              </Button>
              <Button variant="outline" size="sm">
                Escalate to DAO
              </Button>
              <Button variant="outline" size="sm" className="text-red-400 border-red-500/30 hover:bg-red-500/10">
                Confirm Freeze
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
