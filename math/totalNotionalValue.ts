import { BorrowAmounts, MarketAmounts, Prices } from "../components/RiskCalculator";

function totalNotionalValue(borrowAmounts: BorrowAmounts, marketAmounts: MarketAmounts, futurePrices: Prices): number {
    let value = 0;

    // calculate borrow size
    for (const [key, amount] of Object.entries(borrowAmounts)) {
        value += futurePrices[key as keyof Prices] * amount;
    }

    for (const [key, amount] of Object.entries(marketAmounts)) {
        value += futurePrices[key as keyof Prices] * Math.abs(amount);
    }

    return value;
}

export default totalNotionalValue;
