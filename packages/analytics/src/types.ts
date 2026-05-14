export interface TreasurySnapshot {
  timestamp: number;
  totalValueLocked: number;
  totalRaised: number;
  totalDistributed: number;
  activePools: number;
  totalInvestors: number;
  protocolFees: number;
}

export interface RoiMetrics {
  poolId: string;
  expectedRoi: number;
  actualRoi: number;
  yieldDistributed: number;
  nextDistribution: number;
  distributionHistory: DistributionEvent[];
}

export interface DistributionEvent {
  poolId: string;
  amount: number;
  timestamp: number;
  recipients: number;
  txHash: string;
}

export interface ProtocolMetrics {
  totalPools: number;
  activePools: number;
  completedPools: number;
  defaultedPools: number;
  totalVolume: number;
  totalFees: number;
  uniqueIssuers: number;
  uniqueInvestors: number;
  averageRoi: number;
  averageRiskScore: number;
  marketplaceVolume: number;
  stakingTvl: number;
}

export interface TimeSeriesPoint {
  timestamp: number;
  value: number;
  label?: string;
}

export interface PoolAnalytics {
  poolId: string;
  fundingProgress: number;
  milestonesCompleted: number;
  milestonesTotal: number;
  investorCount: number;
  averageInvestment: number;
  topInvestors: Array<{ address: string; amount: number }>;
  tvlHistory: TimeSeriesPoint[];
  yieldHistory: TimeSeriesPoint[];
}
