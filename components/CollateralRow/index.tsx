import { Text, Flex, Input } from "@chakra-ui/react";
import { Collateral } from "../../data/collaterals";
import NumberFormat from "react-number-format";

interface Props {
    collateral: Collateral;
    amount: number;
    onChange: (key: string, newValue: number) => void;
}

const CollateralRow = ({ collateral, amount, onChange }: Props) => {
    return (
        <Flex alignItems="center" my="10px" width="200px">
            <Text width="100px" mr="15px">
                {collateral.symbol}
            </Text>
            <NumberFormat
                customInput={Input}
                // variant="unstyled"
                value={amount}
                thousandSeparator
                onValueChange={(values) => {
                    const { floatValue } = values;
                    onChange(collateral.symbol, floatValue ?? 0);
                }}
            />
            {/* <Button onClick={() => onChange(collateral.symbol, amount + 100)}>Click me</Button> */}
        </Flex>
    );
};

export default CollateralRow;
