"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Progress,
} from "@lumora/ui";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

const MOCK_MILESTONES = [
  {
    id: "m-001",
    poolName: "AgriFinance Kenya Q3",
    title: "Seed Distribution Complete",
    releasePercent: 25,
    status: "submitted" as const,
    dueDate: "Jun 15, 2026",
  },
  {
    id: "m-002",
    poolName: "Solar Microgrid Lagos",
    title: "Site Survey & Permits",
    releasePercent: 15,
    status: "approved" as const,
    dueDate: "Jun 10, 2026",
  },
  {
    id: "m-003",
    poolName: "Creator Revenue Pool",
    title: "Album Release Verified",
    releasePercent: 30,
    status: "pending" as const,
    dueDate: "Jun 30, 2026",
  },
];

const statusIcon = {
  submitted: <Clock className="h-3.5 w-3.5 text-amber-400" />,
  approved: <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />,
  pending: <AlertCircle className="h-3.5 w-3.5 text-gray-400" />,
};

const statusVariant = {
  submitted: "warning" as const,
  approved: "success" as const,
  pending: "secondary" as const,
};

export function MilestoneQueue() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">Milestone Queue</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {MOCK_MILESTONES.map((m) => (
          <div
            key={m.id}
            className="rounded-lg border border-white/5 bg-white/3 p-3 space-y-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs font-medium text-white truncate">
                  {m.title}
                </p>
                <p className="text-[10px] text-gray-500 truncate">
                  {m.poolName}
                </p>
              </div>
              <Badge variant={statusVariant[m.status]} className="shrink-0 flex items-center gap-1">
                {statusIcon[m.status]}
                {m.status}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-[10px] text-gray-500">
              <span>Release: {m.releasePercent}%</span>
              <span>Due: {m.dueDate}</span>
            </div>
            {m.status === "submitted" && (
              <div className="flex gap-1.5">
                <Button size="sm" variant="lumora" className="h-6 text-[10px] px-2 flex-1">
                  Approve
                </Button>
                <Button size="sm" variant="outline" className="h-6 text-[10px] px-2 flex-1">
                  Reject
                </Button>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
