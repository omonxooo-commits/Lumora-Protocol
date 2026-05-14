import type { TreasurySnapshot, TimeSeriesPoint } from "../types";

export function computeTreasuryGrowth(
  snapshots: TreasurySnapshot[]
): TimeSeriesPoint[] {
  return snapshots.map((s) => ({
    timestamp: s.timestamp,
    value: s.totalValueLocked,
  }));
}

export function computeNetFlow(snapshots: TreasurySnapshot[]): TimeSeriesPoint[] {
  return snapshots.map((s) => ({
    timestamp: s.timestamp,
    value: s.totalRaised - s.totalDistributed,
  }));
}

export function latestTreasurySnapshot(
  snapshots: TreasurySnapshot[]
): TreasurySnapshot | null {
  if (!snapshots.length) return null;
  return snapshots.reduce((a, b) => (a.timestamp > b.timestamp ? a : b));
}
