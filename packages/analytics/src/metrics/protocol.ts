import type { ProtocolMetrics } from "../types";

export function computeHealthScore(metrics: ProtocolMetrics): number {
  const completionRate =
    metrics.totalPools > 0
      ? (metrics.completedPools / metrics.totalPools) * 100
      : 0;
  const defaultRate =
    metrics.totalPools > 0
      ? (metrics.defaultedPools / metrics.totalPools) * 100
      : 0;

  // Weighted health score (0–100)
  const score =
    completionRate * 0.4 +
    Math.max(0, 100 - defaultRate * 5) * 0.3 +
    Math.min(metrics.averageRoi, 50) * 0.3 * 2;

  return Math.min(100, Math.max(0, score));
}

export function formatProtocolSummary(metrics: ProtocolMetrics): string {
  return [
    `Total Pools: ${metrics.totalPools}`,
    `Active: ${metrics.activePools}`,
    `Total Volume: $${metrics.totalVolume.toLocaleString()}`,
    `Avg ROI: ${metrics.averageRoi.toFixed(2)}%`,
    `Unique Investors: ${metrics.uniqueInvestors}`,
  ].join(" | ");
}
