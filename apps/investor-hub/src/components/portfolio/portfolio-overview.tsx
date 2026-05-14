"use client";

import { StatCard } from "@lumora/ui";
import { DollarSign, TrendingUp, Coins, BarChart3 } from "lucide-react";

export function PortfolioOverview() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard
        title="Total Invested"
        value="$24,500"
        subtitle="Across 5 pools"
        icon={<DollarSign className="h-5 w-5" />}
        accentColor="violet"
      />
      <StatCard
        title="Total Yield Earned"
        value="$3,218"
        subtitle="All-time distributions"
        icon={<TrendingUp className="h-5 w-5" />}
        trend={{ value: 13.1, label: "annualized ROI" }}
        accentColor="emerald"
      />
      <StatCard
        title="Pending Yield"
        value="$412"
        subtitle="Ready to claim"
        icon={<Coins className="h-5 w-5" />}
        accentColor="amber"
      />
      <StatCard
        title="Portfolio Value"
        value="$27,718"
        subtitle="Invested + earned"
        icon={<BarChart3 className="h-5 w-5" />}
        trend={{ value: 13.1, label: "total return" }}
        accentColor="blue"
      />
    </div>
  );
}
