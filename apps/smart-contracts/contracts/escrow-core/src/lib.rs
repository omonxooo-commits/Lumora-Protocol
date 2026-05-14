#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short,
    Address, Env, String, Vec, Map,
};

// ── Storage Keys ──────────────────────────────────────────────────────────

const POOL_KEY: &str = "POOL";
const MILESTONE_KEY: &str = "MS";
const ADMIN_KEY: &str = "ADMIN";

// ── Data Types ────────────────────────────────────────────────────────────

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub enum PoolStatus {
    Pending,
    Active,
    Funded,
    Completed,
    Paused,
    Defaulted,
}

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub enum MilestoneStatus {
    Pending,
    Submitted,
    Approved,
    Rejected,
    Released,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct Milestone {
    pub id: String,
    pub title: String,
    pub release_percent: u32,
    pub status: MilestoneStatus,
    pub due_date: u64,
    pub completed_at: u64,
    pub verifier: Address,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct AssetPool {
    pub id: String,
    pub issuer: Address,
    pub name: String,
    pub target_amount: i128,
    pub raised_amount: i128,
    pub roi_percent: u32,
    pub duration_days: u32,
    pub status: PoolStatus,
    pub created_at: u64,
    pub milestone_count: u32,
}

// ── Contract ──────────────────────────────────────────────────────────────

#[contract]
pub struct EscrowCore;

#[contractimpl]
impl EscrowCore {
    /// Initialize the contract with an admin address.
    pub fn initialize(env: Env, admin: Address) {
        admin.require_auth();
        env.storage().instance().set(&symbol_short!("ADMIN"), &admin);
    }

    /// Create a new asset pool.
    pub fn create_pool(
        env: Env,
        issuer: Address,
        pool_id: String,
        name: String,
        target_amount: i128,
        roi_percent: u32,
        duration_days: u32,
    ) -> AssetPool {
        issuer.require_auth();

        let pool = AssetPool {
            id: pool_id.clone(),
            issuer,
            name,
            target_amount,
            raised_amount: 0,
            roi_percent,
            duration_days,
            status: PoolStatus::Active,
            created_at: env.ledger().timestamp(),
            milestone_count: 0,
        };

        env.storage().persistent().set(&(symbol_short!("POOL"), pool_id), &pool);
        pool
    }

    /// Add a milestone to a pool.
    pub fn add_milestone(
        env: Env,
        issuer: Address,
        pool_id: String,
        milestone_id: String,
        title: String,
        release_percent: u32,
        due_date: u64,
    ) {
        issuer.require_auth();

        let mut pool: AssetPool = env
            .storage()
            .persistent()
            .get(&(symbol_short!("POOL"), pool_id.clone()))
            .expect("Pool not found");

        assert!(pool.issuer == issuer, "Not pool issuer");

        let milestone = Milestone {
            id: milestone_id.clone(),
            title,
            release_percent,
            status: MilestoneStatus::Pending,
            due_date,
            completed_at: 0,
            verifier: issuer.clone(),
        };

        env.storage()
            .persistent()
            .set(&(symbol_short!("MS"), pool_id.clone(), milestone_id), &milestone);

        pool.milestone_count += 1;
        env.storage()
            .persistent()
            .set(&(symbol_short!("POOL"), pool_id), &pool);
    }

    /// Submit a milestone for review.
    pub fn submit_milestone(
        env: Env,
        issuer: Address,
        pool_id: String,
        milestone_id: String,
    ) {
        issuer.require_auth();

        let mut ms: Milestone = env
            .storage()
            .persistent()
            .get(&(symbol_short!("MS"), pool_id.clone(), milestone_id.clone()))
            .expect("Milestone not found");

        assert!(ms.status == MilestoneStatus::Pending, "Invalid status");
        ms.status = MilestoneStatus::Submitted;

        env.storage()
            .persistent()
            .set(&(symbol_short!("MS"), pool_id, milestone_id), &ms);
    }

    /// Approve a milestone and trigger fund release.
    pub fn approve_milestone(
        env: Env,
        verifier: Address,
        pool_id: String,
        milestone_id: String,
    ) {
        verifier.require_auth();

        let mut ms: Milestone = env
            .storage()
            .persistent()
            .get(&(symbol_short!("MS"), pool_id.clone(), milestone_id.clone()))
            .expect("Milestone not found");

        assert!(ms.status == MilestoneStatus::Submitted, "Not submitted");
        ms.status = MilestoneStatus::Approved;
        ms.completed_at = env.ledger().timestamp();
        ms.verifier = verifier;

        env.storage()
            .persistent()
            .set(&(symbol_short!("MS"), pool_id, milestone_id), &ms);
    }

    /// Reject a milestone.
    pub fn reject_milestone(
        env: Env,
        verifier: Address,
        pool_id: String,
        milestone_id: String,
    ) {
        verifier.require_auth();

        let mut ms: Milestone = env
            .storage()
            .persistent()
            .get(&(symbol_short!("MS"), pool_id.clone(), milestone_id.clone()))
            .expect("Milestone not found");

        assert!(ms.status == MilestoneStatus::Submitted, "Not submitted");
        ms.status = MilestoneStatus::Rejected;

        env.storage()
            .persistent()
            .set(&(symbol_short!("MS"), pool_id, milestone_id), &ms);
    }

    /// Record an investment into a pool.
    pub fn invest(
        env: Env,
        investor: Address,
        pool_id: String,
        amount: i128,
    ) {
        investor.require_auth();
        assert!(amount > 0, "Amount must be positive");

        let mut pool: AssetPool = env
            .storage()
            .persistent()
            .get(&(symbol_short!("POOL"), pool_id.clone()))
            .expect("Pool not found");

        assert!(pool.status == PoolStatus::Active, "Pool not active");
        assert!(
            pool.raised_amount + amount <= pool.target_amount,
            "Exceeds target"
        );

        pool.raised_amount += amount;
        if pool.raised_amount >= pool.target_amount {
            pool.status = PoolStatus::Funded;
        }

        env.storage()
            .persistent()
            .set(&(symbol_short!("POOL"), pool_id), &pool);
    }

    // ── Read-only ──────────────────────────────────────────────────────────

    pub fn get_pool(env: Env, pool_id: String) -> Option<AssetPool> {
        env.storage()
            .persistent()
            .get(&(symbol_short!("POOL"), pool_id))
    }

    pub fn get_milestone(
        env: Env,
        pool_id: String,
        milestone_id: String,
    ) -> Option<Milestone> {
        env.storage()
            .persistent()
            .get(&(symbol_short!("MS"), pool_id, milestone_id))
    }
}

// ── Tests ─────────────────────────────────────────────────────────────────

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    #[test]
    fn test_create_pool() {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register_contract(None, EscrowCore);
        let client = EscrowCoreClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let issuer = Address::generate(&env);

        client.initialize(&admin);

        let pool = client.create_pool(
            &issuer,
            &String::from_str(&env, "pool-001"),
            &String::from_str(&env, "Test Pool"),
            &500_000_i128,
            &1450_u32, // 14.5% * 100
            &180_u32,
        );

        assert_eq!(pool.raised_amount, 0);
        assert_eq!(pool.status, PoolStatus::Active);
    }

    #[test]
    fn test_invest_and_fund() {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register_contract(None, EscrowCore);
        let client = EscrowCoreClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let issuer = Address::generate(&env);
        let investor = Address::generate(&env);

        client.initialize(&admin);
        client.create_pool(
            &issuer,
            &String::from_str(&env, "pool-001"),
            &String::from_str(&env, "Test Pool"),
            &1000_i128,
            &1000_u32,
            &90_u32,
        );

        client.invest(&investor, &String::from_str(&env, "pool-001"), &1000_i128);

        let pool = client
            .get_pool(&String::from_str(&env, "pool-001"))
            .unwrap();
        assert_eq!(pool.status, PoolStatus::Funded);
    }
}
