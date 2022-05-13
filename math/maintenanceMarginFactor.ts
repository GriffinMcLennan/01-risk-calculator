import { collaterals } from "../data/collaterals";
import { markets } from "../data/markets";

function maintenanceMarginFactor(borrowAmounts: any, marketAmounts: any, prices: any, totalNotionalValue: any): number {
    let numerator = 0;

    // calculate borrows

    for (const [key, amount] of Object.entries(borrowAmounts)) {
        const weight = collaterals[key].weight;
        const MMF_base = 1.03 / weight - 1;
        numerator += prices[key] * amount * MMF_base;
    }

    // calculate positions

    for (const [key, amount] of Object.entries(marketAmounts)) {
        const MMF_base = markets[key].baseMMF;
        numerator += prices[key] * Math.abs(amount) * MMF_base;
    }

    return numerator / totalNotionalValue;
}

export default maintenanceMarginFactor;
