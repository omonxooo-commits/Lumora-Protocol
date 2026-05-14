#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, String};

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub enum ProposalStatus {
    Active,
    Passed,
    Rejected,
    Executed,
    Cancelled,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct Proposal {
    pub id: String,
    pub proposer: Address,
    pub title: String,
    pub proposal_type: String,
    pub status: ProposalStatus,
    pub votes_for: i128,
    pub votes_against: i128,
    pub quorum: i128,
    pub start_time: u64,
    pub end_time: u64,
    pub executed_at: u64,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct VoteRecord {
    pub voter: Address,
    pub proposal_id: String,
    pub support: bool,
    pub weight: i128,
    pub voted_at: u64,
}

#[contract]
pub struct GovernanceDAO;

#[contractimpl]
impl GovernanceDAO {
    pub fn initialize(env: Env, admin: Address) {
        admin.require_auth();
        env.storage().instance().set(&symbol_short!("ADMIN"), &admin);
    }

    /// Create a new governance proposal.
    pub fn create_proposal(
        env: Env,
        proposer: Address,
        proposal_id: String,
        title: String,
        proposal_type: String,
        duration_seconds: u64,
        quorum: i128,
    ) -> Proposal {
        proposer.require_auth();

        let now = env.ledger().timestamp();
        let proposal = Proposal {
            id: proposal_id.clone(),
            proposer,
            title,
            proposal_type,
            status: ProposalStatus::Active,
            votes_for: 0,
            votes_against: 0,
            quorum,
            start_time: now,
            end_time: now + duration_seconds,
            executed_at: 0,
        };

        env.storage()
            .persistent()
            .set(&(symbol_short!("PROP"), proposal_id), &proposal);
        proposal
    }

    /// Cast a vote on an active proposal.
    pub fn vote(
        env: Env,
        voter: Address,
        proposal_id: String,
        support: bool,
        weight: i128,
    ) {
        voter.require_auth();
        assert!(weight > 0, "Weight must be positive");

        // Check not already voted
        let vote_key = (symbol_short!("VOTE"), proposal_id.clone(), voter.clone());
        assert!(
            !env.storage().persistent().has(&vote_key),
            "Already voted"
        );

        let mut proposal: Proposal = env
            .storage()
            .persistent()
            .get(&(symbol_short!("PROP"), proposal_id.clone()))
            .expect("Proposal not found");

        assert!(proposal.status == ProposalStatus::Active, "Not active");
        assert!(
            env.ledger().timestamp() <= proposal.end_time,
            "Voting ended"
        );

        if support {
            proposal.votes_for += weight;
        } else {
            proposal.votes_against += weight;
        }

        // Auto-resolve if quorum reached
        let total = proposal.votes_for + proposal.votes_against;
        if total >= proposal.quorum {
            proposal.status = if proposal.votes_for > proposal.votes_against {
                ProposalStatus::Passed
            } else {
                ProposalStatus::Rejected
            };
        }

        env.storage()
            .persistent()
            .set(&(symbol_short!("PROP"), proposal_id.clone()), &proposal);

        let vote_record = VoteRecord {
            voter,
            proposal_id,
            support,
            weight,
            voted_at: env.ledger().timestamp(),
        };
        env.storage().persistent().set(&vote_key, &vote_record);
    }

    /// Execute a passed proposal.
    pub fn execute_proposal(env: Env, executor: Address, proposal_id: String) {
        executor.require_auth();

        let mut proposal: Proposal = env
            .storage()
            .persistent()
            .get(&(symbol_short!("PROP"), proposal_id.clone()))
            .expect("Proposal not found");

        assert!(proposal.status == ProposalStatus::Passed, "Not passed");
        proposal.status = ProposalStatus::Executed;
        proposal.executed_at = env.ledger().timestamp();

        env.storage()
            .persistent()
            .set(&(symbol_short!("PROP"), proposal_id), &proposal);
    }

    // ── Read-only ──────────────────────────────────────────────────────────

    pub fn get_proposal(env: Env, proposal_id: String) -> Option<Proposal> {
        env.storage()
            .persistent()
            .get(&(symbol_short!("PROP"), proposal_id))
    }

    pub fn has_voted(env: Env, proposal_id: String, voter: Address) -> bool {
        env.storage()
            .persistent()
            .has(&(symbol_short!("VOTE"), proposal_id, voter))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    #[test]
    fn test_vote_and_pass() {
        let env = Env::default();
        env.mock_all_auths();
        let id = env.register_contract(None, GovernanceDAO);
        let client = GovernanceDaoClient::new(&env, &id);

        let admin = Address::generate(&env);
        let proposer = Address::generate(&env);
        let voter = Address::generate(&env);

        client.initialize(&admin);
        client.create_proposal(
            &proposer,
            &String::from_str(&env, "prop-001"),
            &String::from_str(&env, "Test Proposal"),
            &String::from_str(&env, "fee_structure"),
            &86400_u64,
            &100_i128,
        );

        client.vote(&voter, &String::from_str(&env, "prop-001"), &true, &150_i128);

        let prop = client
            .get_proposal(&String::from_str(&env, "prop-001"))
            .unwrap();
        assert_eq!(prop.status, ProposalStatus::Passed);
    }
}
