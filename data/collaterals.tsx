interface Collateral {
    /** The symbol of the collateral */
    symbol: string;

    /** Weight of the collateral for calculating the available margin */ //TODO
    weight: number;

    /** The maximum amount of the symbol that may be deposited into 01 exchange */
    maxDeposit: number;
}

const usdcCollateral: Collateral = {
    symbol: "USDC",
    weight: 1,
    maxDeposit: 100_000,
};

const usdtCollateral: Collateral = {
    symbol: "USDT",
    weight: 0.95,
    maxDeposit: 100_000,
};

const solCollateral: Collateral = {
    symbol: "SOL",
    weight: 0.9,
    maxDeposit: 1_000,
};

const btcCollateral: Collateral = {
    symbol: "BTC",
    weight: 0.9,
    maxDeposit: 3,
};

const ethCollateral: Collateral = {
    symbol: "ETH",
    weight: 0.9,
    maxDeposit: 30,
};

const ustCollateral: Collateral = {
    symbol: "UST",
    weight: 0.85,
    maxDeposit: 100_000,
};

const msolCollateral: Collateral = {
    symbol: "mSOL",
    weight: 0.8,
    maxDeposit: 1_000,
};

const collaterals = {
    USDC: usdcCollateral,
    USDT: usdtCollateral,
    UST: ustCollateral,
    SOL: solCollateral,
    BTC: btcCollateral,
    ETH: ethCollateral,
    mSOL: msolCollateral,
};

export type { Collateral };
export { collaterals };
