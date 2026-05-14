import type { RoiMetrics, DistributionEvent } from "../types";

export function computeActualRoi(
  invested: number,
  distributed: number
): number {
  if (invested === 0) return 0;
  return ((distributed - invested) / invested) * 100;
}

export function aggregateDistributions(
  events: DistributionEvent[]
): { total: number; count: number; avgPerEvent: number } {
  const total = events.reduce((sum, e) => sum + e.amount, 0);
  return {
    total,
    count: events.length,
    avgPerEvent: events.length ? total / events.length : 0,
  };
}

export function roiVsBenchmark(
  actualRoi: number,
  benchmarkRoi: number
): { delta: number; outperforming: boolean } {
  return {
    delta: actualRoi - benchmarkRoi,
    outperforming: actualRoi > benchmarkRoi,
  };
}
