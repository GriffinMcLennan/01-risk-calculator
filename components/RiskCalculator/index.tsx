import { Flex, NumberInputFieldProps, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Accordion from "../Accordion";
import { Collateral, collaterals } from "../../data/collaterals";
import { markets } from "../../data/markets";
import fetchPrices from "../../utils/api/fetchPrices";
import CollateralRow from "../CollateralRow";
import MarketRow from "../MarketRow";

interface CollateralAmounts {
    USDC: number;
    USDT: number;
    UST: number;
    SOL: number;
    BTC: number;
    ETH: number;
    mSOL: number;
}

interface Prices {
    SOL: number;
    BTC: number;
    LUNA: number;
    APE: number;
    mSOL: number;
    NEAR: number;
    ETH: number;
    AVAX: number;
    USDC: number;
    USDT: number;
    UST: number;
}

interface Markets {
    SOL: number;
    BTC: number;
    ETH: number;
    LUNA: number;
    AVAX: number;
    APE: number;
    NEAR: number;
}

const RiskCalculator = () => {
    const [prices, setPrices] = useState<Prices>({
        SOL: 0,
        BTC: 0,
        LUNA: 0,
        APE: 0,
        mSOL: 0,
        NEAR: 0,
        ETH: 0,
        AVAX: 0,
        USDC: 1,
        USDT: 1,
        UST: 1,
    });

    const [futurePrices, setFuturePrices] = useState<Prices>({
        SOL: 0,
        BTC: 0,
        LUNA: 0,
        APE: 0,
        mSOL: 0,
        NEAR: 0,
        ETH: 0,
        AVAX: 0,
        USDC: 1,
        USDT: 1,
        UST: 1,
    });

    const [collateralAmounts, setCollateralAmounts] = useState<CollateralAmounts>({
        USDC: 0,
        USDT: 0,
        UST: 0,
        SOL: 0,
        BTC: 0,
        ETH: 0,
        mSOL: 10,
    });

    const [borrowAmounts, setBorrowAmounts] = useState({
        USDC: 0,
        USDT: 0,
        UST: 0,
        SOL: 0,
        BTC: 0,
        ETH: 0,
        mSOL: 10,
    });

    const [marketAmounts, setMarketAmounts] = useState({
        SOL: 0,
        BTC: 0,
        ETH: 0,
        LUNA: 0,
        AVAX: 0,
        APE: 0,
        NEAR: 0,
    });

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
            console.log("Running");

            setPrices({
                SOL: priceObj["solana"].usd,
                BTC: priceObj["bitcoin"].usd,
                LUNA: priceObj["terra-luna"].usd,
                APE: priceObj["apecoin"].usd,
                mSOL: priceObj["msol"].usd,
                NEAR: priceObj["near"].usd,
                ETH: priceObj["ethereum"].usd,
                AVAX: priceObj["avalanche-2"].usd,
                USDC: 1,
                USDT: 1,
                UST: 1,
            });

            setFuturePrices({
                SOL: priceObj["solana"].usd,
                BTC: priceObj["bitcoin"].usd,
                LUNA: priceObj["terra-luna"].usd,
                APE: priceObj["apecoin"].usd,
                mSOL: priceObj["msol"].usd,
                NEAR: priceObj["near"].usd,
                ETH: priceObj["ethereum"].usd,
                AVAX: priceObj["avalanche-2"].usd,
                USDC: 1,
                USDT: 1,
                UST: 1,
            });
        };

        initializePrices();
    }, []);

    return (
        <Flex flexDirection="column" alignItems="center">
            <Text variant="primary" fontSize="22px">
                01 Exchange Risk Calculator
            </Text>

            <Accordion title="Collateral and Borrows">
                <Flex>
                    <Text variant="primary" width="100px" mr="15px">
                        Asset
                    </Text>
                    <Text variant="primary" width="100px" mr="15px">
                        Entry Price
                    </Text>
                    <Text variant="primary" width="100px" mr="15px">
                        Future Price
                    </Text>

                    <Text variant="primary" width="150px" mr="15px">
                        Deposited
                    </Text>
                    <Text variant="primary" width="150px">
                        Borrowed
                    </Text>
                </Flex>
                {collaterals.map((collateral) => (
                    <CollateralRow
                        key={collateral.symbol}
                        collateral={collateral}
                        amount={collateralAmounts[collateral.symbol as keyof CollateralAmounts]}
                        price={prices[collateral.symbol as keyof Prices]}
                        futurePrice={futurePrices[collateral.symbol as keyof Prices]}
                        onChangeCollateral={updateCollateralAmount}
                        onChangeBorrow={updateBorrowAmount}
                        onPriceChange={updatePriceAmount}
                        onFuturePriceChange={updateFuturePriceAmount}
                    />
                ))}
            </Accordion>

            {/* TODO: Fill in perps */}
            <Accordion title="Perpetuals">
                <Flex>
                    <Text width="100px" mr="15px">
                        Market
                    </Text>
                    <Text width="100px" mr="15px">
                        Entry Price
                    </Text>
                    <Text width="100px" mr="15px">
                        Future Price
                    </Text>
                    <Text width="100px" mr="15px">
                        Position Size
                    </Text>
                </Flex>
                {markets.map((market) => (
                    <MarketRow
                        key={market.symbol}
                        market={market}
                        amount={marketAmounts[market.symbol as keyof Markets]}
                        price={prices[market.symbol as keyof Prices]}
                        futurePrice={futurePrices[market.symbol as keyof Prices]}
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
