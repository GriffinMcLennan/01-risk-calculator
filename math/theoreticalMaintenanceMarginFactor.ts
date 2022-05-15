import { BorrowAmounts, MarketAmounts, Prices } from "../components/RiskCalculator";
import { Collaterals, collaterals } from "../data/collaterals";
import { markets } from "../data/markets";

function theoreticalMaintenanceMarginFactor(
    borrowAmounts: BorrowAmounts,
    marketAmounts: MarketAmounts,
    prices: Prices,
    totalNotionalValue: number,
    overrideKey: string,
    overridePrice: number
): number {
    let numerator = 0;

    // calculate borrows

    for (const [key, amount] of Object.entries(borrowAmounts)) {
        const weight = collaterals[key as keyof Collaterals].weight;
        const MMF_base = 1.03 / weight - 1;

        if (key === overrideKey) {
            numerator += overridePrice * amount * MMF_base;
        } else {
            numerator += prices[key as keyof Prices] * amount * MMF_base;
        }
    }

    // calculate positions

    for (const [key, amount] of Object.entries(marketAmounts)) {
        const MMF_base = markets[key as keyof MarketAmounts].baseMMF;

        if (key === overrideKey) {
            numerator += overridePrice * Math.abs(amount) * MMF_base;
        } else {
            numerator += prices[key as keyof Prices] * Math.abs(amount) * MMF_base;
        }
    }

    // console.log("Numerator:", numerator, "totalNotionalValue:", totalNotionalValue);

    return numerator / totalNotionalValue;
}

export default theoreticalMaintenanceMarginFactor;
