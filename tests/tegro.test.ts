import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address, Bytes } from "@graphprotocol/graph-ts"
import { TradeFailed } from "../generated/schema"
import { TradeFailed as TradeFailedEvent } from "../generated/tegro/tegro"
import { handleTradeFailed } from "../src/tegro"
import { createTradeFailedEvent } from "./tegro-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let index = BigInt.fromI32(234)
    let newTradeFailedEvent = createTradeFailedEvent(index)
    handleTradeFailed(newTradeFailedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("TradeFailed created and stored", () => {
    assert.entityCount("TradeFailed", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "TradeFailed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "index",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
