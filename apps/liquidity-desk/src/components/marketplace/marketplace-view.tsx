"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Input,
  StatCard,
  RiskBadge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@lumora/ui";
import { formatCurrency } from "@lumora/ui";
import { TrendingUp, ShoppingCart, Tag, BarChart3 } from "lucide-react";

const LISTINGS = [
  {
    id: "ord-001",
    poolName: "AgriFinance Kenya Q3",
    riskGrade: "A" as const,
    tokenAmount: 500,
    pricePerToken: 1.08,
    totalValue: 540,
    seller: "GBSELL...XYZ",
    roi: 14.5,
    maturity: "Dec 2026",
    side: "sell" as const,
  },
  {
    id: "ord-002",
    poolName: "Solar Microgrid Lagos",
    riskGrade: "BBB" as const,
    tokenAmount: 1_000,
    pricePerToken: 1.05,
    totalValue: 1_050,
    seller: "GBSELL...ABC",
    roi: 11.2,
    maturity: "Jun 2028",
    side: "sell" as const,
  },
  {
    id: "ord-003",
    poolName: "Carbon Credit Forestry — DRC",
    riskGrade: "AA" as const,
    tokenAmount: 2_000,
    pricePerToken: 1.12,
    totalValue: 2_240,
    seller: "GBSELL...DEF",
    roi: 8.0,
    maturity: "Jun 2029",
    side: "sell" as const,
  },
  {
    id: "ord-004",
    poolName: "SME Invoice Finance — Nairobi",
    riskGrade: "A" as const,
    tokenAmount: 750,
    pricePerToken: 1.09,
    totalValue: 817.5,
    seller: "GBSELL...GHI",
    roi: 14.0,
    maturity: "Sep 2026",
    side: "sell" as const,
  },
];

export function MarketplaceView() {
  const [search, setSearch] = useState("");

  const filtered = LISTINGS.filter(
    (l) =>
      !search ||
      l.poolName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard title="24h Volume" value="$48,200" icon={<BarChart3 className="h-5 w-5" />} accentColor="violet" />
        <StatCard title="Active Listings" value="24" icon={<Tag className="h-5 w-5" />} accentColor="blue" />
        <StatCard title="Avg Premium" value="+7.2%" subtitle="Over face value" icon={<TrendingUp className="h-5 w-5" />} accentColor="emerald" />
        <StatCard title="Trades Today" value="13" icon={<ShoppingCart className="h-5 w-5" />} accentColor="amber" />
      </div>

      <Tabs defaultValue="buy">
        <TabsList>
          <TabsTrigger value="buy">Buy Tokens</TabsTrigger>
          <TabsTrigger value="sell">List for Sale</TabsTrigger>
          <TabsTrigger value="myorders">My Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="buy" className="mt-4 space-y-4">
          <Input
            placeholder="Search by pool name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sell" className="mt-4">
          <SellForm />
        </TabsContent>

        <TabsContent value="myorders" className="mt-4">
          <Card>
            <CardContent className="flex items-center justify-center py-16 text-gray-500">
              Connect wallet to view your orders
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ListingCard({ listing }: { listing: (typeof LISTINGS)[0] }) {
  const premium = ((listing.pricePerToken - 1) * 100).toFixed(1);
  return (
    <Card>
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-white text-sm truncate">{listing.poolName}</p>
            <p className="text-xs text-gray-500 mt-0.5">Seller: {listing.seller}</p>
          </div>
          <RiskBadge grade={listing.riskGrade} />
        </div>

        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="rounded-lg bg-white/5 p-2">
            <p className="text-[10px] text-gray-400">Tokens</p>
            <p className="text-sm font-semibold text-white">{listing.tokenAmount.toLocaleString()}</p>
          </div>
          <div className="rounded-lg bg-white/5 p-2">
            <p className="text-[10px] text-gray-400">Price/Token</p>
            <p className="text-sm font-semibold text-white">${listing.pricePerToken.toFixed(3)}</p>
          </div>
          <div className="rounded-lg bg-white/5 p-2">
            <p className="text-[10px] text-gray-400">Total</p>
            <p className="text-sm font-semibold text-white">{formatCurrency(listing.totalValue)}</p>
          </div>
          <div className="rounded-lg bg-white/5 p-2">
            <p className="text-[10px] text-gray-400">Pool ROI</p>
            <p className="text-sm font-semibold text-emerald-400">{listing.roi}%</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Matures: {listing.maturity}</span>
          <Badge variant={Number(premium) > 0 ? "warning" : "success"}>
            {Number(premium) > 0 ? `+${premium}%` : `${premium}%`} premium
          </Badge>
        </div>

        <Button variant="lumora" size="sm" className="w-full">
          <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
          Buy Tokens
        </Button>
      </CardContent>
    </Card>
  );
}

function SellForm() {
  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle className="text-base">List Tokens for Sale</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-400">
          Connect your wallet to list participation tokens from your portfolio.
        </p>
        <Button variant="lumora" className="w-full">Connect Wallet to Continue</Button>
      </CardContent>
    </Card>
  );
}
