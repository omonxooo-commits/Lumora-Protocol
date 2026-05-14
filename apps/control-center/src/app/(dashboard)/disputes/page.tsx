import { DisputesPanel } from "@/components/disputes/disputes-panel";

export default function DisputesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dispute Resolution</h1>
        <p className="text-sm text-gray-400 mt-1">
          Review and resolve milestone disputes and escrow freeze requests
        </p>
      </div>
      <DisputesPanel />
    </div>
  );
}
