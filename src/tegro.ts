import {
  TradeFailed as TradeFailedEvent,
  TradeSuccessful as TradeSuccessfulEvent
} from "../generated/tegro/tegro"
import { TradeFailed, TradeSuccessful } from "../generated/schema"

export function handleTradeFailed(event: TradeFailedEvent): void {
  let entity = new TradeFailed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.index = event.params.index

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTradeSuccessful(event: TradeSuccessfulEvent): void {
  let entity = new TradeSuccessful(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.maker = event.params.maker
  entity.taker = event.params.taker
  entity.makerAsset = event.params.makerAsset
  entity.takerAsset = event.params.takerAsset
  entity.makerAmount = event.params.makerAmount
  entity.takerAmount = event.params.takerAmount
  entity.orderHash = event.params.orderHash

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
