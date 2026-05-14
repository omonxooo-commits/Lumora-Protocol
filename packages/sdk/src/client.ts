import {
  SorobanRpc,
  Networks,
  Keypair,
  TransactionBuilder,
  BASE_FEE,
  Contract,
  xdr,
  nativeToScVal,
  scValToNative,
} from "@stellar/stellar-sdk";
import type { LumoraConfig, StellarNetwork, TxResult } from "./types";

const NETWORK_PASSPHRASES: Record<StellarNetwork, string> = {
  testnet: Networks.TESTNET,
  mainnet: Networks.PUBLIC,
  futurenet: Networks.FUTURENET,
};

export class LumoraClient {
  readonly config: LumoraConfig;
  readonly rpc: SorobanRpc.Server;

  constructor(config: LumoraConfig) {
    this.config = config;
    this.rpc = new SorobanRpc.Server(config.rpcUrl, { allowHttp: false });
  }

  static fromEnv(): LumoraClient {
    const network = (process.env.NEXT_PUBLIC_NETWORK_NAME ?? "testnet") as StellarNetwork;
    return new LumoraClient({
      network,
      rpcUrl: process.env.NEXT_PUBLIC_RPC_URL ?? "https://soroban-testnet.stellar.org",
      horizonUrl: process.env.NEXT_PUBLIC_HORIZON_URL ?? "https://horizon-testnet.stellar.org",
      networkPassphrase: NETWORK_PASSPHRASES[network],
      contracts: {
        escrowCore: process.env.NEXT_PUBLIC_ESCROW_CORE_ID ?? "",
        vaultX: process.env.NEXT_PUBLIC_VAULT_X_ID ?? "",
        assetForge: process.env.NEXT_PUBLIC_ASSET_FORGE_ID ?? "",
        liquidityMarket: process.env.NEXT_PUBLIC_LIQUIDITY_MARKET_ID ?? "",
        governanceDAO: process.env.NEXT_PUBLIC_GOVERNANCE_DAO_ID ?? "",
        identityRegistry: process.env.NEXT_PUBLIC_IDENTITY_REGISTRY_ID ?? "",
        riskOracle: process.env.NEXT_PUBLIC_RISK_ORACLE_ID ?? "",
        complianceGuard: process.env.NEXT_PUBLIC_COMPLIANCE_GUARD_ID ?? "",
        treasuryManager: process.env.NEXT_PUBLIC_TREASURY_MANAGER_ID ?? "",
        stakingEngine: process.env.NEXT_PUBLIC_STAKING_ENGINE_ID ?? "",
      },
    });
  }

  /**
   * Invoke a Soroban contract function and return the simulation result.
   * For read-only calls (no signer needed).
   */
  async simulateCall(
    contractId: string,
    method: string,
    args: xdr.ScVal[] = []
  ): Promise<unknown> {
    const account = await this.rpc.getAccount(
      Keypair.random().publicKey() // dummy for simulation
    ).catch(() => null);

    if (!account) throw new Error("Unable to fetch account for simulation");

    const contract = new Contract(contractId);
    const tx = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: this.config.networkPassphrase,
    })
      .addOperation(contract.call(method, ...args))
      .setTimeout(30)
      .build();

    const sim = await this.rpc.simulateTransaction(tx);
    if (SorobanRpc.Api.isSimulationError(sim)) {
      throw new Error(`Simulation error: ${sim.error}`);
    }

    const result = (sim as SorobanRpc.Api.SimulateTransactionSuccessResponse).result;
    return result ? scValToNative(result.retval) : null;
  }

  /**
   * Submit a signed transaction to the network.
   */
  async submitTransaction(signedXdr: string): Promise<TxResult> {
    const tx = TransactionBuilder.fromXDR(
      signedXdr,
      this.config.networkPassphrase
    );

    const sendResult = await this.rpc.sendTransaction(tx);
    if (sendResult.status === "ERROR") {
      return { hash: sendResult.hash, success: false, error: sendResult.errorResult?.toXDR("base64") };
    }

    // Poll for confirmation
    let attempts = 0;
    while (attempts < 30) {
      await new Promise((r) => setTimeout(r, 2000));
      const status = await this.rpc.getTransaction(sendResult.hash);
      if (status.status === SorobanRpc.Api.GetTransactionStatus.SUCCESS) {
        return {
          hash: sendResult.hash,
          success: true,
          ledger: status.ledger,
          returnValue: status.returnValue ? scValToNative(status.returnValue) : undefined,
        };
      }
      if (status.status === SorobanRpc.Api.GetTransactionStatus.FAILED) {
        return { hash: sendResult.hash, success: false, error: "Transaction failed on-chain" };
      }
      attempts++;
    }

    return { hash: sendResult.hash, success: false, error: "Transaction confirmation timeout" };
  }
}
