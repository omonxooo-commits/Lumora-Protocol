import { CreatePoolForm } from "@/components/pools/create-pool-form";

export default function CreatePoolPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Create Asset Pool</h1>
        <p className="text-sm text-gray-400 mt-1">
          Configure your financing pool, token structure, and milestone schedule
        </p>
      </div>
      <CreatePoolForm />
    </div>
  );
}
