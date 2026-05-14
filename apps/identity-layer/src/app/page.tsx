import { IdentityDashboard } from "@/components/identity/identity-dashboard";

export default function IdentityPage() {
  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Identity Layer</h1>
          <p className="text-sm text-gray-400 mt-1">
            Decentralized identity, KYC verification, and on-chain reputation
          </p>
        </div>
        <IdentityDashboard />
      </div>
    </div>
  );
}
