import { BorrowAmounts, CollateralAmounts, MarketAmounts, Prices } from "../components/RiskCalculator";

function totalAccountValue(
    collateralAmounts: CollateralAmounts,
    borrowAmounts: BorrowAmounts,
    marketAmounts: MarketAmounts,
    prices: Prices,
    futurePrices: Prices
): number {
    let value = 0;

    // accumulate collateral values
    for (const [key, amount] of Object.entries(collateralAmounts)) {
        value += futurePrices[key as keyof Prices] * amount;
        // console.log(key, prices[key], amount, prices[key] * amount);
    }

    const collateralValue = value;
    // console.log("CollateralValue:", collateralValue);

    // remove borrowed values
    for (const [key, amount] of Object.entries(borrowAmounts)) {
        value -= futurePrices[key as keyof Prices] * amount;
    }

    const borrowValue = value - collateralValue;
    // console.log("borrowValue:", borrowValue);

    // calculate position PNL
    for (const [key, amount] of Object.entries(marketAmounts)) {
        value += (futurePrices[key as keyof Prices] - prices[key as keyof Prices]) * amount;
        // console.log(key, futurePrices[key], amount, (futurePrices[key] - prices[key]) * amount);
    }

    // Make sure not to return negative account value
    return Math.max(0, value);
}

export default totalAccountValue;
