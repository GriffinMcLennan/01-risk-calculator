import { Text, Flex, Input } from "@chakra-ui/react";
import { Collateral } from "../../data/collaterals";
import NumberFormat from "react-number-format";
import { useState } from "react";
import { useTheme } from "@chakra-ui/react";

interface Props {
    collateral: Collateral;
    value: string;
    price: number;
    futurePrice: number;
    liqPrice: number;
    onChangeCollateral: (key: string, newValue: number) => void;
    onChangeBorrow: (key: string, newValue: number) => void;
    onPriceChange: (key: string, newValue: number) => void;
    onFuturePriceChange: (key: string, newValue: number) => void;
}

const CollateralRow = ({
    collateral,
    value,
    price,
    futurePrice,
    liqPrice,
    onChangeCollateral,
    onChangeBorrow,
    onPriceChange,
    onFuturePriceChange,
}: Props) => {
    const [collateralVal, setCollateralVal] = useState("");
    const [borrowVal, setBorrowVal] = useState("");
    const disabled = collateral.symbol === "USDC" || collateral.symbol === "USDT" || collateral.symbol === "UST";
    const { textColors } = useTheme();
    const isNegative = Number(value) < 0;
    const transformedValue = isNegative ? -Number(value) : value;

    return (
        <Flex alignItems="center" my="10px">
            <Text variant="secondary" width="100px" mr="15px">
                {collateral.symbol}
            </Text>

            <NumberFormat
                customInput={Input}
                mr="15px"
                width="100px"
                color={textColors.secondary}
                value={price}
                placeholder="0.0"
                disabled={disabled}
                allowNegative={false}
                onValueChange={(values) => {
                    const { floatValue } = values;
                    onPriceChange(collateral.symbol, floatValue ?? 0);
                }}
            />

            <NumberFormat
                customInput={Input}
                mr="15px"
                width="100px"
                value={futurePrice}
                placeholder="0.0"
                color={disabled ? textColors.secondary : futurePrice >= price ? "green.400" : "red.600"}
                disabled={collateral.symbol === "USDC" || collateral.symbol === "USDT" || collateral.symbol === "UST"}
                allowNegative={false}
                onValueChange={(values) => {
                    const { floatValue } = values;
                    onFuturePriceChange(collateral.symbol, floatValue ?? 0);
                }}
            />

            <NumberFormat
                customInput={Input}
                width="100px"
                mr="15px"
                color={textColors.secondary}
                disabled
                value={liqPrice === -1 ? "" : liqPrice.toFixed(2)}
                placeholder="-"
                thousandSeparator
            />

            <NumberFormat
                customInput={Input}
                mr="15px"
                width="150px"
                color={textColors.secondary}
                value={collateralVal}
                placeholder="0.0"
                thousandSeparator
                allowNegative={false}
                onValueChange={(values) => {
                    const { floatValue, formattedValue } = values;
                    onChangeCollateral(collateral.symbol, floatValue ?? 0);
                    setCollateralVal(formattedValue);
                }}
            />

            <NumberFormat
                customInput={Input}
                width="150px"
                mr="15px"
                color={textColors.secondary}
                value={borrowVal}
                placeholder="0.0"
                thousandSeparator
                allowNegative={false}
                onValueChange={(values) => {
                    const { floatValue, formattedValue } = values;
                    onChangeBorrow(collateral.symbol, floatValue ?? 0);
                    setBorrowVal(formattedValue);
                }}
            />

            <NumberFormat
                prefix={isNegative ? "-$" : "$"}
                customInput={Input}
                width="150px"
                color={textColors.secondary}
                disabled
                value={transformedValue}
                placeholder="0.0"
                thousandSeparator
            />
        </Flex>
    );
};

export default CollateralRow;
