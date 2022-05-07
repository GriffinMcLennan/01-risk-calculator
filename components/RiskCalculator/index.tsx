import { Flex, NumberInputFieldProps, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Accordion from "../Accordion";
import { Collateral, collaterals } from "../../data/collaterals";
import fetchPrices from "../../utils/api/fetchPrices";
import CollateralRow from "../CollateralRow";

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
            <Text>Risk Calculator</Text>

            <Accordion title="Collateral and Borrows">
                <Flex>
                    <Text width="100px" mr="15px">
                        Asset
                    </Text>
                    <Text width="100px" mr="15px">
                        Price
                    </Text>
                    <Text width="100px" mr="15px">
                        Future Price
                    </Text>

                    <Text width="150px" mr="15px">
                        Deposited
                    </Text>
                    <Text width="150px">Borrowed</Text>
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
        </Flex>
    );
};

export default RiskCalculator;
