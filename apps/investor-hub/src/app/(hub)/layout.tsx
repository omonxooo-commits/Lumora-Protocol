import { InvestorSidebar } from "@/components/layout/investor-sidebar";
import { InvestorHeader } from "@/components/layout/investor-header";

export default function HubLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-950">
      <InvestorSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <InvestorHeader />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
