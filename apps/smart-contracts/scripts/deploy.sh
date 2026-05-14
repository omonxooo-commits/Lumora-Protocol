#!/usr/bin/env bash
# Lumora Protocol — Soroban contract deployment script
# Usage: ./scripts/deploy.sh [testnet|mainnet]
set -euo pipefail

NETWORK=${1:-testnet}
SOURCE_SECRET=${SOURCE_SECRET:?SOURCE_SECRET env var required}

if [ "$NETWORK" = "testnet" ]; then
  RPC_URL="https://soroban-testnet.stellar.org"
  NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
else
  RPC_URL="https://soroban-rpc.stellar.org"
  NETWORK_PASSPHRASE="Public Global Stellar Network ; September 2015"
fi

echo "🚀 Deploying Lumora contracts to $NETWORK"
echo "RPC: $RPC_URL"

# Build all contracts
echo "📦 Building contracts..."
cargo build --release --target wasm32-unknown-unknown

CONTRACTS=(
  "escrow-core"
  "vault-x"
  "asset-forge"
  "liquidity-market"
  "governance-dao"
  "identity-registry"
  "risk-oracle"
  "staking-engine"
)

declare -A CONTRACT_IDS

for contract in "${CONTRACTS[@]}"; do
  echo ""
  echo "📤 Deploying $contract..."
  WASM_PATH="target/wasm32-unknown-unknown/release/${contract//-/_}.wasm"

  CONTRACT_ID=$(stellar contract deploy \
    --wasm "$WASM_PATH" \
    --source "$SOURCE_SECRET" \
    --rpc-url "$RPC_URL" \
    --network-passphrase "$NETWORK_PASSPHRASE")

  CONTRACT_IDS[$contract]=$CONTRACT_ID
  echo "✅ $contract deployed: $CONTRACT_ID"
done

echo ""
echo "📋 Contract addresses — add to .env:"
echo "NEXT_PUBLIC_ESCROW_CORE_ID=${CONTRACT_IDS[escrow-core]}"
echo "NEXT_PUBLIC_VAULT_X_ID=${CONTRACT_IDS[vault-x]}"
echo "NEXT_PUBLIC_ASSET_FORGE_ID=${CONTRACT_IDS[asset-forge]}"
echo "NEXT_PUBLIC_LIQUIDITY_MARKET_ID=${CONTRACT_IDS[liquidity-market]}"
echo "NEXT_PUBLIC_GOVERNANCE_DAO_ID=${CONTRACT_IDS[governance-dao]}"
echo "NEXT_PUBLIC_IDENTITY_REGISTRY_ID=${CONTRACT_IDS[identity-registry]}"
echo "NEXT_PUBLIC_RISK_ORACLE_ID=${CONTRACT_IDS[risk-oracle]}"
echo "NEXT_PUBLIC_STAKING_ENGINE_ID=${CONTRACT_IDS[staking-engine]}"
