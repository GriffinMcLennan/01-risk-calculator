import { BorrowAmounts, MarketAmounts, Prices } from "../components/RiskCalculator";
import { Collaterals, collaterals } from "../data/collaterals";
import { Markets, markets } from "../data/markets";

function maintenanceMarginFactor(
    borrowAmounts: BorrowAmounts,
    marketAmounts: MarketAmounts,
    prices: Prices,
    totalNotionalValue: number
): number {
    let numerator = 0;

    // calculate borrows

    for (const [key, amount] of Object.entries(borrowAmounts)) {
        const weight = collaterals[key as keyof Collaterals].weight;
        const MMF_base = 1.03 / weight - 1;
        numerator += prices[key as keyof Prices] * amount * MMF_base;
    }

    // calculate positions

    for (const [key, amount] of Object.entries(marketAmounts)) {
        const MMF_base = markets[key as keyof Markets].baseMMF;
        numerator += prices[key as keyof Prices] * Math.abs(amount) * MMF_base;
    }

    return numerator / totalNotionalValue;
}

export default maintenanceMarginFactor;
