import { Flex, Input, Text } from "@chakra-ui/react";
import { useState } from "react";
import NumberFormat from "react-number-format";
import { Market } from "../../data/markets";

interface Props {
    market: Market;
    price: number;
    futurePrice: number;
    amount: number;
    onPriceChange: (key: string, newValue: number) => void;
    onFuturePriceChange: (key: string, newValue: number) => void;
    onAmountChange: (key: string, newValue: number) => void;
}

const MarketRow = ({
    market,
    price,
    futurePrice,
    amount,
    onPriceChange,
    onFuturePriceChange,
    onAmountChange,
}: Props) => {
    const [amountStr, setAmountStr] = useState("");

    return (
        <Flex alignItems="center" my="10px">
            <Text width="100px" mr="15px">
                {market.symbol}
            </Text>

            <NumberFormat
                customInput={Input}
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
                mr="15px"
                width="150px"
                // variant="unstyled"
                value={amountStr}
                placeholder="0.0"
                thousandSeparator
                onValueChange={(values) => {
                    const { floatValue, formattedValue } = values;
                    onAmountChange(market.symbol, floatValue ?? 0);
                    setAmountStr(formattedValue);
                }}
            />
        </Flex>
    );
};

export default MarketRow;
