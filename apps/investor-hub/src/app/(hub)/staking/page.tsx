import { StakingPanel } from "@/components/staking/staking-panel";

export default function StakingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Staking</h1>
        <p className="text-sm text-gray-400 mt-1">
          Stake LMR tokens to earn protocol rewards and boost governance weight
        </p>
      </div>
      <StakingPanel />
    </div>
  );
}
