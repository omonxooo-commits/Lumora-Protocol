import { YieldDashboard } from "@/components/yield/yield-dashboard";

export default function YieldPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Yield & ROI</h1>
        <p className="text-sm text-gray-400 mt-1">
          Claim pending yield, view distribution history, and track ROI
        </p>
      </div>
      <YieldDashboard />
    </div>
  );
}
