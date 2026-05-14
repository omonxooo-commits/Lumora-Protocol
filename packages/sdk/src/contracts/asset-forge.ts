import { nativeToScVal } from "@stellar/stellar-sdk";
import type { LumoraClient } from "../client";
import type { TokenType } from "../types";

export class AssetForgeContract {
  constructor(private client: LumoraClient) {}

  private get contractId() {
    return this.client.config.contracts.assetForge;
  }

  async getTokenAddress(poolId: string, tokenType: TokenType): Promise<string | null> {
    return this.client.simulateCall(this.contractId, "get_token", [
      nativeToScVal(poolId, { type: "string" }),
      nativeToScVal(tokenType, { type: "string" }),
    ]) as Promise<string | null>;
  }

  async getTokenBalance(tokenAddress: string, holder: string): Promise<bigint> {
    return this.client.simulateCall(this.contractId, "balance", [
      nativeToScVal(tokenAddress, { type: "address" }),
      nativeToScVal(holder, { type: "address" }),
    ]) as Promise<bigint>;
  }

  buildDeployToken(
    poolId: string,
    tokenType: TokenType,
    name: string,
    symbol: string,
    decimals: number,
    totalSupply: bigint
  ) {
    return [
      nativeToScVal(poolId, { type: "string" }),
      nativeToScVal(tokenType, { type: "string" }),
      nativeToScVal(name, { type: "string" }),
      nativeToScVal(symbol, { type: "string" }),
      nativeToScVal(decimals, { type: "u32" }),
      nativeToScVal(totalSupply, { type: "i128" }),
    ];
  }
}
