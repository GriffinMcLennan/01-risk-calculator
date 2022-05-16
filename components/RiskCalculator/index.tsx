import { Flex, Tooltip, Text, useTheme, Box, Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Accordion from "../Accordion";
import { Collaterals, collaterals } from "../../data/collaterals";
import { markets } from "../../data/markets";
import fetchPrices from "../../utils/api/fetchPrices";
import CollateralRow from "../CollateralRow";
import MarketRow from "../MarketRow";
import totalAccountValue from "../../math/totalAccountValue";
import totalNotionalValue from "../../math/totalNotionalValue";
import maintenanceMarginFactor from "../../math/maintenanceMarginFactor";
import theoreticalTotalAccountValue from "../../math/theoreticalTotalAccountValue";
import theoreticalTotalNotionalValue from "../../math/theoreticalTotalNotionalValue";
import theoreticalMaintenanceMarginFactor from "../../math/theoreticalMaintenanceMarginFactor";
import { AiOutlineInfoCircle } from "react-icons/ai";
import chroma from "chroma-js";

interface CollateralAmounts {
    USDC: number;
    USDT: number;
    // UST: number;
    SOL: number;
    BTC: number;
    ETH: number;
    mSOL: number;
}

interface Prices {
    SOL: number;
    BTC: number;
    // LUNA: number;
    APE: number;
    mSOL: number;
    NEAR: number;
    ETH: number;
    AVAX: number;
    USDC: number;
    USDT: number;
    // UST: number;
}

interface Markets {
    SOL: number;
    BTC: number;
    ETH: number;
    // LUNA: number;
    AVAX: number;
    APE: number;
    NEAR: number;
}

interface BorrowAmounts {
    USDC: number;
    USDT: number;
    SOL: number;
    BTC: number;
    ETH: number;
    mSOL: number;
}

interface MarketAmounts {
    SOL: number;
    BTC: number;
    ETH: number;
    AVAX: number;
    APE: number;
    NEAR: number;
}

const RiskCalculator = () => {
    const { textColors, colors } = useTheme();
    // console.log("Here:", colors["red"]["50"]);
    const [prices, setPrices] = useState<Prices>({
        SOL: 0,
        BTC: 0,
        // LUNA: 0,
        APE: 0,
        mSOL: 0,
        NEAR: 0,
        ETH: 0,
        AVAX: 0,
        USDC: 1,
        USDT: 1,
        // UST: 1,
    });

    const [futurePrices, setFuturePrices] = useState<Prices>({
        SOL: 0,
        BTC: 0,
        // LUNA: 0,
        APE: 0,
        mSOL: 0,
        NEAR: 0,
        ETH: 0,
        AVAX: 0,
        USDC: 1,
        USDT: 1,
        // UST: 1,
    });

    const [collateralAmounts, setCollateralAmounts] = useState<CollateralAmounts>({
        USDC: 0,
        USDT: 0,
        // UST: 0,
        SOL: 0,
        BTC: 0,
        ETH: 0,
        mSOL: 0,
    });

    const [borrowAmounts, setBorrowAmounts] = useState<BorrowAmounts>({
        USDC: 0,
        USDT: 0,
        // UST: 0,
        SOL: 0,
        BTC: 0,
        ETH: 0,
        mSOL: 0,
    });

    const [marketAmounts, setMarketAmounts] = useState<MarketAmounts>({
        SOL: 0,
        BTC: 0,
        ETH: 0,
        // LUNA: 0,
        AVAX: 0,
        APE: 0,
        NEAR: 0,
    });

    // console.log("Collateral amounts:", collateralAmounts);
    // console.log("Borrow amounts:", borrowAmounts);
    // console.log("Market amounts:", marketAmounts);

    const TAV = totalAccountValue(collateralAmounts, borrowAmounts, marketAmounts, prices, futurePrices);
    const TNV = totalNotionalValue(borrowAmounts, marketAmounts, futurePrices);
    const MF = TNV === 0 ? NaN : TAV / TNV;

    // console.log(TAV, TNV, MF);

    const MMF = maintenanceMarginFactor(borrowAmounts, marketAmounts, futurePrices, TNV);

    const accountRisk = Math.abs((Math.log(Math.min(1, MF)) / Math.log(MMF)) * 100);
    // console.log("MF, MMF, Account Risk:", MF, MMF, accountRisk);

    const calculateLiquidation = (key: string) => {
        let totalDirectional = 0;

        if (key in marketAmounts) {
            totalDirectional += marketAmounts[key as keyof Markets];
        }

        if (key in borrowAmounts) {
            totalDirectional -= borrowAmounts[key as keyof Collaterals];
        }

        // changes in this token don't have any delta => impossible to liquidate
        if (totalDirectional === 0 || accountRisk >= 100) return -1;

        // console.log("totalDirectional:", totalDirectional);

        let low = 0.0;
        let high = 1_000_000.0;

        while (Math.abs(high - low) > 0.001) {
            let theoreticalPrice = (low + high) / 2;

            const theoreticalTAV = theoreticalTotalAccountValue(
                collateralAmounts,
                borrowAmounts,
                marketAmounts,
                prices,
                futurePrices,
                key,
                theoreticalPrice
            );
            const theoreticalTNV = theoreticalTotalNotionalValue(
                borrowAmounts,
                marketAmounts,
                futurePrices,
                key,
                theoreticalPrice
            );

            // console.log("Price: ", theoreticalPrice, "TAV: ", theoreticalTAV, "TNV ", theoreticalTNV);

            const theoreticalMF = Math.min(1, Math.abs(theoreticalTAV / theoreticalTNV));
            const theoreticalMMF = theoreticalMaintenanceMarginFactor(
                borrowAmounts,
                marketAmounts,
                futurePrices,
                theoreticalTNV,
                key,
                theoreticalPrice
            );

            // console.log(
            //     "Price: ",
            //     theoreticalPrice,
            //     "theoreticalMF: ",
            //     Math.abs(theoreticalMF),
            //     "TheoreticalMMF: ",
            //     theoreticalMMF,
            //     "Ratio: ",
            //     theoreticalMF / theoreticalMMF
            // );

            if (Math.abs(theoreticalMF) < Math.abs(theoreticalMMF)) {
                if (totalDirectional > 0) {
                    low = theoreticalPrice;
                } else {
                    high = theoreticalPrice;
                }
            } else {
                if (totalDirectional > 0) {
                    high = theoreticalPrice;
                } else {
                    low = theoreticalPrice;
                }
            }
        }

        const delta = totalDirectional > 0 ? -0.01 : 0.01;

        const theoreticalTAV = theoreticalTotalAccountValue(
            collateralAmounts,
            borrowAmounts,
            marketAmounts,
            prices,
            futurePrices,
            key,
            low + delta
        );

        const theoreticalTNV = theoreticalTotalNotionalValue(
            borrowAmounts,
            marketAmounts,
            futurePrices,
            key,
            low + delta
        );

        const theoreticalMF = Math.min(1, Math.abs(theoreticalTAV / theoreticalTNV));
        const theoreticalMMF = theoreticalMaintenanceMarginFactor(
            borrowAmounts,
            marketAmounts,
            futurePrices,
            theoreticalTNV,
            key,
            low + delta
        );

        if (theoreticalMF > theoreticalMMF) {
            return totalDirectional > 0 ? 0 : -2;
        }

        return low;
    };

    // TODO: Add maximum price for liquidations... similar to -1 special value for no shortside liquidation

    // console.log("SOL Liquidation:", calculateLiquidation("SOL"));
    // console.log("BTC Liquidation:", calculateLiquidation("BTC"));
    // console.log("ETH Liquidation:", calculateLiquidation("ETH"));
    // console.log("mSOL Liquidation:", calculateLiquidation("mSOL"));
    // console.log("LUNA Liquidation:", calculateLiquidation("LUNA"));
    // console.log("AVAX Liquidation:", calculateLiquidation("AVAX"));
    // console.log("APE Liquidation:", calculateLiquidation("APE"));
    // console.log("NEAR Liquidation:", calculateLiquidation("NEAR"));

    const updateCollateralAmount = (key: string, newValue: number) => {
        const oldAmounts = { ...collateralAmounts };

        setCollateralAmounts({
            ...oldAmounts,
            [key]: newValue,
        });
    };

    const updateBorrowAmount = (key: string, newValue: number) => {
        const oldAmounts = { ...borrowAmounts };

        setBorrowAmounts({
            ...oldAmounts,
            [key]: newValue,
        });
    };

    const updatePriceAmount = (key: string, newValue: number) => {
        const oldAmounts = { ...prices };

        setPrices({
            ...oldAmounts,
            [key]: newValue,
        });
    };

    const updateFuturePriceAmount = (key: string, newValue: number) => {
        const oldAmounts = { ...futurePrices };

        setFuturePrices({
            ...oldAmounts,
            [key]: newValue,
        });
    };

    const updateMarketAmount = (key: string, newValue: number) => {
        const oldAmounts = { ...marketAmounts };

        setMarketAmounts({
            ...oldAmounts,
            [key]: newValue,
        });
    };

    useEffect(() => {
        const initializePrices = async () => {
            const priceObj = await fetchPrices();

            setPrices({
                SOL: priceObj["solana"].usd,
                BTC: priceObj["bitcoin"].usd,
                // LUNA: priceObj["terra-luna"].usd,
                APE: priceObj["apecoin"].usd,
                mSOL: priceObj["msol"].usd,
                NEAR: priceObj["near"].usd,
                ETH: priceObj["ethereum"].usd,
                AVAX: priceObj["avalanche-2"].usd,
                USDC: 1,
                USDT: 1,
                // UST: 1,
            });

            setFuturePrices({
                SOL: priceObj["solana"].usd,
                BTC: priceObj["bitcoin"].usd,
                // LUNA: priceObj["terra-luna"].usd,
                APE: priceObj["apecoin"].usd,
                mSOL: priceObj["msol"].usd,
                NEAR: priceObj["near"].usd,
                ETH: priceObj["ethereum"].usd,
                AVAX: priceObj["avalanche-2"].usd,
                USDC: 1,
                USDT: 1,
                // UST: 1,
            });
        };

        initializePrices();
    }, []);

    const colorScale = chroma.scale([colors["green"]["600"], colors["yellow"]["500"], colors["red"]["500"]]);
    const colorVal = Number.isNaN(accountRisk) ? 0 : accountRisk / 100;

    return (
        <Flex flexDirection="column" alignItems="center">
            <Text variant="primary" fontSize={{ base: "24px", md: "38px" }} mt="30px" fontWeight="600">
                01 Exchange Risk Calculator
            </Text>

            <Flex
                display="grid"
                alignItems="center"
                backgroundColor="secondary"
                borderRadius="20px"
                width="min(90vw, 400px)"
                height="130px"
                marginTop="30px"
                marginBottom="20px"
                border="5px solid"
                borderColor={colorScale(colorVal).hex()}
                overflowX="auto"
                padding="10px"
            >
                <Flex flexDirection="column">
                    <Flex justifyContent="flex-start">
                        <Text fontWeight="600" variant="primary" width="150px">
                            Account Risk:{" "}
                        </Text>
                        <Text fontWeight="600" variant="primary" color={colorScale(colorVal).hex()}>
                            {Number.isNaN(accountRisk)
                                ? "0"
                                : accountRisk >= 100
                                ? "Liquidated"
                                : accountRisk.toFixed(2)}
                        </Text>
                    </Flex>
                    <Flex>
                        <Text fontWeight="600" variant="primary" width="150px">
                            Margin Fraction:{" "}
                        </Text>
                        <Text fontWeight="600" variant="primary">
                            {Number.isNaN(MF) ? "N/A" : MF.toFixed(2)}
                        </Text>
                    </Flex>

                    <Flex>
                        <Text fontWeight="600" variant="primary" width="150px">
                            Account Value:
                        </Text>
                        <Text fontWeight="600" variant="primary">
                            {TAV.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                            })}
                        </Text>
                    </Flex>
                </Flex>
            </Flex>
            <Accordion title="Collateral and Borrows">
                <Flex display="flex" flexDirection="column" overflowX="auto" pb="10px">
                    <Flex>
                        <Text variant="secondary" minWidth="120px" width="120px" mr="15px">
                            Asset
                        </Text>
                        <Text variant="secondary" minWidth="100px" width="100px" mr="15px">
                            Entry Price
                        </Text>
                        <Text variant="secondary" minWidth="100px" width="100px" mr="15px">
                            Future Price
                        </Text>
                        <Text variant="secondary" minWidth="100px" width="100px" mr="15px">
                            Liq. Price
                        </Text>

                        <Text variant="secondary" minWidth="140px" width="140px" mr="15px">
                            Deposited
                        </Text>
                        <Text variant="secondary" minWidth="140px" width="140px" mr="15px">
                            Borrowed
                        </Text>
                        <Text variant="secondary" minWidth="140px" width="150px">
                            Value
                        </Text>
                    </Flex>
                    {Object.entries(collaterals).map(([key, collateral]) => (
                        <CollateralRow
                            key={collateral.symbol}
                            collateral={collateral}
                            value={(
                                collateralAmounts[collateral.symbol as keyof CollateralAmounts] *
                                    futurePrices[collateral.symbol as keyof CollateralAmounts] -
                                borrowAmounts[collateral.symbol as keyof CollateralAmounts] *
                                    futurePrices[collateral.symbol as keyof CollateralAmounts]
                            ).toFixed(2)}
                            price={prices[collateral.symbol as keyof Prices]}
                            futurePrice={futurePrices[collateral.symbol as keyof Prices]}
                            liqPrice={calculateLiquidation(collateral.symbol)}
                            onChangeCollateral={updateCollateralAmount}
                            onChangeBorrow={updateBorrowAmount}
                            onPriceChange={updatePriceAmount}
                            onFuturePriceChange={updateFuturePriceAmount}
                        />
                    ))}
                </Flex>
            </Accordion>

            <Accordion title="Perpetuals">
                <Flex display="flex" flexDirection="column" overflowX="auto" pb="10px">
                    <Flex>
                        <Text variant="secondary" minWidth="135px" width="135px" mr="5px">
                            Market
                        </Text>
                        <Text variant="secondary" minWidth="150px" width="150px" mr="11px">
                            Entry Price
                        </Text>
                        <Text variant="secondary" minWidth="150px" width="150px" mr="11px">
                            Future Price
                        </Text>
                        <Text variant="secondary" minWidth="150px" width="150px" mr="11px">
                            Liq. Price
                        </Text>

                        <Flex alignItems="center" minWidth="150px" width="150px" mr="11px">
                            <Text variant="secondary" mr="15px">
                                Position Size
                            </Text>
                            <Tooltip hasArrow label="For short positions set position size to negative.">
                                <span>
                                    <AiOutlineInfoCircle color={textColors.secondary} />
                                </span>
                            </Tooltip>
                        </Flex>

                        <Text variant="secondary" minWidth="100px" width="100px" mr="15px">
                            Value
                        </Text>
                    </Flex>
                    {Object.entries(markets).map(([key, market]) => (
                        <MarketRow
                            key={market.symbol}
                            market={market}
                            value={(
                                marketAmounts[market.symbol as keyof Markets] *
                                (futurePrices[market.symbol as keyof Markets] - prices[market.symbol as keyof Markets])
                            ).toFixed(2)}
                            price={prices[market.symbol as keyof Prices]}
                            futurePrice={futurePrices[market.symbol as keyof Prices]}
                            liqPrice={calculateLiquidation(market.symbol)}
                            onPriceChange={updatePriceAmount}
                            onFuturePriceChange={updateFuturePriceAmount}
                            onAmountChange={updateMarketAmount}
                        />
                    ))}
                </Flex>
            </Accordion>
        </Flex>
    );
};

export type { CollateralAmounts, Prices, Markets, BorrowAmounts, MarketAmounts };
export default RiskCalculator;
