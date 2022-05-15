interface Market {
    /** The name of the market */
    name: string;

    /** The base Initial Margin Fraction */
    baseIMF: number;

    /** The base Maintenance Margin Fraction */
    baseMMF: number;

    /** The symbol that represents the market token */
    symbol: string;

    /** The path to the image file */
    imgURL: string;
}

/// Technically all of the non-squared markets currently have the same IMF and MMF, however, in case this changes in the future
/// the values have been added individually to allow for easy modifications.

const solMarket: Market = {
    name: "Solana",
    baseIMF: 0.1,
    baseMMF: 0.05,
    symbol: "SOL",
    imgURL: "/solana.svg",
};

const btcMarket: Market = {
    name: "Bitcoin",
    baseIMF: 0.1,
    baseMMF: 0.05,
    symbol: "BTC",
    imgURL: "/bitcoin.svg",
};

// deleted for now
const lunaMarket: Market = {
    name: "Luna",
    baseIMF: 0.1,
    baseMMF: 0.05,
    symbol: "LUNA",
    imgURL: "",
};

const ethMarket: Market = {
    name: "Ethereum",
    baseIMF: 0.1,
    baseMMF: 0.05,
    symbol: "ETH",
    imgURL: "/ethereum.svg",
};

const avaxMarket: Market = {
    name: "Avalanche",
    baseIMF: 0.1,
    baseMMF: 0.05,
    symbol: "AVAX",
    imgURL: "/avalanche.svg",
};

const apeMarket: Market = {
    name: "ApeCoin",
    baseIMF: 0.1,
    baseMMF: 0.05,
    symbol: "APE",
    imgURL: "/ape.png",
};

const nearMarket: Market = {
    name: "Near",
    baseIMF: 0.1,
    baseMMF: 0.05,
    symbol: "NEAR",
    imgURL: "/near.png",
};

const solSquaredMarket: Market = {
    name: "Solana^2",
    baseIMF: 1,
    baseMMF: 0.5,
    symbol: "SOL^2",
    imgURL: "/solana.svg",
};

interface Markets {
    SOL: Market;
    BTC: Market;
    ETH: Market;
    AVAX: Market;
    APE: Market;
    NEAR: Market;
}

const markets = {
    SOL: solMarket,
    BTC: btcMarket,
    // LUNA: lunaMarket, Removed for now
    ETH: ethMarket,
    AVAX: avaxMarket,
    APE: apeMarket,
    NEAR: nearMarket,
    // solSquaredMarket, TODO: FIX
};

export type { Market, Markets };
export { markets };
