import { nativeToScVal } from "@stellar/stellar-sdk";
import type { LumoraClient } from "../client";
import type { Proposal, ProposalType } from "../types";

export class GovernanceDAOContract {
  constructor(private client: LumoraClient) {}

  private get contractId() {
    return this.client.config.contracts.governanceDAO;
  }

  async getProposal(proposalId: string): Promise<Proposal | null> {
    return this.client.simulateCall(this.contractId, "get_proposal", [
      nativeToScVal(proposalId, { type: "string" }),
    ]) as Promise<Proposal | null>;
  }

  async listProposals(status?: string): Promise<Proposal[]> {
    const args = status ? [nativeToScVal(status, { type: "string" })] : [];
    return this.client.simulateCall(this.contractId, "list_proposals", args) as Promise<Proposal[]>;
  }

  async getVotingPower(voter: string): Promise<bigint> {
    return this.client.simulateCall(this.contractId, "voting_power", [
      nativeToScVal(voter, { type: "address" }),
    ]) as Promise<bigint>;
  }

  async hasVoted(proposalId: string, voter: string): Promise<boolean> {
    return this.client.simulateCall(this.contractId, "has_voted", [
      nativeToScVal(proposalId, { type: "string" }),
      nativeToScVal(voter, { type: "address" }),
    ]) as Promise<boolean>;
  }

  buildCreateProposal(
    proposer: string,
    title: string,
    description: string,
    type: ProposalType,
    durationDays: number,
    calldata?: string
  ) {
    return [
      nativeToScVal(proposer, { type: "address" }),
      nativeToScVal(title, { type: "string" }),
      nativeToScVal(description, { type: "string" }),
      nativeToScVal(type, { type: "string" }),
      nativeToScVal(durationDays, { type: "u32" }),
      ...(calldata ? [nativeToScVal(calldata, { type: "string" })] : []),
    ];
  }

  buildVote(proposalId: string, voter: string, support: boolean, weight: bigint) {
    return [
      nativeToScVal(proposalId, { type: "string" }),
      nativeToScVal(voter, { type: "address" }),
      nativeToScVal(support, { type: "bool" }),
      nativeToScVal(weight, { type: "i128" }),
    ];
  }

  buildExecuteProposal(proposalId: string, executor: string) {
    return [
      nativeToScVal(proposalId, { type: "string" }),
      nativeToScVal(executor, { type: "address" }),
    ];
  }
}
