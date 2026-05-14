import { DiscoverPools } from "@/components/discover/discover-pools";

export default function DiscoverPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Discover Pools</h1>
        <p className="text-sm text-gray-400 mt-1">
          Browse active financing pools, review risk scores, and invest
        </p>
      </div>
      <DiscoverPools />
    </div>
  );
}
