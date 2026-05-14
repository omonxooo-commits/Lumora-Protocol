"use client";

import { StatCard } from "@lumora/ui";
import { DollarSign, TrendingUp, Users, Layers } from "lucide-react";

// In production these come from @lumora/analytics + API
const MOCK_STATS = {
  tvl: "$4,820,000",
  totalRaised: "$12,340,000",
  investors: "1,847",
  activePools: "23",
};

export function TreasuryOverview() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard
        title="Total Value Locked"
        value={MOCK_STATS.tvl}
        subtitle="Across all escrow vaults"
        icon={<DollarSign className="h-5 w-5" />}
        trend={{ value: 12.4, label: "vs last month" }}
        accentColor="violet"
      />
      <StatCard
        title="Total Raised"
        value={MOCK_STATS.totalRaised}
        subtitle="Cumulative protocol volume"
        icon={<TrendingUp className="h-5 w-5" />}
        trend={{ value: 8.1, label: "vs last month" }}
        accentColor="emerald"
      />
      <StatCard
        title="Active Investors"
        value={MOCK_STATS.investors}
        subtitle="Unique wallet addresses"
        icon={<Users className="h-5 w-5" />}
        trend={{ value: 5.3, label: "vs last month" }}
        accentColor="blue"
      />
      <StatCard
        title="Active Pools"
        value={MOCK_STATS.activePools}
        subtitle="Currently fundraising"
        icon={<Layers className="h-5 w-5" />}
        trend={{ value: -2, label: "vs last month" }}
        accentColor="amber"
      />
    </div>
  );
}
