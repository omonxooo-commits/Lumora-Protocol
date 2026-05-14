import { MarketplaceView } from "@/components/marketplace/marketplace-view";

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Liquidity Desk</h1>
          <p className="text-sm text-gray-400 mt-1">
            Secondary market for Lumora participation tokens — buy, sell, and exit positions
          </p>
        </div>
        <MarketplaceView />
      </div>
    </div>
  );
}
