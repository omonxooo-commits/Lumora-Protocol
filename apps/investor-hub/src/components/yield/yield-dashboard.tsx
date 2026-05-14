"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  StatCard,
} from "@lumora/ui";
import { formatCurrency } from "@lumora/ui";
import { ArrowDownToLine, TrendingUp, Coins, Clock } from "lucide-react";

const CLAIMABLE = [
  { poolId: "pool-001", poolName: "AgriFinance Kenya Q3", amount: 180, dueDate: "Jun 15, 2026" },
  { poolId: "pool-002", poolName: "Solar Microgrid Lagos", amount: 232, dueDate: "Jun 15, 2026" },
];

const HISTORY = [
  { poolName: "SME Invoice Finance", amount: 490, date: "May 1, 2026", txHash: "abc123" },
  { poolName: "AgriFinance Kenya Q3", amount: 175, date: "Apr 1, 2026", txHash: "def456" },
  { poolName: "Solar Microgrid Lagos", amount: 220, date: "Mar 15, 2026", txHash: "ghi789" },
  { poolName: "SME Invoice Finance", amount: 490, date: "Feb 1, 2026", txHash: "jkl012" },
];

export function YieldDashboard() {
  const totalClaimable = CLAIMABLE.reduce((s, c) => s + c.amount, 0);
  const totalEarned = HISTORY.reduce((s, h) => s + h.amount, 0) + totalClaimable;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Earned"
          value={formatCurrency(totalEarned)}
          subtitle="All-time yield"
          icon={<TrendingUp className="h-5 w-5" />}
          accentColor="emerald"
        />
        <StatCard
          title="Claimable Now"
          value={formatCurrency(totalClaimable)}
          subtitle={`${CLAIMABLE.length} distributions ready`}
          icon={<Coins className="h-5 w-5" />}
          accentColor="amber"
        />
        <StatCard
          title="Next Distribution"
          value="Jun 15, 2026"
          subtitle="Estimated date"
          icon={<Clock className="h-5 w-5" />}
          accentColor="blue"
        />
      </div>

      {/* Claimable */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Claimable Yield</CardTitle>
          <Button variant="lumora" size="sm">
            <ArrowDownToLine className="h-3.5 w-3.5 mr-1.5" />
            Claim All ({formatCurrency(totalClaimable)})
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {CLAIMABLE.map((item) => (
            <div
              key={item.poolId}
              className="flex items-center justify-between rounded-lg border border-amber-500/20 bg-amber-500/5 p-4"
            >
              <div>
                <p className="text-sm font-medium text-white">{item.poolName}</p>
                <p className="text-xs text-gray-500">Available: {item.dueDate}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-sm font-bold text-amber-400">{formatCurrency(item.amount)}</p>
                <Button variant="outline" size="sm">Claim</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Distribution History</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="pb-3 text-left text-xs font-medium text-gray-400 uppercase">Pool</th>
                <th className="pb-3 text-left text-xs font-medium text-gray-400 uppercase">Amount</th>
                <th className="pb-3 text-left text-xs font-medium text-gray-400 uppercase">Date</th>
                <th className="pb-3 text-left text-xs font-medium text-gray-400 uppercase">Tx</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {HISTORY.map((h, i) => (
                <tr key={i}>
                  <td className="py-3 text-white">{h.poolName}</td>
                  <td className="py-3 text-emerald-400 font-medium">+{formatCurrency(h.amount)}</td>
                  <td className="py-3 text-gray-400">{h.date}</td>
                  <td className="py-3">
                    <a
                      href={`https://stellar.expert/explorer/testnet/tx/${h.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-violet-400 hover:text-violet-300"
                    >
                      {h.txHash.slice(0, 8)}...
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
