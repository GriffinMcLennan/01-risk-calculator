function totalNotionalValue(borrowAmounts: any, marketAmounts: any, futurePrices: any): number {
    let value = 0;

    // calculate borrow size
    for (const [key, amount] of Object.entries(borrowAmounts)) {
        value += futurePrices[key] * amount;
    }

    for (const [key, amount] of Object.entries(marketAmounts)) {
        value += futurePrices[key] * Math.abs(amount);
    }

    return value;
}

export default totalNotionalValue;
