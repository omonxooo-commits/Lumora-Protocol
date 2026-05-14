import { TreasuryOverview } from "@/components/dashboard/treasury-overview";
import { ActivePools } from "@/components/dashboard/active-pools";
import { MilestoneQueue } from "@/components/dashboard/milestone-queue";
import { RecentActivity } from "@/components/dashboard/recent-activity";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Control Center</h1>
        <p className="text-sm text-gray-400 mt-1">
          Treasury management, milestone approvals, and protocol analytics
        </p>
      </div>

      <TreasuryOverview />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivePools />
        </div>
        <div>
          <MilestoneQueue />
        </div>
      </div>

      <RecentActivity />
    </div>
  );
}
