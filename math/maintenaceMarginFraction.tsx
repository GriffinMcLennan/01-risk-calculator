import { Market } from "../data/markets";
import { Collateral } from "../data/collaterals";
import zip from "../utils/zip";
import getTotalPositionNotional from "./totalPositionNotional";

function getMaintenanceMarginFraction(
    markets: Market[],
    marketPositions: number[],
    marketPrices: number[],
    borrow: Collateral[],
    borrowPositions: number[],
    borrowPrices: number[]
): number {
    const totalPositionNotional = getTotalPositionNotional(
        markets,
        marketPositions,
        marketPrices,
        borrow,
        borrowPositions,
        borrowPrices
    );

    let sum = 0;
    const marketSummary = zip(zip(markets, marketPositions), marketPrices);

    for (const [market, positionSize, marketPrice] of marketSummary) {
        sum += (positionSize * marketPrice * market.baseIMF) / 2;
    }

    const borrowSummary = zip(zip(borrow, borrowPositions), borrowPrices);

    for (const [borrow, borrowSize, borrowPrice] of borrowSummary) {
        sum += borrowSize * borrowPrice * (1.03 / borrow.weight - 1);
    }

    return sum / totalPositionNotional;
}

export default getMaintenanceMarginFraction;
