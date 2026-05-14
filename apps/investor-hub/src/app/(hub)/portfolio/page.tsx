import { PortfolioOverview } from "@/components/portfolio/portfolio-overview";
import { PortfolioPositions } from "@/components/portfolio/portfolio-positions";
import { YieldSummary } from "@/components/portfolio/yield-summary";

export default function PortfolioPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Portfolio</h1>
        <p className="text-sm text-gray-400 mt-1">
          Track your investments, yield, and governance participation
        </p>
      </div>
      <PortfolioOverview />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PortfolioPositions />
        </div>
        <YieldSummary />
      </div>
    </div>
  );
}
