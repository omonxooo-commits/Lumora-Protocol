#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, String};

#[contracttype]
#[derive(Clone, Debug)]
pub struct RiskScore {
    pub pool_id: String,
    pub grade: String,   // "AAA", "AA", "A", "BBB", "BB", "B", "CCC", "D"
    pub score: u32,      // 0–100
    pub confidence: u32, // 0–100
    pub oracle: Address,
    pub updated_at: u64,
}

#[contract]
pub struct RiskOracle;

#[contractimpl]
impl RiskOracle {
    pub fn initialize(env: Env, admin: Address) {
        admin.require_auth();
        env.storage().instance().set(&symbol_short!("ADMIN"), &admin);
    }

    /// Register an authorized oracle address.
    pub fn add_oracle(env: Env, admin: Address, oracle: Address) {
        admin.require_auth();
        let admin_stored: Address = env
            .storage()
            .instance()
            .get(&symbol_short!("ADMIN"))
            .expect("Not initialized");
        assert!(admin == admin_stored, "Not admin");
        env.storage()
            .persistent()
            .set(&(symbol_short!("ORC"), oracle), &true);
    }

    /// Submit or update a risk score for a pool.
    pub fn update_score(
        env: Env,
        oracle: Address,
        pool_id: String,
        grade: String,
        score: u32,
        confidence: u32,
    ) -> RiskScore {
        oracle.require_auth();
        assert!(score <= 100, "Score must be 0–100");
        assert!(confidence <= 100, "Confidence must be 0–100");

        // Verify oracle is authorized
        assert!(
            env.storage()
                .persistent()
                .get::<_, bool>(&(symbol_short!("ORC"), oracle.clone()))
                .unwrap_or(false),
            "Unauthorized oracle"
        );

        let record = RiskScore {
            pool_id: pool_id.clone(),
            grade,
            score,
            confidence,
            oracle,
            updated_at: env.ledger().timestamp(),
        };

        env.storage()
            .persistent()
            .set(&(symbol_short!("RISK"), pool_id), &record);
        record
    }

    // ── Read-only ──────────────────────────────────────────────────────────

    pub fn get_risk_score(env: Env, pool_id: String) -> Option<RiskScore> {
        env.storage()
            .persistent()
            .get(&(symbol_short!("RISK"), pool_id))
    }
}
