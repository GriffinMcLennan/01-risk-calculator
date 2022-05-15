import { BorrowAmounts, CollateralAmounts, MarketAmounts, Prices } from "../components/RiskCalculator";

function theoreticalTotalAccountValue(
    collateralAmounts: CollateralAmounts,
    borrowAmounts: BorrowAmounts,
    marketAmounts: MarketAmounts,
    prices: Prices,
    futurePrices: Prices,
    overrideKey: string,
    overridePrice: number
): number {
    let value = 0;

    // accumulate collateral values
    for (const [key, amount] of Object.entries(collateralAmounts)) {
        if (key === overrideKey) {
            value += overridePrice * amount;
        } else {
            value += futurePrices[key as keyof Prices] * amount;
        }
        // console.log(key, prices[key], amount, prices[key] * amount);
    }

    // remove borrowed values
    for (const [key, amount] of Object.entries(borrowAmounts)) {
        if (key === overrideKey) {
            value -= overridePrice * amount;
        } else {
            value -= futurePrices[key as keyof Prices] * amount;
        }
    }

    // calculate position PNL
    for (const [key, amount] of Object.entries(marketAmounts)) {
        if (key === overrideKey) {
            value += (overridePrice - prices[key as keyof Prices]) * amount;
        } else {
            value += (futurePrices[key as keyof Prices] - prices[key as keyof Prices]) * amount;
        }
    }

    return Math.max(0, value);
}

export default theoreticalTotalAccountValue;
