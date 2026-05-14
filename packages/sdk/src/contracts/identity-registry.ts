import { nativeToScVal } from "@stellar/stellar-sdk";
import type { LumoraClient } from "../client";
import type { IdentityProfile } from "../types";

export class IdentityRegistryContract {
  constructor(private client: LumoraClient) {}

  private get contractId() {
    return this.client.config.contracts.identityRegistry;
  }

  async getProfile(address: string): Promise<IdentityProfile | null> {
    return this.client.simulateCall(this.contractId, "get_profile", [
      nativeToScVal(address, { type: "address" }),
    ]) as Promise<IdentityProfile | null>;
  }

  async isKycVerified(address: string): Promise<boolean> {
    return this.client.simulateCall(this.contractId, "is_kyc_verified", [
      nativeToScVal(address, { type: "address" }),
    ]) as Promise<boolean>;
  }

  async getReputationScore(address: string): Promise<number> {
    return this.client.simulateCall(this.contractId, "reputation_score", [
      nativeToScVal(address, { type: "address" }),
    ]) as Promise<number>;
  }

  buildRegister(address: string, did: string, jurisdiction: string) {
    return [
      nativeToScVal(address, { type: "address" }),
      nativeToScVal(did, { type: "string" }),
      nativeToScVal(jurisdiction, { type: "string" }),
    ];
  }

  buildUpdateKyc(address: string, level: 0 | 1 | 2 | 3, verifier: string) {
    return [
      nativeToScVal(address, { type: "address" }),
      nativeToScVal(level, { type: "u32" }),
      nativeToScVal(verifier, { type: "address" }),
    ];
  }
}
