interface Market {
    /** The name of the market */
    name: string;

    /** The base Initial Margin Fraction */
    baseIMF: number;

    /** The base Maintenance Margin Fraction */
    baseMMF: number;
}

/// Technically all of the non-squared markets currently have the same IMF and MMF, however, in case this changes in the future
/// the values have been added individually to allow for easy modifications.

const solMarket: Market = {
    name: "Solana",
    baseIMF: 0.1,
    baseMMF: 0.05,
};

const btcMarket: Market = {
    name: "Bitcoin",
    baseIMF: 0.1,
    baseMMF: 0.05,
};

const lunaMarket: Market = {
    name: "Luna",
    baseIMF: 0.1,
    baseMMF: 0.05,
};

const ethMarket: Market = {
    name: "Ethereum",
    baseIMF: 0.1,
    baseMMF: 0.05,
};

const avaxMarket: Market = {
    name: "Avalanche",
    baseIMF: 0.1,
    baseMMF: 0.05,
};

const apeMarket: Market = {
    name: "ApeCoin",
    baseIMF: 0.1,
    baseMMF: 0.05,
};

const nearMarket: Market = {
    name: "Near",
    baseIMF: 0.1,
    baseMMF: 0.05,
};

const solSquaredMarket: Market = {
    name: "Solana^2",
    baseIMF: 1,
    baseMMF: 0.5,
};

const markets: Market[] = [
    solMarket,
    btcMarket,
    lunaMarket,
    ethMarket,
    avaxMarket,
    apeMarket,
    nearMarket,
    solSquaredMarket,
];

export type { Market };
export { markets };
