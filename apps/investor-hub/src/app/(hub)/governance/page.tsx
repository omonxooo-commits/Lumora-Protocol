import { InvestorGovernance } from "@/components/governance/investor-governance";

export default function GovernancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Governance</h1>
        <p className="text-sm text-gray-400 mt-1">
          Vote on proposals using your governance token balance
        </p>
      </div>
      <InvestorGovernance />
    </div>
  );
}
