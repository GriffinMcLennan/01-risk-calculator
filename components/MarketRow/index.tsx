import { Flex, Input, Text, useTheme } from "@chakra-ui/react";
import { useState } from "react";
import NumberFormat from "react-number-format";
import { Market } from "../../data/markets";

interface Props {
    market: Market;
    price: number;
    futurePrice: number;
    value: string;
    onPriceChange: (key: string, newValue: number) => void;
    onFuturePriceChange: (key: string, newValue: number) => void;
    onAmountChange: (key: string, newValue: number) => void;
}

const MarketRow = ({
    market,
    price,
    futurePrice,
    value,
    onPriceChange,
    onFuturePriceChange,
    onAmountChange,
}: Props) => {
    const [amountStr, setAmountStr] = useState("");
    const { textColors } = useTheme();

    const isNegative = Number(value) < 0;
    const transformedValue = isNegative ? -Number(value) : value;

    return (
        <Flex alignItems="center" my="10px">
            <Text variant="secondary" width="100px" mr="15px">
                {market.symbol}
            </Text>

            <NumberFormat
                customInput={Input}
                color={textColors.secondary}
                mr="15px"
                width="100px"
                value={price}
                placeholder="0.0"
                onValueChange={(values) => {
                    const { floatValue } = values;
                    onPriceChange(market.symbol, floatValue ?? 0);
                }}
            />

            <NumberFormat
                customInput={Input}
                mr="15px"
                width="100px"
                color={futurePrice >= price ? "green.400" : "red.600"}
                value={futurePrice}
                placeholder="0.0"
                onValueChange={(values) => {
                    const { floatValue } = values;
                    onFuturePriceChange(market.symbol, floatValue ?? 0);
                }}
            />

            <NumberFormat
                customInput={Input}
                color={textColors.secondary}
                mr="15px"
                width="150px"
                value={amountStr}
                placeholder="0.0"
                thousandSeparator
                onValueChange={(values) => {
                    const { floatValue, formattedValue } = values;
                    onAmountChange(market.symbol, floatValue ?? 0);
                    setAmountStr(formattedValue);
                }}
            />

            <NumberFormat
                customInput={Input}
                disabled
                prefix={isNegative ? "-$" : "$"}
                color={textColors.secondary}
                mr="15px"
                width="150px"
                value={transformedValue}
                placeholder="0.0"
                thousandSeparator
            />
        </Flex>
    );
};

export default MarketRow;
