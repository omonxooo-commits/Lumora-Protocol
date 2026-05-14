import { nativeToScVal } from "@stellar/stellar-sdk";
import type { LumoraClient } from "../client";
import type { RiskScore } from "../types";

export class RiskOracleContract {
  constructor(private client: LumoraClient) {}

  private get contractId() {
    return this.client.config.contracts.riskOracle;
  }

  async getRiskScore(poolId: string): Promise<RiskScore | null> {
    return this.client.simulateCall(this.contractId, "get_risk_score", [
      nativeToScVal(poolId, { type: "string" }),
    ]) as Promise<RiskScore | null>;
  }

  async getIssuerRisk(issuer: string): Promise<RiskScore | null> {
    return this.client.simulateCall(this.contractId, "get_issuer_risk", [
      nativeToScVal(issuer, { type: "address" }),
    ]) as Promise<RiskScore | null>;
  }

  buildUpdateScore(
    poolId: string,
    grade: string,
    score: number,
    oracle: string
  ) {
    return [
      nativeToScVal(poolId, { type: "string" }),
      nativeToScVal(grade, { type: "string" }),
      nativeToScVal(score, { type: "u32" }),
      nativeToScVal(oracle, { type: "address" }),
    ];
  }
}
