import { Flex, Tooltip, Text, ColorModeScript, useTheme, Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Accordion from "../Accordion";
import { Collateral, collaterals } from "../../data/collaterals";
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
import Image from "next/image";

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

const RiskCalculator = () => {
    const { textColors } = useTheme();

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

    const [borrowAmounts, setBorrowAmounts] = useState({
        USDC: 0,
        USDT: 0,
        // UST: 0,
        SOL: 0,
        BTC: 0,
        ETH: 0,
        mSOL: 0,
    });

    const [marketAmounts, setMarketAmounts] = useState({
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
        let totalDirectional =
            (key in marketAmounts && marketAmounts[key]) - (key in borrowAmounts && borrowAmounts[key]);

        // changes in this token don't have any delta => impossible to liquidate
        if (totalDirectional === 0 || accountRisk >= 100) return -1;

        // console.log("totalDirectional:", totalDirectional);

        let low = 0.0;
        let high = 200_000.0;

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

    console.log(accountRisk, accountRisk === NaN);

    return (
        <Flex flexDirection="column" alignItems="center">
            <Text variant="primary" fontSize="32px" mt="20px" fontWeight="600">
                01 Exchange Risk Calculator
            </Text>

            <Box
                display="grid"
                placeItems="center"
                backgroundColor="secondary"
                borderRadius="50%"
                width="250px"
                height="250px"
                marginTop="50px"
                border="5px solid"
                borderColor="red.500"
            >
                <Flex flexDirection="column">
                    <Flex>
                        <Text fontWeight="600" variant="primary" width="150px">
                            Account Risk:{" "}
                        </Text>
                        <Text fontWeight="600" variant="primary">
                            {Number.isNaN(accountRisk) ? "0" : accountRisk.toFixed(2)}
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
                </Flex>
            </Box>
            <Accordion title="Collateral and Borrows">
                <Flex>
                    <Text variant="secondary" width="120px" mr="15px">
                        Asset
                    </Text>
                    <Text variant="secondary" width="100px" mr="15px">
                        Entry Price
                    </Text>
                    <Text variant="secondary" width="100px" mr="15px">
                        Future Price
                    </Text>
                    <Text variant="secondary" width="100px" mr="15px">
                        Liq. Price
                    </Text>

                    <Text variant="secondary" width="150px" mr="15px">
                        Deposited
                    </Text>
                    <Text variant="secondary" width="150px" mr="15px">
                        Borrowed
                    </Text>
                    <Text variant="secondary" width="150px">
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
            </Accordion>

            <Accordion title="Perpetuals">
                <Flex>
                    <Text variant="secondary" width="135px" mr="15px">
                        Market
                    </Text>
                    <Text variant="secondary" width="150px" mr="11px">
                        Entry Price
                    </Text>
                    <Text variant="secondary" width="150px" mr="11px">
                        Future Price
                    </Text>
                    <Text variant="secondary" width="150px" mr="11px">
                        Liq. Price
                    </Text>

                    <Flex alignItems="center" width="150px" mr="11px">
                        <Text variant="secondary" mr="15px">
                            Position Size
                        </Text>
                        <Tooltip hasArrow label="For short positions set position size to negative.">
                            <span>
                                <AiOutlineInfoCircle color={textColors.secondary} />
                            </span>
                        </Tooltip>
                    </Flex>

                    <Text variant="secondary" width="100px" mr="15px">
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
            </Accordion>
        </Flex>
    );
};

export default RiskCalculator;
