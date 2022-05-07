import { Button, Flex } from "@chakra-ui/react";
import { Collateral } from "../../data/collaterals";

interface Props {
    collateral: Collateral;
    amount: number;
    onChange: (key: string, newValue: number) => void;
}

const CollateralRow = ({ collateral, amount, onChange }: Props) => {
    return (
        <Flex>
            {collateral.symbol}, {amount}
            <Button onClick={() => onChange(collateral.symbol, amount + 100)}>Click me</Button>
        </Flex>
    );
};

export default CollateralRow;
