import { Text, Flex, Input } from "@chakra-ui/react";
import { Collateral } from "../../data/collaterals";
import NumberFormat from "react-number-format";
import { useState } from "react";

interface Props {
    collateral: Collateral;
    amount: number;
    price: number;
    futurePrice: number;
    onChangeCollateral: (key: string, newValue: number) => void;
    onChangeBorrow: (key: string, newValue: number) => void;
    onPriceChange: (key: string, newValue: number) => void;
    onFuturePriceChange: (key: string, newValue: number) => void;
}

const CollateralRow = ({
    collateral,
    amount,
    price,
    futurePrice,
    onChangeCollateral,
    onChangeBorrow,
    onPriceChange,
    onFuturePriceChange,
}: Props) => {
    const [collateralVal, setCollateralVal] = useState("");
    const [borrowVal, setBorrowVal] = useState("");
    const disabled = collateral.symbol === "USDC" || collateral.symbol === "USDT" || collateral.symbol === "UST";

    return (
        <Flex alignItems="center" my="10px">
            <Text width="100px" mr="15px">
                {collateral.symbol}
            </Text>

            <NumberFormat
                customInput={Input}
                mr="15px"
                width="100px"
                value={price}
                placeholder="0.0"
                disabled={disabled}
                onValueChange={(values) => {
                    const { floatValue, formattedValue } = values;
                    onPriceChange(collateral.symbol, floatValue ?? 0);
                }}
            />

            <NumberFormat
                customInput={Input}
                mr="15px"
                width="100px"
                value={futurePrice}
                placeholder="0.0"
                color={disabled ? "" : futurePrice >= price ? "green.400" : "red.600"}
                disabled={collateral.symbol === "USDC" || collateral.symbol === "USDT" || collateral.symbol === "UST"}
                onValueChange={(values) => {
                    const { floatValue, formattedValue } = values;
                    onFuturePriceChange(collateral.symbol, floatValue ?? 0);
                }}
            />

            <NumberFormat
                customInput={Input}
                mr="15px"
                width="150px"
                // variant="unstyled"
                value={collateralVal}
                placeholder="0.0"
                thousandSeparator
                onValueChange={(values) => {
                    const { floatValue, formattedValue } = values;
                    onChangeCollateral(collateral.symbol, floatValue ?? 0);
                    setCollateralVal(formattedValue);
                }}
            />

            <NumberFormat
                customInput={Input}
                width="150px"
                // variant="unstyled"
                value={borrowVal}
                placeholder="0.0"
                thousandSeparator
                onValueChange={(values) => {
                    const { floatValue, formattedValue } = values;
                    onChangeBorrow(collateral.symbol, floatValue ?? 0);
                    setBorrowVal(formattedValue);
                }}
            />
        </Flex>
    );
};

export default CollateralRow;