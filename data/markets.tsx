interface Market {
    /** The name of the market */
    name: string;

    /** The base Initial Margin Fraction */
    baseIMF: number;

    /** The base Maintenance Margin Fraction */
    baseMMF: number;

    /** The symbol that represents the market token */
    symbol: string;
}

/// Technically all of the non-squared markets currently have the same IMF and MMF, however, in case this changes in the future
/// the values have been added individually to allow for easy modifications.

const solMarket: Market = {
    name: "Solana",
    baseIMF: 0.1,
    baseMMF: 0.05,
    symbol: "SOL",
};

const btcMarket: Market = {
    name: "Bitcoin",
    baseIMF: 0.1,
    baseMMF: 0.05,
    symbol: "BTC",
};

const lunaMarket: Market = {
    name: "Luna",
    baseIMF: 0.1,
    baseMMF: 0.05,
    symbol: "LUNA",
};

const ethMarket: Market = {
    name: "Ethereum",
    baseIMF: 0.1,
    baseMMF: 0.05,
    symbol: "ETH",
};

const avaxMarket: Market = {
    name: "Avalanche",
    baseIMF: 0.1,
    baseMMF: 0.05,
    symbol: "AVAX",
};

const apeMarket: Market = {
    name: "ApeCoin",
    baseIMF: 0.1,
    baseMMF: 0.05,
    symbol: "APE",
};

const nearMarket: Market = {
    name: "Near",
    baseIMF: 0.1,
    baseMMF: 0.05,
    symbol: "NEAR",
};

const solSquaredMarket: Market = {
    name: "Solana^2",
    baseIMF: 1,
    baseMMF: 0.5,
    symbol: "SOL^2",
};

const markets = {
    SOL: solMarket,
    BTC: btcMarket,
    LUNA: lunaMarket,
    ETH: ethMarket,
    AVAX: avaxMarket,
    APE: apeMarket,
    NEAR: nearMarket,
    // solSquaredMarket, TODO: FIX
};

export type { Market };
export { markets };
