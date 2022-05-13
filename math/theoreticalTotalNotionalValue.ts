function theoreticalTotalNotionalValue(
    borrowAmounts: any,
    marketAmounts: any,
    futurePrices: any,
    overrideKey: string,
    overridePrice: number
): number {
    let value = 0;

    // calculate borrow size
    for (const [key, amount] of Object.entries(borrowAmounts)) {
        if (key === overrideKey) {
            value += overridePrice * amount;
        } else {
            value += futurePrices[key] * amount;
        }
    }

    for (const [key, amount] of Object.entries(marketAmounts)) {
        if (key === overrideKey) {
            value += overridePrice * Math.abs(amount);
        } else {
            value += futurePrices[key] * Math.abs(amount);
        }
    }

    return value;
}

export default theoreticalTotalNotionalValue;
