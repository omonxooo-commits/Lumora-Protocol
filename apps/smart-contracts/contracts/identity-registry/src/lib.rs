#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, String};

#[contracttype]
#[derive(Clone, Debug)]
pub struct IdentityProfile {
    pub address: Address,
    pub did: String,
    pub kyc_level: u32,       // 0–3
    pub jurisdiction: String,
    pub reputation_score: u32, // 0–1000
    pub total_projects: u32,
    pub successful_projects: u32,
    pub created_at: u64,
    pub updated_at: u64,
}

#[contract]
pub struct IdentityRegistry;

#[contractimpl]
impl IdentityRegistry {
    pub fn initialize(env: Env, admin: Address) {
        admin.require_auth();
        env.storage().instance().set(&symbol_short!("ADMIN"), &admin);
    }

    /// Register a new identity.
    pub fn register(
        env: Env,
        address: Address,
        did: String,
        jurisdiction: String,
    ) -> IdentityProfile {
        address.require_auth();

        let key = (symbol_short!("ID"), address.clone());
        assert!(
            !env.storage().persistent().has(&key),
            "Already registered"
        );

        let profile = IdentityProfile {
            address: address.clone(),
            did,
            kyc_level: 0,
            jurisdiction,
            reputation_score: 500, // neutral starting score
            total_projects: 0,
            successful_projects: 0,
            created_at: env.ledger().timestamp(),
            updated_at: env.ledger().timestamp(),
        };

        env.storage().persistent().set(&key, &profile);
        profile
    }

    /// Update KYC level (admin/verifier only).
    pub fn update_kyc(env: Env, verifier: Address, address: Address, level: u32) {
        verifier.require_auth();
        assert!(level <= 3, "Max KYC level is 3");

        let key = (symbol_short!("ID"), address.clone());
        let mut profile: IdentityProfile = env
            .storage()
            .persistent()
            .get(&key)
            .expect("Profile not found");

        profile.kyc_level = level;
        profile.updated_at = env.ledger().timestamp();
        env.storage().persistent().set(&key, &profile);
    }

    /// Update reputation score (oracle/admin only).
    pub fn update_reputation(env: Env, oracle: Address, address: Address, score: u32) {
        oracle.require_auth();
        assert!(score <= 1000, "Score must be 0–1000");

        let key = (symbol_short!("ID"), address.clone());
        let mut profile: IdentityProfile = env
            .storage()
            .persistent()
            .get(&key)
            .expect("Profile not found");

        profile.reputation_score = score;
        profile.updated_at = env.ledger().timestamp();
        env.storage().persistent().set(&key, &profile);
    }

    /// Record a completed project (updates success metrics).
    pub fn record_project(env: Env, oracle: Address, address: Address, success: bool) {
        oracle.require_auth();

        let key = (symbol_short!("ID"), address.clone());
        let mut profile: IdentityProfile = env
            .storage()
            .persistent()
            .get(&key)
            .expect("Profile not found");

        profile.total_projects += 1;
        if success {
            profile.successful_projects += 1;
        }
        profile.updated_at = env.ledger().timestamp();
        env.storage().persistent().set(&key, &profile);
    }

    // ── Read-only ──────────────────────────────────────────────────────────

    pub fn get_profile(env: Env, address: Address) -> Option<IdentityProfile> {
        env.storage()
            .persistent()
            .get(&(symbol_short!("ID"), address))
    }

    pub fn is_kyc_verified(env: Env, address: Address) -> bool {
        let profile: Option<IdentityProfile> = env
            .storage()
            .persistent()
            .get(&(symbol_short!("ID"), address));
        profile.map(|p| p.kyc_level >= 1).unwrap_or(false)
    }

    pub fn reputation_score(env: Env, address: Address) -> u32 {
        let profile: Option<IdentityProfile> = env
            .storage()
            .persistent()
            .get(&(symbol_short!("ID"), address));
        profile.map(|p| p.reputation_score).unwrap_or(0)
    }
}
