import { Image, Flex, Input, Text, useTheme } from "@chakra-ui/react";
import { useState } from "react";
import NumberFormat from "react-number-format";
import { Market } from "../../data/markets";

interface Props {
    market: Market;
    price: number;
    futurePrice: number;
    liqPrice: number;
    value: string;
    onPriceChange: (key: string, newValue: number) => void;
    onFuturePriceChange: (key: string, newValue: number) => void;
    onAmountChange: (key: string, newValue: number) => void;
}

const MarketRow = ({
    market,
    price,
    futurePrice,
    liqPrice,
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
            <Flex minWidth="135px" width="135px" minHeight="25px">
                <Image
                    src={market.imgURL}
                    height="25px"
                    width="25px"
                    borderRadius={market.symbol === "NEAR" ? "50%" : "0px"}
                    alt={market.symbol}
                />
                <Text variant="secondary" width="100px" ml="10px" mr="15px">
                    {market.symbol.charAt(market.symbol.length - 1) === "2"
                        ? market.symbol.substring(0, market.symbol.length - 1)
                        : market.symbol}

                    {market.symbol.charAt(market.symbol.length - 1) === "2" && <sup>2</sup>}
                </Text>
            </Flex>

            <NumberFormat
                customInput={Input}
                color={textColors.secondary}
                mr="15px"
                width="145px"
                minWidth="145px"
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
                width="145px"
                minWidth="145px"
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
                color={textColors.primary}
                disabled
                mr="15px"
                width="145px"
                minWidth="145px"
                prefix={liqPrice === -2 ? "> " : ""}
                suffix={liqPrice === -2 ? " Mill" : ""}
                value={liqPrice === -1 ? "" : liqPrice === -2 ? "1" : liqPrice.toFixed(2)}
                placeholder="-"
            />

            <NumberFormat
                customInput={Input}
                color={textColors.secondary}
                mr="15px"
                width="150px"
                minWidth="150px"
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
                minWidth="150px"
                value={transformedValue}
                placeholder="0.0"
                thousandSeparator
            />
        </Flex>
    );
};

export default MarketRow;
