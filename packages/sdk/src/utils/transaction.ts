import {
  TransactionBuilder,
  BASE_FEE,
  Contract,
  SorobanRpc,
  xdr,
} from "@stellar/stellar-sdk";
import type { LumoraClient } from "../client";
import type { WalletAdapter } from "../wallet/adapter";

/**
 * Build, simulate, and prepare a Soroban contract call for signing.
 * Returns the prepared XDR ready to be signed by a wallet.
 */
export async function buildContractCall(
  client: LumoraClient,
  senderAddress: string,
  contractId: string,
  method: string,
  args: xdr.ScVal[]
): Promise<string> {
  const account = await client.rpc.getAccount(senderAddress);
  const contract = new Contract(contractId);

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: client.config.networkPassphrase,
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(30)
    .build();

  const sim = await client.rpc.simulateTransaction(tx);
  if (SorobanRpc.Api.isSimulationError(sim)) {
    throw new Error(`Simulation failed: ${sim.error}`);
  }

  const prepared = SorobanRpc.assembleTransaction(tx, sim).build();
  return prepared.toXDR();
}

/**
 * Full flow: build → sign via wallet → submit.
 */
export async function invokeContract(
  client: LumoraClient,
  wallet: WalletAdapter,
  senderAddress: string,
  contractId: string,
  method: string,
  args: xdr.ScVal[]
) {
  const preparedXdr = await buildContractCall(
    client,
    senderAddress,
    contractId,
    method,
    args
  );

  const signedXdr = await wallet.signTransaction(preparedXdr, {
    networkPassphrase: client.config.networkPassphrase,
  });

  return client.submitTransaction(signedXdr);
}
