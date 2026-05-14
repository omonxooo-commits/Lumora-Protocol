"use client";

import { useState, useCallback } from "react";

interface WalletState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    address: null,
    isConnected: false,
    isConnecting: false,
    error: null,
  });

  const connect = useCallback(async () => {
    setState((s) => ({ ...s, isConnecting: true, error: null }));
    try {
      // Dynamic import to avoid SSR issues
      const { createFreighterAdapter } = await import("@lumora/sdk");
      const adapter = await createFreighterAdapter();
      const publicKey = await adapter.getPublicKey();
      if (!publicKey) throw new Error("No public key returned from wallet");
      setState({ address: publicKey, isConnected: true, isConnecting: false, error: null });
    } catch (err) {
      setState((s) => ({
        ...s,
        isConnecting: false,
        error: err instanceof Error ? err.message : "Failed to connect wallet",
      }));
    }
  }, []);

  const disconnect = useCallback(() => {
    setState({ address: null, isConnected: false, isConnecting: false, error: null });
  }, []);

  return { ...state, connect, disconnect };
}
