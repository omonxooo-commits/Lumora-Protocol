#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env};

#[contracttype]
#[derive(Clone, Debug)]
pub struct StakePosition {
    pub staker: Address,
    pub amount: i128,
    pub reward_debt: i128,   // tracks claimed rewards (scaled by 1e7)
    pub staked_at: u64,
    pub lock_until: u64,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct PoolState {
    pub total_staked: i128,
    pub reward_per_token: i128, // scaled by 1e7
    pub total_rewards_distributed: i128,
}

const SECONDS_PER_DAY: u64 = 86_400;

#[contract]
pub struct StakingEngine;

#[contractimpl]
impl StakingEngine {
    pub fn initialize(env: Env, admin: Address) {
        admin.require_auth();
        env.storage().instance().set(&symbol_short!("ADMIN"), &admin);
        env.storage().persistent().set(
            &symbol_short!("STATE"),
            &PoolState {
                total_staked: 0,
                reward_per_token: 0,
                total_rewards_distributed: 0,
            },
        );
    }

    /// Stake tokens with a lock period.
    pub fn stake(env: Env, staker: Address, amount: i128, lock_days: u32) {
        staker.require_auth();
        assert!(amount > 0, "Amount must be positive");
        assert!(lock_days >= 30, "Minimum lock is 30 days");

        let key = (symbol_short!("STAKE"), staker.clone());
        assert!(
            !env.storage().persistent().has(&key),
            "Already staking — unstake first"
        );

        let now = env.ledger().timestamp();
        let mut state: PoolState = env
            .storage()
            .persistent()
            .get(&symbol_short!("STATE"))
            .expect("Not initialized");

        let position = StakePosition {
            staker: staker.clone(),
            amount,
            reward_debt: (amount * state.reward_per_token) / 10_000_000,
            staked_at: now,
            lock_until: now + (lock_days as u64 * SECONDS_PER_DAY),
        };

        state.total_staked += amount;
        env.storage().persistent().set(&key, &position);
        env.storage()
            .persistent()
            .set(&symbol_short!("STATE"), &state);
    }

    /// Unstake after lock period expires.
    pub fn unstake(env: Env, staker: Address) -> i128 {
        staker.require_auth();

        let key = (symbol_short!("STAKE"), staker.clone());
        let position: StakePosition = env
            .storage()
            .persistent()
            .get(&key)
            .expect("No stake found");

        assert!(
            env.ledger().timestamp() >= position.lock_until,
            "Still locked"
        );

        let mut state: PoolState = env
            .storage()
            .persistent()
            .get(&symbol_short!("STATE"))
            .expect("Not initialized");

        state.total_staked -= position.amount;
        env.storage()
            .persistent()
            .set(&symbol_short!("STATE"), &state);
        env.storage().persistent().remove(&key);

        position.amount
    }

    /// Add rewards to the pool (admin only).
    pub fn add_rewards(env: Env, admin: Address, reward_amount: i128) {
        admin.require_auth();
        assert!(reward_amount > 0, "Reward must be positive");

        let mut state: PoolState = env
            .storage()
            .persistent()
            .get(&symbol_short!("STATE"))
            .expect("Not initialized");

        assert!(state.total_staked > 0, "No stakers");

        state.reward_per_token += (reward_amount * 10_000_000) / state.total_staked;
        state.total_rewards_distributed += reward_amount;
        env.storage()
            .persistent()
            .set(&symbol_short!("STATE"), &state);
    }

    /// Claim pending rewards.
    pub fn claim_rewards(env: Env, staker: Address) -> i128 {
        staker.require_auth();

        let key = (symbol_short!("STAKE"), staker.clone());
        let mut position: StakePosition = env
            .storage()
            .persistent()
            .get(&key)
            .expect("No stake found");

        let state: PoolState = env
            .storage()
            .persistent()
            .get(&symbol_short!("STATE"))
            .expect("Not initialized");

        let total_reward = (position.amount * state.reward_per_token) / 10_000_000;
        let claimable = total_reward - position.reward_debt;
        assert!(claimable > 0, "Nothing to claim");

        position.reward_debt = total_reward;
        env.storage().persistent().set(&key, &position);

        claimable
    }

    // ── Read-only ──────────────────────────────────────────────────────────

    pub fn get_stake(env: Env, staker: Address) -> Option<StakePosition> {
        env.storage()
            .persistent()
            .get(&(symbol_short!("STAKE"), staker))
    }

    pub fn pending_rewards(env: Env, staker: Address) -> i128 {
        let pos: Option<StakePosition> = env
            .storage()
            .persistent()
            .get(&(symbol_short!("STAKE"), staker));
        let state: Option<PoolState> = env
            .storage()
            .persistent()
            .get(&symbol_short!("STATE"));

        match (pos, state) {
            (Some(p), Some(s)) => {
                let total = (p.amount * s.reward_per_token) / 10_000_000;
                (total - p.reward_debt).max(0)
            }
            _ => 0,
        }
    }

    pub fn total_staked(env: Env) -> i128 {
        let state: Option<PoolState> = env
            .storage()
            .persistent()
            .get(&symbol_short!("STATE"));
        state.map(|s| s.total_staked).unwrap_or(0)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    #[test]
    fn test_stake_and_rewards() {
        let env = Env::default();
        env.mock_all_auths();
        let id = env.register_contract(None, StakingEngine);
        let client = StakingEngineClient::new(&env, &id);

        let admin = Address::generate(&env);
        let staker = Address::generate(&env);

        client.initialize(&admin);
        client.stake(&staker, &10_000_i128, &30_u32);
        client.add_rewards(&admin, &1_000_i128);

        let pending = client.pending_rewards(&staker);
        assert_eq!(pending, 1_000);
    }
}
