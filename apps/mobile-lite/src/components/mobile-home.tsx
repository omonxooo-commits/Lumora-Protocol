"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  Badge,
  Button,
  Progress,
  RiskBadge,
} from "@lumora/ui";
import { formatCurrency, formatPercent } from "@lumora/ui";
import {
  Wallet,
  BarChart3,
  Compass,
  TrendingUp,
  Zap,
  ChevronRight,
  ArrowDownToLine,
} from "lucide-react";

type Tab = "home" | "discover" | "portfolio" | "yield";

const POOLS = [
  {
    id: "pool-001",
    name: "AgriFinance Kenya Q3",
    roi: 14.5,
    riskGrade: "A" as const,
    progress: 77.5,
    status: "active" as const,
  },
  {
    id: "pool-002",
    name: "Solar Microgrid Lagos",
    roi: 11.2,
    riskGrade: "BBB" as const,
    progress: 100,
    status: "funded" as const,
  },
  {
    id: "pool-003",
    name: "Creator Revenue Pool",
    roi: 22.0,
    riskGrade: "BB" as const,
    progress: 39.2,
    status: "active" as const,
  },
];

export function MobileHome() {
  const [tab, setTab] = useState<Tab>("home");

  return (
    <div className="flex flex-col h-screen bg-gray-950">
      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600">
            <Zap className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-sm font-bold text-white">Lumora</span>
        </div>
        <Button variant="lumora" size="sm">
          <Wallet className="h-3.5 w-3.5 mr-1.5" />
          Connect
        </Button>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-4 pb-24">
        {tab === "home" && <HomeTab />}
        {tab === "discover" && <DiscoverTab />}
        {tab === "portfolio" && <PortfolioTab />}
        {tab === "yield" && <YieldTab />}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md border-t border-white/5 bg-gray-950/95 backdrop-blur-sm px-2 pb-safe">
        <div className="flex items-center justify-around py-2">
          {(
            [
              { id: "home", label: "Home", icon: Zap },
              { id: "discover", label: "Discover", icon: Compass },
              { id: "portfolio", label: "Portfolio", icon: BarChart3 },
              { id: "yield", label: "Yield", icon: TrendingUp },
            ] as const
          ).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors ${
                tab === id
                  ? "text-violet-400"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

function HomeTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5 pt-2"
    >
      {/* Balance card */}
      <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 p-5">
        <p className="text-xs text-violet-200">Portfolio Value</p>
        <p className="text-3xl font-bold text-white mt-1">$27,718</p>
        <div className="flex items-center gap-1.5 mt-2">
          <Badge variant="success" className="text-[10px]">+13.1% ROI</Badge>
          <span className="text-xs text-violet-200">all-time</span>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="rounded-xl bg-white/10 p-3">
            <p className="text-[10px] text-violet-200">Invested</p>
            <p className="text-sm font-bold text-white">$24,500</p>
          </div>
          <div className="rounded-xl bg-white/10 p-3">
            <p className="text-[10px] text-violet-200">Pending Yield</p>
            <p className="text-sm font-bold text-amber-300">$412</p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="lumora" className="h-12">
          <ArrowDownToLine className="h-4 w-4 mr-2" />
          Claim Yield
        </Button>
        <Button variant="outline" className="h-12">
          <Compass className="h-4 w-4 mr-2" />
          Discover
        </Button>
      </div>

      {/* Featured pools */}
      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
          Featured Pools
        </p>
        <div className="space-y-3">
          {POOLS.slice(0, 2).map((pool) => (
            <MiniPoolCard key={pool.id} pool={pool} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function DiscoverTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 pt-2"
    >
      <p className="text-sm font-semibold text-white">Active Pools</p>
      {POOLS.map((pool) => (
        <MiniPoolCard key={pool.id} pool={pool} showInvest />
      ))}
    </motion.div>
  );
}

function PortfolioTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 pt-2"
    >
      <p className="text-sm font-semibold text-white">My Positions</p>
      {[
        { name: "AgriFinance Kenya Q3", invested: 5_000, roi: 12.4, riskGrade: "A" as const },
        { name: "Solar Microgrid Lagos", invested: 10_000, roi: 11.2, riskGrade: "BBB" as const },
        { name: "SME Invoice Finance", invested: 7_000, roi: 14.0, riskGrade: "A" as const },
      ].map((pos, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{pos.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Invested: {formatCurrency(pos.invested)}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <RiskBadge grade={pos.riskGrade} />
                <span className="text-sm font-semibold text-emerald-400">
                  {formatPercent(pos.roi)}
                </span>
                <ChevronRight className="h-4 w-4 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </motion.div>
  );
}

function YieldTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 pt-2"
    >
      <div className="rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/5 border border-amber-500/20 p-5 text-center">
        <p className="text-xs text-gray-400">Claimable Yield</p>
        <p className="text-3xl font-bold text-white mt-1">$412.00</p>
        <Button variant="lumora" className="mt-4 w-full">
          <ArrowDownToLine className="h-4 w-4 mr-2" />
          Claim All
        </Button>
      </div>

      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
        Recent Distributions
      </p>
      {[
        { pool: "AgriFinance Kenya Q3", amount: 180, date: "Jun 1, 2026" },
        { pool: "Solar Microgrid Lagos", amount: 232, date: "May 15, 2026" },
        { pool: "SME Invoice Finance", amount: 490, date: "May 1, 2026" },
      ].map((item, i) => (
        <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
          <div>
            <p className="text-sm text-white">{item.pool}</p>
            <p className="text-xs text-gray-500">{item.date}</p>
          </div>
          <p className="text-sm font-semibold text-emerald-400">
            +{formatCurrency(item.amount)}
          </p>
        </div>
      ))}
    </motion.div>
  );
}

function MiniPoolCard({
  pool,
  showInvest = false,
}: {
  pool: (typeof POOLS)[0];
  showInvest?: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-white truncate flex-1">{pool.name}</p>
          <div className="flex items-center gap-1.5 shrink-0">
            <RiskBadge grade={pool.riskGrade} />
            <Badge variant={pool.status === "active" ? "success" : "info"}>
              {pool.status}
            </Badge>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>ROI: <span className="text-emerald-400 font-medium">{formatPercent(pool.roi)}</span></span>
          <span>{pool.progress}% funded</span>
        </div>
        <Progress value={pool.progress} className="h-1.5" />
        {showInvest && pool.status === "active" && (
          <Button variant="lumora" size="sm" className="w-full">
            Invest Now
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
