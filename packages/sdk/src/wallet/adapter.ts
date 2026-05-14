/**
 * Wallet adapter interface — implemented by Freighter and other Stellar wallets.
 * The actual Freighter integration lives in each app (browser-only).
 */

export interface WalletAdapter {
  /** Returns the connected public key, or null if not connected. */
  getPublicKey(): Promise<string | null>;
  /** Signs a transaction XDR and returns the signed XDR. */
  signTransaction(xdr: string, opts?: { networkPassphrase?: string }): Promise<string>;
  /** Returns true if the wallet is installed and available. */
  isAvailable(): boolean;
}

/**
 * Minimal Freighter adapter — wraps the @stellar/freighter-api package.
 * Import this only in browser contexts.
 */
export async function createFreighterAdapter(): Promise<WalletAdapter> {
  // Dynamic import to avoid SSR issues
  const freighter = await import("@stellar/freighter-api").catch(() => null);

  if (!freighter) {
    throw new Error("Freighter API not available. Install @stellar/freighter-api.");
  }

  return {
    isAvailable: () => true,

    async getPublicKey() {
      try {
        const result = await freighter.getPublicKey();
        return result ?? null;
      } catch {
        return null;
      }
    },

    async signTransaction(xdr, opts) {
      const result = await freighter.signTransaction(xdr, {
        networkPassphrase: opts?.networkPassphrase,
      });
      if (typeof result === "string") return result;
      // Newer freighter-api returns { signedTxXdr }
      return (result as { signedTxXdr: string }).signedTxXdr;
    },
  };
}
