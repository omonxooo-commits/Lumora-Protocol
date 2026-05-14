"use client";

import { StatCard, Card, CardContent, CardHeader, CardTitle } from "@lumora/ui";
import { DollarSign, ArrowUpRight, ArrowDownLeft, Percent } from "lucide-react";

export function TreasuryDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Protocol Treasury"
          value="$284,500"
          subtitle="Accumulated fees"
          icon={<DollarSign className="h-5 w-5" />}
          accentColor="violet"
        />
        <StatCard
          title="Total Inflows"
          value="$12,340,000"
          subtitle="All-time raised"
          icon={<ArrowDownLeft className="h-5 w-5" />}
          trend={{ value: 8.1, label: "this month" }}
          accentColor="emerald"
        />
        <StatCard
          title="Total Outflows"
          value="$9,820,000"
          subtitle="Distributed to investors"
          icon={<ArrowUpRight className="h-5 w-5" />}
          accentColor="blue"
        />
        <StatCard
          title="Protocol Fee Rate"
          value="1.5%"
          subtitle="On all distributions"
          icon={<Percent className="h-5 w-5" />}
          accentColor="amber"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Revenue Routing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { label: "Investor Yield Distributions", amount: "$8,940,000", percent: 72 },
              { label: "Milestone Releases", amount: "$620,000", percent: 5 },
              { label: "Protocol Fees", amount: "$284,500", percent: 2.3 },
              { label: "Staking Rewards", amount: "$175,500", percent: 1.4 },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-sm text-gray-300">{item.label}</span>
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{item.amount}</p>
                  <p className="text-xs text-gray-500">{item.percent}% of volume</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
