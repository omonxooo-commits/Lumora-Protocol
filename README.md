# Lumora Protocol

**Programmable Real-World Asset Infrastructure on Stellar/Soroban**

A full-stack, open-source tokenization and decentralized financing operating system built for creators, startups, cooperatives, SMEs, NGOs, and emerging-market financing systems.

---

## Monorepo Structure

```
lumora-protocol/
├── apps/
│   ├── control-center/      # Issuer dashboard (Next.js, port 3000)
│   ├── investor-hub/        # Investor portal (Next.js, port 3001)
│   ├── liquidity-desk/      # Secondary marketplace (Next.js, port 3002)
│   ├── identity-layer/      # KYC + reputation (Next.js, port 3003)
│   ├── mobile-lite/         # Mobile-first UI (Next.js, port 3004)
│   ├── ai-risk-engine/      # Risk scoring API (FastAPI, port 8000)
│   └── smart-contracts/     # Soroban contracts (Rust)
├── packages/
│   ├── ui/                  # Shared design system (ShadCN + Tailwind)
│   ├── sdk/                 # TypeScript SDK for contract interaction
│   └── analytics/           # Treasury metrics + ROI analytics
```

---

## Quick Start

### Prerequisites

- Node.js ≥ 20
- npm ≥ 10
- Rust + `wasm32-unknown-unknown` target (for contracts)
- Python ≥ 3.11 (for AI risk engine)
- [Stellar CLI](https://developers.stellar.org/docs/tools/developer-tools/cli/install-cli)

### Install dependencies

```bash
npm install
```

### Configure environment

```bash
cp .env.example .env
# Fill in your Soroban RPC URL, contract addresses, and API keys
```

### Run all apps (development)

```bash
npm run dev
```

### Run a single app

```bash
cd apps/control-center
npm install
npm run dev
```

### Run the AI Risk Engine

```bash
cd apps/ai-risk-engine
pip install -r requirements.txt
python main.py
```

---

## Smart Contracts

| Contract | Purpose |
|---|---|
| `EscrowCore` | Milestone escrow management |
| `VaultX` | Revenue distribution and ROI claims |
| `AssetForge` | Token factory for RWAs |
| `LiquidityMarket` | Secondary token marketplace |
| `GovernanceDAO` | Proposal and voting system |
| `IdentityRegistry` | DID and reputation tracking |
| `RiskOracle` | AI-assisted risk scoring |
| `StakingEngine` | Yield staking and protocol incentives |

### Build contracts

```bash
cd apps/smart-contracts
cargo build --release --target wasm32-unknown-unknown
```

### Run contract tests

```bash
cd apps/smart-contracts
cargo test
```

### Deploy to testnet

```bash
cd apps/smart-contracts
SOURCE_SECRET=SXXX... ./scripts/deploy.sh testnet
```

---

## Apps

### Control Center (port 3000)
Issuer-focused dashboard: treasury analytics, milestone management, escrow approvals, dispute resolution, governance proposals.

### Investor Hub (port 3001)
Investor portal: portfolio overview, ROI dashboard, yield claims, governance voting, asset discovery, staking.

### Liquidity Desk (port 3002)
Secondary marketplace: token listings, pool analytics, peer-to-peer trading, fractional exits.

### Identity Layer (port 3003)
Decentralized KYC, reputation scoring, DID management, compliance modules.

### Mobile Lite (port 3004)
Mobile-first lightweight interface for investors and clients.

### AI Risk Engine (port 8000)
FastAPI service providing multi-factor risk scoring for financing pools. Returns grade (AAA–D), numeric score, and per-factor breakdown.

```bash
# Score a pool
curl -X POST http://localhost:8000/score/pool \
  -H "Content-Type: application/json" \
  -d '{
    "pool_id": "pool-001",
    "issuer_address": "GBXXX...",
    "target_amount": 500000,
    "raised_amount": 387500,
    "roi_percent": 14.5,
    "duration_days": 180,
    "total_projects": 8,
    "successful_projects": 7,
    "historical_repayment_rate": 0.95,
    "kyc_level": 2
  }'
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Blockchain | Stellar + Soroban |
| Frontend | Next.js 15 |
| Styling | TailwindCSS + ShadCN |
| Smart Contracts | Rust + Soroban SDK |
| Wallets | Freighter + Wallet Kit |
| Analytics | PostgreSQL + Prisma |
| AI Engine | Python + scikit-learn |
| Storage | IPFS + Pinata |
| Auth | Clerk / Auth.js |
| Messaging | WebSockets + Redis |

---

## License

MIT — open-source and community-driven.
