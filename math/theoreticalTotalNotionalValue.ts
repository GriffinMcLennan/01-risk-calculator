import { BorrowAmounts, MarketAmounts, Prices } from "../components/RiskCalculator";

function theoreticalTotalNotionalValue(
    borrowAmounts: BorrowAmounts,
    marketAmounts: MarketAmounts,
    futurePrices: Prices,
    overrideKey: string,
    overridePrice: number
): number {
    let value = 0;

    // calculate borrow size
    for (const [key, amount] of Object.entries(borrowAmounts)) {
        if (key === overrideKey) {
            value += overridePrice * amount;
        } else {
            value += futurePrices[key as keyof Prices] * amount;
        }
    }

    for (const [key, amount] of Object.entries(marketAmounts)) {
        if (key === overrideKey) {
            value += overridePrice * Math.abs(amount);
        } else {
            value += futurePrices[key as keyof Prices] * Math.abs(amount);
        }
    }

    return value;
}

export default theoreticalTotalNotionalValue;
