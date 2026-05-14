import { MilestonesManager } from "@/components/milestones/milestones-manager";

export default function MilestonesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Milestone Management</h1>
        <p className="text-sm text-gray-400 mt-1">
          Review, approve, and release milestone-gated escrow funds
        </p>
      </div>
      <MilestonesManager />
    </div>
  );
}
