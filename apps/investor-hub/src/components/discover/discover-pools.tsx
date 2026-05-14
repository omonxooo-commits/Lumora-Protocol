"use client";

import { useState } from "react";
import { PoolCard, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@lumora/ui";
import type { PoolCardProps } from "@lumora/ui";
import { Search } from "lucide-react";

const ALL_POOLS: PoolCardProps[] = [
  {
    id: "pool-001",
    name: "AgriFinance Kenya Q3",
    issuer: "GreenHarvest Cooperative",
    description: "Tokenized crop financing for 200 smallholder farmers in Rift Valley.",
    targetAmount: 500_000,
    raisedAmount: 387_500,
    roi: 14.5,
    duration: "6 months",
    riskGrade: "A",
    category: "Agricultural Finance",
    status: "active",
  },
  {
    id: "pool-002",
    name: "Solar Microgrid Lagos",
    issuer: "SunBridge Energy",
    description: "Community solar infrastructure for 3 underserved neighborhoods.",
    targetAmount: 1_200_000,
    raisedAmount: 1_200_000,
    roi: 11.2,
    duration: "24 months",
    riskGrade: "BBB",
    category: "Community Infrastructure",
    status: "funded",
  },
  {
    id: "pool-003",
    name: "Creator Revenue Pool — Afrobeats",
    issuer: "Rhythm DAO",
    description: "Tokenized streaming revenue from 12 independent artists.",
    targetAmount: 250_000,
    raisedAmount: 98_000,
    roi: 22.0,
    duration: "12 months",
    riskGrade: "BB",
    category: "Creator Economy",
    status: "active",
  },
  {
    id: "pool-004",
    name: "SME Invoice Finance — Nairobi",
    issuer: "TradeFlow Capital",
    description: "Receivables-backed working capital for 15 Nairobi SMEs.",
    targetAmount: 800_000,
    raisedAmount: 520_000,
    roi: 14.0,
    duration: "9 months",
    riskGrade: "A",
    category: "SME Working Capital",
    status: "active",
  },
  {
    id: "pool-005",
    name: "Water Infrastructure — Accra",
    issuer: "AquaCommons Ghana",
    description: "Borehole and distribution network for 4 peri-urban communities.",
    targetAmount: 350_000,
    raisedAmount: 87_500,
    roi: 9.5,
    duration: "36 months",
    riskGrade: "BBB",
    category: "Community Infrastructure",
    status: "active",
  },
  {
    id: "pool-006",
    name: "Carbon Credit Forestry — DRC",
    issuer: "GreenCanopy DAO",
    description: "Reforestation project generating verified carbon credits on-chain.",
    targetAmount: 2_000_000,
    raisedAmount: 1_450_000,
    roi: 8.0,
    duration: "60 months",
    riskGrade: "AA",
    category: "Impact Investing",
    status: "active",
  },
];

export function DiscoverPools() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");

  const filtered = ALL_POOLS.filter((p) => {
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.issuer.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "all" || p.category === category;
    const matchRisk = riskFilter === "all" || p.riskGrade === riskFilter;
    return matchSearch && matchCategory && matchRisk;
  });

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search pools or issuers..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Agricultural Finance">Agricultural Finance</SelectItem>
            <SelectItem value="Community Infrastructure">Community Infrastructure</SelectItem>
            <SelectItem value="Creator Economy">Creator Economy</SelectItem>
            <SelectItem value="SME Working Capital">SME Working Capital</SelectItem>
            <SelectItem value="Impact Investing">Impact Investing</SelectItem>
          </SelectContent>
        </Select>
        <Select value={riskFilter} onValueChange={setRiskFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Risk Grade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Grades</SelectItem>
            <SelectItem value="AAA">AAA</SelectItem>
            <SelectItem value="AA">AA</SelectItem>
            <SelectItem value="A">A</SelectItem>
            <SelectItem value="BBB">BBB</SelectItem>
            <SelectItem value="BB">BB</SelectItem>
            <SelectItem value="B">B</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p className="text-sm text-gray-500">{filtered.length} pools found</p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((pool) => (
          <PoolCard
            key={pool.id}
            {...pool}
            onView={(id) => console.log("view", id)}
            onInvest={(id) => console.log("invest", id)}
          />
        ))}
      </div>
    </div>
  );
}
