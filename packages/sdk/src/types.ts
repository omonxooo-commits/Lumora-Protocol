// ── Network ────────────────────────────────────────────────────────────────

export type StellarNetwork = "testnet" | "mainnet" | "futurenet";

export interface LumoraConfig {
  network: StellarNetwork;
  rpcUrl: string;
  horizonUrl: string;
  networkPassphrase: string;
  contracts: ContractAddresses;
}

export interface ContractAddresses {
  escrowCore: string;
  vaultX: string;
  assetForge: string;
  liquidityMarket: string;
  governanceDAO: string;
  identityRegistry: string;
  riskOracle: string;
  complianceGuard: string;
  treasuryManager: string;
  stakingEngine: string;
}

// ── Asset Pool ─────────────────────────────────────────────────────────────

export type PoolStatus = "pending" | "active" | "funded" | "completed" | "paused" | "defaulted";
export type TokenType = "revenue_share" | "equity" | "debt" | "yield_vault" | "nft" | "invoice" | "carbon" | "bond";
export type RiskGrade = "AAA" | "AA" | "A" | "BBB" | "BB" | "B" | "CCC" | "D";

export interface AssetPool {
  id: string;
  issuer: string;
  name: string;
  description: string;
  targetAmount: bigint;
  raisedAmount: bigint;
  tokenType: TokenType;
  roiPercent: number;
  durationDays: number;
  status: PoolStatus;
  riskGrade: RiskGrade;
  milestones: Milestone[];
  createdAt: number;
  maturityDate: number;
}

// ── Milestones ─────────────────────────────────────────────────────────────

export type MilestoneStatus = "pending" | "submitted" | "approved" | "rejected" | "released";

export interface Milestone {
  id: string;
  poolId: string;
  title: string;
  description: string;
  releasePercent: number;
  status: MilestoneStatus;
  dueDate: number;
  completedAt?: number;
  verifier?: string;
  evidence?: string;
}

// ── Investor ───────────────────────────────────────────────────────────────

export interface Investment {
  poolId: string;
  investor: string;
  amount: bigint;
  tokenBalance: bigint;
  claimedYield: bigint;
  pendingYield: bigint;
  investedAt: number;
}

// ── Governance ─────────────────────────────────────────────────────────────

export type ProposalStatus = "active" | "passed" | "rejected" | "executed" | "cancelled";
export type ProposalType = "milestone_dispute" | "treasury_allocation" | "pool_upgrade" | "risk_params" | "fee_structure" | "emergency";

export interface Proposal {
  id: string;
  proposer: string;
  title: string;
  description: string;
  type: ProposalType;
  status: ProposalStatus;
  votesFor: bigint;
  votesAgainst: bigint;
  quorum: bigint;
  startTime: number;
  endTime: number;
  executedAt?: number;
  calldata?: string;
}

// ── Identity / Reputation ──────────────────────────────────────────────────

export interface IdentityProfile {
  address: string;
  did: string;
  kycVerified: boolean;
  kycLevel: 0 | 1 | 2 | 3;
  jurisdiction: string;
  reputationScore: number;
  totalProjects: number;
  successfulProjects: number;
  createdAt: number;
}

// ── Risk Oracle ────────────────────────────────────────────────────────────

export interface RiskScore {
  poolId: string;
  grade: RiskGrade;
  score: number;
  factors: RiskFactor[];
  updatedAt: number;
  confidence: number;
}

export interface RiskFactor {
  name: string;
  weight: number;
  value: number;
  impact: "positive" | "negative" | "neutral";
}

// ── Marketplace ────────────────────────────────────────────────────────────

export type OrderSide = "buy" | "sell";
export type OrderStatus = "open" | "filled" | "cancelled" | "partial";

export interface MarketOrder {
  id: string;
  poolId: string;
  seller: string;
  buyer?: string;
  tokenAmount: bigint;
  pricePerToken: bigint;
  side: OrderSide;
  status: OrderStatus;
  createdAt: number;
  filledAt?: number;
}

// ── Staking ────────────────────────────────────────────────────────────────

export interface StakePosition {
  staker: string;
  amount: bigint;
  rewardDebt: bigint;
  pendingRewards: bigint;
  stakedAt: number;
  lockUntil: number;
}

// ── Transaction ────────────────────────────────────────────────────────────

export interface TxResult {
  hash: string;
  success: boolean;
  ledger?: number;
  returnValue?: unknown;
  error?: string;
}
