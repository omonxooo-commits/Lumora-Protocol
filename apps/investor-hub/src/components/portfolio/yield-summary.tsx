"use client";

import { Card, CardContent, CardHeader, CardTitle, Button, Separator } from "@lumora/ui";
import { formatCurrency } from "@lumora/ui";
import { Coins, ArrowDownToLine } from "lucide-react";

const YIELD_HISTORY = [
  { pool: "AgriFinance Kenya Q3", amount: 180, date: "Jun 1, 2026" },
  { pool: "Solar Microgrid Lagos", amount: 232, date: "May 15, 2026" },
  { pool: "SME Invoice Finance", amount: 490, date: "May 1, 2026" },
  { pool: "AgriFinance Kenya Q3", amount: 175, date: "Apr 1, 2026" },
];

export function YieldSummary() {
  const totalPending = 412;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-base">Yield Summary</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        {/* Claimable */}
        <div className="rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/5 border border-amber-500/20 p-4 text-center">
          <Coins className="h-6 w-6 text-amber-400 mx-auto mb-2" />
          <p className="text-xs text-gray-400">Claimable Yield</p>
          <p className="text-2xl font-bold text-white mt-1">{formatCurrency(totalPending)}</p>
          <Button variant="lumora" size="sm" className="mt-3 w-full">
            <ArrowDownToLine className="h-3.5 w-3.5 mr-1.5" />
            Claim All
          </Button>
        </div>

        <Separator />

        {/* History */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Recent Distributions
          </p>
          {YIELD_HISTORY.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-1.5">
              <div className="min-w-0">
                <p className="text-xs text-white truncate">{item.pool}</p>
                <p className="text-[10px] text-gray-500">{item.date}</p>
              </div>
              <p className="text-xs font-semibold text-emerald-400 shrink-0 ml-2">
                +{formatCurrency(item.amount)}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
