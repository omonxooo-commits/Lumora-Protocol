#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, String};

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub enum OrderStatus {
    Open,
    Filled,
    Cancelled,
    Partial,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct MarketOrder {
    pub id: String,
    pub pool_id: String,
    pub seller: Address,
    pub token_amount: i128,
    pub price_per_token: i128, // in stroops (1e-7 XLM) or USDC micro-units
    pub status: OrderStatus,
    pub created_at: u64,
    pub filled_at: u64,
}

#[contract]
pub struct LiquidityMarket;

#[contractimpl]
impl LiquidityMarket {
    pub fn initialize(env: Env, admin: Address) {
        admin.require_auth();
        env.storage().instance().set(&symbol_short!("ADMIN"), &admin);
    }

    /// Place a sell order.
    pub fn place_order(
        env: Env,
        seller: Address,
        order_id: String,
        pool_id: String,
        token_amount: i128,
        price_per_token: i128,
    ) -> MarketOrder {
        seller.require_auth();
        assert!(token_amount > 0, "Amount must be positive");
        assert!(price_per_token > 0, "Price must be positive");

        let order = MarketOrder {
            id: order_id.clone(),
            pool_id,
            seller,
            token_amount,
            price_per_token,
            status: OrderStatus::Open,
            created_at: env.ledger().timestamp(),
            filled_at: 0,
        };

        env.storage()
            .persistent()
            .set(&(symbol_short!("ORD"), order_id), &order);
        order
    }

    /// Fill an open order (buyer purchases all tokens).
    pub fn fill_order(env: Env, buyer: Address, order_id: String) -> MarketOrder {
        buyer.require_auth();

        let mut order: MarketOrder = env
            .storage()
            .persistent()
            .get(&(symbol_short!("ORD"), order_id.clone()))
            .expect("Order not found");

        assert!(order.status == OrderStatus::Open, "Order not open");

        order.status = OrderStatus::Filled;
        order.filled_at = env.ledger().timestamp();

        env.storage()
            .persistent()
            .set(&(symbol_short!("ORD"), order_id), &order);
        order
    }

    /// Cancel an open order.
    pub fn cancel_order(env: Env, seller: Address, order_id: String) {
        seller.require_auth();

        let mut order: MarketOrder = env
            .storage()
            .persistent()
            .get(&(symbol_short!("ORD"), order_id.clone()))
            .expect("Order not found");

        assert!(order.seller == seller, "Not order owner");
        assert!(order.status == OrderStatus::Open, "Order not open");

        order.status = OrderStatus::Cancelled;
        env.storage()
            .persistent()
            .set(&(symbol_short!("ORD"), order_id), &order);
    }

    // ── Read-only ──────────────────────────────────────────────────────────

    pub fn get_order(env: Env, order_id: String) -> Option<MarketOrder> {
        env.storage()
            .persistent()
            .get(&(symbol_short!("ORD"), order_id))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    #[test]
    fn test_place_and_fill_order() {
        let env = Env::default();
        env.mock_all_auths();
        let id = env.register_contract(None, LiquidityMarket);
        let client = LiquidityMarketClient::new(&env, &id);

        let admin = Address::generate(&env);
        let seller = Address::generate(&env);
        let buyer = Address::generate(&env);

        client.initialize(&admin);
        client.place_order(
            &seller,
            &String::from_str(&env, "ord-001"),
            &String::from_str(&env, "pool-001"),
            &500_i128,
            &1_080_000_i128,
        );

        let order = client.fill_order(&buyer, &String::from_str(&env, "ord-001"));
        assert_eq!(order.status, OrderStatus::Filled);
    }
}
