import {
  TradeFailed as TradeFailedEvent,
  TradeSuccessful as TradeSuccessfulEvent
} from "../generated/tegro/tegro"
import { TradeFailed, TradeSuccessful, TotalVolume } from "../generated/schema"
import { BigInt, BigDecimal, log } from "@graphprotocol/graph-ts";

const USDT_ADDRESS = "0xdac17f958d2ee523a2206206994597c13d831ec7";

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


   // If the trade involves USDT as makerAsset or takerAsset, update the total volume
   let usdtVolume: BigDecimal;
   log.info("Maker Asset: {}", [entity.makerAsset.toHexString()]);
   log.info("Taker Asset: {}", [entity.takerAsset.toHexString()]); 
   
   if (entity.makerAsset.toHexString() == USDT_ADDRESS) {
     usdtVolume = toHumanReadable(entity.makerAmount);
   } else if (entity.takerAsset.toHexString() == USDT_ADDRESS) {
     usdtVolume = toHumanReadable(entity.takerAmount);
   } else {
     return; // If neither the maker nor taker asset is USDT, do not proceed
   }

   let volumeEntity = TotalVolume.load("usdt_volume");
 
   if (volumeEntity == null) {
     volumeEntity = new TotalVolume("usdt_volume");
     volumeEntity.volume = BigDecimal.fromString("0");
    }
 
   volumeEntity.volume = volumeEntity.volume.plus(usdtVolume);
   volumeEntity.save();
}

function toHumanReadable(amount: BigInt): BigDecimal {
  let decimals = BigDecimal.fromString("1000000") // 6 decimals
  return amount.toBigDecimal().div(decimals)
}