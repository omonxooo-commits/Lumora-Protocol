#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, String};

// ── Types ─────────────────────────────────────────────────────────────────

#[contracttype]
#[derive(Clone, Debug)]
pub struct Investment {
    pub pool_id: String,
    pub investor: Address,
    pub amount: i128,
    pub token_balance: i128,
    pub claimed_yield: i128,
    pub invested_at: u64,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct VaultState {
    pub pool_id: String,
    pub total_invested: i128,
    pub total_yield_distributed: i128,
    pub yield_per_token: i128, // scaled by 1e7
    pub last_distribution: u64,
}

// ── Contract ──────────────────────────────────────────────────────────────

#[contract]
pub struct VaultX;

#[contractimpl]
impl VaultX {
    pub fn initialize(env: Env, admin: Address) {
        admin.require_auth();
        env.storage().instance().set(&symbol_short!("ADMIN"), &admin);
    }

    /// Record an investment and mint proportional token balance.
    pub fn invest(env: Env, investor: Address, pool_id: String, amount: i128) {
        investor.require_auth();
        assert!(amount > 0, "Amount must be positive");

        let key = (symbol_short!("INV"), pool_id.clone(), investor.clone());
        let mut inv: Investment = env.storage().persistent().get(&key).unwrap_or(Investment {
            pool_id: pool_id.clone(),
            investor: investor.clone(),
            amount: 0,
            token_balance: 0,
            claimed_yield: 0,
            invested_at: env.ledger().timestamp(),
        });

        inv.amount += amount;
        inv.token_balance += amount; // 1:1 token ratio at par
        env.storage().persistent().set(&key, &inv);

        // Update vault state
        let vault_key = (symbol_short!("VAULT"), pool_id.clone());
        let mut vault: VaultState = env.storage().persistent().get(&vault_key).unwrap_or(VaultState {
            pool_id: pool_id.clone(),
            total_invested: 0,
            total_yield_distributed: 0,
            yield_per_token: 0,
            last_distribution: 0,
        });
        vault.total_invested += amount;
        env.storage().persistent().set(&vault_key, &vault);
    }

    /// Distribute yield to the vault — increases yield_per_token.
    pub fn distribute_yield(env: Env, admin: Address, pool_id: String, yield_amount: i128) {
        admin.require_auth();
        assert!(yield_amount > 0, "Yield must be positive");

        let vault_key = (symbol_short!("VAULT"), pool_id.clone());
        let mut vault: VaultState = env
            .storage()
            .persistent()
            .get(&vault_key)
            .expect("Vault not found");

        assert!(vault.total_invested > 0, "No investments");

        // yield_per_token scaled by 1e7 to preserve precision
        vault.yield_per_token += (yield_amount * 10_000_000) / vault.total_invested;
        vault.total_yield_distributed += yield_amount;
        vault.last_distribution = env.ledger().timestamp();
        env.storage().persistent().set(&vault_key, &vault);
    }

    /// Claim pending yield for an investor.
    pub fn claim_yield(env: Env, investor: Address, pool_id: String) -> i128 {
        investor.require_auth();

        let key = (symbol_short!("INV"), pool_id.clone(), investor.clone());
        let mut inv: Investment = env
            .storage()
            .persistent()
            .get(&key)
            .expect("Investment not found");

        let vault_key = (symbol_short!("VAULT"), pool_id.clone());
        let vault: VaultState = env
            .storage()
            .persistent()
            .get(&vault_key)
            .expect("Vault not found");

        let total_yield = (inv.token_balance * vault.yield_per_token) / 10_000_000;
        let claimable = total_yield - inv.claimed_yield;
        assert!(claimable > 0, "Nothing to claim");

        inv.claimed_yield = total_yield;
        env.storage().persistent().set(&key, &inv);

        claimable
    }

    // ── Read-only ──────────────────────────────────────────────────────────

    pub fn get_investment(env: Env, pool_id: String, investor: Address) -> Option<Investment> {
        env.storage()
            .persistent()
            .get(&(symbol_short!("INV"), pool_id, investor))
    }

    pub fn pending_yield(env: Env, pool_id: String, investor: Address) -> i128 {
        let inv: Option<Investment> = env
            .storage()
            .persistent()
            .get(&(symbol_short!("INV"), pool_id.clone(), investor));
        let vault: Option<VaultState> = env
            .storage()
            .persistent()
            .get(&(symbol_short!("VAULT"), pool_id));

        match (inv, vault) {
            (Some(i), Some(v)) => {
                let total = (i.token_balance * v.yield_per_token) / 10_000_000;
                (total - i.claimed_yield).max(0)
            }
            _ => 0,
        }
    }

    pub fn get_vault(env: Env, pool_id: String) -> Option<VaultState> {
        env.storage()
            .persistent()
            .get(&(symbol_short!("VAULT"), pool_id))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    #[test]
    fn test_invest_and_distribute() {
        let env = Env::default();
        env.mock_all_auths();
        let id = env.register_contract(None, VaultX);
        let client = VaultXClient::new(&env, &id);

        let admin = Address::generate(&env);
        let investor = Address::generate(&env);
        let pool_id = String::from_str(&env, "pool-001");

        client.initialize(&admin);
        client.invest(&investor, &pool_id, &10_000_i128);
        client.distribute_yield(&admin, &pool_id, &1_000_i128);

        let pending = client.pending_yield(&pool_id, &investor);
        assert_eq!(pending, 1_000);
    }
}
