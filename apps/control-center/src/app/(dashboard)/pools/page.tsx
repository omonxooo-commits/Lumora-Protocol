import { PoolsTable } from "@/components/pools/pools-table";
import { Button } from "@lumora/ui";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function PoolsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Asset Pools</h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage your financing pools and token deployments
          </p>
        </div>
        <Link href="/pools/create">
          <Button variant="lumora">
            <Plus className="h-4 w-4 mr-2" />
            Create Pool
          </Button>
        </Link>
      </div>
      <PoolsTable />
    </div>
  );
}
