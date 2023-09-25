import {
  TradeFailed as TradeFailedEvent,
  TradeSuccessful as TradeSuccessfulEvent
} from "../generated/tegro/tegro"
import { TradeFailed, TradeSuccessful, TotalVolume, DailyVolume, WeeklyVolume } from "../generated/schema"
import { BigInt, BigDecimal, log } from "@graphprotocol/graph-ts";

const USDT_ADDRESS = "0xc2132d05d31c914a87c6611c10748aeb04b58e8f";

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

  // Convert the block timestamp to date and week number
  let timestamp = event.block.timestamp;
  let date = timestamp.toI32() / 86400; // convert timestamp to days since epoch
  let week = date / 7;

  // Handle daily volume
  let dailyVolumeId = date.toString();
  let dailyVolume = DailyVolume.load(dailyVolumeId);

  if (dailyVolume == null) {
    dailyVolume = new DailyVolume(dailyVolumeId);
    dailyVolume.date = date;
    dailyVolume.volume = BigDecimal.fromString("0");
  }

  dailyVolume.volume = dailyVolume.volume.plus(usdtVolume);
  dailyVolume.save();

  // Handle weekly volume
  let weeklyVolumeId = week.toString();
  let weeklyVolume = WeeklyVolume.load(weeklyVolumeId);

  if (weeklyVolume == null) {
    weeklyVolume = new WeeklyVolume(weeklyVolumeId);
    weeklyVolume.week = week;
    weeklyVolume.volume = BigDecimal.fromString("0");
  }

  weeklyVolume.volume = weeklyVolume.volume.plus(usdtVolume);
  weeklyVolume.save();
}

function toHumanReadable(amount: BigInt): BigDecimal {
  let decimals = BigDecimal.fromString("1000000") // 6 decimals
  return amount.toBigDecimal().div(decimals)
}