import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address, Bytes } from "@graphprotocol/graph-ts"
import { TradeFailed, TradeSuccessful } from "../generated/tegro/tegro"

export function createTradeFailedEvent(index: BigInt): TradeFailed {
  let tradeFailedEvent = changetype<TradeFailed>(newMockEvent())

  tradeFailedEvent.parameters = new Array()

  tradeFailedEvent.parameters.push(
    new ethereum.EventParam("index", ethereum.Value.fromUnsignedBigInt(index))
  )

  return tradeFailedEvent
}

export function createTradeSuccessfulEvent(
  maker: Address,
  taker: Address,
  makerAsset: Address,
  takerAsset: Address,
  makerAmount: BigInt,
  takerAmount: BigInt,
  orderHash: Bytes
): TradeSuccessful {
  let tradeSuccessfulEvent = changetype<TradeSuccessful>(newMockEvent())

  tradeSuccessfulEvent.parameters = new Array()

  tradeSuccessfulEvent.parameters.push(
    new ethereum.EventParam("maker", ethereum.Value.fromAddress(maker))
  )
  tradeSuccessfulEvent.parameters.push(
    new ethereum.EventParam("taker", ethereum.Value.fromAddress(taker))
  )
  tradeSuccessfulEvent.parameters.push(
    new ethereum.EventParam(
      "makerAsset",
      ethereum.Value.fromAddress(makerAsset)
    )
  )
  tradeSuccessfulEvent.parameters.push(
    new ethereum.EventParam(
      "takerAsset",
      ethereum.Value.fromAddress(takerAsset)
    )
  )
  tradeSuccessfulEvent.parameters.push(
    new ethereum.EventParam(
      "makerAmount",
      ethereum.Value.fromUnsignedBigInt(makerAmount)
    )
  )
  tradeSuccessfulEvent.parameters.push(
    new ethereum.EventParam(
      "takerAmount",
      ethereum.Value.fromUnsignedBigInt(takerAmount)
    )
  )
  tradeSuccessfulEvent.parameters.push(
    new ethereum.EventParam(
      "orderHash",
      ethereum.Value.fromFixedBytes(orderHash)
    )
  )

  return tradeSuccessfulEvent
}
