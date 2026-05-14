"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
} from "@lumora/ui";
import { Plus, Trash2 } from "lucide-react";

interface MilestoneInput {
  title: string;
  releasePercent: number;
  dueDate: string;
}

export function CreatePoolForm() {
  const [milestones, setMilestones] = useState<MilestoneInput[]>([
    { title: "", releasePercent: 25, dueDate: "" },
  ]);

  const addMilestone = () => {
    setMilestones((prev) => [
      ...prev,
      { title: "", releasePercent: 0, dueDate: "" },
    ]);
  };

  const removeMilestone = (index: number) => {
    setMilestones((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire to SDK buildCreatePool + wallet signing
    console.log("Create pool submitted");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pool Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Pool Name</Label>
            <Input id="name" placeholder="e.g. AgriFinance Kenya Q3" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              rows={3}
              placeholder="Describe the financing purpose, use of funds, and expected outcomes..."
              className="flex w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 resize-none"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agricultural">Agricultural Finance</SelectItem>
                  <SelectItem value="infrastructure">Community Infrastructure</SelectItem>
                  <SelectItem value="creator">Creator Economy</SelectItem>
                  <SelectItem value="sme">SME Working Capital</SelectItem>
                  <SelectItem value="invoice">Invoice Finance</SelectItem>
                  <SelectItem value="impact">Impact Investing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tokenType">Token Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select token type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue_share">Revenue Share</SelectItem>
                  <SelectItem value="debt">Debt Instrument</SelectItem>
                  <SelectItem value="yield_vault">Yield Vault</SelectItem>
                  <SelectItem value="equity">Equity-like</SelectItem>
                  <SelectItem value="bond">Community Bond</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Terms */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Financial Terms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target">Target Amount (USDC)</Label>
              <Input id="target" type="number" placeholder="500000" min="1000" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="roi">ROI % (annual)</Label>
              <Input id="roi" type="number" placeholder="14.5" step="0.1" min="0" max="100" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (days)</Label>
              <Input id="duration" type="number" placeholder="180" min="30" required />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Milestones */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Milestones</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addMilestone}>
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Add Milestone
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {milestones.map((m, i) => (
            <div key={i} className="rounded-lg border border-white/10 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-300">
                  Milestone {i + 1}
                </p>
                {milestones.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-gray-500 hover:text-red-400"
                    onClick={() => removeMilestone(i)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1.5">
                  <Label className="text-xs">Title</Label>
                  <Input
                    placeholder="e.g. Seed Distribution Complete"
                    value={m.title}
                    onChange={(e) =>
                      setMilestones((prev) =>
                        prev.map((ms, idx) =>
                          idx === i ? { ...ms, title: e.target.value } : ms
                        )
                      )
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Release %</Label>
                  <Input
                    type="number"
                    placeholder="25"
                    min="1"
                    max="100"
                    value={m.releasePercent}
                    onChange={(e) =>
                      setMilestones((prev) =>
                        prev.map((ms, idx) =>
                          idx === i
                            ? { ...ms, releasePercent: Number(e.target.value) }
                            : ms
                        )
                      )
                    }
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Due Date</Label>
                <Input
                  type="date"
                  value={m.dueDate}
                  onChange={(e) =>
                    setMilestones((prev) =>
                      prev.map((ms, idx) =>
                        idx === i ? { ...ms, dueDate: e.target.value } : ms
                      )
                    )
                  }
                />
              </div>
            </div>
          ))}
          <p className="text-xs text-gray-500">
            Total release:{" "}
            <span
              className={
                milestones.reduce((s, m) => s + m.releasePercent, 0) === 100
                  ? "text-emerald-400"
                  : "text-amber-400"
              }
            >
              {milestones.reduce((s, m) => s + m.releasePercent, 0)}%
            </span>{" "}
            (must equal 100%)
          </p>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="button" variant="outline" className="flex-1">
          Save Draft
        </Button>
        <Button type="submit" variant="lumora" className="flex-1">
          Deploy Pool
        </Button>
      </div>
    </form>
  );
}
