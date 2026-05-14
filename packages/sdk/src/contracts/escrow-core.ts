import { nativeToScVal, xdr } from "@stellar/stellar-sdk";
import type { LumoraClient } from "../client";
import type { AssetPool, Milestone, TxResult } from "../types";

export class EscrowCoreContract {
  constructor(private client: LumoraClient) {}

  private get contractId() {
    return this.client.config.contracts.escrowCore;
  }

  async getPool(poolId: string): Promise<AssetPool | null> {
    return this.client.simulateCall(this.contractId, "get_pool", [
      nativeToScVal(poolId, { type: "string" }),
    ]) as Promise<AssetPool | null>;
  }

  async listPools(offset = 0, limit = 20): Promise<AssetPool[]> {
    return this.client.simulateCall(this.contractId, "list_pools", [
      nativeToScVal(offset, { type: "u32" }),
      nativeToScVal(limit, { type: "u32" }),
    ]) as Promise<AssetPool[]>;
  }

  async getMilestones(poolId: string): Promise<Milestone[]> {
    return this.client.simulateCall(this.contractId, "get_milestones", [
      nativeToScVal(poolId, { type: "string" }),
    ]) as Promise<Milestone[]>;
  }

  /**
   * Build the XDR for creating a new pool (caller must sign and submit).
   */
  buildCreatePool(params: {
    issuer: string;
    name: string;
    description: string;
    targetAmount: bigint;
    roiPercent: number;
    durationDays: number;
    milestones: Array<{ title: string; releasePercent: number; dueDate: number }>;
  }): xdr.ScVal[] {
    return [
      nativeToScVal(params.issuer, { type: "address" }),
      nativeToScVal(params.name, { type: "string" }),
      nativeToScVal(params.description, { type: "string" }),
      nativeToScVal(params.targetAmount, { type: "i128" }),
      nativeToScVal(params.roiPercent, { type: "u32" }),
      nativeToScVal(params.durationDays, { type: "u32" }),
    ];
  }

  async approveMilestone(
    poolId: string,
    milestoneId: string,
    verifier: string
  ): Promise<xdr.ScVal[]> {
    return [
      nativeToScVal(poolId, { type: "string" }),
      nativeToScVal(milestoneId, { type: "string" }),
      nativeToScVal(verifier, { type: "address" }),
    ];
  }
}
