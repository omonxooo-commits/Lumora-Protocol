"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  StatCard,
  Progress,
  Separator,
} from "@lumora/ui";
import {
  ShieldCheck,
  User,
  Star,
  Globe,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

// Mock profile — in production fetched from IdentityRegistryContract
const MOCK_PROFILE = {
  address: "GBXXX...4YZA",
  did: "did:stellar:GBXXX4YZA",
  kycVerified: true,
  kycLevel: 2 as 0 | 1 | 2 | 3,
  jurisdiction: "KE",
  reputationScore: 847,
  totalProjects: 8,
  successfulProjects: 7,
  createdAt: "Jan 12, 2025",
};

const KYC_LEVELS = [
  { level: 0, label: "Unverified", description: "No identity verification" },
  { level: 1, label: "Basic", description: "Email + phone verified" },
  { level: 2, label: "Standard", description: "Government ID verified" },
  { level: 3, label: "Enhanced", description: "Full AML/KYC + accredited" },
];

const REPUTATION_FACTORS = [
  { label: "Project Success Rate", value: 87.5, max: 100 },
  { label: "Treasury Transparency", value: 92, max: 100 },
  { label: "Milestone Completion", value: 78, max: 100 },
  { label: "Investor Satisfaction", value: 91, max: 100 },
  { label: "Governance Participation", value: 65, max: 100 },
];

export function IdentityDashboard() {
  const successRate =
    MOCK_PROFILE.totalProjects > 0
      ? (MOCK_PROFILE.successfulProjects / MOCK_PROFILE.totalProjects) * 100
      : 0;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Reputation Score"
          value={MOCK_PROFILE.reputationScore.toString()}
          subtitle="Out of 1000"
          icon={<Star className="h-5 w-5" />}
          accentColor="amber"
        />
        <StatCard
          title="KYC Level"
          value={`Level ${MOCK_PROFILE.kycLevel}`}
          subtitle={KYC_LEVELS[MOCK_PROFILE.kycLevel].label}
          icon={<ShieldCheck className="h-5 w-5" />}
          accentColor="emerald"
        />
        <StatCard
          title="Success Rate"
          value={`${successRate.toFixed(0)}%`}
          subtitle={`${MOCK_PROFILE.successfulProjects}/${MOCK_PROFILE.totalProjects} projects`}
          icon={<CheckCircle className="h-5 w-5" />}
          accentColor="violet"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4 text-violet-400" />
              Identity Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                { label: "Wallet Address", value: MOCK_PROFILE.address },
                { label: "DID", value: MOCK_PROFILE.did },
                { label: "Jurisdiction", value: MOCK_PROFILE.jurisdiction },
                { label: "Member Since", value: MOCK_PROFILE.createdAt },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0">
                  <span className="text-sm text-gray-400">{label}</span>
                  <span className="text-sm text-white font-mono">{value}</span>
                </div>
              ))}
            </div>

            <Separator />

            {/* KYC Level Ladder */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                KYC Verification
              </p>
              {KYC_LEVELS.map((lvl) => (
                <div key={lvl.level} className="flex items-center gap-3">
                  {MOCK_PROFILE.kycLevel > lvl.level ? (
                    <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  ) : MOCK_PROFILE.kycLevel === lvl.level ? (
                    <Clock className="h-4 w-4 text-amber-400 shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-gray-600 shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className={`text-xs font-medium ${MOCK_PROFILE.kycLevel >= lvl.level ? "text-white" : "text-gray-600"}`}>
                      Level {lvl.level}: {lvl.label}
                    </p>
                    <p className="text-[10px] text-gray-500">{lvl.description}</p>
                  </div>
                  {MOCK_PROFILE.kycLevel === lvl.level && (
                    <Badge variant="warning" className="text-[10px]">Current</Badge>
                  )}
                </div>
              ))}
            </div>

            {MOCK_PROFILE.kycLevel < 3 && (
              <Button variant="lumora" size="sm" className="w-full">
                <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
                Upgrade to Level {MOCK_PROFILE.kycLevel + 1}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Reputation Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-400" />
              Reputation Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center py-4">
              <div className="text-center">
                <p className="text-5xl font-bold text-white">{MOCK_PROFILE.reputationScore}</p>
                <p className="text-sm text-gray-400 mt-1">Reputation Score</p>
                <Badge variant="success" className="mt-2">Top 15% of issuers</Badge>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              {REPUTATION_FACTORS.map((factor) => (
                <div key={factor.label} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">{factor.label}</span>
                    <span className="text-white font-medium">{factor.value}%</span>
                  </div>
                  <Progress value={factor.value} className="h-1.5" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
