import { nativeToScVal } from "@stellar/stellar-sdk";
import type { LumoraClient } from "../client";
import type { Investment } from "../types";

export class VaultXContract {
  constructor(private client: LumoraClient) {}

  private get contractId() {
    return this.client.config.contracts.vaultX;
  }

  async getInvestment(poolId: string, investor: string): Promise<Investment | null> {
    return this.client.simulateCall(this.contractId, "get_investment", [
      nativeToScVal(poolId, { type: "string" }),
      nativeToScVal(investor, { type: "address" }),
    ]) as Promise<Investment | null>;
  }

  async getPendingYield(poolId: string, investor: string): Promise<bigint> {
    return this.client.simulateCall(this.contractId, "pending_yield", [
      nativeToScVal(poolId, { type: "string" }),
      nativeToScVal(investor, { type: "address" }),
    ]) as Promise<bigint>;
  }

  async getPortfolio(investor: string): Promise<Investment[]> {
    return this.client.simulateCall(this.contractId, "get_portfolio", [
      nativeToScVal(investor, { type: "address" }),
    ]) as Promise<Investment[]>;
  }

  buildInvest(poolId: string, investor: string, amount: bigint) {
    return [
      nativeToScVal(poolId, { type: "string" }),
      nativeToScVal(investor, { type: "address" }),
      nativeToScVal(amount, { type: "i128" }),
    ];
  }

  buildClaimYield(poolId: string, investor: string) {
    return [
      nativeToScVal(poolId, { type: "string" }),
      nativeToScVal(investor, { type: "address" }),
    ];
  }
}
