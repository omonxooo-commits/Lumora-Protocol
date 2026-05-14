import { TreasuryDashboard } from "@/components/treasury/treasury-dashboard";

export default function TreasuryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Treasury</h1>
        <p className="text-sm text-gray-400 mt-1">
          Protocol treasury, revenue routing, and fund allocation
        </p>
      </div>
      <TreasuryDashboard />
    </div>
  );
}
