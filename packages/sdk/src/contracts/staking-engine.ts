import { nativeToScVal } from "@stellar/stellar-sdk";
import type { LumoraClient } from "../client";
import type { StakePosition } from "../types";

export class StakingEngineContract {
  constructor(private client: LumoraClient) {}

  private get contractId() {
    return this.client.config.contracts.stakingEngine;
  }

  async getStakePosition(staker: string): Promise<StakePosition | null> {
    return this.client.simulateCall(this.contractId, "get_stake", [
      nativeToScVal(staker, { type: "address" }),
    ]) as Promise<StakePosition | null>;
  }

  async getPendingRewards(staker: string): Promise<bigint> {
    return this.client.simulateCall(this.contractId, "pending_rewards", [
      nativeToScVal(staker, { type: "address" }),
    ]) as Promise<bigint>;
  }

  async getTotalStaked(): Promise<bigint> {
    return this.client.simulateCall(this.contractId, "total_staked", []) as Promise<bigint>;
  }

  buildStake(staker: string, amount: bigint, lockDays: number) {
    return [
      nativeToScVal(staker, { type: "address" }),
      nativeToScVal(amount, { type: "i128" }),
      nativeToScVal(lockDays, { type: "u32" }),
    ];
  }

  buildUnstake(staker: string, amount: bigint) {
    return [
      nativeToScVal(staker, { type: "address" }),
      nativeToScVal(amount, { type: "i128" }),
    ];
  }

  buildClaimRewards(staker: string) {
    return [nativeToScVal(staker, { type: "address" })];
  }
}
