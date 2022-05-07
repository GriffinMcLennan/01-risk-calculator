import { Flex, Text } from "@chakra-ui/react";
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

const RiskCalculator = () => {
    const [prices, setPrices] = useState({});
    const [collateralAmounts, setCollateralAmounts] = useState<CollateralAmounts>({
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

    useEffect(() => {
        const initializePrices = async () => {
            const priceObj = await fetchPrices();

            setPrices({
                SOL: priceObj["solana"].usd,
                BTC: priceObj["bitcoin"].usd,
                LUNA: priceObj["terra-luna"].usd,
                APE: priceObj["apecoin"].usd,
                mSOL: priceObj["msol"].usd,
                NEAR: priceObj["near"].usd,
                ETH: priceObj["ethereum"].usd,
                AVAX: priceObj["avalanche-2"].usd,
            });
        };
        initializePrices();
    }, []);

    console.log(collateralAmounts);

    return (
        <Flex flexDirection="column" alignItems="center">
            <Text>Risk Calculator</Text>

            <Accordion title="Collateral">
                {collaterals.map((collateral) => (
                    <CollateralRow
                        key={collateral.symbol}
                        collateral={collateral}
                        amount={collateralAmounts[collateral.symbol as keyof CollateralAmounts]}
                        onChange={updateCollateralAmount}
                    />
                ))}
            </Accordion>
        </Flex>
    );
};

export default RiskCalculator;
