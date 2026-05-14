import { nativeToScVal } from "@stellar/stellar-sdk";
import type { LumoraClient } from "../client";
import type { MarketOrder, OrderSide } from "../types";

export class LiquidityMarketContract {
  constructor(private client: LumoraClient) {}

  private get contractId() {
    return this.client.config.contracts.liquidityMarket;
  }

  async getOrder(orderId: string): Promise<MarketOrder | null> {
    return this.client.simulateCall(this.contractId, "get_order", [
      nativeToScVal(orderId, { type: "string" }),
    ]) as Promise<MarketOrder | null>;
  }

  async listOrdersByPool(poolId: string, side?: OrderSide): Promise<MarketOrder[]> {
    const args = [nativeToScVal(poolId, { type: "string" })];
    if (side) args.push(nativeToScVal(side, { type: "string" }));
    return this.client.simulateCall(this.contractId, "list_orders", args) as Promise<MarketOrder[]>;
  }

  async getFloorPrice(poolId: string): Promise<bigint> {
    return this.client.simulateCall(this.contractId, "floor_price", [
      nativeToScVal(poolId, { type: "string" }),
    ]) as Promise<bigint>;
  }

  buildPlaceOrder(
    poolId: string,
    seller: string,
    tokenAmount: bigint,
    pricePerToken: bigint,
    side: OrderSide
  ) {
    return [
      nativeToScVal(poolId, { type: "string" }),
      nativeToScVal(seller, { type: "address" }),
      nativeToScVal(tokenAmount, { type: "i128" }),
      nativeToScVal(pricePerToken, { type: "i128" }),
      nativeToScVal(side, { type: "string" }),
    ];
  }

  buildFillOrder(orderId: string, buyer: string) {
    return [
      nativeToScVal(orderId, { type: "string" }),
      nativeToScVal(buyer, { type: "address" }),
    ];
  }

  buildCancelOrder(orderId: string, owner: string) {
    return [
      nativeToScVal(orderId, { type: "string" }),
      nativeToScVal(owner, { type: "address" }),
    ];
  }
}
