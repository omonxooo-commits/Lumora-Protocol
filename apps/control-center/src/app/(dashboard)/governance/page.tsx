import { ProposalsList } from "@/components/governance/proposals-list";
import { Button } from "@lumora/ui";
import { Plus } from "lucide-react";

export default function GovernancePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Governance</h1>
          <p className="text-sm text-gray-400 mt-1">
            DAO proposals, voting, and protocol parameter management
          </p>
        </div>
        <Button variant="lumora">
          <Plus className="h-4 w-4 mr-2" />
          New Proposal
        </Button>
      </div>
      <ProposalsList />
    </div>
  );
}
