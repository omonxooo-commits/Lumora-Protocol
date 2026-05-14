"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  StatCard,
  Separator,
} from "@lumora/ui";
import { formatCurrency } from "@lumora/ui";
import { Coins, Lock, Unlock, TrendingUp } from "lucide-react";

export function StakingPanel() {
  const [stakeAmount, setStakeAmount] = useState("");
  const [lockDays, setLockDays] = useState("90");

  const stakedBalance = 2_500;
  const pendingRewards = 87.5;
  const apy = 12.5;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Staked Balance"
          value="2,500 LMR"
          subtitle="Locked until Sep 2026"
          icon={<Lock className="h-5 w-5" />}
          accentColor="violet"
        />
        <StatCard
          title="Pending Rewards"
          value={formatCurrency(pendingRewards)}
          subtitle="Claimable now"
          icon={<Coins className="h-5 w-5" />}
          accentColor="amber"
        />
        <StatCard
          title="Current APY"
          value={`${apy}%`}
          subtitle="Protocol staking rate"
          icon={<TrendingUp className="h-5 w-5" />}
          accentColor="emerald"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stake */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Lock className="h-4 w-4 text-violet-400" />
              Stake LMR
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Amount (LMR)</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
              />
              <p className="text-xs text-gray-500">Available: 5,000 LMR</p>
            </div>
            <div className="space-y-2">
              <Label>Lock Period</Label>
              <div className="grid grid-cols-3 gap-2">
                {["30", "90", "180"].map((d) => (
                  <button
                    key={d}
                    onClick={() => setLockDays(d)}
                    className={`rounded-lg border py-2 text-xs font-medium transition-colors ${
                      lockDays === d
                        ? "border-violet-500 bg-violet-500/20 text-violet-300"
                        : "border-white/10 text-gray-400 hover:border-white/20"
                    }`}
                  >
                    {d} days
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-lg bg-white/5 p-3 text-xs text-gray-400 space-y-1">
              <div className="flex justify-between">
                <span>Estimated APY</span>
                <span className="text-emerald-400">
                  {lockDays === "30" ? "8%" : lockDays === "90" ? "12.5%" : "18%"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Governance boost</span>
                <span className="text-violet-400">
                  {lockDays === "30" ? "1x" : lockDays === "90" ? "1.5x" : "2x"}
                </span>
              </div>
            </div>
            <Button variant="lumora" className="w-full">
              <Lock className="h-4 w-4 mr-2" />
              Stake Tokens
            </Button>
          </CardContent>
        </Card>

        {/* Unstake / Claim */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Unlock className="h-4 w-4 text-emerald-400" />
              Manage Position
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-white/10 p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Staked</span>
                <span className="text-white font-medium">2,500 LMR</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Lock expires</span>
                <span className="text-white">Sep 12, 2026</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Pending rewards</span>
                <span className="text-amber-400 font-medium">{formatCurrency(pendingRewards)}</span>
              </div>
            </div>

            <Separator />

            <Button variant="outline" className="w-full" disabled>
              <Unlock className="h-4 w-4 mr-2" />
              Unstake (locked until Sep 2026)
            </Button>
            <Button variant="lumora" className="w-full">
              <Coins className="h-4 w-4 mr-2" />
              Claim Rewards ({formatCurrency(pendingRewards)})
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
