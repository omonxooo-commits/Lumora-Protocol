#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, String};

#[contracttype]
#[derive(Clone, Debug)]
pub struct TokenRecord {
    pub pool_id: String,
    pub token_type: String,
    pub name: String,
    pub symbol: String,
    pub decimals: u32,
    pub total_supply: i128,
    pub issuer: Address,
    pub created_at: u64,
}

#[contract]
pub struct AssetForge;

#[contractimpl]
impl AssetForge {
    pub fn initialize(env: Env, admin: Address) {
        admin.require_auth();
        env.storage().instance().set(&symbol_short!("ADMIN"), &admin);
    }

    /// Deploy (register) a new token for a pool.
    pub fn deploy_token(
        env: Env,
        issuer: Address,
        pool_id: String,
        token_type: String,
        name: String,
        symbol: String,
        decimals: u32,
        total_supply: i128,
    ) -> TokenRecord {
        issuer.require_auth();
        assert!(total_supply > 0, "Supply must be positive");
        assert!(decimals <= 18, "Max 18 decimals");

        let record = TokenRecord {
            pool_id: pool_id.clone(),
            token_type: token_type.clone(),
            name,
            symbol,
            decimals,
            total_supply,
            issuer,
            created_at: env.ledger().timestamp(),
        };

        let key = (symbol_short!("TOKEN"), pool_id, token_type);
        env.storage().persistent().set(&key, &record);
        record
    }

    /// Mint additional tokens (admin only).
    pub fn mint(env: Env, admin: Address, pool_id: String, token_type: String, amount: i128) {
        admin.require_auth();
        let key = (symbol_short!("TOKEN"), pool_id.clone(), token_type.clone());
        let mut record: TokenRecord = env
            .storage()
            .persistent()
            .get(&key)
            .expect("Token not found");
        record.total_supply += amount;
        env.storage().persistent().set(&key, &record);
    }

    // ── Read-only ──────────────────────────────────────────────────────────

    pub fn get_token(env: Env, pool_id: String, token_type: String) -> Option<TokenRecord> {
        env.storage()
            .persistent()
            .get(&(symbol_short!("TOKEN"), pool_id, token_type))
    }
}
