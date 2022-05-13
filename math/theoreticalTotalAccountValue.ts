function theoreticalTotalAccountValue(
    collateralAmounts: any,
    borrowAmounts: any,
    marketAmounts: any,
    prices: any,
    futurePrices: any,
    overrideKey: string,
    overridePrice: number
): number {
    let value = 0;

    // accumulate collateral values
    for (const [key, amount] of Object.entries(collateralAmounts)) {
        if (key === overrideKey) {
            value += overridePrice * amount;
        } else {
            value += futurePrices[key] * amount;
        }
        // console.log(key, prices[key], amount, prices[key] * amount);
    }

    // remove borrowed values
    for (const [key, amount] of Object.entries(borrowAmounts)) {
        if (key === overrideKey) {
            value -= overridePrice * amount;
        } else {
            value -= futurePrices[key] * amount;
        }
    }

    // calculate position PNL
    for (const [key, amount] of Object.entries(marketAmounts)) {
        if (key === overrideKey) {
            value += (overridePrice - prices[key]) * amount;
        } else {
            value += (futurePrices[key] - prices[key]) * amount;
        }
    }

    return Math.max(0, value);
}

export default theoreticalTotalAccountValue;
