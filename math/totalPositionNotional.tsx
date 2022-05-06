import { Market } from "../data/markets";
import { Collateral } from "../data/collaterals";
import zip from "../utils/zip";

function getTotalPositionNotional(
    markets: Market[],
    marketPositions: number[],
    marketPrices: number[],
    borrow: Collateral[],
    borrowPositions: number[],
    borrowPrices: number[]
): number {
    let totalPositionNotional = 0;
    const marketSummary = zip(zip(markets, marketPositions), marketPrices);

    for (const [market, positionSize, marketPrice] of marketSummary) {
        totalPositionNotional += positionSize * marketPrice;
    }

    const borrowSummary = zip(zip(borrow, borrowPositions), borrowPrices);

    for (const [borrow, borrowSize, borrowPrice] of borrowSummary) {
        totalPositionNotional += borrowSize * borrowPrice;
    }

    return totalPositionNotional;
}

export default getTotalPositionNotional;
